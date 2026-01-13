import { authApi } from "@repo/api";

export const login = authApi.login;
export const logout = authApi.logout;
export const getAccount = authApi.getAccount;
export const refreshToken = authApi.refreshToken;
