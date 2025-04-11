<script lang="ts">
  // Avatar.svelte: Reusable avatar component for user profile/history
  import { User } from 'lucide-svelte';
  let { src, alt = 'User avatar', size = 64 } = $props<{ src?: string; alt?: string; size?: number }>();
  // Inline style for dynamic sizing
  const dimension = `${size}px`;
  const iconSize = Math.round(size * 2 / 3);
</script>

{#if src}
  <img
    src={src}
    alt={alt}
    width={size}
    height={size}
    class="rounded-full border border-base-300 object-cover bg-base-200"
    style="width: {dimension}; height: {dimension};"
    loading="lazy"
    role="img"
  />
{:else}
  <span
    class="flex items-center justify-center rounded-full border border-base-300 bg-base-200 text-neutral"
    style="width: {dimension}; height: {dimension};"
    role="img"
    aria-label={alt}
  >
    <!-- User SVG icon (accessible, visually neutral) -->
    <User
      class="text-neutral"
      aria-hidden="true"
      width={iconSize}
      height={iconSize}
      style="width: {iconSize}px; height: {iconSize}px;"
      stroke-width="1.5"
    />
  </span>
{/if}