import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Camera } from "lucide-react";
import useAuthStore from "../store/useAuthStore";
import { axiosInstance } from "../lib/axios";
import { showToast } from "../lib/toastConfig";
import Background from "../components/Background";
import FavouritesPicker from "../components/FavouritesPicker.jsx";
import UserAvatar from "../components/UserAvatar";

const inputClass =
  "mt-1 w-full rounded border border-gray-700 bg-zinc-800 px-4 py-2 text-sm text-gray-200 placeholder-gray-500 focus:border-white focus:outline-none";

const labelClass = "block text-sm font-medium text-gray-300";

const SettingsPage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const navigate = useNavigate();

  const [selectedImage, setSelectedImage] = useState(authUser?.profilePic || "");
  const [formData, setFormData] = useState({
    username: authUser?.username || "",
    email: authUser?.email || "",
    bio: authUser?.bio || "",
  });
  const [favourites, setFavourites] = useState([]);
  const [loadingFavourites, setLoadingFavourites] = useState(true);

  useEffect(() => {
    if (!authUser?.username) return;
    let cancelled = false;

    (async () => {
      try {
        setLoadingFavourites(true);
        const { data } = await axiosInstance.get(`/user/${authUser.username}`);
        if (!cancelled) setFavourites(data.favourites || []);
      } catch (err) {
        console.error("Failed to load favourites:", err);
      } finally {
        if (!cancelled) setLoadingFavourites(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [authUser?.username]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImage(base64Image);
      try {
        await updateProfile({ profilePic: base64Image });
      } catch (error) {
        console.error("Image upload failed:", error);
        setSelectedImage(authUser?.profilePic || "");
      }
    };

    reader.onerror = () => showToast.error("Error reading image");
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      await updateProfile({
        username: formData.username,
        email: formData.email,
        bio: formData.bio,
        favourites: favourites.map((a) => a.albumId),
      });
      navigate(`/${formData.username || authUser.username}/profile`);
    } catch (error) {
      console.error("Profile Update Failed:", error);
    }
  };

  return (
    <Background
      imageUrl="https://imgix.bustle.com/uploads/image/2021/8/31/9043e78c-a96c-49c5-a19d-e4efde485bcf-drake-certified-lover-boy.jpeg?w=374&h=285&fit=crop&crop=faces&dpr=2"
      className="text-white pt-28 pb-16 min-h-screen"
    >
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        {/* Heading */}
        <div className="flex items-baseline justify-between mb-6">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">
              Edit Profile
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              Update your account details and favourite albums.
            </p>
          </div>
          {authUser?.username && (
            <Link
              to={`/${authUser.username}/profile`}
              className="text-sm text-gray-400 hover:text-white"
            >
              Cancel
            </Link>
          )}
        </div>

        <div className="bg-grids p-6 sm:p-8 rounded-lg shadow-xl space-y-8">
          {/* Avatar */}
          <div className="flex flex-col items-center gap-3">
            <label
              htmlFor="imageUpload"
              className="relative w-28 h-28 sm:w-32 sm:h-32 cursor-pointer group"
            >
              <UserAvatar
                username={authUser?.username}
                src={selectedImage}
                size={128}
                className="w-full h-full ring-2 ring-white/10"
                textClassName="text-4xl"
              />
              <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Camera size={22} className="text-white" />
              </div>
              <input
                type="file"
                id="imageUpload"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </label>
            <p className="text-xs text-gray-500">
              Click image to change profile picture
            </p>
          </div>

          {/* Account */}
          <section>
            <h2 className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-3">
              Account
            </h2>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Username"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className={inputClass}
                />
              </div>
            </div>
          </section>

          {/* About */}
          <section>
            <h2 className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-3">
              About
            </h2>
            <div>
              <label className={labelClass}>Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Tell people what you're listening to..."
                rows="3"
                className={`${inputClass} resize-none`}
              />
            </div>
          </section>

          {/* Favourites */}
          <section>
            <h2 className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-3">
              Favourite Albums
            </h2>
            {loadingFavourites ? (
              <div className="flex justify-center py-6">
                <span className="loading loading-spinner loading-md" />
              </div>
            ) : (
              <FavouritesPicker
                value={favourites}
                onChange={setFavourites}
              />
            )}
          </section>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-white/10">
            {authUser?.username && (
              <Link
                to={`/${authUser.username}/profile`}
                className="px-4 py-2 text-sm rounded border border-white/10 text-gray-300 hover:bg-white/5 transition-colors"
              >
                Cancel
              </Link>
            )}
            <button
              type="button"
              onClick={handleSave}
              disabled={isUpdatingProfile}
              className="px-5 py-2 text-sm rounded bg-white text-black font-medium hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUpdatingProfile ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </Background>
  );
};

export default SettingsPage;
