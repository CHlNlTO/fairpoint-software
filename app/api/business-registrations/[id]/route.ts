import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const updateSchema = z.object({
  business_types: z.array(z.string()).optional(),
  fiscal_year_period_id: z.string().uuid().optional(),
  business_structure: z.string().optional(),
  income_tax_rate_id: z.string().uuid().optional().nullable(),
  business_tax_type: z.string().optional().nullable(),
  business_tax_exempt: z.boolean().optional(),
  additional_taxes: z.array(z.string()).optional(),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: registrationId } = await params;
    const body = await request.json();
    const parsed = updateSchema.safeParse(body);
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

    const { data: reg, error: regErr } = await supabase
      .from('business_registrations')
      .select('id, user_id')
      .eq('id', registrationId)
      .single();

    if (regErr || !reg) {
      return NextResponse.json(
        { error: 'Registration not found' },
        { status: 404 }
      );
    }
    if (reg.user_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { error } = await supabase
      .from('business_registrations')
      .update(parsed.data)
      .eq('id', registrationId);
    if (error) {
      return NextResponse.json(
        { error: error.message || 'Failed to update' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
