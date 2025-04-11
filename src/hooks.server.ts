import type { Handle } from "@sveltejs/kit";
import { createClient } from "@supabase/supabase-js";
import {
  PUBLIC_SUPABASE_URL,
  PUBLIC_SUPABASE_ANON_KEY,
} from "$env/static/public";

export const handle: Handle = async ({ event, resolve }) => {
  // Create a Supabase SSR client for this request
  const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);

  // Inject getSession into event.locals for server-side session awareness
  event.locals.getSession = async () => {
    const { data, error } = await supabase.auth.getSession();
    if (error) return null;
    return data.session;
  };

  return resolve(event);
};
