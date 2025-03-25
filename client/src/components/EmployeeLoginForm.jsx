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
        <div className="min-h-screen flex items-center justify-center pb-30 pr-7 bg-blue-50">
            <div className="bg-blue-100 shadow-md rounded p-8">
            {errors.length > 0 && <ul id="errors">
                {errors.map(error => <li className="mb-4 text-red-600" key={error}>{error}</li>)}
            </ul>}

            <h2 className="text-2xl font-bold text-center text-blue-900 mb-6">Log In</h2>
            <div></div>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="username-input" className="block font-bold mb-1">Username </label>
                    <input 
                    className="w-full border border-blue-400 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-black mb-1"
                    name="username" 
                    id="username-input" 
                    type="text" 
                    value={employee.username} 
                    onChange={handleChange} 
                    required
                    />
                </div>

                <div>
                    <label htmlFor="password-input" className="block font-bold mb-1">Password </label>
                    <input 
                    className="w-full border border-blue-400 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-black mb-10"
                    required
                    name="password" id="password-input" type="password" value={employee.password} onChange={handleChange} />
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