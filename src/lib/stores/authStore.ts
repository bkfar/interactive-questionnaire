import { writable, type Writable } from "svelte/store";
import type { User } from "@supabase/supabase-js";

export interface AuthState {
  loggedIn: boolean;
  user: User | null;
}

/**
 * Svelte writable store for authentication state.
 * Should be updated from the root layout based on session changes.
 */
export const authStore: Writable<AuthState> = writable({
  loggedIn: false,
  user: null,
});
