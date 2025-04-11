import { json, error } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { supabase } from "$lib/supabaseClient";

/**
 * GET /api/user-search?q=searchterm
 * Returns users matching the query, excluding self and users with existing or pending friendships.
 */
export const GET: RequestHandler = async ({ url, locals }) => {
  const session = await locals.getSession?.();
  const userId = session?.user?.id;
  if (!userId) {
    throw error(401, "Not authenticated");
  }

  const q = url.searchParams.get("q")?.trim();
  if (!q || q.length < 2) {
    // Require at least 2 chars for search
    return json({ users: [] });
  }

  // 1. Find all user IDs to exclude (self, friends, pending requests)
  // Get all friendships where current user is involved and status is pending or accepted
  const { data: friendships, error: friendshipsError } = await supabase
    .from("friendships")
    .select("user_id_1, user_id_2")
    .or(`user_id_1.eq.${userId},user_id_2.eq.${userId}`)
    .in("status", ["pending", "accepted"]);

  if (friendshipsError) {
    throw error(500, "Failed to fetch friendships");
  }

  // Collect all user IDs to exclude
  const excludeIds = new Set<string>();
  excludeIds.add(userId);
  if (friendships) {
    for (const f of friendships) {
      if (f.user_id_1 && f.user_id_1 !== userId) excludeIds.add(f.user_id_1);
      if (f.user_id_2 && f.user_id_2 !== userId) excludeIds.add(f.user_id_2);
    }
  }

  // 2. Search profiles
  const { data: users, error: usersError } = await supabase
    .from("profiles")
    .select("id, username, avatar_url, email")
    .or(`username.ilike.%${q}%,email.ilike.%${q}%`)
    .not("id", "in", `(${[...excludeIds].join(",")})`)
    .order("username")
    .limit(10);

  if (usersError) {
    throw error(500, "Failed to search users");
  }

  return json({ users });
};
