<script lang="ts">
  import { invalidateAll } from '$app/navigation';
  import { onMount } from 'svelte';
  import Card from '$lib/components/Card.svelte';
  import Button from '$lib/components/Button.svelte';
  import Spinner from '$lib/components/Spinner.svelte';
  import { Award, Flame, BarChart3, Info } from 'lucide-svelte';

  export let data: {
    question: { id: string; text: string; options: any } | null;
    metrics: { points: number; current_streak: number };
    noQuestionsLeft: boolean;
  };
  export let form: any;

  let autoAdvanceTimeout: ReturnType<typeof setTimeout> | null = null;

  // Auto-advance to next question after feedback is shown (2s delay)
  $: if (form?.feedback) {
    if (autoAdvanceTimeout) clearTimeout(autoAdvanceTimeout);
    autoAdvanceTimeout = setTimeout(() => {
      invalidateAll();
    }, 2000);
  }
  // Clear timeout on destroy
  onMount(() => {
    return () => {
      if (autoAdvanceTimeout) clearTimeout(autoAdvanceTimeout);
    };
  });

  function handleNextQuestion() {
    if (autoAdvanceTimeout) clearTimeout(autoAdvanceTimeout);
    invalidateAll();
  }
</script>

<svelte:head>
  <title>Dashboard | Questionnaire App</title>
</svelte:head>

<main class="min-h-screen bg-background text-foreground font-sans flex flex-col items-center justify-center px-4 py-8">
  <div class="w-full max-w-xl space-y-8">
    <Card ariaLabel="Dashboard" class="flex flex-col items-center">
      <div slot="header" class="w-full flex flex-col items-center">
        <h1 class="text-2xl font-bold mb-2 tracking-tight flex items-center gap-2">
          <BarChart3 class="w-6 h-6 text-primary" aria-hidden="true" />
          Dashboard
        </h1>
        <div class="flex space-x-6 mb-4">
          <div class="flex flex-col items-center">
            <span class="flex items-center gap-1 text-lg font-semibold">
              <Award class="w-5 h-5 text-yellow-500" aria-hidden="true" />
              Points
            </span>
            <span class="text-2xl font-mono">{data.metrics?.points ?? 0}</span>
          </div>
          <div class="flex flex-col items-center">
            <span class="flex items-center gap-1 text-lg font-semibold">
              <Flame class="w-5 h-5 text-orange-500" aria-hidden="true" />
              Streak
            </span>
            <span class="text-2xl font-mono">{data.metrics?.current_streak ?? 0}</span>
          </div>
        </div>
      </div>

      <div class="w-full border-t border-border my-4"></div>

      {#if data.noQuestionsLeft}
        <div class="flex flex-col items-center gap-2 py-8">
          <Info class="w-7 h-7 text-muted-foreground" aria-hidden="true" />
          <p class="text-center text-muted-foreground font-medium">
            🎉 You have answered all available questions!
          </p>
        </div>
      {:else if data.question}
        <div class="w-full">
          <h2 class="text-xl font-semibold mb-2 flex items-center gap-2">
            <BarChart3 class="w-5 h-5 text-primary" aria-hidden="true" />
            Next Question
          </h2>

          {#if form?.feedback}
            <!-- Feedback Visualization -->
            <div class="mb-6">
              <h3 class="text-lg font-medium mb-2 flex items-center gap-2">
                <BarChart3 class="w-5 h-5 text-primary" aria-hidden="true" />
                Feedback
              </h3>
              <div class="flex flex-col gap-3">
                {#each form.feedback.options as fbOpt, idx (fbOpt.id ?? idx)}
                  <div class="flex flex-col gap-1">
                    <div class="flex justify-between items-center">
                      <span class="text-foreground">{fbOpt.text ?? fbOpt.id ?? `Option ${idx + 1}`}</span>
                      <span class="text-sm text-muted-foreground">{fbOpt.percentage ?? 0}%</span>
                    </div>
                    <div class="w-full bg-accent rounded h-3 overflow-hidden" aria-label="Option result">
                      <div
                        class="h-3 rounded bg-primary transition-all"
                        style="width: {fbOpt.percentage ?? 0}%"
                        aria-valuenow={fbOpt.percentage ?? 0}
                        aria-valuemin="0"
                        aria-valuemax="100"
                        role="progressbar"
                      ></div>
                    </div>
                  </div>
                {/each}
              </div>
            </div>
            <Button
              variant="primary"
              class="mt-4"
              on:click={handleNextQuestion}
              ariaLabel="Next Question"
            >
              Next Question
            </Button>
            <p class="mt-2 text-xs text-muted-foreground">Advancing automatically...</p>
          {:else}
            <form class="space-y-4 w-full" autocomplete="off">
              <p class="mb-4 text-base font-medium">{data.question.text}</p>
              <fieldset>
                <legend class="sr-only">Options</legend>
                <div class="flex flex-col gap-3">
                  {#each data.question.options as option, idx (option.id ?? idx)}
                    <label class="flex items-center gap-3 bg-accent rounded px-4 py-2 cursor-pointer hover:bg-accent/80 transition">
                      <input
                        type="radio"
                        name="option"
                        value={option.id ?? option}
                        class="form-radio h-5 w-5 text-primary focus:ring-primary"
                        disabled
                      />
                      <span class="text-foreground">{option.text ?? option}</span>
                    </label>
                  {/each}
                </div>
              </fieldset>
              <!-- No answer submission logic yet -->
            </form>
          {/if}
        </div>
      {:else}
        <div class="flex flex-col items-center gap-2 py-8">
          <Spinner size={32} ariaLabel="Loading dashboard" />
          <span class="text-muted-foreground text-sm mt-2">Loading...</span>
        </div>
      {/if}
    </Card>
  </div>
</main>