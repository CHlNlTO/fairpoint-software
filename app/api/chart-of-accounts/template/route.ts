// app/api/chart-of-accounts/templates/route.ts

import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Schema for COA template item validation
const coaTemplateItemSchema = z.object({
  account_code: z
    .string()
    .min(1, 'Account code is required')
    .regex(/^[0-9]{6}$/, 'Account code must be exactly 6 digits'),
  account_name: z
    .string()
    .min(1, 'Account name is required')
    .max(200, 'Account name must be 200 characters or less'),
  account_class_id: z.string().uuid('Invalid account class'),
  account_subclass_id: z.string().uuid('Invalid account subclass'),
  account_type_id: z.string().uuid('Invalid account type'),
  account_subtype_id: z.string().uuid('Invalid account subtype'),
  normal_balance: z.enum(['debit', 'credit']),
  is_active: z.boolean(),
  sort_order: z.number().min(0, 'Sort order must be 0 or greater'),
});

// Schema for COA template rules validation
const coaTemplateRulesSchema = z.object({
  tax_type_id: z.string().uuid().optional(),
  business_type_id: z.string().uuid().optional(),
  industry_type_id: z.string().uuid().optional(),
});

// Schema for combined COA template creation
const createCoaTemplateCombinedSchema = z.object({
  template_name: z
    .string()
    .min(1, 'Template name is required')
    .max(200, 'Template name must be 200 characters or less'),
  description: z
    .string()
    .max(1000, 'Description must be 1000 characters or less')
    .optional()
    .or(z.literal('')),
  is_default: z.boolean(),
  is_active: z.boolean(),
  rules: coaTemplateRulesSchema,
  items: z.array(coaTemplateItemSchema).min(1, 'At least one item is required'),
});

