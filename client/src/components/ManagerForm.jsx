import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {jwtDecode} from "jwt-decode"


export default function ManagerForm({setLoggedInManager}){

    const navigate = useNavigate()

    const [manager, setManager] = useState({
        firstName: "",
        lastName: "",
        username: "",
        password: ""
    })

    const [errors, setErrors] = useState([])

    const handleSubmit = (event) => {
        event.preventDefault()

        fetch("http://localhost:8080/api/managers", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(manager)
        })
        .then(response => {
            if(response.status >= 200 && response.status < 300){
                response.json().then(fetchedManager => {
                    const manager = jwtDecode(fetchedManager.jwt)
                    manager.jwt = fetchedManager.jwt
                    setLoggedInManager(manager)
                    localStorage.setItem("loggedInManager", JSON.stringify(manager))
                    navigate("/")
                })
            }else{
                response.json().then(fetchedErrors => setErrors(fetchedErrors))
            }
        })
    }

    const handleChange = (event) => {
        setManager({ ...manager, [event.target.name]: event.target.value})
    }


    return(
        <div className="min-h-screen flex items-center justify-center pt-20 pb-20 pr-7 bg-blue-50">
             <div className="bg-blue-100 shadow-md rounded-lg max-w-md w-full p-8">
            {errors.length > 0 && <ul id="errors">
                {errors.map(error => <li className="mb-4 text-red-600" key={error}>{error}</li>)}
            </ul>}

            <h2 className="text-2xl font-bold text-center text-blue-900 mb-6">Create an Account</h2>

            <div></div>
            <form onSubmit={handleSubmit}>

                 <div>
                    <label htmlFor="firstname-input" className="block font-bold mb-1">First Name </label>
                    <input 
                    className="w-full border border-blue-400 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-black mb-1"
                    required
                    name="firstName" id="firstname-input" type="text" value={manager.firstName} onChange={handleChange} />
                </div>

                <div>
                    <label htmlFor="lastname-input" className="block font-bold mb-1">Last Name </label>
                    <input 
                    className="w-full border border-blue-400 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-black mb-1"
                    required
                    name="lastName" id="laststname-input" type="text" value={manager.lastName} onChange={handleChange} />
                </div>

                <div>
                    <label htmlFor="username-input" className="block font-bold mb-1">Username </label>
                    <input 
                    className="w-full border border-blue-400 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-black mb-1"
                    required
                    name="username" id="username-input" type="text" value={manager.username} onChange={handleChange} />
                </div>

                <div>
                    <label htmlFor="password-input" className="block font-bold mb-1">Password </label>
                    <input 
                    className="w-full border border-blue-400 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-black mb-10"
                    required
                    name="password" id="password-input" type="password" value={manager.password} onChange={handleChange} />
                </div>

                <div>
                    <button className="px-4 py-2 bg-blue-900 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300" type="submit">Sign Up</button>
                </div>
            </form>
            </div>
        </div>
    )
}