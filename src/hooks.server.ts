import type { Handle } from '@sveltejs/kit';
import { createServerClient, type CookieOptions } from '@supabase/auth-helpers-sveltekit';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

export const handle: Handle = async ({ event, resolve }) => {
	// Create a Supabase server client for this request
	const supabase = createServerClient(
		PUBLIC_SUPABASE_URL,
		PUBLIC_SUPABASE_ANON_KEY,
		{
			cookies: {
				get: (key: string) => event.cookies.get(key),
				set: (key: string, value: string, options: CookieOptions) => {
					event.cookies.set(key, value, options);
				},
				remove: (key: string, options: CookieOptions) => {
					event.cookies.delete(key, options);
				}
			}
		}
	);

	// Inject getSession into event.locals for server-side session awareness
	event.locals.getSession = async () => {
		const { data, error } = await supabase.auth.getSession();
		if (error) return null;
		return data.session;
	};

	return resolve(event);
};