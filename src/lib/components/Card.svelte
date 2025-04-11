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
  class={`bg-background border border-border rounded-lg shadow-sm p-3 sm:p-4 md:p-6 ${className}`}
  aria-label={ariaLabel}
  role={role}
>
  {#if $$slots.header}
    <div class="mb-3 sm:mb-4">
      <slot name="header" />
    </div>
  {/if}

  <div>
    <slot />
  </div>

  {#if $$slots.footer}
    <div class="mt-3 sm:mt-4">
      <slot name="footer" />
    </div>
  {/if}
</div>