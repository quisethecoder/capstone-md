import { useState } from "react";
import EmployeeDaysOnsite from "./EmployeeDaysOnsite";
import EmployeeScheduleForm from "./EmployeeScheduleForm";
import Schedule from "./Schedule";


export default function EmployeeProfile({ loggedInEmployee }) {

    if (!loggedInEmployee) {
        return <div>Please log in to view your profile</div>
    }

    const employeeId = loggedInEmployee.employeeId

    const [refreshTrigger, setRefreshTrigger] = useState(0)

    const handleNewSchedules = (newSchedules) => {
        setRefreshTrigger((prev) => prev + 1)
    }

    return (
        <div className="min-h-screen max-w-7xl mx-auto p-4 bg-blue-50">
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4" >
                <div className="md:w-1/3 pt-22">
                    <EmployeeScheduleForm employeeId={employeeId} onNewSchedules={handleNewSchedules} />
                </div>
                <div className="md:w-2/3">
                    <EmployeeDaysOnsite employeeId={employeeId} refreshTrigger={refreshTrigger} />
                </div>
            </div>
        </div>
    )
}