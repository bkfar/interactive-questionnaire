// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      /**
       * Returns the current session object or null if not authenticated.
       * Replace 'unknown' with your session type if defined.
       */
      getSession: () => Promise<unknown | null>;
    }
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }
}

export {};
