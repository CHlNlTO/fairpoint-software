import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const bodySchema = z.object({
  agencies: z.array(z.enum(['BIR', 'DTI', 'LGU', 'SEC', 'CDA'])),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: registrationId } = await params;
    const json = await request.json();
    const parsed = bodySchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid payload', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Ensure business registration exists and belongs to current user
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

    // First, deactivate all existing government registrations for this business
    const { error: deactivateErr } = await supabase
      .from('business_government_registrations')
      .update({ is_active: false })
      .eq('business_registration_id', registrationId);

    if (deactivateErr) {
      return NextResponse.json(
        { error: deactivateErr.message },
        { status: 500 }
      );
    }

    const results: Array<{ agencyCode: string; id: string }> = [];

    for (const agencyCode of parsed.data.agencies) {
      // Resolve agency id by code
      const { data: agency, error: agencyErr } = await supabase
        .from('government_agencies')
        .select('id, code')
        .eq('code', agencyCode)
        .eq('is_active', true)
        .single();

      if (agencyErr || !agency) {
        continue; // skip unknown agency
      }

      // Check existing record
      const { data: existing, error: existingErr } = await supabase
        .from('business_government_registrations')
        .select('id')
        .eq('business_registration_id', registrationId)
        .eq('government_agency_id', agency.id)
        .maybeSingle();

      if (existingErr) {
        return NextResponse.json(
          { error: existingErr.message },
          { status: 500 }
        );
      }

      const payload = {
        business_registration_id: registrationId,
        government_agency_id: agency.id,
        registration_number: null,
        registration_date: null,
        expiry_date: null,
        status: 'registered',
        notes: null,
        is_active: true,
      } as const;

      if (existing) {
        // Update existing record to be active
        const { error: updErr } = await supabase
          .from('business_government_registrations')
          .update(payload)
          .eq('id', existing.id);
        if (updErr) {
          return NextResponse.json({ error: updErr.message }, { status: 500 });
        }
        results.push({ agencyCode, id: existing.id });
      } else {
        // Insert new record
        const { data: inserted, error: insErr } = await supabase
          .from('business_government_registrations')
          .insert(payload)
          .select('id')
          .single();
        if (insErr || !inserted) {
          return NextResponse.json(
            { error: insErr?.message || 'Insert failed' },
            { status: 500 }
          );
        }
        results.push({ agencyCode, id: inserted.id });
      }
    }

    return NextResponse.json({ success: true, results });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
