<script lang="ts">
  import Card from '$lib/components/Card.svelte';
  import Avatar from '$lib/components/Avatar.svelte';
  import Button from '$lib/components/Button.svelte';
  import Spinner from '$lib/components/Spinner.svelte';
  import { enhance } from '$app/forms';

  let { accepted, pendingReceived, pendingSent, userId } = $props<{
    accepted: any[];
    pendingReceived: any[];
    pendingSent: any[];
    userId: string;
  }>();

  let search = $state('');
  let results = $state<any[]>([]);
  let loading = $state(false);
  let error = $state('');
  let debounceTimeout: ReturnType<typeof setTimeout> | null = null;

  // Helper: check if user is already a friend or has a pending request
  function isRequestable(user: any) {
    if (user.id === userId) return false;
    // Already friends
    if (accepted.some(f => (f.user_id_1 === user.id || f.user_id_2 === user.id))) return false;
    // Pending sent
    if (pendingSent.some(f => f.user_id_2 === user.id)) return false;
    // Pending received
    if (pendingReceived.some(f => f.user_id_1 === user.id)) return false;
    return true;
  }

  let requestStatus = $state<{ [id: string]: string }>({}); // userId -> status message

  async function doSearch() {
    if (search.trim().length < 2) {
      results = [];
      return;
    }
    loading = true;
    error = '';
    try {
      const res = await fetch(`/api/user-search?q=${encodeURIComponent(search.trim())}`);
      if (!res.ok) throw new Error('Failed to search');
      const data = await res.json();
      results = data.users || [];
    } catch (e) {
      error = 'Error searching users.';
      results = [];
    } finally {
      loading = false;
    }
  }

  function onInput() {
    if (debounceTimeout) clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(doSearch, 350);
  }
</script>

<svelte:head>
  <title>Friends | Questionnaire App</title>
</svelte:head>

