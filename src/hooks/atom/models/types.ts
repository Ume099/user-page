export type UserMetadata = {
  lastSignInTime: string;
  creationTime: string;
  lastRefreshTime?: string;
};

export type ProviderData = {
  uid: string;
  displayName: string;
  email: string;
  providerId: string;
};

export type displayName = {
  uid: string;
  email: string;
  emailVerified: boolean;
  displayName: string;
  disabled: boolean;
  metadata: UserMetadata;
  passwordHash: string;
  passwordSalt: string;
  tokensValidAfterTime: string;
  providerData: ProviderData[];
};
