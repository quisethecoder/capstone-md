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
        <div>
            <h2>{choose === "login" ? "Log In" : "Sign Up"}</h2>
            <p>Are you a manager or an Employee?</p>
            <div>
            <button className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300" onClick={handleEmployeeClick}>Employee</button>
            <button className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300" onClick={handleManagerCLick}>Manager</button>
            </div>
        </div>
    )


}