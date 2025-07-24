import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserSessionState {
  token: string | null;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  agencyName: string | null;
  workspaceName: string | null;
  userId: string | null;
  agencyId: string | null;
  workspaceId: string | null;
  isPaymentVerified: boolean;

  // Twitter-specific fields
  twitterUserId: string | null;
  twitterAccessToken: string | null;
  // twitterAccessSecret: string | null;
  twitterUsername: string | null;
  twitterProfileImage: string | null;
  twitterAccessTokenSecret: string | null;
}

const initialState: UserSessionState = {
  token: null,
  email: null,
  firstName: null,
  lastName: null,
  agencyName: null,
  workspaceName: null,
  userId: null,
  agencyId: null,
  workspaceId: null,
  isPaymentVerified: false,

  // Twitter-specific fields
  twitterUserId: null,
  twitterAccessToken: null,
  // twitterAccessSecret: null,
  twitterUsername: null,
  twitterProfileImage: null,
  twitterAccessTokenSecret: null,
};

export const AppStore = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<Partial<UserSessionState>>) => {
      Object.assign(state, action.payload);
    },
    clearUser: () => {
      return initialState;
    },
  },
});

export const { setUser, clearUser } = AppStore.actions;
export default AppStore.reducer;
