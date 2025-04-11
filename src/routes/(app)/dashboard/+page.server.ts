import type { ServerLoad } from "@sveltejs/kit";
import { error, fail } from "@sveltejs/kit";
import { supabase } from "$lib/supabaseClient";

// Dashboard page load: fetch question, metrics, etc.
export const load: ServerLoad = async (event) => {
  try {
    // Get session and user ID
    const session = await event.locals.getSession?.();
    const userId = session?.user?.id;
    if (!userId) {
      throw error(401, "Not authenticated");
    }

    // Fetch all question IDs the user has already answered
    const { data: answered, error: answeredError } = await supabase
      .from("answers")
      .select("question_id")
      .eq("user_id", userId);

    if (answeredError) {
      throw error(500, "Failed to fetch answered questions");
    }

    const answeredIds = answered?.map((a) => a.question_id) ?? [];

    // Fetch one random unanswered question
    let question = null;
    const { data: questions, error: questionsError } = await supabase
      .from("questions")
      .select("id, text, options")
      .not(
        "id",
        "in",
        answeredIds.length > 0
          ? answeredIds
          : ["00000000-0000-0000-0000-000000000000"],
      )
      .order("random")
      .limit(1);

    if (questionsError) {
      throw error(500, "Failed to fetch question");
    }
    question = questions?.[0] ?? null;

    // Fetch user metrics
    const { data: metrics, error: metricsError } = await supabase
      .from("user_metrics")
      .select("points, current_streak")
      .eq("user_id", userId)
      .single();

    if (metricsError) {
      throw error(500, "Failed to fetch user metrics");
    }

    return {
      question,
      metrics,
      noQuestionsLeft: !question,
    };
  } catch {
    // Error intentionally ignored; generic error message returned for security.
    throw error(
      500,
      "An unexpected error occurred while loading the dashboard.",
    );
  }
};

// Form actions
export const actions = {
  answer: async (event: import("@sveltejs/kit").RequestEvent) => {
    try {
      const session = await event.locals.getSession?.();
      const userId = session?.user?.id;
      if (!userId) {
        throw error(401, "Not authenticated");
      }

      const form = await event.request.formData();
      const questionId = form.get("questionId");
      const selectedOptionId = form.get("selectedOptionId");

      if (!questionId || !selectedOptionId) {
        return fail(400, { message: "Missing question or option." });
      }

      // Insert answer, handle unique violation
      const { error: insertError } = await supabase.from("answers").insert({
        user_id: userId,
        question_id: questionId,
        selected_option_id: selectedOptionId,
      });

      if (insertError) {
        // Unique violation: user already answered
        if (insertError.code === "23505") {
          return fail(409, {
            message: "You have already answered this question.",
          });
        }
        return fail(500, { message: "Failed to submit answer." });
      }

      // Fetch user metrics
      const { data: metrics, error: metricsError } = await supabase
        .from("user_metrics")
        .select("points, current_streak, last_answered_date")
        .eq("user_id", userId)
        .single();
      if (metricsError || !metrics) {
        return fail(500, { message: "Failed to fetch user metrics." });
      }

      // Calculate new streak and points
      const today = new Date();
      const todayStr = today.toISOString().split("T")[0];
      let newStreak = 1;
      let newPoints = metrics.points + 1;
      if (metrics.last_answered_date) {
        const last = new Date(metrics.last_answered_date);
        const diffDays = Math.floor(
          (today.getTime() - last.getTime()) / (1000 * 60 * 60 * 24),
        );
        if (diffDays === 1) {
          newStreak = metrics.current_streak + 1;
        } else if (diffDays === 0) {
          newStreak = metrics.current_streak;
          newPoints = metrics.points; // Already answered today, don't increment points
        }
        // else: diffDays > 1, reset streak to 1
      }

      const { error: updateError } = await supabase
        .from("user_metrics")
        .update({
          points: newPoints,
          current_streak: newStreak,
          last_answered_date: todayStr,
        })
        .eq("user_id", userId);
      if (updateError) {
        return fail(500, { message: "Failed to update user metrics." });
      }

      // --- Step 56: Fetch answer aggregation stats for feedback ---
      // 1. Get total number of answers for this question
      const { data: allAnswers, error: allAnswersError } = await supabase
        .from("answers")
        .select("selected_option_id")
        .eq("question_id", questionId);

      if (allAnswersError) {
        return fail(500, { message: "Failed to fetch answer stats." });
      }

      // 2. Count per option
      const total = allAnswers?.length ?? 0;
      const counts: Record<string, number> = {};
      if (allAnswers) {
        for (const ans of allAnswers) {
          const opt = ans.selected_option_id;
          counts[opt] = (counts[opt] ?? 0) + 1;
        }
      }

      // 3. Calculate percentages
      const feedback: Record<string, number> = {};
      if (total > 0) {
        for (const [optionId, count] of Object.entries(counts)) {
          feedback[optionId] = count / total;
        }
      }

      return { success: true, feedback };
    } catch {
      // Error intentionally ignored; generic error message returned for security.
      return fail(500, {
        message: "An unexpected error occurred while submitting your answer.",
      });
    }
  },
};
