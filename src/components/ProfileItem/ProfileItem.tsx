"use client"

import Link from 'next/link';
import React, { useContext, useEffect, useRef, useState } from 'react'
import { FaArrowLeft, FaLink } from 'react-icons/fa';
import { IoCalendarOutline } from 'react-icons/io5';
import { MdEdit } from 'react-icons/md';
import formatDate from '../../utils/date';
import Posts from '../Posts/Posts';
import { userContextProvider } from '@/context/UserContext';
import toast from 'react-hot-toast';

import cover from '../../assets/img/cover.png';
import avatarPlaceholder from '../../assets/img/avatar-placeholder.png';
import fetchingProfileDataUser from '@/utils/fetchingProfileData';

export const ProfileHeaderSkeleton = () => {
    return (
        <div className='flex flex-col gap-2 w-full my-2 p-4'>
            <div className='flex gap-2 items-center'>
                <div className='flex flex-1 gap-1'>
                    <div className='flex flex-col gap-1 w-full'>
                        <div className='skeleton h-4 w-12 rounded-full'></div>
                        <div className='skeleton h-4 w-16 rounded-full'></div>
                        <div className='skeleton h-40 w-full relative'>
                            <div className='skeleton h-20 w-20 rounded-full border absolute -bottom-10 left-3'></div>
                        </div>
                        <div className='skeleton h-6 mt-4 w-24 ml-auto rounded-full'></div>
                        <div className='skeleton h-4 w-14 rounded-full mt-4'></div>
                        <div className='skeleton h-4 w-20 rounded-full'></div>
                        <div className='skeleton h-4 w-2/3 rounded-full'></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const EditProfileModal = () => {

    const [formData, setFormData] = useState({
        fullName: "",
        username: "",
        email: "",
        bio: "",
        link: "",
        newPassword: "",
        currentPassword: "",
    });
    const [isPanding, setIsPanding] = useState(false);

    let { cookies, sideBarEffect, setSideBarEffect } = useContext(userContextProvider);

    let handlingEditProfile = async (e: any) => {
        e.preventDefault();
        try {
            let res;
            try {
                setIsPanding(true);

                res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/updateUser`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        'token-auth': cookies.jwt,
                    },
                    body: JSON.stringify(formData),
                });

                if (res.ok) {
                    setSideBarEffect(!sideBarEffect)
                }

                if (!res.ok) {
                    return toast.error("Invalid Password");
                }
            } catch (error) {
                throw new Error("Invalid Server Error" + error);
            }

            try {
                let data = await res.json();
                if (data) {
                    toast.success("profile modify successfully");
                    setIsPanding(false);
                };
            } catch (error) {
                throw new Error("Overall error" + error);
            }

        } catch (error) {
            throw new Error("Invalid Error Server");
        }
    };

    let editProfileModal: any = useRef(null)

    const handleInputChange = (e: any) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <>
            <button
                className='btn btn-outline rounded-full btn-sm'
                onClick={() => editProfileModal.current.showModal()}
            >
                Edit profile
            </button>
            <dialog ref={editProfileModal} id='edit_profile_modal' className='modal'>
                <div className='modal-box border rounded-md border-gray-700 shadow-md'>
                    <h3 className='font-bold text-lg my-3'>Update Profile</h3>
                    <form
                        className='flex flex-col gap-4'
                        onSubmit={handlingEditProfile}
                    >
                        <div className='flex flex-wrap gap-2'>
                            <input
                                type='text'
                                placeholder='Full Name'
                                className='flex-1 input border border-gray-700 rounded p-2 input-md'
                                value={formData.fullName}
                                name='fullName'
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className='flex flex-wrap gap-2'>
                            <input
                                type='email'
                                placeholder='Email'
                                className='flex-1 input border border-gray-700 rounded p-2 input-md'
                                value={formData.email}
                                name='email'
                                onChange={handleInputChange}
                            />
                            <textarea
                                placeholder='Bio'
                                className='flex-1 input border border-gray-700 rounded p-2 input-md'
                                value={formData.bio}
                                name='bio'
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className='flex flex-wrap gap-2'>
                            <input
                                type='password'
                                placeholder='Current Password'
                                className='flex-1 input border border-gray-700 rounded p-2 input-md'
                                value={formData.currentPassword}
                                name='currentPassword'
                                onChange={handleInputChange}
                            />
                            <input
                                type='password'
                                placeholder='New Password'
                                className='flex-1 input border border-gray-700 rounded p-2 input-md'
                                value={formData.newPassword}
                                name='newPassword'
                                onChange={handleInputChange}
                            />
                        </div>
                        <input
                            type='text'
                            placeholder='Link'
                            className='flex-1 input border border-gray-700 rounded p-2 input-md'
                            value={formData.link}
                            name='link'
                            onChange={handleInputChange}
                        />
                        <button className='btn btn-primary rounded-full btn-sm text-white'
                        >
                            {isPanding ? "Loading..." : "Update"}
                        </button>
                    </form>
                </div>
                <form method='dialog' className='modal-backdrop'>
                    <button className='outline-none'>close</button>
                </form>
            </dialog>
        </>
    );
};

const ProfileItem = ({ username }: any) => {

    const [feedType, setFeedType] = useState("posts");
    const [coverImg, setCoverImg] = useState(null);
    const [profileImg, setProfileImg] = useState(null);
    let [isLoading, setIsLoading]: any = useState(false);
    let [followUnfollow, setFollowUnfollow]: any = useState();
    let [isLoadingFollwo, setIsLoadingFollwo]: any = useState(false);
    let [userCurrent, setUserCurrent]: any = useState();
    let [feedTypeDetected, setFeedTypeDetected]: any = useState(`/user/${username}`);
    let [dataPost, setDataPost]: any = useState();

    const coverImgRef: any = useRef(null);
    const profileImgRef: any = useRef(null);

    let { user, cookies, sideBarEffect, setSideBarEffect } = useContext(userContextProvider);

    let isMyProfile = userCurrent && userCurrent._id == user.user._id

    let getPostes = async () => {
        if (feedTypeDetected) {
            try {
                setIsLoading(true);

                let res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}${feedTypeDetected}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'token-auth': cookies.jwt,
                    }
                });
                let data = await res.json();

                setDataPost(data);

            } catch (error: any) {
                throw new Error(error);

            } finally {
                setIsLoading(false);
            }
        }
    };

    let getValueFeedType = (type: any) => {
        if (userCurrent) {
            switch (type) {
                case "likes":
                    return `/likes/${userCurrent._id}`;
                case "posts":
                    return `/user/${username}`;
                default:
                    return `/likes/${userCurrent._id}`;
            };
        };
    };

    let handlingFollow = async (userId: any) => {
        try {
            setIsLoadingFollwo(true);

            let res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/followUnfollowUser/${userId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'token-auth': cookies.jwt,
                }
            });

            let data = await res.json();

            if (res.status == 200) {
                toast.success(`${data.message}`)
                setFollowUnfollow(!followUnfollow);
            };
        } catch (error: any) {
            throw new Error(error)
        };
    };

    let handlingUploadImg = async () => {
        try {
            let res;
            try {
                setIsLoadingFollwo(true);

                res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/updateUser`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        'token-auth': cookies.jwt,
                    },
                    body: JSON.stringify({
                        coverImg, profileImg
                    }),
                });

                if (res.ok) {
                    setSideBarEffect(!sideBarEffect);
                };

                if (!res.ok) {
                    throw new Error("HTTP Error");
                };

            } catch (error) {
                throw new Error("Invalid Server Error" + error);
            }

            let data;

            try {
                data = await res.json();
                if (data) {
                    toast.success("upload image successfully");
                    setIsLoadingFollwo(false);
                };
            } catch (error) {
                throw new Error("Overall error" + error);
            }

        } catch (error) {
            throw new Error("Invalid Error Server");
        }
    };

    const handleProfileImg = (e: any) => {
        const file = e.target.files[0];
        if (file) {
            const reader: any = new FileReader();
            reader.onload = () => {
                setProfileImg(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCoverImg = (e: any) => {
        const file = e.target.files[0];
        if (file) {
            const reader: any = new FileReader();
            reader.onload = () => {
                setCoverImg(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    useEffect(() => {
        const newFeedTypeDetected = getValueFeedType(feedType);
        setFeedTypeDetected(newFeedTypeDetected);
    }, [feedType]);


    useEffect(() => {
        getPostes();

    }, [feedTypeDetected]);

    useEffect(() => {
        let userProfile = async () => {
            let data = await fetchingProfileDataUser(username, cookies);
            setUserCurrent(data);
        }
        userProfile();

    }, [username, sideBarEffect]);

    // check if i already follow this user
    useEffect(() => {
        if (userCurrent) {
            setFollowUnfollow(user.user.follwing.includes(userCurrent._id));
        }
    }, [userCurrent]);

    return (
        <>
            <div className='flex-[4_4_0]  border-r border-gray-700 min-h-screen '>
                {/* HEADER */}
                {isLoading && <ProfileHeaderSkeleton />}
                {!isLoading && !userCurrent && <p className='text-center text-lg mt-4'>User not found</p>}
                <div className='flex flex-col'>
                    {!isLoading && userCurrent && (
                        <>
                            <div className='flex gap-10 px-4 py-2 items-center'>
                                <Link href='/home'>
                                    <FaArrowLeft className='w-4 h-4' />
                                </Link>
                                <div className='flex flex-col'>
                                    <p className='font-bold text-lg'>{userCurrent?.fullName}</p>
                                    {/* <span className='text-sm text-slate-500'>{POSTS?.length} posts</span> */}
                                </div>
                            </div>
                            {/* COVER IMG */}
                            <div className='relative group/cover'>
                                <img
                                    src={coverImg && coverImg || userCurrent?.coverImg || cover.src}
                                    className='h-52 w-full object-cover'
                                    alt='cover image'
                                />
                                {isMyProfile && (
                                    <div
                                        className='absolute top-2 right-2 rounded-full p-2 bg-gray-800 bg-opacity-75 cursor-pointer opacity-0 group-hover/cover:opacity-100 transition duration-200'
                                        onClick={() => coverImgRef.current.click()}
                                    >
                                        <MdEdit className='w-5 h-5 text-white' />
                                    </div>
                                )}

                                <input
                                    type='file'
                                    hidden
                                    ref={coverImgRef}
                                    onChange={handleCoverImg}
                                />
                                <input
                                    type='file'
                                    hidden
                                    ref={profileImgRef}
                                    onChange={handleProfileImg}
                                />
                                {/* USER AVATAR */}
                                <div className='avatar absolute -bottom-16 left-4'>
                                    <div className='w-32 rounded-full relative group/avatar'>
                                        <img src={profileImg && profileImg || userCurrent?.profileImg || avatarPlaceholder.src} />
                                        <div className='absolute top-5 right-3 p-1 bg-primary rounded-full group-hover/avatar:opacity-100 opacity-0 cursor-pointer'>
                                            {isMyProfile && (
                                                <MdEdit
                                                    className='w-4 h-4 text-white'
                                                    onClick={() => profileImgRef.current.click()}
                                                />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='flex justify-end px-4 mt-5'>
                                {isMyProfile && <EditProfileModal />}
                                {!isMyProfile && (
                                    <button
                                        className='btn btn-outline rounded-full btn-sm'
                                        onClick={() => handlingFollow(userCurrent._id)}
                                    >
                                        {followUnfollow && followUnfollow ? "Unfollow" : "Follow"}
                                    </button>
                                )}
                                {(coverImg || profileImg) && (
                                    <button
                                        className='btn btn-primary rounded-full btn-sm text-white px-4 ml-2'
                                        onClick={() => handlingUploadImg()}
                                    >
                                        {isLoadingFollwo ? "Loading..." : "Update"}
                                    </button>
                                )}
                            </div>

                            <div className='flex flex-col gap-4 mt-14 px-4'>
                                <div className='flex flex-col'>
                                    <span className='font-bold text-lg'>{userCurrent?.fullName}</span>
                                    <span className='text-sm text-slate-500'>@{userCurrent?.username}</span>
                                    <span className='text-sm my-1'>{userCurrent?.bio}</span>
                                </div>

                                <div className='flex gap-2 flex-wrap'>
                                    {userCurrent?.link && (
                                        <div className='flex gap-1 items-center '>
                                            <>
                                                <FaLink className='w-3 h-3 text-slate-500' />
                                                <a
                                                    href={userCurrent?.link}
                                                    target='_blank'
                                                    rel='noreferrer'
                                                    className='text-sm text-blue-500 hover:underline'
                                                >
                                                    youtube.com
                                                </a>
                                            </>
                                        </div>
                                    )}
                                    <div className='flex gap-2 items-center'>
                                        <IoCalendarOutline className='w-4 h-4 text-slate-500' />
                                        <span className='text-sm text-slate-500'>{`Joined ${formatDate(userCurrent.updatedAt)}`}</span>
                                    </div>
                                </div>
                                <div className='flex gap-2'>
                                    <div className='flex gap-1 items-center'>
                                        <span className='font-bold text-xs'>{userCurrent?.follwing.length}</span>
                                        <span className='text-slate-500 text-xs'>Following</span>
                                    </div>
                                    <div className='flex gap-1 items-center'>
                                        <span className='font-bold text-xs'>{userCurrent?.follwers.length}</span>
                                        <span className='text-slate-500 text-xs'>Followers</span>
                                    </div>
                                </div>
                            </div>
                            <div className='flex w-full border-b border-gray-700 mt-4'>
                                <div
                                    className='flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 relative cursor-pointer'
                                    onClick={() => setFeedType("posts")}
                                >
                                    Posts
                                    {feedType === "posts" && (
                                        <div className='absolute bottom-0 w-10 h-1 rounded-full bg-primary' />
                                    )}
                                </div>
                                <div
                                    className='flex justify-center flex-1 p-3 text-slate-500 hover:bg-secondary transition duration-300 relative cursor-pointer'
                                    onClick={() => setFeedType("likes")}
                                >
                                    Likes
                                    {feedType === "likes" && (
                                        <div className='absolute bottom-0 w-10  h-1 rounded-full bg-primary' />
                                    )}
                                </div>
                            </div>
                        </>
                    )}

                </div>
            </div>
            {/* POSTS */}
            <Posts
                dataPost={dataPost}
                isLoading={isLoading}
                getPostes={getPostes}
                feedType={feedType}
            />
        </>
    );
};

export default ProfileItem;