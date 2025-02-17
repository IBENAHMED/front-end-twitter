"use client"

import React from "react"
import withAuth from "@/utils/PrivateRouter"
import NotificationItem from "@/components/NotificationItem/NotificationItem"

const page = () => {
  return <NotificationItem />
}

export default withAuth(page)
