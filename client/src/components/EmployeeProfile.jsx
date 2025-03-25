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
        setRefreshTrigger(prev => prev + 1)
    }

    return (
        <div >
            <div >
                <EmployeeScheduleForm employeeId={employeeId} onNewSchedules={handleNewSchedules} />
            </div>
            <div>
                <EmployeeDaysOnsite employeeId={employeeId} refreshTrigger={refreshTrigger} />
            </div>
        </div>
    )
}