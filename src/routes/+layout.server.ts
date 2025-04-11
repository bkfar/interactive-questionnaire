// src/routes/+layout.server.ts

import { redirect, fail, type Actions } from "@sveltejs/kit";
import { supabase } from "$lib/supabaseClient";
import type { RequestEvent } from "@sveltejs/kit";

