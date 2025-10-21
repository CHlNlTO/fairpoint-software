// app/api/chart-of-accounts/coa-template-rules/route.ts

import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Schema for COA template rule validation
const createCoaTemplateRuleSchema = z
  .object({
    coa_template_id: z.string().uuid(),
    tax_type: z.enum(['VAT', 'Non-VAT', 'Any']).optional(),
    business_structure: z.string().optional(), // This will be validated against the enum in the database
    industry_type: z.string().max(100).optional(),
    is_active: z.boolean().default(true),
  })
  .refine(
    data => {
      // At least one rule criteria must be provided
      return data.tax_type || data.business_structure || data.industry_type;
    },
    {
      message:
        'At least one rule criteria (tax_type, business_structure, or industry_type) must be provided',
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
        updateData.tax_type ||
        updateData.business_structure ||
        updateData.industry_type ||
        (updateData.tax_type === null &&
          updateData.business_structure === null &&
          updateData.industry_type === null)
      );
    },
    {
      message:
        'At least one rule criteria (tax_type, business_structure, or industry_type) must be provided',
    }
  );

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const coa_template_id = searchParams.get('coa_template_id');
    const tax_type = searchParams.get('tax_type');
    const business_structure = searchParams.get('business_structure');
    const industry_type = searchParams.get('industry_type');
    const is_active = searchParams.get('is_active');

    let query = supabase
      .from('coa_template_rules')
      .select('*, coa_templates(template_name)')
      .order('created_at', { ascending: false });

    // Apply filters
    if (coa_template_id) {
      query = query.eq('coa_template_id', coa_template_id);
    }
    if (tax_type) {
      query = query.eq('tax_type', tax_type);
    }
    if (business_structure) {
      query = query.eq('business_structure', business_structure);
    }
    if (industry_type) {
      query = query.ilike('industry_type', `%${industry_type}%`);
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
      .eq('tax_type', validatedData.tax_type || null)
      .eq('business_structure', validatedData.business_structure || null)
      .eq('industry_type', validatedData.industry_type || null)
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
      .select('*, coa_templates(template_name)')
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
    const taxType =
      updateData.tax_type !== undefined ? updateData.tax_type : null;
    const businessStructure =
      updateData.business_structure !== undefined
        ? updateData.business_structure
        : null;
    const industryType =
      updateData.industry_type !== undefined ? updateData.industry_type : null;

    const { data: conflictingRule } = await supabase
      .from('coa_template_rules')
      .select('id')
      .eq('coa_template_id', templateId)
      .eq('tax_type', taxType)
      .eq('business_structure', businessStructure)
      .eq('industry_type', industryType)
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
      .select('*, coa_templates(template_name)')
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
