import { Link } from 'react-router-dom'
import logo from '../assets/logo.png';


export default function Nav({loggedInManager, setLoggedInManager, loggedInEmployee, setLoggedInEmployee}){
   
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
                    <Link to={"/"}>
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
                    <Link to={"/"}>
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
        </nav>
       </header>
    )
}