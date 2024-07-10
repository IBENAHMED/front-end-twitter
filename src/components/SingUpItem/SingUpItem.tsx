"use client"

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useContext, useState } from 'react'
import toast from 'react-hot-toast';
import XSvg from '../Svgs/X';
import { MdDriveFileRenameOutline, MdOutlineMail, MdPassword } from 'react-icons/md';
import { FaUser } from 'react-icons/fa';
import { userContextProvider } from '@/context/UserContext';

const SingUpItem = () => {
    let [isPending, setIsPending] = useState(false);
    let router = useRouter();

    const [formData, setFormData] = useState({
        email: "",
        username: "",
        fullName: "",
        password: "",
    });

    let { setCookie } = useContext(userContextProvider);

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (formData.email !== "" && formData.username !== "" && formData.fullName !== "" && formData.password !== "") {
            setIsPending(true);
            try {

                let res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/sigup`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                });

                let data = await res.json();

                if (res.status == 201) {

                    setCookie("jwt", data.token);
                    router.push('/home');
                    toast.success(`user sign in successfully`);

                }

                if (res.status == 400) {
                    toast.error(`${data.error}`);
                }

                setIsPending(false);
            } catch (err) {
                console.log(err)
            }
        } else {
            toast.error(`We do not accept empty fields`);
        }
    };

    const handleInputChange = (e: any) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const isError = false;

    return (
        <div className='max-w-screen-xl mx-auto flex h-screen px-10'>
            <div className='flex-1 hidden lg:flex items-center  justify-center'>
                <XSvg className=' lg:w-2/3 fill-white' />
            </div>
            <div className='flex-1 flex flex-col justify-center items-center'>
                <form className='lg:w-2/3  mx-auto md:mx-20 flex gap-4 flex-col' onSubmit={handleSubmit}>
                    <XSvg className='w-24 lg:hidden fill-white' />
                    <h1 className='text-4xl font-extrabold text-white'>Join today.</h1>
                    <label className='input input-bordered rounded flex items-center gap-2'>
                        <MdOutlineMail />
                        <input
                            type='email'
                            className='grow w-full'
                            placeholder='Email'
                            name='email'
                            onChange={handleInputChange}
                            value={formData.email}
                        />
                    </label>
                    <div className='flex gap-4 flex-wrap'>
                        <label className='input input-bordered rounded flex items-center gap-2 flex-1'>
                            <FaUser />
                            <input
                                type='text'
                                className='grow w-full'
                                placeholder='Username'
                                name='username'
                                onChange={handleInputChange}
                                value={formData.username}
                            />
                        </label>
                        <label className='input input-bordered rounded flex items-center gap-2 flex-1'>
                            <MdDriveFileRenameOutline />
                            <input
                                type='text'
                                className='grow w-full'
                                placeholder='Full Name'
                                name='fullName'
                                onChange={handleInputChange}
                                value={formData.fullName}
                            />
                        </label>
                    </div>
                    <label className='input input-bordered rounded flex items-center gap-2'>
                        <MdPassword />
                        <input
                            type='password'
                            className='grow w-full'
                            placeholder='Password'
                            name='password'
                            onChange={handleInputChange}
                            value={formData.password}
                        />
                    </label>
                    <button className='btn rounded-full btn-primary text-white'>
                        {isPending ? "loading..." : "SingUp"}
                    </button>
                    {isError && <p className='text-red-500'>Something went wrong</p>}
                </form>
                <div className='flex flex-col lg:w-2/3 gap-2 mt-4'>
                    <p className='text-white text-lg'>Already have an account?</p>
                    <Link href='/login'>
                        <button className='btn rounded-full btn-primary text-white btn-outline w-full'>Login</button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default SingUpItem