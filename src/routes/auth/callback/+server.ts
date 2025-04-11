// src/routes/auth/callback/+server.ts
import { redirect, type RequestHandler } from "@sveltejs/kit";
import { createSupabaseServerClient } from "@supabase/auth-helpers-sveltekit";

/**
 * Handles the Supabase auth callback (email verification, OAuth, etc.).
 * After processing, redirects the user to /dashboard.
 */
export const GET: RequestHandler = async (event) => {
  // Create a Supabase client using the event (request context)
  const supabase = createSupabaseServerClient({
    supabaseUrl: process.env.PUBLIC_SUPABASE_URL,
    supabaseKey: process.env.PUBLIC_SUPABASE_ANON_KEY,
    event
  });

  // This will parse the callback and set the session cookies
  await supabase.auth.getSessionFromUrl({ storeSession: true });

  // Always redirect to /dashboard after processing
  throw redirect(303, "/dashboard");
};
