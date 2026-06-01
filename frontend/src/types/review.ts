export interface ReviewUserRef {
  id: string;
  username: string;
}

export interface ReviewComment {
  commentId: string;
  text: string;
  createdAt?: string;
  user: ReviewUserRef;
}

export interface AlbumReview {
  reviewId: string;
  reviewText: string;
  createdAt?: string;
  likes?: number;
  likedBy?: string[];
  user: ReviewUserRef;
  commentCount: number;
}

export interface AlbumReviewsResponse {
  reviews: AlbumReview[];
  totalReviews: number;
}

/** /pages/albums/:albumId review (includes nested comments). */
export interface AlbumPageReview {
  reviewId: string;
  reviewText: string;
  rating?: number;
  createdAt?: string;
  user: ReviewUserRef;
  comments: ReviewComment[];
  commentCount: number;
}

/** Paginated user reviews — /pagination/:username/reviews. */
export interface UserReviewListItem {
  _id: string;
  reviewText: string;
  rating: number | "NA";
  createdAt?: string;
  albumId: string;
  albumTitle: string;
  releaseDate: string;
  albumImage: string | null;
}
