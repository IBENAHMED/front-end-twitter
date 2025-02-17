"use client"
import React, {useContext, useEffect, useState} from "react"

import "./Sidebar.css"

import Link from "next/link"
import toast from "react-hot-toast"
import {useRouter} from "next/navigation"
import {userContextProvider} from "@/context/UserContext"

import {FaUser} from "react-icons/fa"
import {BiLogOut} from "react-icons/bi"
import {MdHomeFilled} from "react-icons/md"
import {IoNotifications} from "react-icons/io5"

import XSvg from "../Svgs/X"
import avatarPlaceholder from "../../assets/img/avatar-placeholder.png"
import fetchingProfileDataUser from "@/utils/fetchingProfileData"

const Sidebar = () => {
  let router = useRouter()
  const {cookies, user, sideBarEffect, removeCookie} = useContext(userContextProvider)

  const [isLoading, setIsLoading] = useState(true)
  const [userData, setUserData]: any = useState(null)

  useEffect(() => {
    if (user) {
      let userProfile = async () => {
        let data = await fetchingProfileDataUser(user.user.username, cookies)
        setUserData(data)
      }
      userProfile()
    }

    const checkAuth = async () => {
      if (cookies && cookies.jwt) {
        setIsLoading(false)
      } else {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [cookies, sideBarEffect])

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    if (cookies.jwt) {
      removeCookie("jwt")
      router.push("/login")
      toast.success(`user logout successfully `)
    }
  }

  if (isLoading) {
    return (
      <div className='h-screen flex justify-center items-center'>
        <div className='flex w-52 flex-col gap-4'>
          <div className='skeleton h-32 w-full'></div>
          <div className='skeleton h-4 w-28'></div>
          <div className='skeleton h-4 w-full'></div>
          <div className='skeleton h-4 w-full'></div>
          <div className='skeleton h-32 w-full'></div>
          <div className='skeleton h-4 w-28'></div>
          <div className='skeleton h-4 w-full'></div>
          <div className='skeleton h-4 w-full'></div>
        </div>
      </div>
    )
  }

  if (cookies && cookies.jwt) {
    return (
      <div className='Sidebar md:flex-[2_2_0] w-18 max-w-52'>
        <div className='sticky top-0 left-0 h-screen flex flex-col border-r border-gray-700 w-12 md:w-full'>
          <Link href='/home' className='flex justify-center md:justify-start'>
            <XSvg className='px-2 w-12 h-12 rounded-full fill-white hover:bg-stone-900' />
          </Link>
          <ul className='flex flex-col gap-3 mt-4'>
            <li className='flex justify-center md:justify-start'>
              <Link href='/home' className='flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer'>
                <MdHomeFilled className='w-8 h-8' />
                <span className='text-lg hidden md:block'>Home</span>
              </Link>
            </li>
            <li className='flex justify-center md:justify-start'>
              <Link href='/notification' className='flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer'>
                <IoNotifications className='w-6 h-6' />
                <span className='text-lg hidden md:block'>Notifications</span>
              </Link>
            </li>

            <li className='flex justify-center md:justify-start'>
              <Link href={`/profile/${userData && userData?.username}`} className='flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer'>
                <FaUser className='w-6 h-6' />
                <span className='text-lg hidden md:block'>Profile</span>
              </Link>
            </li>
          </ul>
          {userData && userData && (
            <Link href={`/profile/${userData && userData.username}`} className='mt-auto mb-10 flex gap-2 items-start transition-all duration-300 hover:bg-[#181818] py-2 px-4 rounded-full'>
              <div className='avatar hidden md:inline-flex'>
                <div className='w-8 rounded-full'>
                  <img src={(userData && userData?.profileImg) || avatarPlaceholder.src} />
                </div>
              </div>
              <div className='flex justify-between flex-1'>
                <div className='hidden md:block'>
                  <p className='text-white font-bold text-sm w-20 truncate'>{userData && userData?.fullName}</p>
                  <p className='text-slate-500 text-sm'>@{userData && userData?.username}</p>
                </div>
                <BiLogOut onClick={(e: any) => handleSubmit(e)} className='w-5 h-5 cursor-pointer' />
              </div>
            </Link>
          )}
        </div>
      </div>
    )
  } else {
    return <></>
  }
}

export default Sidebar
