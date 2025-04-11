<script lang="ts">
  import { enhance } from '$app/forms';
  import { AlertCircle, CheckCircle, User, Mail, Lock, UserPlus } from 'lucide-svelte';
  import Spinner from '$lib/components/Spinner.svelte';
  // Svelte 5 runes for local state
  let submitting = $state(false);

</script>

<svelte:head>
  <title>Register | My Questionnaire App</title>
  <meta name="description" content="Create a new account for the Interactive Questionnaire App." />
</svelte:head>

<main class="flex flex-col items-center justify-center min-h-[70vh] px-2 sm:px-4">
  <section class="w-full max-w-md bg-background rounded-lg shadow-md p-4 sm:p-6 md:p-8 border border-border">
    <h1 class="text-xl sm:text-2xl font-bold mb-6 text-center">Create an Account</h1>
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
      class="space-y-4 sm:space-y-5"
      aria-label="Registration form"
    >
      {#if form?.error}
        <div class="mb-4 p-2 sm:p-3 rounded bg-red-100 text-red-700 border border-red-300" role="alert" aria-live="polite">
          <span class="flex items-center gap-1 sm:gap-2">
            <AlertCircle class="w-4 h-4 text-red-600" aria-hidden="true" />
            <span>{form.error}</span>
          </span>
        </div>
      {/if}
      {#if form?.success}
        <div class="mb-4 p-2 sm:p-3 rounded bg-green-100 text-green-800 border border-green-300" role="status" aria-live="polite">
          <span class="flex items-center gap-1 sm:gap-2">
            <CheckCircle class="w-4 h-4 text-green-600" aria-hidden="true" />
            <span>{form.success}</span>
          </span>
        </div>
      {/if}
      <div>
        <label for="username" class="block text-sm font-medium mb-1">Username</label>
        <div class="relative">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none">
            <User class="w-4 h-4" aria-hidden="true" />
          </span>
          <input
            id="username"
            name="username"
            type="text"
            required
            aria-required="true"
            minlength="3"
            maxlength="32"
            autocomplete="username"
            class="w-full pl-10 pr-3 py-2 border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>
      <div>
        <label for="email" class="block text-sm font-medium mb-1">Email</label>
        <div class="relative">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none">
            <Mail class="w-4 h-4" aria-hidden="true" />
          </span>
          <input
            id="email"
            name="email"
            type="email"
            required
            aria-required="true"
            autocomplete="email"
            class="w-full pl-10 pr-3 py-2 border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>
      <div>
        <label for="password" class="block text-sm font-medium mb-1">Password</label>
        <div class="relative">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none">
            <Lock class="w-4 h-4" aria-hidden="true" />
          </span>
          <input
            id="password"
            name="password"
            type="password"
            required
            aria-required="true"
            minlength="8"
            autocomplete="new-password"
            class="w-full pl-10 pr-3 py-2 border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>
      <button
        type="submit"
        class="w-full py-2 px-3 sm:px-4 bg-primary text-primary-foreground font-semibold rounded hover:bg-primary/90 transition disabled:opacity-60"
        disabled={submitting}
      >
        <span class="flex items-center justify-center gap-2">
          {#if submitting}
            <Spinner size={18} class="mr-1" ariaLabel="Registering" />
          {/if}
          <UserPlus class="w-5 h-5" aria-hidden="true" />
          <span>{submitting ? 'Registering...' : 'Register'}</span>
        </span>
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