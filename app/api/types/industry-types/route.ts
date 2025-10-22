// app/api/types/industry-types/route.ts

import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Schema for industry type validation
const createIndustryTypeSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  hint: z.string().max(200).optional(),
  is_active: z.boolean().default(true),
});

const updateIndustryTypeSchema = createIndustryTypeSchema.partial().extend({
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
      // Fetch single industry type by ID
      const { data, error } = await supabase
        .from('industry_types')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }

      return NextResponse.json({ data });
    }

    // Fetch all industry types with optional search
    let query = supabase.from('industry_types').select('*');

    // Apply search filter
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
    const validatedData = createIndustryTypeSchema.parse(body);

    // Check if name already exists
    const { data: existingType } = await supabase
      .from('industry_types')
      .select('id')
      .eq('name', validatedData.name)
      .single();

    if (existingType) {
      return NextResponse.json(
        { error: 'Industry type with this name already exists' },
        { status: 409 }
      );
    }

    const { data, error } = await supabase
      .from('industry_types')
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
    const validatedData = updateIndustryTypeSchema.parse(body);
    const { id, ...updateData } = validatedData;

    // Check if industry type exists
    const { data: existingType } = await supabase
      .from('industry_types')
      .select('id')
      .eq('id', id)
      .single();

    if (!existingType) {
      return NextResponse.json(
        { error: 'Industry type not found' },
        { status: 404 }
      );
    }

    // If updating name, check for conflicts
    if (updateData.name) {
      const { data: conflictingType } = await supabase
        .from('industry_types')
        .select('id')
        .eq('name', updateData.name)
        .neq('id', id)
        .single();

      if (conflictingType) {
        return NextResponse.json(
          { error: 'Industry type with this name already exists' },
          { status: 409 }
        );
      }
    }

    const { data, error } = await supabase
      .from('industry_types')
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

    // Check if industry type exists
    const { data: existingType } = await supabase
      .from('industry_types')
      .select('id')
      .eq('id', id)
      .single();

    if (!existingType) {
      return NextResponse.json(
        { error: 'Industry type not found' },
        { status: 404 }
      );
    }

    // Check if there are dependent records (business_registrations)
    const { data: dependentRecords } = await supabase
      .from('business_registrations')
      .select('id')
      .eq('industry_type_id', id)
      .limit(1);

    if (dependentRecords && dependentRecords.length > 0) {
      return NextResponse.json(
        {
          error:
            'Cannot delete industry type with existing business registrations',
        },
        { status: 409 }
      );
    }

    const { error } = await supabase
      .from('industry_types')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ message: 'Industry type deleted successfully' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
