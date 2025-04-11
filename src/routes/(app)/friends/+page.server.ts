import type { ServerLoad } from '@sveltejs/kit';
import { error, fail } from '@sveltejs/kit';
import { supabase } from '$lib/supabaseClient';

/**
 * Friends page load: fetch accepted friends, pending received, and pending sent requests.
 */
export const load: ServerLoad = async (event) => {
  // Get session and user ID
  const session = await event.locals.getSession?.();
  const userId = session?.user?.id;
  if (!userId) {
    throw error(401, 'Not authenticated');
  }

  // Accepted friends: status='accepted' and user is user_id_1 or user_id_2
  const { data: accepted, error: acceptedError } = await supabase
    .from('friendships')
    .select(`
      *,
      profile_1:profiles!user_id_1(*),
      profile_2:profiles!user_id_2(*)
    `)
    .or(`user_id_1.eq.${userId},user_id_2.eq.${userId}`)
    .eq('status', 'accepted');

  // Pending received: status='pending' and user is user_id_2
  const { data: pendingReceived, error: receivedError } = await supabase
    .from('friendships')
    .select(`
      *,
      sender_profile:profiles!user_id_1(*)
    `)
    .eq('user_id_2', userId)
    .eq('status', 'pending');

  // Pending sent: status='pending' and user is user_id_1
  const { data: pendingSent, error: sentError } = await supabase
    .from('friendships')
    .select(`
      *,
      receiver_profile:profiles!user_id_2(*)
    `)
    .eq('user_id_1', userId)
    .eq('status', 'pending');

  if (acceptedError || receivedError || sentError) {
    throw error(500, 'Failed to fetch friends data');
  }

  return {
    accepted: accepted ?? [],
    pendingReceived: pendingReceived ?? [],
    pendingSent: pendingSent ?? [],
    userId
  };
};

import type { Actions } from './$types';

export const actions: Actions = {
  sendRequest: async (event) => {
    const session = await event.locals.getSession?.();
    const userId = session?.user?.id;
    if (!userId) {
      return fail(401, { error: 'Not authenticated' });
    }

    const form = await event.request.formData();
    const targetId = form.get('targetId');
    if (!targetId || typeof targetId !== 'string') {
      return fail(400, { error: 'Invalid target user' });
    }
    if (targetId === userId) {
      return fail(400, { error: 'You cannot send a friend request to yourself.' });
    }

    // Check for existing friendship or pending request (in either direction)
    const { data: existing, error: checkError } = await supabase
      .from('friendships')
      .select('id, status')
      .or(
        `and(user_id_1.eq.${userId},user_id_2.eq.${targetId}),and(user_id_1.eq.${targetId},user_id_2.eq.${userId})`
      )
      .in('status', ['pending', 'accepted']);

    if (checkError) {
      return fail(500, { error: 'Database error. Please try again.' });
    }
    if (existing && existing.length > 0) {
      const status = existing[0].status;
      if (status === 'accepted') {
        return fail(400, { error: 'You are already friends.' });
      } else {
        return fail(400, { error: 'A friend request already exists.' });
      }
    }

    // Insert new pending request
    const { error: insertError } = await supabase
      .from('friendships')
      .insert({ user_id_1: userId, user_id_2: targetId, status: 'pending' });

    if (insertError) {
      return fail(500, { error: 'Failed to send friend request.' });
    }

    return { success: true };
  }
  },
  acceptRequest: async (event) => {
    const session = await event.locals.getSession?.();
    const userId = session?.user?.id;
    if (!userId) {
      return fail(401, { error: 'Not authenticated' });
    }

    const form = await event.request.formData();
    const requestId = form.get('requestId');
    if (!requestId || typeof requestId !== 'string') {
      return fail(400, { error: 'Invalid request' });
    }

    // Fetch the friendship row to verify recipient and status
    const { data: friendship, error: fetchError } = await supabase
      .from('friendships')
      .select('id, user_id_2, status')
      .eq('id', requestId)
      .single();

    if (fetchError || !friendship) {
      return fail(404, { error: 'Friend request not found.' });
    }
    if (friendship.user_id_2 !== userId) {
      return fail(403, { error: 'You are not authorized to accept this request.' });
    }
    if (friendship.status !== 'pending') {
      return fail(400, { error: 'Request is not pending.' });
    }

    // Update status to 'accepted'
    const { error: updateError } = await supabase
      .from('friendships')
      .update({ status: 'accepted' })
      .eq('id', requestId);

    if (updateError) {
      return fail(500, { error: 'Failed to accept friend request.' });
    }

    return { success: true };
  },
  rejectRequest: async (event) => {
    const session = await event.locals.getSession?.();
    const userId = session?.user?.id;
    if (!userId) {
      return fail(401, { error: 'Not authenticated' });
    }

    const form = await event.request.formData();
    const requestId = form.get('requestId');
    if (!requestId || typeof requestId !== 'string') {
      return fail(400, { error: 'Invalid request' });
    }

    // Fetch the friendship row to verify recipient and status
    const { data: friendship, error: fetchError } = await supabase
      .from('friendships')
      .select('id, user_id_2, status')
      .eq('id', requestId)
      .single();

    if (fetchError || !friendship) {
      return fail(404, { error: 'Friend request not found.' });
    }
    if (friendship.user_id_2 !== userId) {
      return fail(403, { error: 'You are not authorized to reject this request.' });
    }
    if (friendship.status !== 'pending') {
      return fail(400, { error: 'Request is not pending.' });
    }

    // Delete the friendship row
    const { error: deleteError } = await supabase
      .from('friendships')
      .delete()
      .eq('id', requestId);

    if (deleteError) {
      return fail(500, { error: 'Failed to reject friend request.' });
    }

    return { success: true };
  }
};