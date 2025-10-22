// app/api/chart-of-accounts/coa-template-rules/route.ts

import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Schema for COA template rule validation
const createCoaTemplateRuleSchema = z
  .object({
    coa_template_id: z.string().uuid(),
    tax_type_id: z.string().uuid().optional(),
    business_type_id: z.string().uuid().optional(),
    industry_type_id: z.string().uuid().optional(),
    is_active: z.boolean().default(true),
  })
  .refine(
    data => {
      // At least one rule criteria must be provided
      return data.tax_type_id || data.business_type_id || data.industry_type_id;
    },
    {
      message:
        'At least one rule criteria (tax_type_id, business_type_id, or industry_type_id) must be provided',
    }
  );

const updateCoaTemplateRuleSchema = createCoaTemplateRuleSchema
  .partial()
  .extend({
    id: z.string().uuid(),
  })
  .refine(
    data => {
      // If updating, at least one rule criteria must be provided
      const { id, ...updateData } = data;
      return (
        updateData.tax_type_id ||
        updateData.business_type_id ||
        updateData.industry_type_id ||
        (updateData.tax_type_id === null &&
          updateData.business_type_id === null &&
          updateData.industry_type_id === null)
      );
    },
    {
      message:
        'At least one rule criteria (tax_type_id, business_type_id, or industry_type_id) must be provided',
    }
  );

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const coa_template_id = searchParams.get('coa_template_id');
    const tax_type_id = searchParams.get('tax_type_id');
    const business_type_id = searchParams.get('business_type_id');
    const industry_type_id = searchParams.get('industry_type_id');
    const is_active = searchParams.get('is_active');

    let query = supabase
      .from('coa_template_rules')
      .select(
        `
        *,
        coa_templates(template_name),
        tax_types(name, description),
        business_types(name, description),
        industry_types(name, description)
      `
      )
      .order('created_at', { ascending: false });

    // Apply filters
    if (coa_template_id) {
      query = query.eq('coa_template_id', coa_template_id);
    }
    if (tax_type_id) {
      query = query.eq('tax_type_id', tax_type_id);
    }
    if (business_type_id) {
      query = query.eq('business_type_id', business_type_id);
    }
    if (industry_type_id) {
      query = query.eq('industry_type_id', industry_type_id);
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
    const validatedData = createCoaTemplateRuleSchema.parse(body);

    // Check if template exists
    const { data: template } = await supabase
      .from('coa_templates')
      .select('id')
      .eq('id', validatedData.coa_template_id)
      .single();

    if (!template) {
      return NextResponse.json(
        { error: 'COA template not found' },
        { status: 404 }
      );
    }

    // Check for duplicate rules (same template with same criteria)
    const { data: existingRule } = await supabase
      .from('coa_template_rules')
      .select('id')
      .eq('coa_template_id', validatedData.coa_template_id)
      .eq('tax_type_id', validatedData.tax_type_id || null)
      .eq('business_type_id', validatedData.business_type_id || null)
      .eq('industry_type_id', validatedData.industry_type_id || null)
      .single();

    if (existingRule) {
      return NextResponse.json(
        {
          error:
            'A rule with the same criteria already exists for this template',
        },
        { status: 409 }
      );
    }

    const { data, error } = await supabase
      .from('coa_template_rules')
      .insert([validatedData])
      .select(
        `
        *,
        coa_templates(template_name),
        tax_types(name, description),
        business_types(name, description),
        industry_types(name, description)
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
    const validatedData = updateCoaTemplateRuleSchema.parse(body);
    const { id, ...updateData } = validatedData;

    // Check if template rule exists
    const { data: existingRule } = await supabase
      .from('coa_template_rules')
      .select('id, coa_template_id')
      .eq('id', id)
      .single();

    if (!existingRule) {
      return NextResponse.json(
        { error: 'COA template rule not found' },
        { status: 404 }
      );
    }

    // If updating coa_template_id, check if it exists
    if (updateData.coa_template_id) {
      const { data: template } = await supabase
        .from('coa_templates')
        .select('id')
        .eq('id', updateData.coa_template_id)
        .single();

      if (!template) {
        return NextResponse.json(
          { error: 'COA template not found' },
          { status: 404 }
        );
      }
    }

    // Check for duplicate rules (same template with same criteria)
    const templateId =
      updateData.coa_template_id || existingRule.coa_template_id;
    const taxTypeId =
      updateData.tax_type_id !== undefined ? updateData.tax_type_id : null;
    const businessTypeId =
      updateData.business_type_id !== undefined
        ? updateData.business_type_id
        : null;
    const industryTypeId =
      updateData.industry_type_id !== undefined
        ? updateData.industry_type_id
        : null;

    const { data: conflictingRule } = await supabase
      .from('coa_template_rules')
      .select('id')
      .eq('coa_template_id', templateId)
      .eq('tax_type_id', taxTypeId)
      .eq('business_type_id', businessTypeId)
      .eq('industry_type_id', industryTypeId)
      .neq('id', id)
      .single();

    if (conflictingRule) {
      return NextResponse.json(
        {
          error:
            'A rule with the same criteria already exists for this template',
        },
        { status: 409 }
      );
    }

    const { data, error } = await supabase
      .from('coa_template_rules')
      .update(updateData)
      .eq('id', id)
      .select(
        `
        *,
        coa_templates(template_name),
        tax_types(name, description),
        business_types(name, description),
        industry_types(name, description)
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

    // Check if template rule exists
    const { data: existingRule } = await supabase
      .from('coa_template_rules')
      .select('id')
      .eq('id', id)
      .single();

    if (!existingRule) {
      return NextResponse.json(
        { error: 'COA template rule not found' },
        { status: 404 }
      );
    }

    const { error } = await supabase
      .from('coa_template_rules')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({
      message: 'COA template rule deleted successfully',
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
