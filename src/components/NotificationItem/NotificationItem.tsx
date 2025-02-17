"use client"

import Link from "next/link"
import toast from "react-hot-toast"
import {userContextProvider} from "@/context/UserContext"
import React, {useContext, useEffect, useState} from "react"

import {FaHeart, FaUser} from "react-icons/fa"
import {IoSettingsOutline} from "react-icons/io5"

import LoadingSpinner from "../LoadingSpinner/LoadingSpinner"
import avatarPlaceholder from "../../assets/img/avatar-placeholder.png"

const NotificationItem = () => {
  let {cookies} = useContext(userContextProvider)

  const [notifications, setNotifications]: any = useState()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchingNotifications()
  }, [])

  const fetchingNotifications = async () => {
    try {
      setIsLoading(true)

      let res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/getAllNotification`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "token-auth": cookies.jwt,
        },
      })

      const data = await res.json()

      if (data) {
        setNotifications(data.notification)
        setIsLoading(false)
      }
    } catch (error) {
      throw new Error("Invalid Server Error")
    }
  }

  const deleteNotifications = async () => {
    try {
      let res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/deleteNotifications`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "token-auth": cookies.jwt,
        },
      })

      const data = await res.json()

      if (data == null) {
        setNotifications(data)
        toast.success("delete notifications successfully")
      }
    } catch (error) {
      throw new Error("Invalid Server Error")
    }
  }

  return (
    <div className='flex-[4_4_0] border-l border-r border-gray-700 min-h-screen'>
      <div className=' p-4 border-b border-gray-700'>
        <p className='font-bold'>Notifications</p>
        <div className='dropdown '>
          <div tabIndex={0} role='button' className='m-1'>
            <IoSettingsOutline className='w-4' />
          </div>
          <ul tabIndex={0} className='dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52'>
            <li>
              <button onClick={deleteNotifications}>Delete all notifications</button>
            </li>
          </ul>
        </div>
      </div>
      {isLoading && (
        <div className='flex justify-center h-full items-center'>
          <LoadingSpinner size='lg' />
        </div>
      )}
      {notifications && notifications.length === 0 && <div className='text-center p-4 font-bold'>No notifications 🤔</div>}
      {notifications &&
        notifications.map((notification: any) => (
          <div className='border-b border-gray-700' key={notification._id}>
            <div className='flex gap-2 p-4'>
              {notification.type === "follow" && <FaUser className='w-7 h-7 text-primary' />}
              {notification.type === "like" && <FaHeart className='w-7 h-7 text-red-500' />}
              <Link href={`/profile/${notification.from.username}`}>
                <div className='avatar'>
                  <div className='w-8 rounded-full'>
                    <img src={notification.from.profileImg || avatarPlaceholder.src} />
                  </div>
                </div>
                <div className='flex gap-1'>
                  <span className='font-bold'>@{notification.from.username}</span> {notification.type === "follow" ? "followed you" : "liked your post"}
                </div>
              </Link>
            </div>
          </div>
        ))}
    </div>
  )
}

export default NotificationItem
