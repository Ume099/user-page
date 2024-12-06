export type GoogleTagManagerId = `GTM-${string}`;

export const googleTagManagerId = process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID
  ? (process.env.NEXT_PUBLIC_GOOGLE_SEARCH_CONSOLE_CONTENT as GoogleTagManagerId)
  : undefined;
