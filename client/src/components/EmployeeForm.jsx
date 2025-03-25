import { useEffect, useState } from "react"
import { useNavigate} from "react-router-dom"
import { jwtDecode } from "jwt-decode"



export default function EmployeeForm({setLoggedInEmployee}){
    const navigate = useNavigate()

    const [employee, setEmployee] = useState({
        firstName: "",
        lastName: "",
        username: "",
        password: "",
        manager: {managerId: ""}
    })

    const [managers, setManagers] = useState([])
    const [errors, setErrors] = useState([])

    useEffect(() => {
        fetch("http://localhost:8080/api/managers")
        .then(response => response.json())
        .then(m => setManagers(m))
        .catch(error => console.error("Error fetching managers:", error))
    }, [])

    const payload = {
        ...employee,
        manager: {managerId: Number(employee.manager.managerId)}
    }
    console.log(payload)


    const handleSubmit = (event) => {
        event.preventDefault()

        fetch("http://localhost:8080/api/employees", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                ...employee,
                manager: {managerId: Number(employee.manager.managerId)}
            })
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
        const {name, value} = event.target;

        if(name === "manager"){
            setEmployee({ ...employee, manager: {managerId: value}})
        }else{
            setEmployee({ ...employee, [name]: value})
        }
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
                    name="firstName" 
                    id="firstname-input" 
                    type="text" 
                    value={employee.firstName} 
                    onChange={handleChange} 
                    required
                    />
                </div>

                <div>
                    <label htmlFor="lastname-input" className="block font-bold mb-1">Last Name </label>
                    <input 
                    className="w-full border border-blue-400 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-black mb-1" 
                    name="lastName" 
                    id="laststname-input" 
                    type="text" 
                    value={employee.lastName} 
                    onChange={handleChange} 
                    required
                    />
                </div>

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
                    className="w-full border border-blue-400 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-black mb-1" 
                    name="password" 
                    id="password-input" 
                    type="password" 
                    value={employee.password} 
                    onChange={handleChange} 
                    required
                    />
                </div>

                <div>
                    <label htmlFor="managerId-input" className="block font-bold mt-4 mb-1">Manager </label>
                    <select 
                    name="manager" 
                    id="managerId-input" 
                    value={employee.manager.managerId} 
                    onChange={handleChange}
                    className="w-full border border-blue-400 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-black mb-15" 
                    >
                    <option value="">Select your manager</option>
                    {managers.map(manager => (
                        <option key={manager.managerId} value={manager.managerId}>
                            {manager.firstName}
                        </option>
                    ))}
                    </select>
                </div>

                <div>
                    <button className="px-4 py-2 bg-blue-900 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300" 
                    type="submit">Sign Up</button>
                </div>
            </form>
            </div>
        </div>
    )
}