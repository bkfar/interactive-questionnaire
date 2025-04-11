<script lang="ts">
  // Avatar.svelte: Reusable avatar component for user profile/history
  let { src, alt = 'User avatar', size = 64 } = $props<{ src?: string; alt?: string; size?: number }>();
  // Inline style for dynamic sizing
  const dimension = `${size}px`;
</script>

{#if src}
  <img
    src={src}
    alt={alt}
    width={size}
    height={size}
    class="rounded-full border border-gray-200 object-cover bg-gray-100"
    style="width: {dimension}; height: {dimension};"
    loading="lazy"
    role="img"
  />
{:else}
  <span
    class="flex items-center justify-center rounded-full border border-gray-200 bg-gray-100 text-gray-400"
    style="width: {dimension}; height: {dimension};"
    role="img"
    aria-label={alt}
  >
    <!-- User SVG icon (accessible, visually neutral) -->
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 32 32"
      class="w-2/3 h-2/3"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="16" cy="12" r="6" fill="currentColor" />
      <path
        d="M6 26c0-4.418 4.03-8 10-8s10 3.582 10 8"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
      />
    </svg>
  </span>
{/if}