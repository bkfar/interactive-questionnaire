import { browser } from "$app/environment";
import { supabase } from "$lib/supabaseClient";
import { invalidateAll } from "$app/navigation";

export const load = async ({ depends, parent }) => {
  depends("supabase:auth");
  const { session } = await parent();

  if (browser && supabase) {
    supabase.auth.onAuthStateChange(() => {
      invalidateAll();
    });
  }

  return { session };
};
