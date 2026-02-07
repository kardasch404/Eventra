import Cookies from 'js-cookie';

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

export class AuthService {
  static setTokens(accessToken: string, refreshToken: string): void {
    Cookies.set(ACCESS_TOKEN_KEY, accessToken, { expires: 1/96 }); // 15 minutes
    Cookies.set(REFRESH_TOKEN_KEY, refreshToken, { expires: 7 }); // 7 days
  }

  static getAccessToken(): string | undefined {
    return Cookies.get(ACCESS_TOKEN_KEY);
  }

  static getRefreshToken(): string | undefined {
    return Cookies.get(REFRESH_TOKEN_KEY);
  }

  static clearTokens(): void {
    Cookies.remove(ACCESS_TOKEN_KEY);
    Cookies.remove(REFRESH_TOKEN_KEY);
  }

  static isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }
}
