import { useEffect, useState } from "react"



export default function EmployeeDaysOnsite({employeeId, refreshTrigger}){

    const [schedules, setSchedules] = useState([])

    useEffect(() => {
        if(!employeeId){
            console.log("employeeId is undefined")
            return;
        }
        fetch(`http://localhost:8080/api/schedule/employee/${employeeId}`)
        .then(res => res.json())
        .then(data => {
            console.log("Fetched data: ", data)
            if(Array.isArray(data)){
                const sorted = data.sort((a,b) => new Date(a.scheduleDate) - new Date(b.scheduleDate))
                setSchedules(sorted) 
            }else{
                console.error("Expected an array but got:", data)
            }
            
        })
        .catch(err => console.error("Error fetching employee schedules", err))
    }, [employeeId, refreshTrigger])

    const handleDelete = (scheduleId) => {
        fetch(`http://localhost:8080/api/schedule/${scheduleId}`, {
            method: 'DELETE',
        })
        .then(res => {
            if(!res.ok){
                throw new Error("Failed to delete schedule")
            }
            setSchedules(prev => prev.filter(s => s.scheduleId !== scheduleId))
        })
        .catch(err => console.error("Error deleting schedule", err))
    }

    const handleEdit = (schedule) => {
        const newDate = prompt("Enter new date (yyyy-mm-dd):", schedule.scheduleDate)
        const newSeat = prompt("Enter new seat: ", schedule.seat.seat)

        if(newDate && newSeat){
            const updatedSchedule = {...schedule, scheduleDate: newDate, seat: {...schedule.seat, seat: newSeat}}
            fetch(`http://localhost:8080/api/schedule/${schedule.scheduleId}`,{
                method: 'PUT',
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(updatedSchedule)
            })
            .then(res => {
                if(!res.ok){
                    throw new Error("Failed to update schedule")
                }
                setSchedules(prev => prev.map(s.scheduleId === schedule.scheduleId ? updatedSchedule : s))
            })
            .catch(err => console.error("Error updating schedule", err))
        }
    }

    function parseLocalDate(dateStr){
        const [year, month, day] = dateStr.split('-').map(Number)
        return new Date(year, month-1, day)
    }

    const formatDate = (dateStr) => {
        const date = parseLocalDate(dateStr)
        const dayNumber = date.getDate();
        const dayName = date.toLocaleDateString('default', {weekday: 'long'})
        return{dayNumber, dayName}
    }


    return(
        <div className="mt-8">
            <h2 className="text-xl font-bold mb-4"> My Onsite Days</h2>
            <div className="space-y-4">
                {schedules.map(schedule => {
                    const {dayNumber, dayName} = formatDate(schedule.scheduleDate)
                    return (
                        <div key={schedule.scheduleId} className="border p-4 rounded flex justify-between items-center">
                            <div>
                                <div className="text-lg font-semibold">
                                    {dayNumber} - {dayName}
                                </div>
                                <div>Name: {schedule.employee.firstName} {schedule.employee.lastName}</div>
                                <div>Seat: {schedule.seat.seat}</div>
                            </div>
                            <div className="space-x-2">
                                <button onClick={() => handleEdit(schedule)} className="px-2 py-1 bg-yellow-500 text-white rounded">Edit</button>
                                <button onClick={() => handleDelete(schedule.scheduleId)} className="px-2 py-1 bg-red-500 text-white rounded">Delete</button>
                            </div>
                        </div>
                    )
                })}

            </div>
        </div>
    )
}