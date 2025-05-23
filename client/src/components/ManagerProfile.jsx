import ManagerCheckEmployeeOnSchedule from "./ManagerCheckEmployeeOnSchedule"
import ManagerListOfEmployees from "./ManagerListOfEmployees"
import Schedule from "./Schedule";
import SeatsList from "./SeatsList"


export default function ManagerProfile({ loggedInManager }) {

    if (!loggedInManager) {
        return <div>Please log in as a manager to view profile</div>
    }


    const managerId = loggedInManager.managerId;

    return (
        <div className="min-h-screen bg-blue-50">
        <div className=" max-w-7xl mx-auto p-4" >
            <h1 className="text-6xl font-bold  text-blue-900 mb-10 mt-10 ml-5">Welcome, {loggedInManager.firstName}!</h1>
            <div className="flex flex-col md:flex-row gap-4 ml-5">
                <div className="md:w-1/3 space-y-4" >
                    <SeatsList />
                    <ManagerListOfEmployees managerId={managerId} />
                </div>
                <div className="md:w-2/3">
                    <ManagerCheckEmployeeOnSchedule managerId={managerId} />    
                    <Schedule />
                </div>

            </div>
        </div>
        </div>
    )
}