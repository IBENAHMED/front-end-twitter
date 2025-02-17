"use client"

import {useContext, useEffect, useState} from "react"
import {userContextProvider} from "@/context/UserContext"

import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner"
import SingUpItem from "@/components/SingUpItem/SingUpItem"

const withAuth = (Component: any) => {
  const Auth = (props: any) => {
    const {cookies} = useContext(userContextProvider)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
      const checkAuth = async () => {
        if (cookies && cookies.jwt) {
          setIsLoading(false)
        } else {
          setIsLoading(false)
        }
      }
      checkAuth()
    }, [cookies])

    if (isLoading) {
      return (
        <div className='h-screen flex justify-center items-center'>
          <LoadingSpinner size='lg' />
        </div>
      )
    }

    if (cookies && cookies.jwt) {
      return <Component {...props} />
    } else {
      return <SingUpItem />
    }
  }
  return Auth
}

export default withAuth
