import { google } from "googleapis";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN;
const GOOGLE_REDIRECT_URI = "https://developers.google.com/oauthplayground";

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_REFRESH_TOKEN) {
  console.error("Google OAuth credentials missing in environment variables.");
}

export const oAuth2Client = new google.auth.OAuth2(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI
);

if (GOOGLE_REFRESH_TOKEN) {
  oAuth2Client.setCredentials({ refresh_token: GOOGLE_REFRESH_TOKEN });
}

export async function getGmailClient() {
  if (
    !oAuth2Client.credentials.access_token ||
    (oAuth2Client.credentials.expiry_date &&
      oAuth2Client.credentials.expiry_date < Date.now())
  ) {
    try {
      const { token } = await oAuth2Client.getAccessToken();
      if (token) {
        oAuth2Client.setCredentials({ access_token: token });
      } else {
        throw new Error("Failed to refresh access token, no token received.");
      }
    } catch (error) {
      console.error("Error refreshing access token:", error);
      throw new Error("Could not refresh access token for Gmail API.");
    }
  }
  return google.gmail({ version: "v1", auth: oAuth2Client });
}
