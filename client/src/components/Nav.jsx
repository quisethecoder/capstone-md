import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react';
import logo from '../assets/logo.png';



export default function Nav({ loggedInManager, setLoggedInManager, loggedInEmployee, setLoggedInEmployee }) {


    return (
        <header className="bg-blue-100 shadow-md">
            <nav className='max-w-7xl mx-auto flex items-center justify-between px-6 py-1'>
                <div className='flex items-center'>
                    <Link to={"/"} className='flex items-center space-x-2'>
                    <img src={logo} alt="MD Scheduler" width={150} />
                    </Link>
                    <ul className='hidden md:flex space-x-6 text-lg'>
                        <li>
                            <Link to={"/"} className='hover:text-blue-600 transition-colors'>
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link to={"/schedule"} className='hover:text-blue-600 transition-colors'>
                                Schedule
                            </Link>
                        </li>
                        {loggedInManager === null && loggedInEmployee === null ? <>
                            <li>
                                <Link to={"/choose-route/signup"} >
                                    Sign Up
                                </Link>
                            </li>
                            <li>
                                <Link to={"/choose-route/login"}>
                                    Log In
                                </Link>
                            </li>
                        </> : <>
                            <li>
                                <Link to={"profile"} className='hover:text-blue-600 transition-colors'>
                                    Profile
                                </Link>
                            </li>
                            <li>
                                <Link to={"/"} className='hover:text-blue-600 transition-colors'>
                                    Time Off Request
                                </Link >
                            </li>
                            <li>
                                <button onClick={() => {
                                    setLoggedInManager(null)
                                    setLoggedInEmployee(null)
                                    localStorage.clear("loggedInEmployee")
                                    localStorage.clear("loggedInManager")
                                }}>Log Out</button>
                            </li>
                        </>
                        }
                    </ul>
                </div>
            </nav>
        </header>
    )
}