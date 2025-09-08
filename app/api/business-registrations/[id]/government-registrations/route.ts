import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const isoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/u, 'Invalid date format (use YYYY-MM-DD)');

const credentialSchema = z.object({
  agencyCode: z.enum(['BIR', 'DTI', 'LGU', 'SEC', 'CDA']),
  registrationNumber: z.string().max(100).optional().or(z.literal('')),
  registrationDate: isoDate.optional().or(z.literal('')),
  expiryDate: isoDate.optional().or(z.literal('')),
  status: z.enum(['registered', 'pending', 'expired', 'cancelled']).optional(),
  notes: z.string().max(1000).optional().or(z.literal('')),
});

const bodySchema = z.object({
  credentials: z.array(credentialSchema),
});

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const registrationId = params.id;
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

    const results: Array<{ agencyCode: string; id: string }> = [];

    for (const cred of parsed.data.credentials) {
      // Resolve agency id by code
      const { data: agency, error: agencyErr } = await supabase
        .from('government_agencies')
        .select('id, code')
        .eq('code', cred.agencyCode)
        .eq('is_active', true)
        .single();

      if (agencyErr || !agency) {
        continue; // skip unknown agency
      }

      // Check existing
      const { data: existing, error: existingErr } = await supabase
        .from('business_government_registrations')
        .select('id')
        .eq('business_registration_id', registrationId)
        .eq('government_agency_id', agency.id)
        .maybeSingle();

      const payload = {
        business_registration_id: registrationId,
        government_agency_id: agency.id,
        registration_number: cred.registrationNumber || null,
        registration_date: cred.registrationDate || null,
        expiry_date: cred.expiryDate || null,
        status: cred.status || 'registered',
        notes: cred.notes || null,
        is_active: true,
      } as const;

      if (existingErr) {
        return NextResponse.json(
          { error: existingErr.message },
          { status: 500 }
        );
      }

      if (existing) {
        const { error: updErr } = await supabase
          .from('business_government_registrations')
          .update(payload)
          .eq('id', existing.id);
        if (updErr) {
          return NextResponse.json({ error: updErr.message }, { status: 500 });
        }
        results.push({ agencyCode: cred.agencyCode, id: existing.id });
      } else {
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
        results.push({ agencyCode: cred.agencyCode, id: inserted.id });
      }
    }

    return NextResponse.json({ success: true, results });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
