// src/routes/auth/callback/+server.ts
import { redirect, type RequestHandler } from '@sveltejs/kit';
import { handleAuthCallback } from '@supabase/auth-helpers-sveltekit';

/**
 * Handles the Supabase auth callback (email verification, OAuth, etc.).
 * After processing, redirects the user to /dashboard.
 */
export const GET: RequestHandler = async (event) => {
	// Process the Supabase auth callback and set session cookies
	await handleAuthCallback(event);

	// Always redirect to /dashboard after processing
	throw redirect(303, '/dashboard');
};