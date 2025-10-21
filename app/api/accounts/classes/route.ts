// app/api/accounts/classes/route.ts

import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Schema for account class validation
const createAccountClassSchema = z.object({
  code: z.number().int().min(1),
  name: z.string().min(1).max(100),
  normal_balance: z.enum(['debit', 'credit']),
  is_active: z.boolean().default(true),
  description: z.string().max(500).optional(),
  hint: z.string().max(200).optional(),
});

const updateAccountClassSchema = createAccountClassSchema.partial().extend({
  id: z.string().uuid(),
});

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');

    let query = supabase.from('account_classes').select('*');

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

    // Validate input
    const validatedData = createAccountClassSchema.parse(body);

    // Check if code already exists
    const { data: existingClass } = await supabase
      .from('account_classes')
      .select('id')
      .eq('code', validatedData.code)
      .single();

    if (existingClass) {
      return NextResponse.json(
        { error: 'Account class with this code already exists' },
        { status: 409 }
      );
    }

    const { data, error } = await supabase
      .from('account_classes')
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
    const validatedData = updateAccountClassSchema.parse(body);
    const { id, ...updateData } = validatedData;

    // Check if account class exists
    const { data: existingClass } = await supabase
      .from('account_classes')
      .select('id')
      .eq('id', id)
      .single();

    if (!existingClass) {
      return NextResponse.json(
        { error: 'Account class not found' },
        { status: 404 }
      );
    }

    // If updating code, check for conflicts
    if (updateData.code) {
      const { data: conflictingClass } = await supabase
        .from('account_classes')
        .select('id')
        .eq('code', updateData.code)
        .neq('id', id)
        .single();

      if (conflictingClass) {
        return NextResponse.json(
          { error: 'Account class with this code already exists' },
          { status: 409 }
        );
      }
    }

    const { data, error } = await supabase
      .from('account_classes')
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

    // Check if account class exists
    const { data: existingClass } = await supabase
      .from('account_classes')
      .select('id')
      .eq('id', id)
      .single();

    if (!existingClass) {
      return NextResponse.json(
        { error: 'Account class not found' },
        { status: 404 }
      );
    }

    // Check if there are dependent records (account_subclasses)
    const { data: dependentRecords } = await supabase
      .from('account_subclasses')
      .select('id')
      .eq('account_class_id', id)
      .limit(1);

    if (dependentRecords && dependentRecords.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete account class with existing subclasses' },
        { status: 409 }
      );
    }

    const { error } = await supabase
      .from('account_classes')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ message: 'Account class deleted successfully' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
