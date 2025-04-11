<script lang="ts">
  import { authStore } from '$lib/stores/authStore';
  import { LayoutDashboard, History, Users, Trophy, FileText, User, Settings, LogOut, ChevronDown } from 'lucide-svelte';
  // No lifecycle hooks needed; all menu logic is handled via events.
  let menuOpen = $state(false);
  let menuButton: HTMLButtonElement | null = null;
  let menuList: HTMLUListElement | null = null;

  function handleMenuButtonClick() {
    menuOpen = !menuOpen;
    if (menuOpen) {
      setTimeout(() => {
        menuList?.focus();
      }, 0);
    }
  }

  function handleMenuButtonKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      menuOpen = !menuOpen;
      if (menuOpen) {
        setTimeout(() => {
          menuList?.focus();
        }, 0);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      menuOpen = true;
      setTimeout(() => {
        menuList?.focus();
      }, 0);
    }
  }

  function handleMenuListKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      menuOpen = false;
      menuButton?.focus();
    }
  }

  /**
   * Handles blur events on the menu container.
   * Closes the menu if focus leaves both the button and the menu list.
   */
  function handleBlur() {
    setTimeout(() => {
      if (
        document.activeElement !== menuButton &&
        (!menuList || !menuList.contains(document.activeElement))
      ) {
        menuOpen = false;
      }
    }, 0);
  }
</script>

<nav class="bg-background border-b border-border px-2 sm:px-4 py-1 sm:py-2 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-0">
  <div class="flex flex-col sm:flex-row items-center gap-3 sm:gap-6 w-full sm:w-auto">
    <a href="/" class="flex items-center gap-1 sm:gap-2 text-base sm:text-lg font-bold text-primary-foreground hover:text-primary transition-colors">
      <FileText class="w-5 h-5 stroke-[1.5] text-primary-foreground" aria-hidden="true" />
      My Questionnaire App
    </a>
    <ul class="flex flex-col sm:flex-row gap-2 sm:gap-4 ml-0 sm:ml-4 w-full sm:w-auto">
      <li>
        <a href="/dashboard" class="flex items-center gap-1 text-foreground hover:text-primary transition-colors">
          <LayoutDashboard class="w-4 h-4 stroke-[1.5]" aria-hidden="true" />
          <span>Dashboard</span>
        </a>
      </li>
      <li>
        <a href="/history" class="flex items-center gap-1 text-foreground hover:text-primary transition-colors">
          <History class="w-4 h-4 stroke-[1.5]" aria-hidden="true" />
          <span>History</span>
        </a>
      </li>
      <li>
        <a href="/friends" class="flex items-center gap-1 text-foreground hover:text-primary transition-colors">
          <Users class="w-4 h-4 stroke-[1.5]" aria-hidden="true" />
          <span>Friends</span>
        </a>
      </li>
      <li>
        <a href="/leaderboard" class="flex items-center gap-1 text-foreground hover:text-primary transition-colors">
          <Trophy class="w-4 h-4 stroke-[1.5]" aria-hidden="true" />
          <span>Leaderboard</span>
        </a>
      </li>
    </ul>
  </div>
  <div>
    {#if !$authStore.user}
      <div class="flex gap-1 sm:gap-2">
        <a href="/login" class="px-2 sm:px-3 py-1 rounded bg-primary text-primary-foreground hover:bg-primary/80 transition-colors">Login</a>
        <a href="/register" class="px-2 sm:px-3 py-1 rounded border border-primary text-primary hover:bg-primary/10 transition-colors">Register</a>
      </div>
    {:else}
      <div class="relative" on:focusout={handleBlur}>
        <button
          class="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 rounded bg-muted text-foreground hover:bg-muted/80 transition-colors focus:outline-none"
          aria-haspopup="true"
          aria-expanded={menuOpen}
          aria-controls="user-menu-list"
          tabindex="0"
          bind:this={menuButton}
          on:click={handleMenuButtonClick}
          on:keydown={handleMenuButtonKeydown}
        >
          <span class="font-medium">{$authStore.user.email ?? 'User'}</span>
          <ChevronDown class="w-4 h-4 stroke-[1.5]" aria-hidden="true" />
        </button>
        {#if menuOpen}
          <ul
            id="user-menu-list"
            class="absolute right-0 mt-2 w-36 sm:w-40 bg-popover border border-border rounded shadow-lg py-1 transition-opacity z-20 focus:outline-none"
            role="menu"
            tabindex="-1"
            bind:this={menuList}
            on:keydown={handleMenuListKeydown}
          >
            <li>
              <a href="/profile" class="flex items-center gap-2 block px-4 py-2 text-foreground hover:bg-accent hover:text-accent-foreground transition-colors" role="menuitem" tabindex="0">
                <User class="w-4 h-4 stroke-[1.5]" aria-hidden="true" />
                <span>Profile</span>
              </a>
            </li>
            <li>
              <a href="/settings" class="flex items-center gap-2 block px-4 py-2 text-foreground hover:bg-accent hover:text-accent-foreground transition-colors" role="menuitem" tabindex="0">
                <Settings class="w-4 h-4 stroke-[1.5]" aria-hidden="true" />
                <span>Settings</span>
              </a>
            </li>
            <li>
              <button class="flex items-center gap-2 w-full text-left block px-4 py-2 text-foreground hover:bg-destructive hover:text-destructive-foreground transition-colors" type="button" role="menuitem" tabindex="0">
                <LogOut class="w-4 h-4 stroke-[1.5]" aria-hidden="true" />
                <span>Logout</span>
              </button>
            </li>
          </ul>
        {/if}
      </div>
    {/if}
  </div>
</nav>