// app/api/chart-of-accounts/business-chart-of-accounts/route.ts

import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Schema for business chart of accounts validation
const createBusinessChartOfAccountsSchema = z.object({
  business_registration_id: z.string().uuid(),
  account_code: z.string().regex(/^[0-9]{6}$/, 'Account code must be 6 digits'),
  account_name: z.string().min(1).max(200),
  account_subtype_id: z.string().uuid(),
  is_active: z.boolean().default(true),
  is_custom: z.boolean().default(false),
  source_template_id: z.string().uuid().optional(),
  source_template_item_id: z.string().uuid().optional(),
  notes: z.string().max(1000).optional(),
});

const updateBusinessChartOfAccountsSchema = createBusinessChartOfAccountsSchema
  .partial()
  .extend({
    id: z.string().uuid(),
  });

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const business_registration_id = searchParams.get(
      'business_registration_id'
    );
    const account_code = searchParams.get('account_code');
    const account_subtype_id = searchParams.get('account_subtype_id');
    const is_active = searchParams.get('is_active');
    const is_custom = searchParams.get('is_custom');
    const source_template_id = searchParams.get('source_template_id');

    let query = supabase
      .from('business_chart_of_accounts')
      .select(
        `
        *,
        business_registrations(business_name),
        account_subtypes(name),
        coa_templates(template_name)
      `
      )
      .order('account_code', { ascending: true });

    // Apply filters
    if (business_registration_id) {
      query = query.eq('business_registration_id', business_registration_id);
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
    if (is_custom !== null) {
      query = query.eq('is_custom', is_custom === 'true');
    }
    if (source_template_id) {
      query = query.eq('source_template_id', source_template_id);
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
    const validatedData = createBusinessChartOfAccountsSchema.parse(body);

    // Check if business registration exists
    const { data: businessRegistration } = await supabase
      .from('business_registrations')
      .select('id')
      .eq('id', validatedData.business_registration_id)
      .single();

    if (!businessRegistration) {
      return NextResponse.json(
        { error: 'Business registration not found' },
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

    // Check if source template exists (if provided)
    if (validatedData.source_template_id) {
      const { data: template } = await supabase
        .from('coa_templates')
        .select('id')
        .eq('id', validatedData.source_template_id)
        .single();

      if (!template) {
        return NextResponse.json(
          { error: 'Source template not found' },
          { status: 404 }
        );
      }
    }

    // Check if source template item exists (if provided)
    if (validatedData.source_template_item_id) {
      const { data: templateItem } = await supabase
        .from('coa_template_items')
        .select('id')
        .eq('id', validatedData.source_template_item_id)
        .single();

      if (!templateItem) {
        return NextResponse.json(
          { error: 'Source template item not found' },
          { status: 404 }
        );
      }
    }

    // Check if account code already exists for this business
    const { data: existingItem } = await supabase
      .from('business_chart_of_accounts')
      .select('id')
      .eq('business_registration_id', validatedData.business_registration_id)
      .eq('account_code', validatedData.account_code)
      .single();

    if (existingItem) {
      return NextResponse.json(
        {
          error:
            'Business chart of accounts item with this account code already exists for this business',
        },
        { status: 409 }
      );
    }

    const { data, error } = await supabase
      .from('business_chart_of_accounts')
      .insert([validatedData])
      .select(
        `
        *,
        business_registrations(business_name),
        account_subtypes(name),
        coa_templates(template_name)
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
    const validatedData = updateBusinessChartOfAccountsSchema.parse(body);
    const { id, ...updateData } = validatedData;

    // Check if business chart of accounts item exists
    const { data: existingItem } = await supabase
      .from('business_chart_of_accounts')
      .select('id, business_registration_id')
      .eq('id', id)
      .single();

    if (!existingItem) {
      return NextResponse.json(
        { error: 'Business chart of accounts item not found' },
        { status: 404 }
      );
    }

    // If updating business_registration_id, check if it exists
    if (updateData.business_registration_id) {
      const { data: businessRegistration } = await supabase
        .from('business_registrations')
        .select('id')
        .eq('id', updateData.business_registration_id)
        .single();

      if (!businessRegistration) {
        return NextResponse.json(
          { error: 'Business registration not found' },
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

    // If updating source_template_id, check if it exists
    if (updateData.source_template_id) {
      const { data: template } = await supabase
        .from('coa_templates')
        .select('id')
        .eq('id', updateData.source_template_id)
        .single();

      if (!template) {
        return NextResponse.json(
          { error: 'Source template not found' },
          { status: 404 }
        );
      }
    }

    // If updating source_template_item_id, check if it exists
    if (updateData.source_template_item_id) {
      const { data: templateItem } = await supabase
        .from('coa_template_items')
        .select('id')
        .eq('id', updateData.source_template_item_id)
        .single();

      if (!templateItem) {
        return NextResponse.json(
          { error: 'Source template item not found' },
          { status: 404 }
        );
      }
    }

    // If updating account_code, check for conflicts
    if (updateData.account_code) {
      const businessRegistrationId =
        updateData.business_registration_id ||
        existingItem.business_registration_id;
      const { data: conflictingItem } = await supabase
        .from('business_chart_of_accounts')
        .select('id')
        .eq('business_registration_id', businessRegistrationId)
        .eq('account_code', updateData.account_code)
        .neq('id', id)
        .single();

      if (conflictingItem) {
        return NextResponse.json(
          {
            error:
              'Business chart of accounts item with this account code already exists for this business',
          },
          { status: 409 }
        );
      }
    }

    const { data, error } = await supabase
      .from('business_chart_of_accounts')
      .update(updateData)
      .eq('id', id)
      .select(
        `
        *,
        business_registrations(business_name),
        account_subtypes(name),
        coa_templates(template_name)
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

    // Check if business chart of accounts item exists
    const { data: existingItem } = await supabase
      .from('business_chart_of_accounts')
      .select('id')
      .eq('id', id)
      .single();

    if (!existingItem) {
      return NextResponse.json(
        { error: 'Business chart of accounts item not found' },
        { status: 404 }
      );
    }

    const { error } = await supabase
      .from('business_chart_of_accounts')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({
      message: 'Business chart of accounts item deleted successfully',
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
