<script lang="ts">
  import { Loader } from 'lucide-svelte';

  let {
    size = 24,
    class: className = '',
    ariaLabel = 'Loading'
  } = $props<{
    size?: number;
    class?: string;
    ariaLabel?: string;
  }>();
</script>

<span
  class={`inline-flex items-center justify-center ${className}`}
  role="status"
  aria-live="polite"
  aria-label={ariaLabel}
>
  <Loader
    class="animate-spin text-muted-foreground"
    style={`width: ${size}px; height: ${size}px;`}
    aria-hidden="true"
  />
  <span class="sr-only">{ariaLabel}</span>
</span>