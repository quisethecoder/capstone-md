import { useNavigate, useNavigation, useParams } from "react-router-dom";


export default function ChooseRoute(){
    const {choose} = useParams()
    const navigate = useNavigate()


    const handleEmployeeClick = () => {
        if (choose === "login"){
            navigate("/employeelogin")
        }else if(choose === "signup"){
            navigate("/employeesignup")
        }
    }

    const handleManagerCLick = () => {
        if(choose === "login"){
            navigate("/managerlogin")
        }else if(choose === "signup"){
            navigate("/managersignup")
        }
    }

    return(
        <div className="min-h-screen flex items-center justify-center pb-50 pr-7 bg-blue-50">
            <div className="bg-blue-100 shadow-md rounded p-8 text-center">
            <h2 className="text-2xl font-bold mb-4 text-blue-900">{choose === "login" ? "Log In" : "Sign Up"}</h2>
            <p className="mb-6 text-blue-900">Are you a manager or an employee?</p>
            <div className="space-x-5">
            <button className="px-4 py-2 bg-blue-900 text-white font-semibold rounded-lg hover:bg-blue-800 transition duration-300" onClick={handleEmployeeClick}>Employee</button>
            <button className="px-4 ml-2 py-2 bg-blue-900 text-white font-semibold rounded-lg hover:bg-blue-800 transition duration-300" onClick={handleManagerCLick}>Manager</button>
            </div>
            </div>
        </div>
    )
}