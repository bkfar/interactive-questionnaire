<script lang="ts">
  let {
    class: className = '',
    ariaLabel = undefined,
    role = 'region'
  } = $props<{
    class?: string;
    ariaLabel?: string;
    role?: string;
  }>();
</script>

<div
  class={`bg-background border border-border rounded-lg shadow-sm p-6 ${className}`}
  aria-label={ariaLabel}
  role={role}
>
  {#if $$slots.header}
    <div class="mb-4">
      <slot name="header" />
    </div>
  {/if}

  <div>
    <slot />
  </div>

  {#if $$slots.footer}
    <div class="mt-4">
      <slot name="footer" />
    </div>
  {/if}
</div>