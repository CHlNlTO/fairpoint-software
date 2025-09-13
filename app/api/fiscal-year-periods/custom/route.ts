import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const createCustomFiscalYearSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  start_month: z.number().int().min(1).max(12),
  start_day: z.number().int().min(1).max(31),
  end_month: z.number().int().min(1).max(12),
  end_day: z.number().int().min(1).max(31),
  description: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = createCustomFiscalYearSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid payload', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // First, check if a custom period with the same dates already exists
    const { data: existingPeriod, error: searchError } = await supabase
      .from('fiscal_year_periods')
      .select(
        'id, name, start_month, start_day, end_month, end_day, description'
      )
      .eq('start_month', parsed.data.start_month)
      .eq('start_day', parsed.data.start_day)
      .eq('end_month', parsed.data.end_month)
      .eq('end_day', parsed.data.end_day)
      .eq('is_default', false)
      .eq('is_active', true)
      .maybeSingle();

    if (searchError) {
      return NextResponse.json(
        { error: 'Failed to search for existing fiscal year period' },
        { status: 500 }
      );
    }

    // If a matching period exists, return it
    if (existingPeriod) {
      return NextResponse.json(existingPeriod);
    }

    // If no matching period exists, create a new one
    const payload = {
      ...parsed.data,
      is_default: false,
      is_active: true,
    };

    const { data, error } = await supabase
      .from('fiscal_year_periods')
      .insert(payload)
      .select(
        'id, name, start_month, start_day, end_month, end_day, description'
      )
      .single();

    if (error || !data) {
      return NextResponse.json(
        {
          error: error?.message || 'Failed to create custom fiscal year period',
        },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
