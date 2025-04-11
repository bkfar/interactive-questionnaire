import type { ServerLoad } from '@sveltejs/kit';
import { error } from '@sveltejs/kit';
import { supabase } from '$lib/supabaseClient';

export const load: ServerLoad = async (event) => {
  // Get session and user ID
  const session = await event.locals.getSession?.();
  const userId = session?.user?.id;
  if (!userId) {
    throw error(401, 'Not authenticated');
  }

  // Pagination params
  const page = Number(event.url.searchParams.get('page')) || 1;
  const pageSize = Number(event.url.searchParams.get('pageSize')) || 10;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  // Fetch answers with question text, ordered by created_at desc, paginated
  const { data, error: dbError, count } = await supabase
    .from('answers')
    .select(
      `
        id,
        question_id,
        selected_option_id,
        created_at,
        questions (
          text
        )
      `,
      { count: 'exact' }
    )
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .range(from, to);

  if (dbError) {
    throw error(500, 'Failed to fetch answers');
  }

  // answers: [{ id, question_id, selected_option_id, created_at, questions: { text } }]
  const answers =
    data?.map((a) => ({
      id: a.id,
      questionId: a.question_id,
      questionText: a.questions?.text ?? '',
      selectedOptionId: a.selected_option_id,
      createdAt: a.created_at
    })) ?? [];

  const total = count ?? 0;
  const totalPages = Math.ceil(total / pageSize);
  const hasNext = page < totalPages;
  const hasPrev = page > 1;

  return {
    answers,
    pagination: {
      page,
      pageSize,
      total,
      totalPages,
      hasNext,
      hasPrev
    }
  };
};