<main class="max-w-2xl mx-auto px-4 py-8">
  <h1 class="text-3xl font-bold mb-8">Friends</h1>

  <!-- User Search -->
  <section class="mb-10">
    <h2 class="text-xl font-semibold mb-4">Find New Friends</h2>
    <div class="flex gap-2 items-center mb-4">
      <input
        type="text"
        class="w-full max-w-xs px-3 py-2 rounded border border-base-300 bg-base-200 text-neutral placeholder:text-base-300 focus:outline-none focus:ring-2 focus:ring-primary font-medium"
        placeholder="Search by username or email..."
        bind:value={search}
        on:input={onInput}
        aria-label="Search users"
        minlength="2"
        maxlength="64"
        autocomplete="off"
      />
      <Button
        variant="primary"
        class="px-4 py-2 font-semibold"
        on:click={doSearch}
        disabled={search.trim().length < 2 || loading}
        ariaLabel="Search"
      >
        Search
      </Button>
    </div>
    {#if loading}
      <div class="flex justify-center py-4"><Spinner size={28} ariaLabel="Searching..." /></div>
    {:else if error}
      <div class="text-error mb-2 font-medium">{error}</div>
    {:else if search.trim().length >= 2}
      {#if results.length > 0}
        <div class="grid gap-4">
          {#each results as user}
            <Card>
              <div class="flex items-center gap-4 w-full">
                <Avatar size={48} src={user.avatar_url} alt={user.username} />
                <span class="font-medium">{user.username}</span>
                <span class="text-gray-500 text-sm">{user.email}</span>
                <div class="ml-auto">
                  {#if isRequestable(user)}
                    <form method="POST" use:enhance={{
                      pending: () => { requestStatus[user.id] = ''; },
                      result: (res) => {
                        res.json().then((data) => {
                          if (data.success) {
                            requestStatus[user.id] = 'Success! Friend request sent.';
                          } else if (data.error) {
                            requestStatus[user.id] = data.error;
                          } else {
                            requestStatus[user.id] = 'Unknown error.';
                          }
                        });
                      }
                    }}>
                      <input type="hidden" name="targetId" value={user.id} />
                      <Button type="submit" variant="primary" class="text-sm py-1 px-3" ariaLabel="Send friend request">
                        Send Request
                      </Button>
                    </form>
                    {#if requestStatus[user.id]}
                      <span class="text-sm ml-2 font-medium {requestStatus[user.id].startsWith('Success') ? 'text-success' : 'text-error'}">{requestStatus[user.id]}</span>
                    {/if}
                  {:else}
                    <Button variant="primary" class="text-sm py-1 px-3 opacity-60 cursor-not-allowed" disabled ariaLabel="Send friend request (disabled)">
                      Send Request
                    </Button>
                  {/if}
                </div>
              </div>
            </Card>
          {/each}
        </div>
      {:else}
        <p class="text-gray-500">No users found.</p>
      {/if}
    {/if}
  </section>

  <!-- Accepted Friends -->
  <section class="mb-10">
    <h2 class="text-xl font-semibold mb-4">Your Friends</h2>
    {#if accepted.length > 0}
      <div class="grid gap-4">
        {#each accepted as friendship}
          <Card>
            <div class="flex items-center gap-4">
              {#if friendship.user_id_1 === friendship.user_id_2}
                <!-- Should not happen, but fallback -->
                <Avatar size={48} src={friendship.profile_1?.avatar_url} alt={friendship.profile_1?.username} />
                <span class="font-medium text-neutral">{friendship.profile_1?.username}</span>
              {:else}
                {#if friendship.user_id_1 === userId}
                  <Avatar size={48} src={friendship.profile_2?.avatar_url} alt={friendship.profile_2?.username} />
                  <span class="font-medium text-neutral">{friendship.profile_2?.username}</span>
                {:else}
                  <Avatar size={48} src={friendship.profile_1?.avatar_url} alt={friendship.profile_1?.username} />
                  <span class="font-medium text-neutral">{friendship.profile_1?.username}</span>
                {/if}
              {/if}
            </div>
          </Card>
        {/each}
      </div>
    {:else}
      <p class="text-gray-500">You have no friends yet.</p>
    {/if}
  </section>

  <!-- Pending Received Requests -->
  <section class="mb-10">
    <h2 class="text-xl font-semibold mb-4">Friend Requests Received</h2>
    {#if pendingReceived.length > 0}
      <div class="grid gap-4">
        {#each pendingReceived as request}
          <Card>
            <div class="flex items-center gap-4 w-full">
              <Avatar size={48} src={request.sender_profile?.avatar_url} alt={request.sender_profile?.username} />
              <span class="font-medium text-neutral">{request.sender_profile?.username}</span>
              <div class="ml-auto flex gap-2">
                <form method="POST" action="?/acceptRequest" use:enhance={{
                  pending: () => { requestStatus[request.id] = ''; },
                  result: (res) => {
                    res.json().then((data) => {
                      if (data.success) {
                        requestStatus[request.id] = 'Success! Friend request accepted.';
                      } else if (data.error) {
                        requestStatus[request.id] = data.error;
                      } else {
                        requestStatus[request.id] = 'Unknown error.';
                      }
                    });
                  }
                }}>
                  <input type="hidden" name="requestId" value={request.id} />
                  <Button type="submit" variant="primary" ariaLabel="Accept friend request" class="text-sm py-1 px-3 font-semibold">
                    Accept
                  </Button>
                </form>
                <form method="POST" action="?/rejectRequest" use:enhance={{
                  pending: () => { requestStatus[request.id] = ''; },
                  result: (res) => {
                    res.json().then((data) => {
                      if (data.success) {
                        requestStatus[request.id] = 'Success! Friend request rejected.';
                      } else if (data.error) {
                        requestStatus[request.id] = data.error;
                      } else {
                        requestStatus[request.id] = 'Unknown error.';
                      }
                    });
                  }
                }}>
                  <input type="hidden" name="requestId" value={request.id} />
                  <Button type="submit" variant="secondary" ariaLabel="Reject friend request" class="text-sm py-1 px-3 font-semibold">
                    Reject
                  </Button>
                </form>
                {#if requestStatus[request.id]}
                  <span class="text-sm ml-2 font-medium {requestStatus[request.id].startsWith('Success') ? 'text-success' : 'text-error'}">{requestStatus[request.id]}</span>
                {/if}
              </div>
            </div>
          </Card>
        {/each}
      </div>
    {:else}
      <p class="text-gray-500">No pending friend requests received.</p>
    {/if}
  </section>

  <!-- Pending Sent Requests -->
  <section>
    <h2 class="text-xl font-semibold mb-4">Friend Requests Sent</h2>
    {#if pendingSent.length > 0}
      <div class="grid gap-4">
        {#each pendingSent as request}
          <Card>
            <div class="flex items-center gap-4 w-full">
              <Avatar size={48} src={request.receiver_profile?.avatar_url} alt={request.receiver_profile?.username} />
              <span class="font-medium text-neutral">{request.receiver_profile?.username}</span>
              <div class="ml-auto">
                <Button variant="secondary" ariaLabel="Cancel friend request" class="text-sm py-1 px-3 font-semibold opacity-60 cursor-not-allowed" disabled>
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        {/each}
      </div>
    {:else}
      <p class="text-muted-foreground">No pending friend requests sent.</p>
    {/if}
  </section>
</main>