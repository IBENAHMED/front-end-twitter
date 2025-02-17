"use client"

import Link from "next/link"
import toast from "react-hot-toast"
import React, {useContext, useRef, useState} from "react"
import {userContextProvider} from "@/context/UserContext"

import {BiRepost} from "react-icons/bi"
import {FaRegBookmark, FaRegComment, FaRegHeart, FaTrash} from "react-icons/fa"
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner"
import formatDate from "../../utils/date"
import avatarPlaceholder from "../../assets/img/avatar-placeholder.png"

export const PostSkeleton = () => {
  return (
    <div className='flex flex-col gap-4 w-full p-4'>
      <div className='flex gap-4 items-center'>
        <div className='skeleton w-10 h-10 rounded-full shrink-0'></div>
        <div className='flex flex-col gap-2'>
          <div className='skeleton h-2 w-12 rounded-full'></div>
          <div className='skeleton h-2 w-24 rounded-full'></div>
        </div>
      </div>
      <div className='skeleton h-40 w-full'></div>
    </div>
  )
}

export const Post = ({post, reloadPosts}: any) => {
  const {user, cookies} = useContext(userContextProvider)

  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingAddComments, setIsLoadingAddComments] = useState(false)
  const [isLoadingLike, setIsLoadingLike] = useState(false)
  const isLiked = post.likes.includes(user.user._id)

  const commentsModal: any = useRef()
  const [comment, setComment] = useState("")

  const postOwner = post.user

  const isMyPost = post.user._id === user.user._id

  const handleDeletePost = async () => {
    try {
      setIsLoading(true)

      await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/delete/${post._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "token-auth": cookies.jwt,
        },
      })

      toast.success("poste deleted successfully")
      reloadPosts()
    } catch (error: any) {
      throw new Error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePostComment = (e: any) => {
    e.preventDefault()
  }

  const handleLikePost = async (postId: any) => {
    try {
      setIsLoadingLike(true)

      let res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/like/${postId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "token-auth": cookies.jwt,
        },
      })

      const data = await res.json()

      if (data) {
        post.likes = await data
        setIsLoadingLike(false)
      }
    } catch (error: any) {
      throw new Error(error)
    }
  }

  let handlingComment = async () => {
    try {
      setIsLoadingAddComments(true)

      let res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/comment/${post._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "token-auth": cookies.jwt,
        },
        body: JSON.stringify({text: comment}),
      })

      const data = await res.json()

      if (data) {
        post.comments = await data.comments
        post.user = await data.user
        setComment("")
        setIsLoadingAddComments(false)
      }
    } catch (error: any) {
      throw new Error(error)
    }
  }

  return (
    <>
      <div className='flex gap-2 items-start p-4 border-b border-gray-700'>
        <div className='avatar'>
          <Link href={`/profile/${postOwner.username}`} className='w-8 rounded-full overflow-hidden'>
            <img src={postOwner.profileImg || avatarPlaceholder.src} />
          </Link>
        </div>
        <div className='flex flex-col flex-1'>
          <div className='flex gap-2 items-center flex-wrap'>
            <div>
              <Link href={`/profile/${postOwner.username}`} className='font-bold'>
                {postOwner.fullName}
              </Link>
            </div>
            <div>
              <span className='text-gray-700 flex gap-1 text-sm'>
                <Link href={`/profile/${postOwner.username}`}>@{postOwner.username}</Link>
                <span>·</span>
                <span>{formatDate(post.updatedAt)}</span>
              </span>
            </div>
            <div>{isMyPost && <span className='flex justify-end flex-1'>{isLoading ? <LoadingSpinner size='sm' /> : <FaTrash className='cursor-pointer hover:text-red-500' onClick={handleDeletePost} />}</span>}</div>
          </div>
          <div className='flex flex-col gap-3 overflow-hidden'>
            <p>{post.text}</p>
            {post.img && <img src={post.img} className='h-80 object-contain rounded-lg border border-gray-700' alt='' />}
          </div>
          <div className='flex justify-between mt-3'>
            <div className='flex flex-wrap gap-4 items-center w-2/3 justify-between'>
              <div className='flex gap-1 items-center cursor-pointer group' onClick={() => commentsModal.current.showModal()}>
                <FaRegComment className='w-4 h-4  text-slate-500 group-hover:text-sky-400' />
                <span className='text-sm text-slate-500 group-hover:text-sky-400'>{post.comments.length}</span>
              </div>
              {/* We're using Modal Component from DaisyUI */}
              <dialog ref={commentsModal} id={`comments_modal${post._id}`} className='modal border-none outline-none'>
                <div className='modal-box rounded border border-gray-600'>
                  <h3 className='font-bold text-lg mb-4'>COMMENTS</h3>
                  <div className='flex flex-col gap-3 max-h-60 overflow-auto'>
                    {post && post.comments.length === 0 && <p className='text-sm text-slate-500'>No comments yet 🤔 Be the first one 😉</p>}
                    {post &&
                      post.comments.map((comment: any) => (
                        <div key={comment._id} className='flex gap-2 items-start'>
                          <div className='avatar'>
                            <div className='w-8 rounded-full'>
                              <img src={comment.user.profileImg || avatarPlaceholder.src} />
                            </div>
                          </div>
                          <div className='flex flex-col'>
                            <div className='flex items-center gap-1'>
                              <span className='font-bold'>{comment.user.fullName}</span>
                              <span className='text-gray-700 text-sm'>@{comment.user.username}</span>
                            </div>
                            <div className='text-sm'>{comment.text}</div>
                          </div>
                        </div>
                      ))}
                  </div>
                  <form className='flex gap-2 items-center mt-4 border-t border-gray-600 pt-2' onSubmit={handlePostComment}>
                    <textarea
                      className='textarea w-full p-1 rounded text-md resize-none border focus:outline-none  border-gray-800'
                      placeholder='Add a comment...'
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />
                    <button onClick={handlingComment} className='btn btn-primary rounded-full btn-sm text-white px-4'>
                      {isLoadingAddComments ? <LoadingSpinner size='sm' /> : "Post"}
                    </button>
                  </form>
                </div>
                <form method='dialog' className='modal-backdrop'>
                  <button className='outline-none'>close</button>
                </form>
              </dialog>
              <div className='flex gap-1 items-center group cursor-pointer'>
                <BiRepost className='w-6 h-6  text-slate-500 group-hover:text-green-500' />
                <span className='text-sm text-slate-500 group-hover:text-green-500'>0</span>
              </div>
              <div className='flex gap-1 items-center group cursor-pointer' onClick={() => handleLikePost(post._id)}>
                {/* ***************************************************************** */}
                {isLoadingLike ? (
                  <LoadingSpinner size='sm' />
                ) : !isLiked ? (
                  <FaRegHeart className='w-4 h-4 cursor-pointer text-slate-500 group-hover:text-pink-500' />
                ) : (
                  <FaRegHeart className='w-4 h-4 cursor-pointer text-pink-500 ' />
                )}
                <span className={`text-sm group-hover:text-pink-500 ${isLiked ? `text-pink-500` : "text-slate-500"}`}>{post.likes.length}</span>
              </div>
            </div>
            <div className='flex w-1/3 justify-end gap-2 items-center'>
              <FaRegBookmark className='w-4 h-4 text-slate-500 cursor-pointer' />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

const Posts = ({dataPost, getPostes, isLoading}: any) => {
  return (
    <>
      {isLoading && (
        <div className='flex flex-col justify-center'>
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </div>
      )}
      {!isLoading && dataPost?.length === 0 && <p className='text-center my-4'>No posts in this tab. Switch 👻</p>}
      {!isLoading && dataPost && (
        <div>
          {dataPost.map((post: any) => (
            <Post key={post._id} post={post} reloadPosts={getPostes} />
          ))}
        </div>
      )}
    </>
  )
}

export default Posts
