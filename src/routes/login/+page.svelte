<script lang="ts">
  import { enhance } from '$app/forms';
  import { AlertCircle, Mail, Lock, LogIn } from 'lucide-svelte';
  import Spinner from '$lib/components/Spinner.svelte';
  // SvelteKit injects the `form` prop for form actions
  let { form } = $props<{ form?: { error?: string; email?: string } }>();

  // Local state for input values (for client-side validation, if needed)
  let email = $state(form?.email ?? '');
  let password = $state('');
  let submitting = $state(false);
</script>

<svelte:head>
  <title>Login | My Questionnaire App</title>
  <meta name="description" content="Login to access your account." />
</svelte:head>

<main class="flex min-h-screen items-center justify-center bg-background">
  <section class="w-full max-w-md rounded-lg bg-white p-4 sm:p-6 md:p-8 shadow-md dark:bg-zinc-900">
    <h1 class="mb-6 text-xl sm:text-2xl font-bold text-center text-foreground">Sign in to your account</h1>
    {#if form?.error}
      <div class="mb-4 rounded bg-red-100 px-3 py-2 sm:px-4 text-sm text-red-700 dark:bg-red-900 dark:text-red-100" role="alert" aria-live="polite">
        <span class="flex items-center gap-1 sm:gap-2">
          <AlertCircle class="w-4 h-4 text-red-600 dark:text-red-200" aria-hidden="true" />
          <span>{form.error}</span>
        </span>
      </div>
    {/if}
    <form
      method="POST"
      use:enhance={async () => {
        submitting = true;
        try {
          // Let SvelteKit handle the default behavior
        } finally {
          submitting = false;
        }
      }}
      class="flex flex-col gap-3 sm:gap-4"
      aria-label="Login form"
      autocomplete="on"
    >
      <div>
        <label for="email" class="block text-sm font-medium text-foreground mb-1">Email</label>
        <div class="relative">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none">
            <Mail class="w-4 h-4" aria-hidden="true" />
          </span>
          <input
            id="email"
            name="email"
            type="email"
            class="w-full rounded border border-zinc-300 pl-10 pr-3 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:bg-zinc-800 dark:border-zinc-700"
            required
            autocomplete="email"
            bind:value={email}
            aria-required="true"
          />
        </div>
      </div>
      <div>
        <label for="password" class="block text-sm font-medium text-foreground mb-1">Password</label>
        <div class="relative">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none">
            <Lock class="w-4 h-4" aria-hidden="true" />
          </span>
          <input
            id="password"
            name="password"
            type="password"
            class="w-full rounded border border-zinc-300 pl-10 pr-3 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:bg-zinc-800 dark:border-zinc-700"
            required
            autocomplete="current-password"
            bind:value={password}
            aria-required="true"
          />
        </div>
      </div>
      <button
        type="submit"
        class="mt-2 w-full rounded bg-primary px-3 py-2 sm:px-4 font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/40"
        disabled={submitting}
      >
        <span class="flex items-center justify-center gap-2">
          {#if submitting}
            <Spinner size={18} class="mr-1" ariaLabel="Signing in" />
          {/if}
          <LogIn class="w-5 h-5" aria-hidden="true" />
          <span>{submitting ? 'Signing In...' : 'Sign In'}</span>
        </span>
      </button>
    </form>
  </section>
</main>