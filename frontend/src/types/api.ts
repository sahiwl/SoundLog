/**
 * Shared API response shapes — match backend JSON (no { success, data } envelope).
 * Expand as components migrate to TypeScript.
 */

import type { Album, AlbumCard } from "./album";
import type { UserReviewListItem } from "./review";
import type { AuthUser, UserProfile } from "./user";

export interface MessageResponse {
  message: string;
}

export interface ApiErrorResponse {
  message: string;
  aiRateLimitInfo?: AIRateLimitInfo;
}

/** Paginated user lists — albums, likes, listen later, reviews. */
export interface PaginatedAlbumsResponse {
  albums: Album[];
  currentPage: number;
  totalPages: number;
  total: number;
}

export interface PaginatedReviewsResponse {
  reviews: UserReviewListItem[];
  currentPage: number;
  totalPages: number;
  total: number;
}

export interface AlbumActionsState {
  listened: boolean;
  liked: boolean;
  listenLater: boolean;
  rating: number | null;
  reviewed: boolean;
}

export interface RatingResponse {
  rating: number;
}

/** Batch track ratings — /actions/tracks/ratings?ids= */
export type TrackRatingsMap = Record<string, number>;

export interface AIRateLimitInfo {
  canMakeRequest: boolean;
  remainingRequests: number;
  timeUntilReset: number;
  maxRequests: number;
  windowMs: number;
  windowSeconds: number;
  currentRequests: number;
  isAtLimit: boolean;
}

export interface MoodRecommendations {
  type: "mood" | "personalized";
  mood?: string;
  albums: AlbumCard[];
  tracks: [];
  tasteProfile?: string;
  isUsingAiFallback?: boolean;
  fallbackReason?: string;
  needMoreData?: boolean;
  error?: string;
}

export interface RecommendationsResponse {
  recommendations: MoodRecommendations;
  availableMoods: string[];
  aiRateLimitInfo: AIRateLimitInfo;
  aiPowered?: boolean;
}

export type AuthResponse = AuthUser;
export type UserProfileResponse = UserProfile;
