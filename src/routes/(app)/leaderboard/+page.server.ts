import type { ServerLoad } from "@sveltejs/kit";
import { error } from "@sveltejs/kit";
import { supabase } from "$lib/supabaseClient";

const GLOBAL_LEADERBOARD_LIMIT = 20;

interface LeaderboardEntry {
  user_id: string;
  username: string;
  avatar_url: string | null;
  points: number;
}

export const load: ServerLoad = async (event) => {
  // Get session and user ID
  const session = await event.locals.getSession?.();
  const userId = session?.user?.id;
  if (!userId) {
    throw error(401, "Not authenticated");
  }

  // --- Global Leaderboard ---
  const { data: globalData, error: globalError } = await supabase
    .from("user_metrics")
    .select("user_id, points, profiles(username, avatar_url)")
    .order("points", { ascending: false })
    .limit(GLOBAL_LEADERBOARD_LIMIT);

  if (globalError) {
    throw error(500, "Failed to fetch global leaderboard");
  }

  // Supabase returns rows as generic objects; cast to expected shape.
  const globalLeaderboard: LeaderboardEntry[] = (globalData ?? []).map(
    (row: Record<string, unknown>) => ({
      user_id: String(row.user_id),
      username:
        typeof row.profiles === "object" &&
        row.profiles &&
        "username" in row.profiles
          ? ((row.profiles as any).username ?? "")
          : "",
      avatar_url:
        typeof row.profiles === "object" &&
        row.profiles &&
        "avatar_url" in row.profiles
          ? ((row.profiles as any).avatar_url ?? null)
          : null,
      points: typeof row.points === "number" ? row.points : 0,
    }),
  );

  // --- Friends Leaderboard ---
  // 1. Get friend IDs (bidirectional, status = 'accepted')
  const { data: friendships, error: friendshipsError } = await supabase
    .from("friendships")
    .select("user_id, friend_id")
    .or(`user_id.eq.${userId},friend_id.eq.${userId}`)
    .eq("status", "accepted");

  if (friendshipsError) {
    throw error(500, "Failed to fetch friendships");
  }

  // Collect friend IDs (the other user in each friendship)
  const friendIds = new Set<string>();
  for (const f of friendships ?? []) {
    if (f.user_id === userId && f.friend_id) {
      friendIds.add(f.friend_id);
    } else if (f.friend_id === userId && f.user_id) {
      friendIds.add(f.user_id);
    }
  }
  // Include self
  friendIds.add(userId);

  // 2. Query user_metrics for friends + self
  let friendsLeaderboard: LeaderboardEntry[] = [];
  if (friendIds.size > 0) {
    const { data: friendsData, error: friendsError } = await supabase
      .from("user_metrics")
      .select("user_id, points, profiles(username, avatar_url)")
      .in("user_id", Array.from(friendIds))
      .order("points", { ascending: false });

    if (friendsError) {
      throw error(500, "Failed to fetch friends leaderboard");
    }

    // Supabase returns rows as generic objects; cast to expected shape.
    friendsLeaderboard = (friendsData ?? []).map(
      (row: Record<string, unknown>) => ({
        user_id: String(row.user_id),
        username:
          typeof row.profiles === "object" &&
          row.profiles &&
          "username" in row.profiles
            ? ((row.profiles as any).username ?? "")
            : "",
        avatar_url:
          typeof row.profiles === "object" &&
          row.profiles &&
          "avatar_url" in row.profiles
            ? ((row.profiles as any).avatar_url ?? null)
            : null,
        points: typeof row.points === "number" ? row.points : 0,
      }),
    );
  }

  return {
    globalLeaderboard,
    friendsLeaderboard,
    currentUserId: userId,
  };
};
