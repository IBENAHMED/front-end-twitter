import "./globals.css"

import type {Metadata} from "next"
import {Inter} from "next/font/google"

import {Toaster} from "react-hot-toast"
import UserContext from "@/context/UserContext"

import Sidebar from "@/components/Sidebar/Sidebar"
import RightPanel from "@/components/RightPanel.jsx/RightPanel"

const inter = Inter({subsets: ["latin"]})

export const metadata: Metadata = {
  manifest: "/manifest.json",
  title: "Twitter",
  description: "Make your own conversation",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en' data-theme='black'>
      <body className={inter.className}>
        <UserContext>
          <div className='flex max-w-6xl mx-auto'>
            <div>
              {" "}
              <Sidebar />{" "}
            </div>
            <div className='flex-1'> {children} </div>
            <div>
              {" "}
              <RightPanel />{" "}
            </div>
          </div>
          <Toaster />
        </UserContext>
      </body>
    </html>
  )
}
