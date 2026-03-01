import axios from "axios";
import { ENV } from "./_core/env";

const DISCORD_API_URL = "https://discord.com/api/v10";

export interface DiscordUser {
  id: string;
  username: string;
  discriminator: string;
  avatar: string | null;
  email?: string;
}

export interface DiscordTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
}

export class DiscordOAuthService {
  private clientId: string;
  private clientSecret: string;
  private redirectUri: string;

  constructor(clientId: string, clientSecret: string, redirectUri: string) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.redirectUri = redirectUri;
  }

  /**
   * Generate Discord OAuth login URL
   */
  getLoginUrl(state: string): string {
    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      response_type: "code",
      scope: "identify email",
      state,
    });

    return `${DISCORD_API_URL}/oauth2/authorize?${params.toString()}`;
  }

  /**
   * Exchange authorization code for access token
   */
  async exchangeCodeForToken(code: string): Promise<DiscordTokenResponse> {
    try {
      const response = await axios.post<DiscordTokenResponse>(
        `${DISCORD_API_URL}/oauth2/token`,
        {
          client_id: this.clientId,
          client_secret: this.clientSecret,
          grant_type: "authorization_code",
          code,
          redirect_uri: this.redirectUri,
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      return response.data;
    } catch (error: any) {
      console.error("[Discord OAuth] Token exchange failed:", error.response?.data || error.message);
      throw new Error("Failed to exchange code for token");
    }
  }

  /**
   * Get Discord user info using access token
   */
  async getUserInfo(accessToken: string): Promise<DiscordUser> {
    try {
      const response = await axios.get<DiscordUser>(`${DISCORD_API_URL}/users/@me`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return response.data;
    } catch (error: any) {
      console.error("[Discord OAuth] Failed to get user info:", error.response?.data || error.message);
      throw new Error("Failed to get user info from Discord");
    }
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshToken(refreshToken: string): Promise<DiscordTokenResponse> {
    try {
      const response = await axios.post<DiscordTokenResponse>(
        `${DISCORD_API_URL}/oauth2/token`,
        {
          client_id: this.clientId,
          client_secret: this.clientSecret,
          grant_type: "refresh_token",
          refresh_token: refreshToken,
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      return response.data;
    } catch (error: any) {
      console.error("[Discord OAuth] Token refresh failed:", error.response?.data || error.message);
      throw new Error("Failed to refresh token");
    }
  }
}

// Initialize Discord OAuth service
export function initializeDiscordOAuth(redirectUri: string): DiscordOAuthService {
  const clientId = process.env.DISCORD_CLIENT_ID;
  const clientSecret = process.env.DISCORD_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("Discord OAuth credentials not configured");
  }

  return new DiscordOAuthService(clientId, clientSecret, redirectUri);
}
