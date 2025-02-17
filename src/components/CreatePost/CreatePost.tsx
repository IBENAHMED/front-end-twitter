"use client"

import React, {useContext, useRef, useState} from "react"
import {userContextProvider} from "@/context/UserContext"

import toast from "react-hot-toast"
import {CiImageOn} from "react-icons/ci"
import {IoCloseSharp} from "react-icons/io5"
import {BsEmojiSmileFill} from "react-icons/bs"

import avatarPlaceholder from "../../assets/img/avatar-placeholder.png"

const CreatePost = ({reloadPosts, isLoading}: any) => {
  const isError = false

  const imgRef: any = useRef(null)
  const {user, cookies} = useContext(userContextProvider)

  const [text, setText] = useState("")
  const [img, setImg]: any = useState(null)

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    try {
      let res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "token-auth": cookies.jwt,
        },
        body: JSON.stringify({text, img}),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong")
      }

      if (data) {
        toast.success(data.message)
        setText("")
        setImg(null)
        reloadPosts()
      }
    } catch (error: any) {
      throw new Error(error)
    }
  }

  const handleImgChange = (e: any) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setImg(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className='flex p-4 items-start gap-4 border-b border-gray-700'>
      <div className='avatar'>
        <div className='w-8 rounded-full'>
          <img src={user.user?.profileImg || avatarPlaceholder.src} />
        </div>
      </div>
      <form className='flex flex-col gap-2 w-full'>
        <textarea className='textarea w-full p-0 text-lg resize-none border-none focus:outline-none  border-gray-800' placeholder='What is happening?!' value={text} onChange={(e) => setText(e.target.value)} />
        {img && (
          <div className='relative w-72 mx-auto'>
            <IoCloseSharp className='absolute top-0 right-0 text-white bg-gray-800 rounded-full w-5 h-5 cursor-pointer' onClick={() => setImg(null)} />
            <img src={img} className='w-full mx-auto h-72 object-contain rounded' />
          </div>
        )}

        <div className='flex justify-between border-t py-2 border-t-gray-700'>
          <div className='flex gap-1 items-center'>
            <CiImageOn className='fill-primary w-6 h-6 cursor-pointer' onClick={() => imgRef.current.click()} />
            <BsEmojiSmileFill className='fill-primary w-5 h-5 cursor-pointer' />
          </div>
          <input type='file' accept='image/*' hidden ref={imgRef} onChange={handleImgChange} />
          <button className='btn btn-primary rounded-full btn-sm text-white px-4' type='submit' onClick={handleSubmit}>
            {isLoading ? "Posting..." : "Post"}
          </button>
        </div>
        {isError && <div className='text-red-500'>Something went wrong</div>}
      </form>
    </div>
  )
}

export default CreatePost
