// app/api/accounts/subtypes/route.ts

import {
  accountSubtypeCreateSchema,
  accountSubtypeUpdateSchema,
} from '@/features/chart-of-accounts/lib/schemas';
import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get the authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const search = searchParams.get('search');

    if (id) {
      const { data, error } = await supabase
        .from('account_subtypes')
        .select(
          `
          *,
          account_type:account_types(
            *,
            account_subclass:account_subclasses(
              *,
              account_class:account_classes(*)
            )
          )
        `
        )
        .eq('id', id)
        .or(`user_id.is.null,user_id.eq.${user.id}`) // System data OR user's own data
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
      if (!data) {
        return NextResponse.json(
          { error: 'Account subtype not found' },
          { status: 404 }
        );
      }
      return NextResponse.json({ data });
    }

    let query = supabase
      .from('account_subtypes')
      .select(
        `
      *,
      account_type:account_types(
        *,
        account_subclass:account_subclasses(
          *,
          account_class:account_classes(*)
        )
      )
    `
      )
      .or(`user_id.is.null,user_id.eq.${user.id}`); // System data OR user's own data

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

    // Get the authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = accountSubtypeCreateSchema.parse(body);

    // Check if account type exists
    const { data: accountType, error: checkError } = await supabase
      .from('account_types')
      .select('id')
      .eq('id', validatedData.account_type_id)
      .single();

    if (checkError || !accountType) {
      return NextResponse.json(
        { error: 'Account type not found' },
        { status: 400 }
      );
    }

    // Check for unique code within the account_type_id
    const { count, error: countError } = await supabase
      .from('account_subtypes')
      .select('id', { count: 'exact' })
      .eq('account_type_id', validatedData.account_type_id)
      .eq('code', validatedData.code);

    if (countError) {
      throw countError;
    }

    if (count && count > 0) {
      return NextResponse.json(
        {
          error:
            'An account subtype with this code already exists for this account type.',
        },
        { status: 409 }
      );
    }

    // Prepare data for insert with user_id and is_system_defined
    const insertData = {
      ...validatedData,
      user_id: user.id,
      is_system_defined: false, // User-created subtypes are not system defined
    };

    const { data, error } = await supabase
      .from('account_subtypes')
      .insert([insertData])
      .select(
        `
        *,
        account_type:account_types(
          *,
          account_subclass:account_subclasses(
            *,
            account_class:account_classes(*)
          )
        )
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

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get the authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = accountSubtypeUpdateSchema.parse(body);

    if (!validatedData.id) {
      return NextResponse.json(
        { error: 'ID is required for update' },
        { status: 400 }
      );
    }

    // Check if account subtype exists and belongs to the user (not system-defined)
    const { data: existingSubtype, error: checkError } = await supabase
      .from('account_subtypes')
      .select('id, account_type_id, user_id, is_system_defined')
      .eq('id', validatedData.id)
      .eq('user_id', user.id) // Only allow updating user's own subtypes
      .single();

    if (checkError || !existingSubtype) {
      return NextResponse.json(
        {
          error:
            'Account subtype not found or access denied. You can only update your own account subtypes.',
        },
        { status: 404 }
      );
    }

    // If updating account_type_id, check if it exists
    if (validatedData.account_type_id) {
      const { data: accountType, error: typeError } = await supabase
        .from('account_types')
        .select('id')
        .eq('id', validatedData.account_type_id)
        .single();

      if (typeError || !accountType) {
        return NextResponse.json(
          { error: 'Account type not found' },
          { status: 400 }
        );
      }
    }

    // If code is being updated, check if it already exists for this account type
    if (validatedData.code) {
      const accountTypeId =
        validatedData.account_type_id || existingSubtype.account_type_id;

      const { data: duplicateSubtype, error: duplicateError } = await supabase
        .from('account_subtypes')
        .select('id')
        .eq('account_type_id', accountTypeId)
        .eq('code', validatedData.code)
        .neq('id', validatedData.id); // Exclude current subtype from check

      if (duplicateError) {
        throw duplicateError;
      }

      if (duplicateSubtype && duplicateSubtype.length > 0) {
        return NextResponse.json(
          {
            error:
              'An account subtype with this code already exists for this account type.',
          },
          { status: 409 }
        );
      }
    }

    const { data, error } = await supabase
      .from('account_subtypes')
      .update(validatedData)
      .eq('id', validatedData.id)
      .select(
        `
        *,
        account_type:account_types(
          *,
          account_subclass:account_subclasses(
            *,
            account_class:account_classes(*)
          )
        )
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

    // Get the authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID is required for deletion' },
        { status: 400 }
      );
    }

    // Check if account subtype exists and belongs to the user (not system-defined)
    const { data: existingSubtype, error: checkError } = await supabase
      .from('account_subtypes')
      .select('id')
      .eq('id', id)
      .eq('user_id', user.id) // Only allow deleting user's own subtypes
      .single();

    if (checkError || !existingSubtype) {
      return NextResponse.json(
        {
          error:
            'Account subtype not found or access denied. You can only delete your own account subtypes.',
        },
        { status: 404 }
      );
    }

    const { error } = await supabase
      .from('account_subtypes')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({
      message: 'Account subtype deleted successfully',
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
