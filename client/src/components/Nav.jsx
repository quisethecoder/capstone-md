import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react';
import logo from '../assets/logo.png';

//Come back to this point in time


export default function Nav({ loggedInManager, setLoggedInManager, loggedInEmployee, setLoggedInEmployee }) {


    return (
        <header className="bg-blue-100  shadow-md">
            <nav className='max-w-7xl mx-auto flex items-center justify-between px-6 py-1'>
                <div className='flex items-center'>
                    <Link to={"/"} className='flex items-center space-x-2'>
                        <img src={logo} alt="MD Scheduler" width={150}/>
                    </Link>
                </div>
                <ul className='hidden md:flex space-x-6 text-2xl font-normal'>
                    <li>
                        <Link to={"/"} className='hover:text-blue-600 text-blue-900 transition-colors'>
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link to={"/schedule"} className='hover:text-blue-600 text-blue-900 transition-colors'>
                            Schedule
                        </Link>
                    </li>
                    {(loggedInManager || loggedInEmployee) && (
                        <>
                            <li>
                                <Link to={"/Profile"} className='hover:text-blue-600 text-blue-900 transition-colors'>
                                    Profile
                                </Link>
                            </li>
                        </>
                    )}
                </ul>
                <div className='flex items-center space-x-4'>
                    {loggedInManager === null && loggedInEmployee === null ? (
                        <>
                        
                                <Link to={"/choose-route/signup"} className='px-4 py-2 border border-blue-600 rounded hover:bg-blue-900 hover:text-white transition-colors'>
                                    Sign Up
                                </Link>
                                <Link to={"/choose-route/login"} className='px-4 py-2 border border-blue-600 rounded hover:bg-blue-900 hover:text-white transition-colors'>
                                    Log In
                                </Link>
                
                        </>
                    ) : (
                        <button onClick={() => {
                            setLoggedInManager(null)
                            setLoggedInEmployee(null)
                            localStorage.clear("loggedInEmployee")
                            localStorage.clear("loggedInManager")
                        }}
                        className='px-4 py-2 bg-blue-900 text-white rounded hover:bg-blue-700 transition-colors'
                        >
                            Log Out
                        </button>
                    )}

                </div>
            </nav>
        </header>
    )
}