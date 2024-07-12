"use client"

const fetchingProfileDataUser = async (username: any, cookies: any) => {

    try {

        let res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/getUserProfile/${username}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'token-auth': cookies.jwt,
            }
        });

        let data = await res.json();
        return data.user;

    } catch (error) {
        throw new Error("Invalid Error Server");
    };
};

export default fetchingProfileDataUser
