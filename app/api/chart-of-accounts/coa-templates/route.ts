// app/api/chart-of-accounts/coa-templates/route.ts

import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Schema for COA template validation
const createCoaTemplateSchema = z.object({
  template_name: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  is_default: z.boolean().default(false),
  is_active: z.boolean().default(true),
});

const updateCoaTemplateSchema = createCoaTemplateSchema.partial().extend({
  id: z.string().uuid(),
});

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const is_default = searchParams.get('is_default');
    const is_active = searchParams.get('is_active');
    const template_name = searchParams.get('template_name');

    let query = supabase
      .from('coa_templates')
      .select('*')
      .order('template_name', { ascending: true });

    // Apply filters
    if (is_default !== null) {
      query = query.eq('is_default', is_default === 'true');
    }
    if (is_active !== null) {
      query = query.eq('is_active', is_active === 'true');
    }
    if (template_name) {
      query = query.ilike('template_name', `%${template_name}%`);
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
    const validatedData = createCoaTemplateSchema.parse(body);

    // Check if template name already exists
    const { data: existingTemplate } = await supabase
      .from('coa_templates')
      .select('id')
      .eq('template_name', validatedData.template_name)
      .single();

    if (existingTemplate) {
      return NextResponse.json(
        { error: 'Template with this name already exists' },
        { status: 409 }
      );
    }

    // If setting as default, unset other defaults
    if (validatedData.is_default) {
      await supabase
        .from('coa_templates')
        .update({ is_default: false })
        .eq('is_default', true);
    }

    const { data, error } = await supabase
      .from('coa_templates')
      .insert([validatedData])
      .select()
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
    const validatedData = updateCoaTemplateSchema.parse(body);
    const { id, ...updateData } = validatedData;

    // Check if template exists
    const { data: existingTemplate } = await supabase
      .from('coa_templates')
      .select('id')
      .eq('id', id)
      .single();

    if (!existingTemplate) {
      return NextResponse.json(
        { error: 'COA template not found' },
        { status: 404 }
      );
    }

    // If updating template_name, check for conflicts
    if (updateData.template_name) {
      const { data: conflictingTemplate } = await supabase
        .from('coa_templates')
        .select('id')
        .eq('template_name', updateData.template_name)
        .neq('id', id)
        .single();

      if (conflictingTemplate) {
        return NextResponse.json(
          { error: 'Template with this name already exists' },
          { status: 409 }
        );
      }
    }

    // If setting as default, unset other defaults
    if (updateData.is_default) {
      await supabase
        .from('coa_templates')
        .update({ is_default: false })
        .eq('is_default', true)
        .neq('id', id);
    }

    const { data, error } = await supabase
      .from('coa_templates')
      .update(updateData)
      .eq('id', id)
      .select()
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

    // Check if template exists
    const { data: existingTemplate } = await supabase
      .from('coa_templates')
      .select('id, is_default')
      .eq('id', id)
      .single();

    if (!existingTemplate) {
      return NextResponse.json(
        { error: 'COA template not found' },
        { status: 404 }
      );
    }

    // Prevent deletion of default template
    if (existingTemplate.is_default) {
      return NextResponse.json(
        { error: 'Cannot delete default template' },
        { status: 409 }
      );
    }

    // Check if there are dependent records (coa_template_rules, coa_template_items, business_chart_of_accounts)
    const { data: dependentRules } = await supabase
      .from('coa_template_rules')
      .select('id')
      .eq('coa_template_id', id)
      .limit(1);

    const { data: dependentItems } = await supabase
      .from('coa_template_items')
      .select('id')
      .eq('template_id', id)
      .limit(1);

    const { data: dependentBusinessCoa } = await supabase
      .from('business_chart_of_accounts')
      .select('id')
      .eq('source_template_id', id)
      .limit(1);

    if (
      (dependentRules && dependentRules.length > 0) ||
      (dependentItems && dependentItems.length > 0) ||
      (dependentBusinessCoa && dependentBusinessCoa.length > 0)
    ) {
      return NextResponse.json(
        {
          error:
            'Cannot delete template with existing rules, items, or business chart of accounts',
        },
        { status: 409 }
      );
    }

    const { error } = await supabase
      .from('coa_templates')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ message: 'COA template deleted successfully' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
