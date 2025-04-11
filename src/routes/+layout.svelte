<script>
  import '../app.postcss';
  import Header from '../lib/components/Header.svelte';
  import Spinner from '../lib/components/Spinner.svelte';
  import { navigating } from '$app/stores';
</script>
<Header />

{#if $navigating}
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm"
    aria-label="Loading page"
    role="status"
    aria-live="polite"
  >
    <Spinner size={40} ariaLabel="Loading page" />
  </div>
{/if}
<main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
  <slot />
</main>
<slot />