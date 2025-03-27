import { useEffect, useState } from "react"





export default function ManagerCheckEmployeeOnSchedule({managerId}){
    const [employees, setEmployees] = useState([])
    const [schedules, setSchedules] = useState([])
    
    const today = new Date()
    const [filterMonth, setFilterMonth] = useState(today.getMonth())
    const [filterYear, setFilterYear] = useState(today.getFullYear())



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

    const schedulesThisMonth = schedules.filter((s) => {
        const d = new Date(s.scheduleDate)
        return d.getMonth() === filterMonth && d.getFullYear() === filterYear
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

    const headerDate = new Date(filterYear, filterMonth, 1)
    const monthYearHeader = new Intl.DateTimeFormat("en-US", {
        month: "long",
        year: "numeric",
    }).format(headerDate)

    const previousMonth = () => {
        if(filterMonth === 0){
            setFilterYear(filterYear - 1)
            setFilterMonth(11)
        }else{
            setFilterMonth(filterMonth - 1)
        }
    }

    const nextMonth = () => {
        if(filterMonth === 11){
            setFilterYear(filterYear + 1)
            setFilterMonth(0)
        }else{
            setFilterMonth(filterMonth + 1)
        }
    }



    return (
        <div className="p-4 bg-indigo-200 rounded shadow  cursor-default">
            <div className="flex item-center justify-between mb-4">
            <h2 className="text-3xl font-bold mb-1 text-blue-900">Employees Scheduled for {monthYearHeader}</h2>
            <div className="flex space-x-1">
                <button onClick={previousMonth} className="px-2 py-0 bg-blue-900 text-indigo-100 rounded hover:bg-blue-800 transition text-xl">
                    &larr;
                </button>
                <button onClick={nextMonth} className="px-2 py-0 bg-blue-900 text-indigo-100 rounded hover:bg-blue-800 transition text-xl">
                    &rarr;
                </button>  
            </div>
            </div>
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