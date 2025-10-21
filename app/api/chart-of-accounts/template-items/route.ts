// app/api/chart-of-accounts/coa-template-items/route.ts

import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Schema for COA template item validation
const createCoaTemplateItemSchema = z.object({
  template_id: z.string().uuid(),
  account_code: z.string().regex(/^[0-9]{6}$/, 'Account code must be 6 digits'),
  account_name: z.string().min(1).max(200),
  account_subtype_id: z.string().uuid(),
  is_active: z.boolean().default(true),
  sort_order: z.number().int().min(0).default(0),
});

const updateCoaTemplateItemSchema = createCoaTemplateItemSchema
  .partial()
  .extend({
    id: z.string().uuid(),
  });

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const template_id = searchParams.get('template_id');
    const account_code = searchParams.get('account_code');
    const account_subtype_id = searchParams.get('account_subtype_id');
    const is_active = searchParams.get('is_active');

    let query = supabase
      .from('coa_template_items')
      .select(
        `
        *,
        account_subtypes(
          name,
          account_types(
            name,
            account_subclasses(
              name,
              account_classes(
                name,
                normal_balance
              )
            )
          )
        ),
        coa_templates(
          template_name,
          description,
          is_default
        )
      `
      )
      .order('account_code', { ascending: true });

    // Apply filters
    if (template_id) {
      query = query.eq('template_id', template_id);
    }
    if (account_code) {
      query = query.eq('account_code', account_code);
    }
    if (account_subtype_id) {
      query = query.eq('account_subtype_id', account_subtype_id);
    }
    if (is_active !== null) {
      query = query.eq('is_active', is_active === 'true');
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();

    // Validate input
    const validatedData = createCoaTemplateItemSchema.parse(body);

    // Check if template exists
    const { data: template } = await supabase
      .from('coa_templates')
      .select('id')
      .eq('id', validatedData.template_id)
      .single();

    if (!template) {
      return NextResponse.json(
        { error: 'COA template not found' },
        { status: 404 }
      );
    }

    // Check if account subtype exists
    const { data: accountSubtype } = await supabase
      .from('account_subtypes')
      .select('id')
      .eq('id', validatedData.account_subtype_id)
      .single();

    if (!accountSubtype) {
      return NextResponse.json(
        { error: 'Account subtype not found' },
        { status: 404 }
      );
    }

    // Check if account code already exists for this template
    const { data: existingItem } = await supabase
      .from('coa_template_items')
      .select('id')
      .eq('template_id', validatedData.template_id)
      .eq('account_code', validatedData.account_code)
      .single();

    if (existingItem) {
      return NextResponse.json(
        {
          error:
            'Template item with this account code already exists for this template',
        },
        { status: 409 }
      );
    }

    const { data, error } = await supabase
      .from('coa_template_items')
      .insert([validatedData])
      .select(
        `
        *,
        account_subtypes(
          name,
          account_types(
            name,
            account_subclasses(
              name,
              account_classes(
                name,
                normal_balance
              )
            )
          )
        ),
        coa_templates(
          template_name,
          description,
          is_default
        )
      `
      )
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();

    // Validate input
    const validatedData = updateCoaTemplateItemSchema.parse(body);
    const { id, ...updateData } = validatedData;

    // Check if template item exists
    const { data: existingItem } = await supabase
      .from('coa_template_items')
      .select('id, template_id')
      .eq('id', id)
      .single();

    if (!existingItem) {
      return NextResponse.json(
        { error: 'COA template item not found' },
        { status: 404 }
      );
    }

    // If updating template_id, check if it exists
    if (updateData.template_id) {
      const { data: template } = await supabase
        .from('coa_templates')
        .select('id')
        .eq('id', updateData.template_id)
        .single();

      if (!template) {
        return NextResponse.json(
          { error: 'COA template not found' },
          { status: 404 }
        );
      }
    }

    // If updating account_subtype_id, check if it exists
    if (updateData.account_subtype_id) {
      const { data: accountSubtype } = await supabase
        .from('account_subtypes')
        .select('id')
        .eq('id', updateData.account_subtype_id)
        .single();

      if (!accountSubtype) {
        return NextResponse.json(
          { error: 'Account subtype not found' },
          { status: 404 }
        );
      }
    }

    // If updating account_code, check for conflicts
    if (updateData.account_code) {
      const templateId = updateData.template_id || existingItem.template_id;
      const { data: conflictingItem } = await supabase
        .from('coa_template_items')
        .select('id')
        .eq('template_id', templateId)
        .eq('account_code', updateData.account_code)
        .neq('id', id)
        .single();

      if (conflictingItem) {
        return NextResponse.json(
          {
            error:
              'Template item with this account code already exists for this template',
          },
          { status: 409 }
        );
      }
    }

    const { data, error } = await supabase
      .from('coa_template_items')
      .update(updateData)
      .eq('id', id)
      .select(
        `
        *,
        account_subtypes(
          name,
          account_types(
            name,
            account_subclasses(
              name,
              account_classes(
                name,
                normal_balance
              )
            )
          )
        ),
        coa_templates(
          template_name,
          description,
          is_default
        )
      `
      )
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID parameter is required' },
        { status: 400 }
      );
    }

    // Check if template item exists
    const { data: existingItem } = await supabase
      .from('coa_template_items')
      .select('id')
      .eq('id', id)
      .single();

    if (!existingItem) {
      return NextResponse.json(
        { error: 'COA template item not found' },
        { status: 404 }
      );
    }

    // Check if there are dependent records (business_chart_of_accounts)
    const { data: dependentBusinessCoa } = await supabase
      .from('business_chart_of_accounts')
      .select('id')
      .eq('source_template_item_id', id)
      .limit(1);

    if (dependentBusinessCoa && dependentBusinessCoa.length > 0) {
      return NextResponse.json(
        {
          error:
            'Cannot delete template item with existing business chart of accounts',
        },
        { status: 409 }
      );
    }

    const { error } = await supabase
      .from('coa_template_items')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({
      message: 'COA template item deleted successfully',
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
