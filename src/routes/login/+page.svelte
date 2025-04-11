<script lang="ts">
  import { enhance } from '$app/forms';
  // SvelteKit injects the `form` prop for form actions
  let { form } = $props<{ form?: { error?: string; email?: string } }>();

  // Local state for input values (for client-side validation, if needed)
  let email = $state(form?.email ?? '');
  let password = $state('');
</script>

<svelte:head>
  <title>Login | My Questionnaire App</title>
  <meta name="description" content="Login to access your account." />
</svelte:head>

<main class="flex min-h-screen items-center justify-center bg-background">
  <section class="w-full max-w-md rounded-lg bg-white p-8 shadow-md dark:bg-zinc-900">
    <h1 class="mb-6 text-2xl font-bold text-center text-foreground">Sign in to your account</h1>
    {#if form?.error}
      <div class="mb-4 rounded bg-red-100 px-4 py-2 text-sm text-red-700 dark:bg-red-900 dark:text-red-100" role="alert" aria-live="polite">
        {form.error}
      </div>
    {/if}
    <form
      method="POST"
      use:enhance
      class="flex flex-col gap-4"
      aria-label="Login form"
      autocomplete="on"
    >
      <div>
        <label for="email" class="block text-sm font-medium text-foreground mb-1">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          class="w-full rounded border border-zinc-300 px-3 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:bg-zinc-800 dark:border-zinc-700"
          required
          autocomplete="email"
          bind:value={email}
          aria-required="true"
        />
      </div>
      <div>
        <label for="password" class="block text-sm font-medium text-foreground mb-1">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          class="w-full rounded border border-zinc-300 px-3 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:bg-zinc-800 dark:border-zinc-700"
          required
          autocomplete="current-password"
          bind:value={password}
          aria-required="true"
        />
      </div>
      <button
        type="submit"
        class="mt-2 w-full rounded bg-primary px-4 py-2 font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/40"
      >
        Sign In
      </button>
    </form>
  </section>
</main>