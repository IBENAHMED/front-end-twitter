"use client"

import "./RightPanel.css"

import Link from "next/link"
import toast from "react-hot-toast"
import {useContext, useEffect, useState} from "react"
import {userContextProvider} from "@/context/UserContext"

import avatarPlaceholder from "../../assets/img/avatar-placeholder.png"

export const RightPanelSkeleton = () => {
  return (
    <div className='flex flex-col gap-2 w-52 my-2'>
      <div className='flex gap-2 items-center'>
        <div className='skeleton w-8 h-8 rounded-full shrink-0'></div>
        <div className='flex flex-1 justify-between'>
          <div className='flex flex-col gap-1'>
            <div className='skeleton h-2 w-12 rounded-full'></div>
            <div className='skeleton h-2 w-16 rounded-full'></div>
          </div>
          <div className='skeleton h-6 w-14 rounded-full'></div>
        </div>
      </div>
    </div>
  )
}

const RightPanel = () => {
  const {cookies} = useContext(userContextProvider)
  
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingFollwo, setIsLoadingFollwo] = useState(false)
  const [USERS_FOR_RIGHT_PANEL, SETUSERS_FOR_RIGHT_PANEL]: any = useState()

  useEffect(() => {
    const checkAuth = async () => {
      if (cookies && cookies.jwt) {
        setIsLoading(false)
        getSuggest()
      } else {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [cookies])

  const getSuggest = async () => {
    try {
      let res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/suggested`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "token-auth": cookies.jwt,
        },
      })

      if (res.ok) {
        let data = await res.json()
        SETUSERS_FOR_RIGHT_PANEL(data)
      }
    } catch (error: any) {
      throw new Error(error)
    }
  }

  const handlingFollow = async (userId: any) => {
    try {
      setIsLoadingFollwo(true)

      let res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/followUnfollowUser/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "token-auth": cookies.jwt,
        },
      })

      if (res.status == 200) {
        toast.success("following user successfully")
      }
      setIsLoadingFollwo(false)
    } catch (error: any) {
      throw new Error(error)
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
      <div className='RightPanel hidden lg:block my-4 mx-2'>
        <div className='bg-[#16181C] p-4 rounded-md sticky top-2'>
          <p className='font-bold'>Who to follow</p>
          <div className='flex flex-col gap-4'>
            {!USERS_FOR_RIGHT_PANEL && (
              <>
                <RightPanelSkeleton />
                <RightPanelSkeleton />
                <RightPanelSkeleton />
                <RightPanelSkeleton />
              </>
            )}
            {USERS_FOR_RIGHT_PANEL?.map((user: any) => (
              <Link href={`/profile/${user.username}`} className='flex items-center justify-between gap-4' key={user._id}>
                <div className='flex gap-2 items-center'>
                  <div className='avatar'>
                    <div className='w-8 rounded-full'>
                      <img src={user.profileImg || avatarPlaceholder.src} />
                    </div>
                  </div>
                  <div className='flex flex-col'>
                    <span className='font-semibold tracking-tight truncate w-28'>{user.fullName}</span>
                    <span className='text-sm text-slate-500'>@{user.username}</span>
                  </div>
                </div>
                <div>
                  <button
                    className='btn bg-white text-black hover:bg-white hover:opacity-90 rounded-full btn-sm'
                    onClick={(e) => {
                      e.preventDefault()
                      handlingFollow(user._id)
                    }}
                  >
                    Follow
                  </button>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    )
  } else {
    return <></>
  }
}
export default RightPanel
