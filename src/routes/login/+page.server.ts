import type { Actions, RequestEvent } from '@sveltejs/kit';
import { fail, redirect } from '@sveltejs/kit';
import { supabase } from '$lib/supabaseClient';

export const actions: Actions = {
  default: async (event: RequestEvent) => {
    const { request, cookies } = event;
    const formData = await request.formData();
    const email = formData.get('email');
    const password = formData.get('password');

    if (typeof email !== 'string' || typeof password !== 'string') {
      return fail(400, { error: 'Email and password are required.' });
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      return fail(401, { error: error.message });
    }

    // Set the Supabase auth session cookie if needed
    if (data.session) {
      cookies.set('sb-access-token', data.session.access_token, {
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: data.session.expires_in
      });
      cookies.set('sb-refresh-token', data.session.refresh_token, {
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 30 // 30 days
      });
    }

    throw redirect(303, '/dashboard');
  }
};