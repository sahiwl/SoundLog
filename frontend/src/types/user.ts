import type { AlbumSummary } from "./album";

export interface AuthUser {
  _id: string;
  username: string;
  email: string;
  profilePic?: string;
  bio?: string;
  followers?: string[];
  following?: string[];
  favourites?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface UserProfileStats {
  albums: number;
  reviews: number;
  likes: number;
  listenLater: number;
  listened: number;
}

export interface RecentReviewSummary {
  _id: string;
  reviewText: string;
  albumId: string;
  createdAt?: string;
  albumTitle: string;
  albumImage: string | null;
  rating: number | null;
}

/** /users/:username/profile response shape. */
export interface UserProfile extends Omit<AuthUser, "favourites"> {
  favourites: AlbumSummary[];
  stats: UserProfileStats;
  recentReviews: RecentReviewSummary[];
}

export interface SignupInput {
  username: string;
  email: string;
  password: string;
}

export interface LoginInput {
  username: string;
  password: string;
}

export interface UpdateUserProfileInput {
  profilePic?: string;
  username?: string;
  email?: string;
  bio?: string;
  favourites?: string[];
}
