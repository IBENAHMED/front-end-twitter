"use client"

import NotificationItem from '@/components/NotificationItem/NotificationItem';
import withAuth from '@/utils/PrivateRouter';
import React from 'react'

const page = () => {

    return (
        <>
            <NotificationItem />
        </>
    );
};

export default withAuth(page)