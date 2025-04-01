import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore.js';
import { axiosInstance } from '../lib/axios.js';
import Background from '../components/Background.jsx';

const ProfilePage = () => {
    const { username } = useParams();
    const navigate = useNavigate();
    const { authUser } = useAuthStore();
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const isOwnProfile = authUser?.username === username;

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                setLoading(true);
                // If it's own profile, use authUser data
                if (isOwnProfile) {
                    setUserInfo(authUser);
                } else {
                    const response = await axiosInstance.get(`/user/${username}`);
                    setUserInfo(response.data);
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
                navigate('/404');
            } finally {
                setLoading(false);
            }
        };

        if (username) {
            fetchUserProfile();
        }
    }, [username, authUser, isOwnProfile]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="loading loading-spinner loading-lg"></div>
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

    return (
        <Background imageUrl={"https://imgix.bustle.com/uploads/image/2021/8/31/9043e78c-a96c-49c5-a19d-e4efde485bcf-drake-certified-lover-boy.jpeg?w=374&h=285&fit=crop&crop=faces&dpr=2"}>
        <div className="max-w-3xl min-h-dvh mx-auto p-6 pt-28">
            {/* Desktop Layout */}
            <div className="hidden sm:flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <img
                        src={userInfo.profilePic || "/placeholder.svg"}
                        alt="Profile"
                        className="w-24 h-24 rounded-full object-cover"
                    />
                    <div>
                        <h1 className="text-2xl font-bold">{userInfo.username}</h1>
                        <p className="text-gray-500 text-sm">
                            Joined {new Date(userInfo.createdAt).toLocaleDateString()}
                        </p>
                        <div className="flex gap-4 mt-2">
                            <p className="text-sm">
                                <span className="font-bold">{userInfo.followers?.length || 0}</span>{" "}
                                <span className="text-gray-400">Followers</span>
                            </p>
                            <p className="text-sm">
                                <span className="font-bold">{userInfo.following?.length || 0}</span>{" "}
                                <span className="text-gray-400">Following</span>
                            </p>
                        </div>
                        {/* use a different font here */}
                        <div className="pt-2 w-full italic text-slate-500">
                            {userInfo.bio}
                        </div>
                    </div>
                </div>
                {isOwnProfile && (
                    <Link
                        to={`/${username}/settings`}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                        Edit Profile
                    </Link>
                )}
            </div>

            {/* Mobile Layout */}
            <div className="sm:hidden flex flex-col items-center text-center">
                <img
                    src={userInfo.profilePic || "/placeholder.svg"}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover mb-4"
                />
                <h1 className="text-xl font-bold">{userInfo.username}</h1>
                <p className="text-gray-500 text-sm mt-1">
                    Joined {new Date(userInfo.createdAt).toLocaleDateString()}
                </p>
                <div className="flex gap-6 mt-4">
                    <p className="text-center">
                        <span className="block font-bold">{userInfo.followers?.length || 0}</span>
                        <span className="text-gray-400 text-sm">Followers</span>
                    </p>
                    <p className="text-center">
                        <span className="block font-bold">{userInfo.following?.length || 0}</span>
                        <span className="text-gray-400 text-sm">Following</span>
                    </p>
                </div>
                {isOwnProfile && (
                    <Link
                        to={`/${username}/settings`}
                        className="mt-6 w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-center transition-colors"
                    >
                        Edit Profile
                    </Link>
                )}
            </div>

            {/* Navigation Tabs */}
            <div className="mt-8 border-b border-gray-700">
                <nav className="flex flex-wrap justify-center sm:justify-start gap-6 text-sm">
                    {['albums', 'reviews', 'likes', 'listenlater'].map((tab) => (
                        <Link
                            key={tab}
                            to={`/${userInfo.username}/${tab}`}
                            className="text-gray-400 hover:text-white pb-4 border-b-2 border-transparent hover:border-blue-600 transition-colors"
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </Link>
                    ))}
                </nav>
            </div>
        </div>
        </Background>
    );
};

export default ProfilePage;