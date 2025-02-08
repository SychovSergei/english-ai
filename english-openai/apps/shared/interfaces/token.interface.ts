/** ITokens - interface describing the variety of tokens*/
export interface TokensShared {
  accessToken: string;
  refreshToken: string;
}

export interface ITokenModel<TUserId = string> {
  userId: TUserId;
  refreshToken: string;
}
