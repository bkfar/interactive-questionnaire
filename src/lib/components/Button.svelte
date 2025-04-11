<script lang="ts">
  import { Loader } from 'lucide-svelte';

  type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger';

  let {
    variant = 'primary',
    type = 'button',
    disabled = false,
    loading = false,
    ariaLabel = undefined,
    class: className = ''
  } = $props<{
    variant?: ButtonVariant;
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
    loading?: boolean;
    ariaLabel?: string;
    class?: string;
  }>();

  // Tailwind variant classes
  const VARIANT: Record<ButtonVariant, string> = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 focus:ring-secondary',
    outline: 'border border-input bg-background hover:bg-accent focus:ring-accent',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-600'
  };

  const base =
    'inline-flex items-center justify-center font-medium rounded-md px-3 py-2 sm:px-4 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none gap-2 text-sm sm:text-base font-sans';
</script>

<button
  type={type}
  class={`${base} ${VARIANT[variant as ButtonVariant]} ${className}`}
  disabled={disabled || loading}
  aria-disabled={disabled || loading}
  aria-busy={loading}
  aria-label={ariaLabel}
>
  {#if loading}
    <Loader class="animate-spin w-5 h-5" aria-hidden="true" />
    <span class="sr-only">Loading</span>
  {/if}
  <slot />
</button>