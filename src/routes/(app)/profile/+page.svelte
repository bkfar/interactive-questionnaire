<script lang="ts">
  import Header from '$lib/components/Header.svelte';
  import Card from '$lib/components/Card.svelte';
  import Button from '$lib/components/Button.svelte';
  import Spinner from '$lib/components/Spinner.svelte';
  import Avatar from '$lib/components/Avatar.svelte';
  import { enhance } from '$app/forms';

  // Data from load function
  export let data: {
    username: string;
    avatarUrl?: string | null;
  };

  // Form state
  let username: string = data.username ?? '';
  let avatarFile: File | null = null;
  let submitting = false;
  let errorMsg: string | null = null;

  // Reset error on username change
  $: if (errorMsg && username !== data.username) {
    errorMsg = null;
  }

  // Handle file input change
  function handleFileChange(e: Event) {
    const files = (e.target as HTMLInputElement).files;
    avatarFile = files && files.length > 0 ? files[0] : null;
  }

  // Demo: set submitting state on submit, reset after short delay (since no real action handler yet)
  function handleSubmit(e: Event) {
    submitting = true;
    errorMsg = null;
    // Simulate async submit for UI demo only
    setTimeout(() => {
      submitting = false;
      // errorMsg = 'Failed to update profile. Please try again.'; // Uncomment to demo error
    }, 1200);
    e.preventDefault();
  }
</script>

<svelte:head>
  <title>User Profile | Questionnaire App</title>
</svelte:head>

<div class="flex flex-col min-h-[80vh] items-center py-8 px-4">
  <Header />

  <div class="w-full max-w-xl mt-8">
    <h1 class="text-2xl font-bold mb-6 text-center">Profile</h1>
    <Card>
      <div class="flex flex-col gap-6">
        <!-- Profile Info -->
        <section aria-label="Profile Information" class="flex flex-col gap-2">
          <h2 class="text-lg font-semibold">Profile Information</h2>
          <div class="flex items-center gap-4 mt-2">
            <Avatar src={data.avatarUrl ?? undefined} alt="User avatar" size={56} />
            <span class="text-base font-medium">{data.username}</span>
          </div>
        </section>

        <!-- Edit Profile Form -->
        <section aria-label="Edit Profile" class="flex flex-col gap-2">
          <h2 class="text-lg font-semibold">Edit Profile</h2>
          <form
            method="POST"
            enctype="multipart/form-data"
            use:enhance
            class="flex flex-col gap-4 mt-2"
            on:submit={handleSubmit}
          >
            <div class="flex flex-col gap-1">
              <label for="username" class="text-sm font-medium">Username</label>
              <input
                id="username"
                name="username"
                type="text"
                class="input input-bordered w-full"
                required
                bind:value={username}
                autocomplete="username"
                aria-label="Username"
                disabled={submitting}
              />
            </div>
            <div class="flex flex-col gap-1">
              <label for="avatar" class="text-sm font-medium">Avatar</label>
              <input
                id="avatar"
                name="avatar"
                type="file"
                accept="image/*"
                class="file-input file-input-bordered w-full"
                on:change={handleFileChange}
                aria-label="Upload new avatar"
                disabled={submitting}
              />
            </div>
            {#if errorMsg}
              <div class="text-red-500 text-sm">{errorMsg}</div>
            {/if}
            <Button type="submit" class="w-32" disabled={submitting}>
              {#if submitting}
                <Spinner size={18} class="mr-2" />
                Saving...
              {:else}
                Save Changes
              {/if}
            </Button>
          </form>
        </section>

        <!-- Loading Spinner (hidden unless submitting) -->
        {#if submitting}
        <section aria-label="Loading State" class="flex items-center gap-2 mt-4">
          <Spinner size={20} />
          <span class="text-muted-foreground text-sm">Saving changes...</span>
        </section>
        {/if}
      </div>
    </Card>
  </div>
</div>