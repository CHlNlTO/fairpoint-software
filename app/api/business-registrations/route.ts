import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const createSchema = z.object({
  business_name: z.string().min(1),
  tin_number: z
    .string()
    .regex(/^\d{3}-\d{3}-\d{3}-\d{3}$/u, 'Invalid TIN format'),
  business_email: z.string().email(),
  region_psgc: z.string().regex(/^\d{2}0{8}$/u),
  province_psgc: z.string().regex(/^\d{5}0{5}$/u),
  city_municipality_psgc: z.string().regex(/^\d{7}0{3}$/u),
  barangay_psgc: z.string().regex(/^\d{10}$/u),
  street_address: z.string().max(500).optional().or(z.literal('')),
  building_name: z.string().max(200).optional().or(z.literal('')),
  unit_number: z.string().max(50).optional().or(z.literal('')),
  postal_code: z
    .string()
    .regex(/^\d{4}$/u)
    .optional()
    .or(z.literal('')),
  business_types: z.array(z.string()).min(1),
  fiscal_year_period_id: z.string().uuid().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = createSchema.safeParse(body);
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

    // determine fiscal year period id (required by DB)
    let fiscalYearPeriodId = parsed.data.fiscal_year_period_id;
    if (!fiscalYearPeriodId) {
      const { data: period, error: periodErr } = await supabase
        .from('fiscal_year_periods')
        .select('id, is_default')
        .eq('is_active', true)
        .order('is_default', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (periodErr || !period) {
        return NextResponse.json(
          { error: 'No active fiscal year period configured' },
          { status: 500 }
        );
      }
      fiscalYearPeriodId = period.id;
    }

    const payload = {
      user_id: user.id,
      business_name: parsed.data.business_name,
      tin_number: parsed.data.tin_number,
      business_email: parsed.data.business_email,
      region_psgc: parsed.data.region_psgc,
      province_psgc: parsed.data.province_psgc,
      city_municipality_psgc: parsed.data.city_municipality_psgc,
      barangay_psgc: parsed.data.barangay_psgc,
      street_address: parsed.data.street_address || null,
      building_name: parsed.data.building_name || null,
      unit_number: parsed.data.unit_number || null,
      postal_code: parsed.data.postal_code || null,
      business_types: parsed.data.business_types,
      fiscal_year_period_id: fiscalYearPeriodId,
      is_active: true,
    };

    const { data, error } = await supabase
      .from('business_registrations')
      .insert(payload)
      .select('id')
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: error?.message || 'Failed to create draft' },
        { status: 500 }
      );
    }

    return NextResponse.json({ id: data.id });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
