import type { ServerLoad } from "@sveltejs/kit";
import { error, fail } from "@sveltejs/kit";
import { supabase } from "$lib/supabaseClient";

/**
 * Profile page load: fetch user profile and signed avatar URL.
 */
export const load: ServerLoad = async (event) => {
  try {
    // Get session and user ID
    const session = await event.locals.getSession?.();
    const userId = session?.user?.id;
    if (!userId) {
      throw error(401, "Not authenticated");
    }

    // Fetch user profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("username, avatar_url")
      .eq("id", userId)
      .single();

    if (profileError) {
      throw error(500, "Failed to fetch profile");
    }
    if (!profile) {
      throw error(404, "Profile not found");
    }

    let avatarUrl: string | null = null;
    if (profile.avatar_url) {
      // Generate signed URL for avatar
      const { data: signed, error: signedError } = await supabase.storage
        .from("profile-pictures")
        .createSignedUrl(profile.avatar_url, 60 * 10); // 10 minutes

      if (signedError) {
        throw error(500, "Failed to generate signed avatar URL");
      }
      avatarUrl = signed?.signedUrl ?? null;
    }

    return {
      username: profile.username,
      avatarUrl,
    };
  } catch {
    // Error intentionally ignored; generic error message returned for security.
    throw error(500, "An unexpected error occurred while loading the profile.");
  }
};

/**
 * Profile update action: handles username and avatar updates.
 */
export const actions = {
  default: async (event: import("@sveltejs/kit").RequestEvent) => {
    try {
      const session = await event.locals.getSession?.();
      const userId = session?.user?.id;
      if (!userId) {
        return fail(401, { message: "Not authenticated." });
      }

      const form = await event.request.formData();
      const username = form.get("username");
      const avatar = form.get("avatar");

      if (typeof username !== "string" || username.trim().length === 0) {
        return fail(400, { message: "Username is required." });
      }

      let avatar_url: string | undefined;
      if (avatar instanceof File && avatar.size > 0) {
        // Get file extension
        const originalName = avatar.name;
        const ext = originalName.split(".").pop()?.toLowerCase() || "png";
        const storagePath = `${userId}/avatar.${ext}`;
        // Upload to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from("profile-pictures")
          .upload(storagePath, avatar, {
            upsert: true,
            contentType: avatar.type,
          });
        if (uploadError) {
          return fail(500, { message: "Failed to upload avatar." });
        }
        avatar_url = storagePath;
      }

      // Prepare update object
      const update: Record<string, unknown> = { username };
      if (avatar_url) update.avatar_url = avatar_url;

      // Update profile
      const { error: updateError } = await supabase
        .from("profiles")
        .update(update)
        .eq("id", userId);

      if (updateError) {
        if (updateError.code === "23505") {
          // Unique violation (username)
          return fail(409, { message: "Username already taken." });
        }
        return fail(500, { message: "Failed to update profile." });
      }

      return { success: true };
    } catch {
      // Error intentionally ignored; generic error message returned for security.
      return fail(500, {
        message: "An unexpected error occurred while updating the profile.",
      });
    }
  },
};
