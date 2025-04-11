<script lang="ts">
  import { Sparkles, Book } from 'lucide-svelte';
</script>

<h1 class="flex items-center gap-1 sm:gap-2 text-xl sm:text-2xl md:text-3xl font-bold">
  <Sparkles class="w-6 h-6 text-primary" aria-hidden="true" />
  Welcome to SvelteKit
</h1>
<p class="mt-4 flex flex-wrap items-center gap-1 sm:gap-2">
  <Book class="w-5 h-5 text-muted-foreground" aria-hidden="true" />
  Visit <a href="https://svelte.dev/docs/kit" class="underline text-primary hover:text-primary/80 transition-colors">svelte.dev/docs/kit</a> to read the documentation
</p>
