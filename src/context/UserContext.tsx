"use client"

import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner';
import axios from 'axios';
import React, { createContext, useEffect, useState } from 'react'
import { useCookies } from "react-cookie";
import toast from 'react-hot-toast';

export const userContextProvider = createContext<any>(null)

const UserContext = ({ children }: any) => {

    const [cookies, setCookie, removeCookie] = useCookies(['jwt']);
    let [user, setUser]: any = useState(null);
    let [isPending, setIsPending] = useState(false);

    let getUserData = async () => {

        try {
            setIsPending(true);
            let res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/me`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'token-auth': cookies.jwt,
                }
            });

            let user = await res.json();
            setUser(user)

        } catch (error) {
            toast.error("we can't get user data Invalid Server Error");
        } finally {
            setIsPending(false);
        };
    };

    useEffect(() => {
        getUserData();
    }, [cookies.jwt]);

    let data = {
        user,
        cookies, setCookie, removeCookie
    }

    return (
        <div>
            {
                !isPending
                    ?
                    (
                        <userContextProvider.Provider value={data}>
                            {children}
                        </userContextProvider.Provider>
                    )
                    :
                    (
                        <div className='h-screen flex justify-center items-center'>
                            <LoadingSpinner size='lg' />
                        </div>
                    )
            }

        </div>
    )
}

export default UserContext
