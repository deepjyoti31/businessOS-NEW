/**
 * Service for managing route persistence across page reloads
 */
export const RoutePersistenceService = {
  // Storage key for the current route
  ROUTE_STORAGE_KEY: 'businessos-current-route',

  // Flag to indicate if we're in a page reload
  RELOAD_FLAG_KEY: 'businessos-is-reload',

  /**
   * Save the current route to localStorage
   * Only saves if the path is valid and not a public route
   */
  saveRoute(path: string): void {
    if (path && !this.isPublicRoute(path)) {
      localStorage.setItem(this.ROUTE_STORAGE_KEY, path);
      console.log(`RoutePersistenceService: Saved route ${path}`);
    }
  },

  /**
   * Save the current route specifically for page reload
   * This should be called only when we know a page reload is about to happen
   */
  saveRouteForReload(path: string): void {
    if (path && !this.isPublicRoute(path)) {
      // Save the route
      localStorage.setItem(this.ROUTE_STORAGE_KEY, path);

      // Set a flag indicating this is for a reload
      sessionStorage.setItem(this.RELOAD_FLAG_KEY, 'true');

      console.log(`RoutePersistenceService: Saved route ${path} for reload`);
    }
  },

  /**
   * Get the stored route from localStorage
   * If checkReloadFlag is true, only returns the route if we're in a reload
   */
  getStoredRoute(checkReloadFlag: boolean = false): string | null {
    // If we're checking the reload flag and it's not set, return null
    if (checkReloadFlag && sessionStorage.getItem(this.RELOAD_FLAG_KEY) !== 'true') {
      return null;
    }

    const route = localStorage.getItem(this.ROUTE_STORAGE_KEY);
    if (route) {
      console.log(`RoutePersistenceService: Retrieved stored route ${route}`);

      // Clear the reload flag if it exists
      if (sessionStorage.getItem(this.RELOAD_FLAG_KEY) === 'true') {
        sessionStorage.removeItem(this.RELOAD_FLAG_KEY);
      }
    }
    return route;
  },

  /**
   * Clear the stored route
   */
  clearStoredRoute(): void {
    localStorage.removeItem(this.ROUTE_STORAGE_KEY);
    sessionStorage.removeItem(this.RELOAD_FLAG_KEY);
    console.log('RoutePersistenceService: Cleared stored route');
  },

  /**
   * Check if a route is a public route (login, register, etc.)
   */
  isPublicRoute(path: string): boolean {
    const publicRoutes = ['/login', '/register', '/forgot-password', '/reset-password', '/'];
    return publicRoutes.includes(path);
  }
};
