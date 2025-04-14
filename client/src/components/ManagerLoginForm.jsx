import { useState } from "react"
import { useNavigate} from "react-router-dom"
import { jwtDecode } from "jwt-decode"



export default function ManagerLoginForm({ setLoggedInManager }) {

    const navigate = useNavigate()

    const [manager, setManager] = useState({
        username: "",
        password: ""
    })

    const [errors, setErrors] = useState([])

    const handleSubmit = (event) => {
        event.preventDefault()

        fetch("http://localhost:8080/api/managers/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(manager)
        })
        .then(response =>{
            if(response.status >= 200 && response.status < 300){
                response.json().then(fetchedManager => {
                    const manager = jwtDecode(fetchedManager.jwt)
                    manager.jwt = fetchedManager.jwt
                    setLoggedInManager(manager)
                    localStorage.setItem("loggedInManager", JSON.stringify(manager))
                    navigate("/")
                })
            }else{
                response.json().then(fetchedManager => setErrors(fetchedManager))
            }
        })
    }

    const handleChange = (event) => {
        setManager({ ...manager, [event.target.name]: event.target.value})
    }


    return (
        <div className="min-h-screen flex items-center justify-center pb-30 pr-7 bg-blue-50">
            <div className="bg-blue-100 shadow-md rounded p-8">
            {errors.length > 0 && <ul id="errors">
                {errors.map(error => <li className="mb-4 text-red-600" key={error}>{error}</li>)}
            </ul>}

            <h2 className="text-2xl font-bold text-center text-blue-900 mb-6">Log In</h2>
            <div></div>
            <form onSubmit={handleSubmit}>
                <div>
                    <label className="block font-bold mb-1" htmlFor="username-input">Username: </label>
                    <input 
                    className="w-full border border-blue-400 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-black mb-1"
                    required
                    name="username" id="username-input" type="text" value={manager.username} onChange={handleChange} />
                </div>

                <div>
                    <label htmlFor="password-input" className="block font-bold mb-1">Password: </label>
                    <input 
                    required
                    className="w-full border border-blue-400 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-black mb-10"
                    name="password" id="password-input" type="password" value={manager.password} onChange={handleChange} />
                </div>

                <div>
                    <button className="px-4 py-2 bg-blue-900 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300" 
                    type="submit">Log In</button>
                </div>
            </form>
            </div>
        </div>
    )
}