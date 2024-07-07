"use client"

import ProfileItem from '@/components/ProfileItem/ProfileItem';
import withAuth from '@/utils/PrivateRouter';

const page = (props: any) => {

    let username = props.params.username;

    return (
        <>
            <ProfileItem username={username} />
        </>
    );
}

export default withAuth(page)
