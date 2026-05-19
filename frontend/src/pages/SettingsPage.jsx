import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore.js";
import { axiosInstance } from "../lib/axios.js";
import { showToast } from "../lib/toastConfig.js";
import FavouritesPicker from "../components/FavouritesPicker.jsx";

const SettingsPage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const navigate = useNavigate();

  const [selectedImage, setSelectedImage] = useState(
    authUser?.profilePic || "/avatar.png"
  );
  const [formData, setFormData] = useState({
    username: authUser?.username || "",
    email: authUser?.email || "",
    bio: authUser?.bio || "",
  });
  const [favourites, setFavourites] = useState([]);
  const [loadingFavourites, setLoadingFavourites] = useState(true);

  // Pull current favourites (with album details) from the profile endpoint
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
        setSelectedImage(authUser.profilePic);
      }
    };

    reader.onerror = () => {
      showToast.error("Error reading image");
    };
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const payload = {
        username: formData.username,
        email: formData.email,
        bio: formData.bio,
        favourites: favourites.map((a) => a.albumId),
      };
      await updateProfile(payload);
      navigate(`/${formData.username || authUser.username}/profile`);
    } catch (error) {
      console.error("Profile Update Failed:", error);
    }
  };

  return (
    <div className="max-w-xl min-h-dvh mx-auto mt-5 p-6 bg-gray-800 rounded-lg shadow-md text-white">
      <div className="flex flex-col items-center pt-10">
        <label
          htmlFor="imageUpload"
          className="relative w-32 h-32 md:w-36 md:h-36 cursor-pointer"
        >
          <img
            src={selectedImage}
            alt="Profile"
            className="w-full h-full rounded-full object-cover border-2 border-gray-500"
          />
          <input
            type="file"
            id="imageUpload"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
        </label>
        <p className="text-gray-400 text-sm mt-2">
          Click to change profile picture
        </p>
      </div>

      <div className="mt-6 space-y-4">
        <div>
          <label className="block text-gray-300 text-sm mb-1">Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="w-full bg-gray-700 text-white p-2 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-gray-300 text-sm mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full bg-gray-700 text-white p-2 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-gray-300 text-sm mb-1">Bio</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            className="w-full bg-gray-700 text-white p-2 rounded-md outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows="3"
          />
        </div>

        {!loadingFavourites && (
          <FavouritesPicker value={favourites} onChange={setFavourites} />
        )}
      </div>

      <button
        type="button"
        onClick={handleSave}
        disabled={isUpdatingProfile}
        className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-semibold transition disabled:opacity-50 cursor-pointer"
      >
        {isUpdatingProfile ? "Updating..." : "Save Changes"}
      </button>
    </div>
  );
};

export default SettingsPage;
