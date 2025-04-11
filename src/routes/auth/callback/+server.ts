// src/routes/auth/callback/+server.ts
import { redirect, type RequestHandler } from "@sveltejs/kit";
import { createServerClient } from "@supabase/ssr";

/**
 * Handles the Supabase auth callback (email verification, OAuth, etc.).
 * After processing, redirects the user to /dashboard.
 */
export const GET: RequestHandler = async (event) => {
  // Create a Supabase client using the event (request context)
  const supabase = createServerClient(
    process.env.PUBLIC_SUPABASE_URL!,
    process.env.PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: event.cookies }
  );

  // This will parse the callback and set the session cookies
  await supabase.auth.exchangeCodeForSession(event.url.toString());

  // Always redirect to /dashboard after processing
  throw redirect(303, "/dashboard");
};
