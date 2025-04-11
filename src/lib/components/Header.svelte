<script lang="ts">
  import { authStore } from '$lib/stores/authStore';
  // No need for $state or redeclaration; use $authStore directly in markup
  // Optionally, you could add a logout handler here if needed
  // function handleLogout() { ... }
</script>

<nav class="bg-background border-b border-border px-4 py-2 flex items-center justify-between">
  <div class="flex items-center gap-6">
    <a href="/" class="text-lg font-bold text-primary-foreground hover:text-primary transition-colors">My Questionnaire App</a>
    <ul class="flex gap-4 ml-4">
      <li>
        <a href="/dashboard" class="text-foreground hover:text-primary transition-colors">Dashboard</a>
      </li>
      <li>
        <a href="/history" class="text-foreground hover:text-primary transition-colors">History</a>
      </li>
      <li>
        <a href="/friends" class="text-foreground hover:text-primary transition-colors">Friends</a>
      </li>
      <li>
        <a href="/leaderboard" class="text-foreground hover:text-primary transition-colors">Leaderboard</a>
      </li>
    </ul>
  </div>
  <div>
    {#if !$authStore.user}
      <div class="flex gap-2">
        <a href="/login" class="px-3 py-1 rounded bg-primary text-primary-foreground hover:bg-primary/80 transition-colors">Login</a>
        <a href="/register" class="px-3 py-1 rounded border border-primary text-primary hover:bg-primary/10 transition-colors">Register</a>
      </div>
    {:else}
      <div class="relative group">
        <button class="flex items-center gap-2 px-3 py-1 rounded bg-muted text-foreground hover:bg-muted/80 transition-colors focus:outline-none" aria-haspopup="true" aria-expanded="false">
          <span class="font-medium">{$authStore.user.email ?? 'User'}</span>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>
          </svg>
        </button>
        <ul class="absolute right-0 mt-2 w-40 bg-popover border border-border rounded shadow-lg py-1 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity z-20">
          <li>
            <a href="/profile" class="block px-4 py-2 text-foreground hover:bg-accent hover:text-accent-foreground transition-colors">Profile</a>
          </li>
          <li>
            <a href="/settings" class="block px-4 py-2 text-foreground hover:bg-accent hover:text-accent-foreground transition-colors">Settings</a>
          </li>
          <li>
            <button class="w-full text-left block px-4 py-2 text-foreground hover:bg-destructive hover:text-destructive-foreground transition-colors" type="button">
              Logout
            </button>
          </li>
        </ul>
      </div>
    {/if}
  </div>
</nav>