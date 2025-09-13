import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const createSchema = z.object({
  business_name: z.string().min(1),
  tin_number: z
    .string()
    .regex(/^\d{3}-\d{3}-\d{3}-\d{3}$/u, 'Invalid TIN format'),
  business_email: z.string().email(),
  barangay_psgc: z.string().regex(/^\d{10}$/u, 'Invalid barangay PSGC format'),
  street_address: z.string().max(500).optional().or(z.literal('')),
  building_name: z.string().max(200).optional().or(z.literal('')),
  unit_number: z.string().max(50).optional().or(z.literal('')),
  postal_code: z
    .string()
    .regex(/^\d{4}$/u)
    .optional()
    .or(z.literal('')),
  business_types: z.array(z.string()).min(1),
  business_structure: z.string().min(1),
  fiscal_year_period_id: z.string().uuid().optional(),
});

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch businesses
    const { data: businesses, error } = await supabase
      .from('business_registrations')
      .select(
        `
        id,
        business_name,
        business_email,
        tin_number,
        business_types,
        business_structure,
        is_active,
        created_at,
        updated_at,
        barangay_psgc,
        street_address,
        building_name,
        unit_number,
        postal_code,
        business_tax_type,
        business_tax_exempt,
        fiscal_year_period_id
      `
      )
      .eq('user_id', user.id)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: error.message || 'Failed to fetch businesses' },
        { status: 500 }
      );
    }

    // Get unique fiscal year period IDs
    const fiscalYearIds =
      businesses
        ?.map(b => b.fiscal_year_period_id)
        .filter((id, index, array) => array.indexOf(id) === index) || [];

    // Fetch fiscal year periods in batch
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let fiscalYearPeriods: Record<string, any> = {};
    if (fiscalYearIds.length > 0) {
      const { data: periods } = await supabase
        .from('fiscal_year_periods')
        .select('id, name, description')
        .in('id', fiscalYearIds);

      fiscalYearPeriods =
        periods?.reduce(
          (acc, period) => {
            acc[period.id] = period;
            return acc;
          },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          {} as Record<string, any>
        ) || {};
    }

    // Transform the data to match the expected format
    const transformedBusinesses =
      businesses?.map(business => ({
        id: business.id,
        name: business.business_name,
        email: business.business_email,
        tin: business.tin_number,
        types: business.business_types,
        structure: business.business_structure,
        status: business.is_active ? 'Active' : 'Inactive',
        createdAt: business.created_at,
        updatedAt: business.updated_at,
        address: {
          barangayPsgc: business.barangay_psgc,
          streetAddress: business.street_address,
          buildingName: business.building_name,
          unitNumber: business.unit_number,
          postalCode: business.postal_code,
        },
        taxInfo: {
          type: business.business_tax_type,
          exempt: business.business_tax_exempt,
        },
        fiscalYear: {
          id: business.fiscal_year_period_id || '',
          name:
            fiscalYearPeriods[business.fiscal_year_period_id]?.name ||
            'Unknown Period',
          description:
            fiscalYearPeriods[business.fiscal_year_period_id]?.description,
        },
      })) || [];

    return NextResponse.json({ businesses: transformedBusinesses });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

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
      barangay_psgc: parsed.data.barangay_psgc,
      street_address: parsed.data.street_address || null,
      building_name: parsed.data.building_name || null,
      unit_number: parsed.data.unit_number || null,
      postal_code: parsed.data.postal_code || null,
      business_types: parsed.data.business_types,
      business_structure: parsed.data.business_structure,
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
