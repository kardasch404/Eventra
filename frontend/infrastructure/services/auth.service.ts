import { apolloClient } from '@/infrastructure/graphql/apollo-client';
import { REFRESH_TOKEN } from '@/infrastructure/graphql/mutations';

export class AuthService {
  static setTokens(accessToken: string, refreshToken: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
    }
  }

  static getAccessToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('accessToken');
    }
    return null;
  }

  static getRefreshToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('refreshToken');
    }
    return null;
  }

  static clearTokens(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  }

  static async refreshAccessToken(): Promise<string | null> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) return null;

    try {
      const { data } = await apolloClient.mutate({
        mutation: REFRESH_TOKEN,
        variables: { refreshToken },
      });

      if (data?.refreshToken) {
        this.setTokens(data.refreshToken.accessToken, data.refreshToken.refreshToken);
        return data.refreshToken.accessToken;
      }
      return null;
    } catch (error) {
      this.clearTokens();
      return null;
    }
  }

  static isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }
}
