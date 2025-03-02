import { apiClient } from "./client.api";
import {
  LoginRequest,
  SignupRequest,
  AuthTokens,
} from "@shared/interfaces/auth-context.interface";
import { AddUser, User } from "@features/user/interface/user.interface";
import { Pagination } from "@shared/interfaces/pagination.interface";

export class AuthApi {
  /** Fetch the current user's profile */
  static async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<User>("/api/v1/user/me");
    return response.data;
  }

  /** Update the current user's profile */
  static async updateUser(
    userData: Partial<SignupRequest>
  ): Promise<AuthTokens> {
    const response = await apiClient.patch<AuthTokens>(
      "/api/v1/user/",
      userData
    );
    return response.data;
  }

  /** Register a new user */
  static async registerUser(
    registrationData: SignupRequest
  ): Promise<AuthTokens> {
    const response = await apiClient.post<AuthTokens>(
      "/api/v1/user/register",
      registrationData
    );
    return response.data;
  }

  /** Log in a user */
  static async loginUser(loginData: LoginRequest): Promise<AuthTokens> {
    const response = await apiClient.post<AuthTokens>(
      "/api/v1/user/login",
      loginData
    );
    return response.data;
  }
}