// Schema for combined COA template update
const updateCoaTemplateCombinedSchema = createCoaTemplateCombinedSchema.extend({
  id: z.string().uuid('Invalid ID format'),
});

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      // Get single template with rules and items
      const { data: template, error: templateError } = await supabase
        .from('coa_templates')
        .select('*')
        .eq('id', id)
        .single();

      if (templateError) {
        return NextResponse.json(
          { error: 'Template not found' },
          { status: 404 }
        );
      }

      // Get template rules
      const { data: rules, error: rulesError } = await supabase
        .from('coa_template_rules')
        .select('*')
        .eq('coa_template_id', id)
        .single();

      if (rulesError && rulesError.code !== 'PGRST116') {
        return NextResponse.json(
          { error: `Failed to fetch template rules: ${rulesError.message}` },
          { status: 400 }
        );
      }

      // Get template items
      const { data: items, error: itemsError } = await supabase
        .from('coa_template_items')
        .select(
          `
          *,
          normal_balance,
          account_subtypes!inner(
            id,
            name,
            code,
            account_types!inner(
              id,
              name,
              code,
              account_subclasses!inner(
                id,
                name,
                code,
                account_classes!inner(
                  id,
                  name,
                  code
                )
              )
            )
          )
        `
        )
        .eq('template_id', id)
        .order('sort_order', { ascending: true });

      if (itemsError) {
        return NextResponse.json(
          { error: `Failed to fetch template items: ${itemsError.message}` },
          { status: 400 }
        );
      }

      // Transform items to match form structure
      const transformedItems =
        items?.map(item => ({
          id: item.id,
          account_code: item.account_code,
          account_name: item.account_name,
          account_class_id:
            item.account_subtypes.account_types.account_subclasses
              .account_classes.id,
          account_subclass_id:
            item.account_subtypes.account_types.account_subclasses.id,
          account_type_id: item.account_subtypes.account_types.id,
          account_subtype_id: item.account_subtypes.id,
          normal_balance: item.normal_balance as 'debit' | 'credit',
          is_active: item.is_active,
          sort_order: item.sort_order,
        })) || [];

      return NextResponse.json({
        data: {
          ...template,
          rules: rules || {
            tax_type_id: null,
            business_type_id: null,
            industry_type_id: null,
          },
          items: transformedItems,
        },
      });
    } else {
      // Get all templates (basic list)
      const { data: templates, error } = await supabase
        .from('coa_templates')
        .select('*')
        .order('template_name', { ascending: true });

      if (error) {
        return NextResponse.json(
          { error: `Failed to fetch templates: ${error.message}` },
          { status: 400 }
        );
      }

      return NextResponse.json({ data: templates });
    }
  } catch (error) {
    console.error('Error fetching COA templates:', error);
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
    const validatedData = createCoaTemplateCombinedSchema.parse(body);

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

    // Validate that all account hierarchy IDs exist and are properly related
    const processedItems = await validateAccountHierarchy(
      supabase,
      validatedData.items
    );

    // If setting as default, unset other defaults
    if (validatedData.is_default) {
      await supabase
        .from('coa_templates')
        .update({ is_default: false })
        .eq('is_default', true);
    }

    // Start transaction-like operations
    // 1. Create the COA template
    const { data: template, error: templateError } = await supabase
      .from('coa_templates')
      .insert([
        {
          template_name: validatedData.template_name,
          description: validatedData.description || null,
          is_default: validatedData.is_default,
          is_active: validatedData.is_active,
        },
      ])
      .select()
      .single();

    if (templateError) {
      return NextResponse.json(
        { error: `Failed to create template: ${templateError.message}` },
        { status: 400 }
      );
    }

    // 2. Create the COA template rules
    const { error: rulesError } = await supabase
      .from('coa_template_rules')
      .insert([
        {
          coa_template_id: template.id,
          tax_type_id: validatedData.rules.tax_type_id || null,
          business_type_id: validatedData.rules.business_type_id || null,
          industry_type_id: validatedData.rules.industry_type_id || null,
          is_active: true,
        },
      ]);

    if (rulesError) {
      // Clean up the template if rules creation fails
      await supabase.from('coa_templates').delete().eq('id', template.id);
      return NextResponse.json(
        { error: `Failed to create template rules: ${rulesError.message}` },
        { status: 400 }
      );
    }

    // 3. Create the COA template items
    const itemsToInsert = processedItems.map(item => ({
      template_id: template.id,
      account_code: item.account_code,
      account_name: item.account_name,
      account_subtype_id: item.account_subtype_id,
      normal_balance: item.normal_balance,
      is_active: item.is_active,
      sort_order: item.sort_order,
    }));

    const { error: itemsError } = await supabase
      .from('coa_template_items')
      .insert(itemsToInsert);

    if (itemsError) {
      // Clean up the template and rules if items creation fails
      await supabase
        .from('coa_template_rules')
        .delete()
        .eq('coa_template_id', template.id);
      await supabase.from('coa_templates').delete().eq('id', template.id);
      return NextResponse.json(
        { error: `Failed to create template items: ${itemsError.message}` },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        data: template,
        message: 'COA template created successfully with rules and items',
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Validation error',
          details: error.issues.map(issue => ({
            field: issue.path.join('.'),
            message: issue.message,
          })),
        },
        { status: 400 }
      );
    }
    console.error('Error creating COA template:', error);
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
    const validatedData = updateCoaTemplateCombinedSchema.parse(body);
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

    // Validate that all account hierarchy IDs exist and are properly related
    const processedItems = await validateAccountHierarchy(
      supabase,
      updateData.items
    );

    // If setting as default, unset other defaults
    if (updateData.is_default) {
      await supabase
        .from('coa_templates')
        .update({ is_default: false })
        .eq('is_default', true)
        .neq('id', id);
    }

    // Start transaction-like operations
    // 1. Update the COA template
    const { data: template, error: templateError } = await supabase
      .from('coa_templates')
      .update({
        template_name: updateData.template_name,
        description: updateData.description || null,
        is_default: updateData.is_default,
        is_active: updateData.is_active,
      })
      .eq('id', id)
      .select()
      .single();

    if (templateError) {
      return NextResponse.json(
        { error: `Failed to update template: ${templateError.message}` },
        { status: 400 }
      );
    }

    // 2. Update the COA template rules (delete existing and create new)
    await supabase
      .from('coa_template_rules')
      .delete()
      .eq('coa_template_id', id);

    const { error: rulesError } = await supabase
      .from('coa_template_rules')
      .insert([
        {
          coa_template_id: id,
          tax_type_id: updateData.rules.tax_type_id || null,
          business_type_id: updateData.rules.business_type_id || null,
          industry_type_id: updateData.rules.industry_type_id || null,
          is_active: true,
        },
      ]);

    if (rulesError) {
      return NextResponse.json(
        { error: `Failed to update template rules: ${rulesError.message}` },
        { status: 400 }
      );
    }

    // 3. Update the COA template items (delete existing and create new)
    await supabase.from('coa_template_items').delete().eq('template_id', id);

    const itemsToInsert = processedItems.map(item => ({
      template_id: id,
      account_code: item.account_code,
      account_name: item.account_name,
      account_subtype_id: item.account_subtype_id,
      normal_balance: item.normal_balance,
      is_active: item.is_active,
      sort_order: item.sort_order,
    }));

    const { error: itemsError } = await supabase
      .from('coa_template_items')
      .insert(itemsToInsert);

    if (itemsError) {
      return NextResponse.json(
        { error: `Failed to update template items: ${itemsError.message}` },
        { status: 400 }
      );
    }

    return NextResponse.json({
      data: template,
      message: 'COA template updated successfully with rules and items',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Validation error',
          details: error.issues.map(issue => ({
            field: issue.path.join('.'),
            message: issue.message,
          })),
        },
        { status: 400 }
      );
    }
    console.error('Error updating COA template:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function to generate account code
function generateAccountCode(
  accountClass: any,
  accountSubclass: any,
  accountType: any,
  accountSubtype: any,
  existingItems: any[]
): string {
  // Format: {class}{subclass}{type}{subtype}
  const baseCode = `${accountClass.code}${accountSubclass.code}${accountType.code}${accountSubtype.code}`;

  // Find existing codes for this combination
  const existingCodes = existingItems
    .filter(
      item =>
        item.account_class_id === accountClass.id &&
        item.account_subclass_id === accountSubclass.id &&
        item.account_type_id === accountType.id &&
        item.account_subtype_id === accountSubtype.id &&
        item.account_code.startsWith(baseCode)
    )
    .map(item => {
      const suffix = item.account_code.slice(baseCode.length);
      return parseInt(suffix) || 0;
    })
    .sort((a, b) => a - b);

  // Find the next available number
  let nextNumber = 1;
  for (const num of existingCodes) {
    if (num === nextNumber) {
      nextNumber++;
    } else {
      break;
    }
  }

  return `${baseCode}${nextNumber.toString().padStart(2, '0')}`;
}

// Helper function to validate account hierarchy relationships and generate account codes
async function validateAccountHierarchy(supabase: any, items: any[]) {
  const processedItems = [];

  for (const item of items) {
    // Validate account class exists
    const { data: accountClass } = await supabase
      .from('account_classes')
      .select('id, code')
      .eq('id', item.account_class_id)
      .single();

    if (!accountClass) {
      throw new Error(
        `Account class with ID ${item.account_class_id} not found`
      );
    }

    // Validate account subclass exists and belongs to the class
    const { data: accountSubclass } = await supabase
      .from('account_subclasses')
      .select('id, account_class_id, code')
      .eq('id', item.account_subclass_id)
      .eq('account_class_id', item.account_class_id)
      .single();

    if (!accountSubclass) {
      throw new Error(
        `Account subclass with ID ${item.account_subclass_id} not found or does not belong to the selected class`
      );
    }

    // Validate account type exists and belongs to the subclass
    const { data: accountType } = await supabase
      .from('account_types')
      .select('id, account_subclass_id, code')
      .eq('id', item.account_type_id)
      .eq('account_subclass_id', item.account_subclass_id)
      .single();

    if (!accountType) {
      throw new Error(
        `Account type with ID ${item.account_type_id} not found or does not belong to the selected subclass`
      );
    }

    // Validate account subtype exists and belongs to the type
    const { data: accountSubtype } = await supabase
      .from('account_subtypes')
      .select('id, account_type_id, code')
      .eq('id', item.account_subtype_id)
      .eq('account_type_id', item.account_type_id)
      .single();

    if (!accountSubtype) {
      throw new Error(
        `Account subtype with ID ${item.account_subtype_id} not found or does not belong to the selected type`
      );
    }

    // Generate account code if missing
    let accountCode = item.account_code;
    if (!accountCode) {
      accountCode = generateAccountCode(
        accountClass,
        accountSubclass,
        accountType,
        accountSubtype,
        processedItems
      );
    }

    processedItems.push({
      ...item,
      account_code: accountCode,
    });
  }

  return processedItems;
}
