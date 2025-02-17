"use client"

import withAuth from "@/utils/PrivateRouter"
import ProfileItem from "@/components/ProfileItem/ProfileItem"

const page = (props: any) => {
  let username = props.params.username

  return <ProfileItem username={username} />
}

export default withAuth(page)
