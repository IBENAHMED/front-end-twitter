"use client"

import XSvg from '@/components/Svgs/X';
import { userContextProvider } from '@/context/UserContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useContext, useState } from 'react'
import toast from 'react-hot-toast';
import { MdOutlineMail, MdPassword } from 'react-icons/md';

const page = () => {

    let [isPending, setIsPending] = useState(false);
    let [isError, setIisError] = useState(false);

    let router = useRouter();

    let { setCookie } = useContext(userContextProvider)

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        try {
            let res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            let data = await res.json();

            if (data.token) {

                setCookie("jwt", data.token);
                setIsPending(true);
                router.push('/home');
                toast.success(`user login successfully`);

            } else {
                toast.error(`${data.error}`);
            }

        } catch (err) {
            setIisError(true)
        }
    };

    const handleInputChange = (e: any) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className='max-w-screen-xl mx-auto flex h-screen'>
            <div className='flex-1 hidden lg:flex items-center  justify-center'>
                <XSvg className='lg:w-2/3 fill-white' />
            </div>
            <div className='flex-1 flex flex-col justify-center items-center'>
                <form className='flex gap-4 flex-col' onSubmit={handleSubmit}>
                    <XSvg className='w-24 lg:hidden fill-white' />
                    <h1 className='text-4xl font-extrabold text-white'>{"Let's"} go.</h1>
                    <label className='input input-bordered rounded flex items-center gap-2'>
                        <MdOutlineMail />
                        <input
                            type='text'
                            className='grow'
                            placeholder='email'
                            name='email'
                            onChange={handleInputChange}
                            value={formData.email}
                        />
                    </label>

                    <label className='input input-bordered rounded flex items-center gap-2'>
                        <MdPassword />
                        <input
                            type='password'
                            className='grow'
                            placeholder='Password'
                            name='password'
                            onChange={handleInputChange}
                            value={formData.password}
                        />
                    </label>
                    <button className='btn rounded-full btn-primary text-white'>
                        {isPending ? "loading..." : "Login"}
                    </button>
                    {isError && <p className='text-red-500'>Something went wrong</p>}
                </form>
                <div className='flex flex-col gap-2 mt-4'>
                    <p className='text-white text-lg'>{"Don't"} have an account?</p>
                    <Link href='/'>
                        <button className='btn rounded-full btn-primary text-white btn-outline w-full'>
                            Sign up
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default page
