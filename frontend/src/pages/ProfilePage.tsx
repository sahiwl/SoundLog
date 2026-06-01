import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";
import { axiosInstance } from "../lib/axios";
import Background from "../components/Background";
import AlbumImage from "../components/AlbumImage";
import UserAvatar from "../components/UserAvatar";
import type { AlbumSummary } from "../types/album";
import type {
  RecentReviewSummary,
  UserProfile,
  UserProfileStats,
} from "../types/user";

interface FavouriteSlotProps {
  album?: AlbumSummary;
  index: number;
}

const FavouriteSlot = ({ album, index }: FavouriteSlotProps) => {
  if (!album) {
    return (
      <div className="flex flex-col items-center gap-2">
        <div className="aspect-square w-full rounded-md bg-white/5 border border-dashed border-white/15 flex items-center justify-center text-white/30 text-sm">
          #{index + 1}
        </div>
      </div>
    );
  }

  return (
    <Link
      to={`/album/${album.albumId}`}
      className="group flex flex-col items-center gap-2"
    >
      <div className="aspect-square w-full overflow-hidden rounded-md ring-1 ring-white/10 transition-transform group-hover:scale-[1.03] group-hover:ring-purple-400/60">
        <AlbumImage
          src={album.images?.[0]?.url}
          alt={album.name}
          size={300}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="w-full text-center">
        <p className="text-sm font-medium text-white truncate">{album.name}</p>
        <p className="text-xs text-gray-400 truncate">
          {album.artists?.[0]?.name}
        </p>
      </div>
    </Link>
  );
};

interface StatCardProps {
  label: string;
  value?: number;
  to?: string;
}

const StatCard = ({ label, value, to }: StatCardProps) => {
  const inner = (
    <div className="rounded-lg bg-white/5 border border-white/10 px-4 py-3 text-center hover:bg-white/10 transition-colors">
      <div className="text-2xl font-bold tracking-tight">{value ?? 0}</div>
      <div className="text-xs text-gray-400 uppercase tracking-wider mt-1">
        {label}
      </div>
    </div>
  );
  return to ? <Link to={to}>{inner}</Link> : inner;
};

const ProfilePage = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const { authUser } = useAuthStore();
  const [userInfo, setUserInfo] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const isOwnProfile = authUser?.username === username;

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get<UserProfile>(
          `/user/${username}`
        );
        setUserInfo(response.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
        navigate("/404");
      } finally {
        setLoading(false);
      }
    };

    if (username) fetchUserProfile();
  }, [username, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  if (!userInfo) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-400">Failed to load profile</p>
      </div>
    );
  }

  const favourites = userInfo.favourites || [];
  const stats: UserProfileStats = userInfo.stats || {
    albums: 0,
    reviews: 0,
    likes: 0,
    listenLater: 0,
    listened: 0,
  };
  const recentReviews: RecentReviewSummary[] = userInfo.recentReviews || [];

  return (
    <Background
      imageUrl="https://imgix.bustle.com/uploads/image/2021/8/31/9043e78c-a96c-49c5-a19d-e4efde485bcf-drake-certified-lover-boy.jpeg?w=374&h=285&fit=crop&crop=faces&dpr=2"
      className="text-white pt-24 min-h-screen"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-16">
        <section className="flex flex-col sm:flex-row sm:items-end gap-6 pb-8 border-b border-white/10">
          <UserAvatar
            username={userInfo.username}
            src={userInfo.profilePic}
            size={128}
            className="ring-2 ring-white/10"
            textClassName="text-4xl"
          />

          <div className="flex-1">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
                {userInfo.username}
              </h1>
              {isOwnProfile && (
                <Link
                  to={`/${username}/settings`}
                  className="px-4 py-2 text-sm rounded-md border border-white/15 hover:bg-white/10 transition-colors"
                >
                  Edit Profile
                </Link>
              )}
            </div>

            {userInfo.bio && (
              <p className="mt-3 text-gray-300 italic max-w-xl">{userInfo.bio}</p>
            )}

            <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-400">
              <span>
                <span className="font-semibold text-white">
                  {userInfo.followers?.length || 0}
                </span>{" "}
                Followers
              </span>
              <span>
                <span className="font-semibold text-white">
                  {userInfo.following?.length || 0}
                </span>{" "}
                Following
              </span>
              {userInfo.createdAt && (
                <span>
                  Joined {new Date(userInfo.createdAt).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        </section>

        <section className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard
            label="Albums"
            value={stats.albums}
            to={`/${userInfo.username}/albums`}
          />
          <StatCard
            label="Reviews"
            value={stats.reviews}
            to={`/${userInfo.username}/reviews`}
          />
          <StatCard
            label="Likes"
            value={stats.likes}
            to={`/${userInfo.username}/likes`}
          />
          <StatCard
            label="Listen Later"
            value={stats.listenLater}
            to={`/${userInfo.username}/listenlater`}
          />
        </section>

        <section className="mt-10">
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-400">
              Favourite Albums
            </h2>
            {isOwnProfile && (
              <Link
                to={`/${username}/settings`}
                className="text-xs text-purple-300 hover:text-purple-200"
              >
                {favourites.length === 0 ? "Choose 4 →" : "Edit →"}
              </Link>
            )}
          </div>

          {favourites.length === 0 ? (
            <p className="text-gray-500 text-sm">
              {isOwnProfile
                ? "Pick four albums that define your taste."
                : "No favourites yet."}
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[0, 1, 2, 3].map((i) => (
                <FavouriteSlot key={i} album={favourites[i]} index={i} />
              ))}
            </div>
          )}
        </section>

        <section className="mt-12">
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-400">
              Recent Reviews
            </h2>
            {stats.reviews > 0 && (
              <Link
                to={`/${userInfo.username}/reviews`}
                className="text-xs text-purple-300 hover:text-purple-200"
              >
                View all →
              </Link>
            )}
          </div>

          {recentReviews.length === 0 ? (
            <p className="text-gray-500 text-sm">No reviews yet.</p>
          ) : (
            <div className="space-y-3">
              {recentReviews.map((review) => (
                <Link
                  key={review._id}
                  to={`/album/${review.albumId}`}
                  className="flex gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <AlbumImage
                    src={review.albumImage}
                    alt={review.albumTitle}
                    size={64}
                    className="w-16 h-16 rounded object-cover shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-semibold truncate">
                        {review.albumTitle}
                      </p>
                      {review.rating != null && (
                        <span className="text-sm font-semibold text-green-400 shrink-0">
                          {review.rating}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                      {review.reviewText}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </Background>
  );
};

export default ProfilePage;
