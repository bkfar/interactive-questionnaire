<script lang="ts">
  import Card from '$lib/components/Card.svelte';
  import Button from '$lib/components/Button.svelte';
  import Spinner from '$lib/components/Spinner.svelte';
  // No need for $app/stores; all data is passed via props.
  import { goto } from '$app/navigation';

  export let data: {
    answers: {
      id: string;
      questionId: string;
      questionText: string;
      selectedOptionId: string;
      createdAt: string;
    }[];
    pagination: {
      page: number;
      pageSize: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };

  // Format timestamp for display
  function formatDate(ts: string) {
    const date = new Date(ts);
    return date.toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // Pagination navigation
  function goToPage(newPage: number) {
    const url = new URL(window.location.href);
    url.searchParams.set('page', String(newPage));
    goto(url.pathname + url.search);
  }
</script>

<svelte:head>
  <title>History &mdash; Questionnaire App</title>
  <meta name="description" content="View your answer history in the interactive questionnaire app." />
</svelte:head>

<main class="flex flex-col items-center gap-8 py-8 px-4 max-w-3xl mx-auto w-full">
  <h1 class="text-2xl font-bold text-foreground mb-2 w-full text-left">History</h1>

  <Card class="w-full">
    {#if !data}
      <div class="flex flex-col items-center justify-center min-h-[200px] py-8">
        <Spinner size={32} />
        <span class="mt-4 text-muted-foreground">Loading...</span>
      </div>
    {:else if data.answers.length === 0}
      <div class="flex flex-col items-center justify-center min-h-[200px] py-8">
        <span class="text-muted-foreground text-center">
          You haven't answered any questions yet.
        </span>
      </div>
    {:else}
      <ul class="divide-y divide-border">
        {#each data.answers as answer (answer.id)}
          <li class="py-4 flex flex-col gap-1">
            <div class="text-base font-medium text-foreground">{answer.questionText}</div>
            <div class="text-sm text-muted-foreground">
              Selected Option ID: <span class="font-mono">{answer.selectedOptionId}</span>
            </div>
            <div class="text-xs text-muted-foreground">
              Answered on {formatDate(answer.createdAt)}
            </div>
          </li>
        {/each}
      </ul>
    {/if}
  </Card>

  <nav
    class="flex items-center justify-center gap-2 w-full"
    aria-label="Pagination"
  >
    <Button
      variant="outline"
      ariaLabel="Previous page"
      disabled={!data?.pagination.hasPrev}
      on:click={() => goToPage(data.pagination.page - 1)}
    >
      Previous
    </Button>
    <span class="text-sm text-muted-foreground px-2 select-none">
      Page {data?.pagination.page ?? 1} of {data?.pagination.totalPages ?? 1}
    </span>
    <Button
      variant="outline"
      ariaLabel="Next page"
      disabled={!data?.pagination.hasNext}
      on:click={() => goToPage(data.pagination.page + 1)}
    >
      Next
    </Button>
  </nav>
</main>