<script lang="ts">
  import Card from '$lib/components/Card.svelte';
  import Avatar from '$lib/components/Avatar.svelte';
  import Button from '$lib/components/Button.svelte';

  // Props from load function
  let {
    globalLeaderboard,
    friendsLeaderboard,
    currentUserId
  } = $props<{
    globalLeaderboard: {
      user_id: string;
      username: string;
      avatar_url: string | null;
      points: number;
    }[];
    friendsLeaderboard: {
      user_id: string;
      username: string;
      avatar_url: string | null;
      points: number;
    }[];
    currentUserId: string;
  }>();

  let activeTab = $state<'global' | 'friends'>('global');
</script>

<svelte:head>
  <title>Leaderboard | My Questionnaire App</title>
</svelte:head>

<div class="max-w-2xl mx-auto py-8 px-4">
  <h1 class="text-3xl font-bold mb-8 text-center text-neutral">Leaderboard</h1>

  <!-- Tabs -->
  <nav class="flex justify-center mb-8 gap-2" aria-label="Leaderboard tabs">
    <Button
      on:click={() => (activeTab = 'global')}
      class={`px-5 py-2 rounded-t-md font-semibold transition-colors outline-none ring-primary ring-offset-2 focus-visible:ring-2 ${
        activeTab === 'global'
          ? 'bg-primary text-primary-foreground shadow'
          : 'bg-base-200 text-muted-foreground'
      }`}
      type="button"
      ariaLabel="Show global leaderboard"
    >
      Global
    </Button>
    <Button
      on:click={() => (activeTab = 'friends')}
      class={`px-5 py-2 rounded-t-md font-semibold transition-colors outline-none ring-primary ring-offset-2 focus-visible:ring-2 ${
        activeTab === 'friends'
          ? 'bg-primary text-primary-foreground shadow'
          : 'bg-base-200 text-muted-foreground'
      }`}
      type="button"
      ariaLabel="Show friends leaderboard"
    >
      Friends
    </Button>
  </nav>

  <!-- Leaderboard Card -->
  {#if activeTab === 'global'}
    <Card class="mb-8 p-0">
      <h2 class="text-xl font-semibold mb-4 px-6 pt-6 text-neutral">Global Leaderboard</h2>
      <div class="overflow-x-auto">
        <table class="min-w-full text-left">
          <thead>
            <tr class="border-b border-muted">
              <th class="py-2 px-3">Rank</th>
              <th class="py-2 px-3">User</th>
              <th class="py-2 px-3">Score</th>
            </tr>
          </thead>
          <tbody>
            {#if globalLeaderboard.length === 0}
              <tr>
                <td colspan="3" class="py-4 text-center text-muted-foreground">No leaderboard data available.</td>
              </tr>
            {:else}
              {#each globalLeaderboard as entry, i}
                <tr
                  class={`border-b border-muted last:border-0 transition ${
                    entry.user_id === currentUserId
                      ? 'bg-primary/10 font-semibold'
                      : ''
                  }`}
                >
                  <td class="py-2 px-3">{i + 1}</td>
                  <td class="py-2 px-3">
                    <div class="flex items-center gap-2">
                      <div class="bg-muted rounded-full">
                        <Avatar size={32} src={entry.avatar_url ?? undefined} alt={entry.username} />
                      </div>
                      <span>{entry.username}</span>
                      {#if entry.user_id === currentUserId}
                        <span class="ml-2 px-2 py-0.5 rounded bg-primary text-primary-foreground text-xs font-bold">You</span>
                      {/if}
                    </div>
                  </td>
                  <td class="py-2 px-3">{entry.points}</td>
                </tr>
              {/each}
            {/if}
          </tbody>
        </table>
      </div>
    </Card>
  {:else}
    <Card class="mb-8 p-0">
      <h2 class="text-xl font-semibold mb-4 px-6 pt-6 text-neutral">Friends Leaderboard</h2>
      <div class="overflow-x-auto">
        <table class="min-w-full text-left text-base">
          <thead>
            <tr class="border-b border-base-300 bg-base-100">
              <th class="py-3 px-6 font-semibold text-neutral">Rank</th>
              <th class="py-3 px-6 font-semibold text-neutral">Friend</th>
              <th class="py-3 px-6 font-semibold text-neutral">Score</th>
            </tr>
          </thead>
          <tbody>
            {#if friendsLeaderboard.length === 0}
              <tr>
                <td colspan="3" class="py-6 text-center text-muted-foreground font-medium">No friends leaderboard data available.</td>
              </tr>
            {:else}
              {#each friendsLeaderboard as entry, i}
                <tr
                  class={`border-b border-base-300 last:border-0 transition ${
                    entry.user_id === currentUserId
                      ? 'bg-primary/10 font-semibold'
                      : ''
                  }`}
                >
                  <td class="py-3 px-6">{i + 1}</td>
                  <td class="py-3 px-6">
                    <div class="flex items-center gap-3">
                      <div class="bg-base-200 rounded-full">
                        <Avatar size={32} src={entry.avatar_url ?? undefined} alt={entry.username} />
                      </div>
                      <span class="text-neutral">{entry.username}</span>
                      {#if entry.user_id === currentUserId}
                        <span class="ml-2 px-2 py-0.5 rounded bg-primary text-primary-foreground text-xs font-bold">You</span>
                      {/if}
                    </div>
                  </td>
                  <td class="py-3 px-6">{entry.points}</td>
                </tr>
              {/each}
            {/if}
          </tbody>
        </table>
      </div>
    </Card>
  {/if}
</div>