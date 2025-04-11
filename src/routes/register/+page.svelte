<script lang="ts">
  import { enhance } from '$app/forms';
  // Svelte 5 runes for local state
  let submitting = $state(false);
</script>

<svelte:head>
  <title>Register | My Questionnaire App</title>
  <meta name="description" content="Create a new account for the Interactive Questionnaire App." />
</svelte:head>

<main class="flex flex-col items-center justify-center min-h-[70vh] px-4">
  <section class="w-full max-w-md bg-background rounded-lg shadow-md p-8 border border-border">
    <h1 class="text-2xl font-bold mb-6 text-center">Create an Account</h1>
    <form
      method="POST"
      use:enhance
      class="space-y-5"
      aria-label="Registration form"
    >
      {#if form?.error}
        <div class="mb-4 p-3 rounded bg-red-100 text-red-700 border border-red-300" role="alert" aria-live="polite">
          {form.error}
        </div>
      {/if}
      {#if form?.success}
        <div class="mb-4 p-3 rounded bg-green-100 text-green-800 border border-green-300" role="status" aria-live="polite">
          {form.success}
        </div>
      {/if}
      <div>
        <label for="username" class="block text-sm font-medium mb-1">Username</label>
        <input
          id="username"
          name="username"
          type="text"
          required
          minlength="3"
          maxlength="32"
          autocomplete="username"
          class="w-full px-3 py-2 border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
      <div>
        <label for="email" class="block text-sm font-medium mb-1">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autocomplete="email"
          class="w-full px-3 py-2 border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
      <div>
        <label for="password" class="block text-sm font-medium mb-1">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minlength="8"
          autocomplete="new-password"
          class="w-full px-3 py-2 border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
      <button
        type="submit"
        class="w-full py-2 px-4 bg-primary text-primary-foreground font-semibold rounded hover:bg-primary/90 transition disabled:opacity-60"
        disabled={submitting}
      >
        {submitting ? 'Registering...' : 'Register'}
      </button>
    </form>
    <p class="mt-6 text-center text-sm text-muted-foreground">
      Already have an account?
      <a href="/login" class="text-primary underline hover:no-underline">Log in</a>
    </p>
  </section>
</main>

<!-- SvelteKit form result context -->
<script context="module" lang="ts">
  export let form: { error?: string; success?: string } | undefined;
</script>