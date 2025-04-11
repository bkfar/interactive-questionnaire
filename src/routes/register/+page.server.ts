import type { Actions, RequestEvent } from "@sveltejs/kit";
import { fail, redirect } from "@sveltejs/kit";
import { supabase } from "$lib/supabaseClient";

export const actions: Actions = {
  default: async (event: RequestEvent) => {
    const { request } = event;
    const formData = await request.formData();
    const email = formData.get("email")?.toString().trim() ?? "";
    const password = formData.get("password")?.toString() ?? "";
    const username = formData.get("username")?.toString().trim() ?? "";

    // Basic validation
    if (!email || !password || !username) {
      return fail(400, {
        error: "All fields are required.",
        values: { email, username },
      });
    }

    try {
      // Register user with Supabase
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        let message = error.message;
        // Supabase returns "User already registered" for existing users
        if (error.status === 400 && message.includes("already registered")) {
          message = "A user with this email already exists.";
        }
        return fail(400, { error: message, values: { email, username } });
      }

      // Update profile with username if user was created
      const user = data.user;
      if (user) {
        const { error: profileError } = await supabase
          .from("profiles")
          .update({ username })
          .eq("id", user.id);

        if (profileError) {
          return fail(500, {
            error: "Registration succeeded, but failed to set username.",
            values: { email, username },
          });
        }
      }

      // Optionally, you may want to redirect to login or dashboard after registration
      throw redirect(303, "/login");
    } catch (err) {
      // Catch unexpected errors (network, thrown, etc.)
      return fail(500, {
        error: "An unexpected error occurred. Please try again.",
        values: { email, username },
      });
    }
  },
};
