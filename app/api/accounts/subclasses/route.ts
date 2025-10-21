// app/api/accounts/subclasses/route.ts

import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Schema for account subclass validation
const createAccountSubclassSchema = z.object({
  account_class_id: z.string().uuid('Invalid account class ID'),
  code: z.number().int().min(1),
  name: z.string().min(1).max(100),
  is_active: z.boolean().default(true),
  description: z.string().max(500).optional(),
  hint: z.string().max(200).optional(),
});

const updateAccountSubclassSchema = createAccountSubclassSchema
  .partial()
  .extend({
    id: z.string().uuid(),
  });

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const search = searchParams.get('search');

    if (id) {
      // Fetch single account subclass by ID
      const { data, error } = await supabase
        .from('account_subclasses')
        .select(
          `
          *,
          account_class:account_classes(*)
        `
        )
        .eq('id', id)
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }

      return NextResponse.json({ data });
    }

    // Fetch all account subclasses
    let query = supabase.from('account_subclasses').select(`
        *,
        account_class:account_classes(*)
      `);

    // Apply search filter only
    if (search) {
      query = query.or(
        `name.ilike.%${search}%,description.ilike.%${search}%,hint.ilike.%${search}%`
      );
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

    // Validate request body
    const validatedData = createAccountSubclassSchema.parse(body);

    // Check if account class exists
    const { data: accountClass, error: classError } = await supabase
      .from('account_classes')
      .select('id')
      .eq('id', validatedData.account_class_id)
      .single();

    if (classError || !accountClass) {
      return NextResponse.json(
        { error: 'Account class not found' },
        { status: 400 }
      );
    }

    // Check if code already exists for this account class
    const { data: existingSubclass, error: checkError } = await supabase
      .from('account_subclasses')
      .select('id')
      .eq('account_class_id', validatedData.account_class_id)
      .eq('code', validatedData.code)
      .single();

    if (existingSubclass) {
      return NextResponse.json(
        { error: 'Code already exists for this account class' },
        { status: 400 }
      );
    }

    // Create account subclass
    const { data, error } = await supabase
      .from('account_subclasses')
      .insert([validatedData])
      .select(
        `
        *,
        account_class:account_classes(*)
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

    // Validate request body
    const validatedData = updateAccountSubclassSchema.parse(body);

    // Check if account subclass exists
    const { data: existingSubclass, error: checkError } = await supabase
      .from('account_subclasses')
      .select('id, account_class_id')
      .eq('id', validatedData.id)
      .single();

    if (checkError || !existingSubclass) {
      return NextResponse.json(
        { error: 'Account subclass not found' },
        { status: 400 }
      );
    }

    // If account_class_id is being updated, check if it exists
    if (validatedData.account_class_id) {
      const { data: accountClass, error: classError } = await supabase
        .from('account_classes')
        .select('id')
        .eq('id', validatedData.account_class_id)
        .single();

      if (classError || !accountClass) {
        return NextResponse.json(
          { error: 'Account class not found' },
          { status: 400 }
        );
      }
    }

    // If code is being updated, check if it already exists for this account class
    if (validatedData.code) {
      const accountClassId =
        validatedData.account_class_id || existingSubclass.account_class_id;

      const { data: duplicateSubclass, error: duplicateError } = await supabase
        .from('account_subclasses')
        .select('id')
        .eq('account_class_id', accountClassId)
        .eq('code', validatedData.code)
        .neq('id', validatedData.id)
        .single();

      if (duplicateSubclass) {
        return NextResponse.json(
          { error: 'Code already exists for this account class' },
          { status: 400 }
        );
      }
    }

    // Update account subclass
    const { data, error } = await supabase
      .from('account_subclasses')
      .update(validatedData)
      .eq('id', validatedData.id)
      .select(
        `
        *,
        account_class:account_classes(*)
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

    // Check if account subclass exists
    const { data: existingSubclass, error: checkError } = await supabase
      .from('account_subclasses')
      .select('id')
      .eq('id', id)
      .single();

    if (checkError || !existingSubclass) {
      return NextResponse.json(
        { error: 'Account subclass not found' },
        { status: 400 }
      );
    }

    // Delete account subclass
    const { error } = await supabase
      .from('account_subclasses')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({
      message: 'Account subclass deleted successfully',
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
