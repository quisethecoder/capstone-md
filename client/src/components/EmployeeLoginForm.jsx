import { useState } from "react"
import { useNavigate} from "react-router-dom"
import { jwtDecode } from "jwt-decode"


export default function EmployeeFormLogin({setLoggedInEmployee}){
    const navigate = useNavigate()
   
       const [employee, setEmployee] = useState({
           username: "",
           password: ""
       })
   
       const [errors, setErrors] = useState([])

       const handleSubmit = (event) => {
        event.preventDefault()

        fetch("http://localhost:8080/api/employees/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(employee)
        })
        .then(response =>{
            if(response.status >= 200 && response.status < 300){
                response.json().then(fetchedEmployee => {
                    const employee = jwtDecode(fetchedEmployee.jwt)
                    employee.jwt = fetchedEmployee.jwt
                    setLoggedInEmployee(employee)
                    localStorage.setItem("loggedInEmployee", JSON.stringify(employee))
                    navigate("/")
                })
            }else{
                response.json().then(fetchedEmployee => setErrors(fetchedEmployee))
            }
        })
    }

    const handleChange = (event) => {
        setEmployee({ ...employee, [event.target.name]: event.target.value})
    }
   
   
    return(
        <div>
            {errors.length > 0 && <ul id="errors">
                {errors.map(error => <li key={error}>{error}</li>)}
            </ul>}

            <h2>Login</h2>
            <div></div>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="username-input">Username: </label>
                    <input name="username" id="username-input" type="text" value={employee.username} onChange={handleChange} />
                </div>

                <div>
                    <label htmlFor="password-input">Password: </label>
                    <input name="password" id="password-input" type="password" value={employee.password} onChange={handleChange} />
                </div>

                <div>
                    <button className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300" 
                    type="submit">Log In</button>
                </div>
            </form>
        </div>
    )
}