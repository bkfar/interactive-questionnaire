// src/routes/+layout.server.ts

import { redirect, type Actions } from '@sveltejs/kit';
import { supabase } from '$lib/supabaseClient';
import type { RequestEvent } from '@sveltejs/kit';

export const actions: Actions = {
  logout: async (event: RequestEvent) => {
    await supabase.auth.signOut();
    // Remove Supabase auth cookies (names may vary by version)
    event.cookies.delete('sb-access-token', { path: '/' });
    event.cookies.delete('sb-refresh-token', { path: '/' });
    throw redirect(303, '/');
  }
};