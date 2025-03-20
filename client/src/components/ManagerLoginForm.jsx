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
        <div>
            {errors.length > 0 && <ul id="errors">
                {errors.map(error => <li key={error}>{error}</li>)}
            </ul>}

            <h2>Login</h2>
            <div></div>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="username-input">Username: </label>
                    <input name="username" id="username-input" type="text" value={manager.username} onChange={handleChange} />
                </div>

                <div>
                    <label htmlFor="password-input">Password: </label>
                    <input name="password" id="password-input" type="password" value={manager.password} onChange={handleChange} />
                </div>

                <div>
                    <button className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300" 
                    type="submit">Log In</button>
                </div>
            </form>
        </div>
    )
}