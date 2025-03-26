import { useEffect, useState } from "react"





export default function ManagerCheckEmployeeOnSchedule({managerId}){
    const [employees, setEmployees] = useState([])
    const [schedules, setSchedules] = useState([])

    useEffect(() => {
        fetch(`http://localhost:8080/api/employees/manager/list/${managerId}`)
        .then((res) => res.json())
        .then((data) => setEmployees(data))
        .catch((err) => console.error("Error fetching employees", err))

        fetch(`http://localhost:8080/api/schedule`)
        .then((res) => res.json())
        .then((data) => setSchedules(data))
        .catch((err) => console.error("Error fetching schedules", err))
    }, [managerId])

    const today = new Date()
    const currentMonth = today.getMonth()
    const currentYear = today.getFullYear()

    const schedulesThisMonth = schedules.filter((s) => {
        const d = new Date(s.scheduleDate)
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear
    })

    const scheduleEmployeeIds = new Set(
        schedulesThisMonth.map((s) => s.employee.employeeId)
    )

    const employeeScheduleId = employees.filter((e) => 
        scheduleEmployeeIds.has(e.employeeId)
    )

    const employeeNotScheduled = employees.filter((e) =>
    !scheduleEmployeeIds.has(e.employeeId)
    )

    const monthYearHeader = today.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
    })



    return (
        <div className="p-4 bg-blue-100 rounded shadow mb-4 cursor-default">
            <h2 className="text-3xl font-bold mb-7 text-blue-900">Employees Scheduled for {monthYearHeader}</h2>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <h3 className="text-lg font-semibold mb-2">Scheduled</h3>
                    <ul className="space-y-1">
                        {employeeScheduleId.length > 0 ? (
                            employeeScheduleId.map((e) => (
                                <li key={e.employeeId} className="border border-gray-300 p-2 rounded bg-green-100 shadow-sm">{e.firstName} {e.lastName}</li>
                            ))
                        ) : (
                            <li className="text-sm text-gray-500">No employees scheduled</li>
                        )}
                    </ul>
                </div>
                <div>
                    <h3 className="text-lg font-semibold mb-2">Not Scheduled</h3>
                    <ul className="space-y-1">
                        {employeeNotScheduled.length > 0 ? (
                            employeeNotScheduled.map((e) => (
                                <li key={e.employeeId} className="border border-gray-300 p-2 rounded bg-red-100 shadow-sm">{e.firstName} {e.lastName}</li>
                            ))
                        ) : (
                            <li className="text-sm text-gray-500">All employees scheduled</li>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    )
}