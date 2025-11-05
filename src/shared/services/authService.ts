/**
 * OAuth2 Authentication Service for POL API
 * Handles token acquisition, storage, and refresh using client credentials flow
 */

interface TokenResponse {
  access_token: string;
  token_type: 'Bearer';
  expires_in: number;
  scope?: string;
}

interface AuthConfig {
  clientId: string;
  clientSecret: string;
  tokenUrl: string;
  scope?: string;
}

interface StoredToken {
  accessToken: string;
  tokenExpiry: number;
}

class AuthService {
  private readonly config: AuthConfig;
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;
  private refreshPromise: Promise<string> | null = null;

  constructor(config: AuthConfig) {
    this.config = config;
    this.loadTokenFromStorage();
  }

  /**
   * Get a valid access token, refreshing if necessary
   */
  async getAccessToken(): Promise<string> {
    // If we have a valid token, return it
    if (
      this.accessToken !== null &&
      this.accessToken.trim() !== '' &&
      Date.now() < this.tokenExpiry - 30000
    ) {
      // 30s buffer
      return this.accessToken;
    }

    // If there's already a refresh in progress, wait for it
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    // Start token refresh
    this.refreshPromise = this.refreshToken();

    try {
      const token = await this.refreshPromise;
      return token;
    } finally {
      this.refreshPromise = null;
    }
  }

  /**
   * Refresh the access token using client credentials flow
   */
  private async refreshToken(): Promise<string> {
    try {
      const body = new URLSearchParams({
        grant_type: 'client_credentials',
        ...(this.config.scope !== null &&
        this.config.scope !== undefined &&
        this.config.scope.trim() !== ''
          ? { scope: this.config.scope }
          : {}),
      });

      const credentials = btoa(`${this.config.clientId}:${this.config.clientSecret}`);

      const response = await fetch(this.config.tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${credentials}`,
        },
        body: body.toString(),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Token request failed: ${response.status} - ${errorText}`);
      }

      const tokenData = (await response.json()) as TokenResponse;

      this.accessToken = tokenData.access_token;
      this.tokenExpiry = Date.now() + tokenData.expires_in * 1000;

      this.saveTokenToStorage();

      return this.accessToken;
    } catch (error) {
      this.clearToken();
      throw new Error(
        `Failed to obtain access token: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Clear the current token (e.g., on logout or token invalidation)
   */
  clearToken(): void {
    this.accessToken = null;
    this.tokenExpiry = 0;
    this.clearTokenFromStorage();
  }

  /**
   * Check if we currently have a valid token
   */
  isAuthenticated(): boolean {
    return this.accessToken !== null && Date.now() < this.tokenExpiry - 30000;
  }

  /**
   * Save token to localStorage for persistence across page reloads
   */
  private saveTokenToStorage(): void {
    if (typeof window !== 'undefined') {
      const tokenData: StoredToken = {
        accessToken: this.accessToken || '',
        tokenExpiry: this.tokenExpiry,
      };
      localStorage.setItem('pol_auth_token', JSON.stringify(tokenData));
    }
  }

  /**
   * Load token from localStorage
   */
  private loadTokenFromStorage(): void {
    if (typeof window !== 'undefined') {
      try {
        const tokenData = localStorage.getItem('pol_auth_token');
        if (tokenData !== null && tokenData.trim() !== '') {
          const parsed = JSON.parse(tokenData) as StoredToken;
          if (parsed.accessToken && parsed.tokenExpiry > Date.now()) {
            this.accessToken = parsed.accessToken;
            this.tokenExpiry = parsed.tokenExpiry;
          }
        }
      } catch (_error) {
        // Invalid token data in storage, ignore
        this.clearTokenFromStorage();
      }
    }
  }

  /**
   * Clear token from localStorage
   */
  private clearTokenFromStorage(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('pol_auth_token');
    }
  }
}

// Create auth service instance with configuration
const authConfig: AuthConfig = {
  clientId: import.meta.env.VITE_POL_CLIENT_ID,
  clientSecret:
    import.meta.env.VITE_POL_CLIENT_SECRET,
  tokenUrl:
    import.meta.env.VITE_POL_TOKEN_URL,
  scope: 'https://resource-server.execute-api.us-east-1.amazon.com/dev/fis.write',
};

export const authService = new AuthService(authConfig);
export default authService;
