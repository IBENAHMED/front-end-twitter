"use client"

import CreatePost from '@/components/CreatePost/CreatePost';
import Posts from '@/components/Posts/Posts';
import { userContextProvider } from '@/context/UserContext';
import withAuth from '@/utils/PrivateRouter';
import React, { useContext, useEffect, useState } from 'react'

const page = () => {

    let [feedTypeDetected, setFeedTypeDetected]: any = useState("/all");

    const [feedType, setFeedType] = useState("forYou");
    let [dataPost, setDataPost]: any = useState();
    let [isLoading, setIsLoading]: any = useState(false);

    let { cookies } = useContext(userContextProvider);

    let getPostes = async () => {
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
    };

    let getValueFeedType = (type: any) => {
        switch (type) {
            case "forYou":
                return '/all';
            case "following":
                return '/following';
            default:
                return '/all';
        }
    };

    useEffect(() => {
        const newFeedTypeDetected = getValueFeedType(feedType);
        setFeedTypeDetected(newFeedTypeDetected);
    }, [feedType]);


    useEffect(() => {
        getPostes();

    }, [feedTypeDetected])

    return (
        <>
            <div className='flex-[4_4_0] mr-auto border-r border-gray-700 min-h-screen'>
                {/* Header */}
                <div className='flex w-full pb-2 border-b border-gray-700'>
                    <div
                        className={
                            "flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 cursor-pointer relative"
                        }
                        onClick={() => setFeedType("forYou")}
                    >
                        For you
                        {feedType === "forYou" && (
                            <div className='absolute bottom-0 w-10  h-1 rounded-full bg-primary'></div>
                        )}
                    </div>
                    <div
                        className='flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 cursor-pointer relative'
                        onClick={() => setFeedType("following")}
                    >
                        Following
                        {feedType === "following" && (
                            <div className='absolute bottom-0 w-10  h-1 rounded-full bg-primary'></div>
                        )}
                    </div>
                </div>

                {/*  CREATE POST INPUT */}
                <CreatePost reloadPosts={getPostes} isLoading={isLoading} />

                {/* POSTS */}
                <Posts
                    dataPost={dataPost}
                    isLoading={isLoading}
                    getPostes={getPostes}
                    feedType={feedType}
                />
            </div>
        </>
    );
}

export default withAuth(page)
