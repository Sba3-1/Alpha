export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

// Discord login URL - no longer using Manus OAuth
export const getDiscordLoginUrl = () => {
  return "/login";
};

// For backward compatibility
export const getLoginUrl = getDiscordLoginUrl;
