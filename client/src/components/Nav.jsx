import { Link } from 'react-router-dom'
import logo from '../assets/logo.png';
import { useEffect, useState } from 'react';


export default function Nav({loggedInManager, setLoggedInManager, loggedInEmployee, setLoggedInEmployee}){
    const [darkMode, setDarkMode] = useState(false)

    useEffect(() => {
        const storedPreference = localStorage.getItem("darkMode")
        if(storedPreference === "true"){
            setDarkMode(true)
            document.documentElement.classList.add("dark")
        }else{
            setDarkMode(false)
            document.documentElement.classList.remove("dark")
        }
    }, [])

    const toggleDarkMode = () => {
        if(darkMode){
            document.documentElement.classList.remove("dark")
            localStorage.setItem("darkMode", "false")
            setDarkMode(false)
        }else{
            document.documentElement.classList.add("dark")
            localStorage.setItem("darkMode", "true")
            setDarkMode(true)
        }
    }
   
    return(
       <header>
        <nav>
           <div>
            <Link to={"/"}>
                <img src={logo} alt="MD Scheduler" width={150} />
            </Link>
            <ul>
                <li>
                    <Link to={"/"}>
                    Home
                    </Link>
                </li>
                <li>
                    <Link to={"/schedule"}>
                    Schedule
                    </Link>
                </li>
                {loggedInManager === null && loggedInEmployee === null ? <>
                    <li>
                    <Link to={"/choose-route/signup"}>
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
                    <Link to={"profile"}>
                    Profile
                    </Link>
                </li>
                <li>
                    <Link to={"/"}>
                    Time Off Request
                    </Link>
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
           {/* <button onClick={toggleDarkMode} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300" >{darkMode ? "Light Mode" : "Dark Mode"}</button> */}
        </nav>
       </header>
    )
}