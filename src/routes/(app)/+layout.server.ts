import type { LayoutServerLoad, LayoutServerLoadEvent } from "./$types";
import { redirect } from "@sveltejs/kit";

export const load: LayoutServerLoad = async (event: LayoutServerLoadEvent) => {
  const session = await event.locals.getSession?.();

  if (!session) {
    throw redirect(303, "/login");
  }

  return {
    session,
    user: session.user,
  };
};

/**
 * The load function ensures the user is authenticated before accessing app routes.
 * If no session is found, the user is redirected to the login page.
 */
