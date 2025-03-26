import { useEffect, useState } from "react"

function parseLocalDate(dateStr){
    const [year, month, day] = dateStr.split("-").map(Number)
    return new Date(year, month -1, day)
}

const formatDate = (dateStr) => {
    const date = parseLocalDate(dateStr)
    const weekday = date.toLocaleDateString("en-US", {weekday: "long"})
    const month = date.getMonth() + 1
    const day = date.getDate()
    const year = date.getFullYear()
    return {weekday, formattedDate: `${month}-${day}-${year}`}
}



export default function EmployeeDaysOnsite({employeeId, refreshTrigger}){
    const [schedules, setSchedules] = useState([])
    const [seatOptions, setSeatOptions] = useState([])
    const [editModalOpen, setEditModalOpen] = useState(false)
    const [editedSchedule, setEditedSchedule] = useState(null)

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


    useEffect(() => {
        fetch("http://localhost:8080/api/seats")
        .then((res) => res.json())
        .then((data) => setSeatOptions(data))
        .catch((err) => console.error("Error fetching seats", err))
    }, [])

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

    const openEditModal = (schedule) => {
        setEditedSchedule(schedule)
        setEditModalOpen(true)
    }

    const handleEditChange = (field, value) => {
        setEditedSchedule({ ...editedSchedule, [field]: value})
    }

    const handleEditSeatChange = (newSeatId) =>{
            const selectedSeat = seatOptions.find(
                (seat) => seat.seatId === parseInt(newSeatId) 
            )
        if(selectedSeat){
            setEditedSchedule({
                ...editedSchedule,
                seat: {seatId: selectedSeat.seatId, seat: selectedSeat.seat}
            })
        }
    }

    const submitEdit = () =>{
        fetch(`http://localhost:8080/api/schedule/${editedSchedule.scheduleId}`, {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(editedSchedule),
        })
        .then((res) => {
            if(!res.ok){
                throw new Error("Failed tp update schedule")
            }
            setSchedules((prev) => 
            prev.map((s) => 
            s.scheduleId === editedSchedule.scheduleId ? editedSchedule : s
            )
            )
            setEditModalOpen(false)
            setEditedSchedule(null)
        })
        .catch((err) => console.error("Error updating schedule", err))
    }


    return(
        <div className="mt-8 ml-8 mr-20">
            <h2 className="text-4xl text-blue-900 font-bold mb-4"> My Onsite Days</h2>
            <div className="space-y-3">
               {schedules.map((schedule) =>{
                const {weekday, formattedDate} = formatDate(schedule.scheduleDate)
                return(
                    <div key={schedule.scheduleId} className="border p-4 rounded flex justify-between items-center bg-blue-100 shadow-md">
                        <div>
                            <div>
                                <div className="text-2xl font-extrabold text-blue-900">{weekday}</div>
                                <div className="text-md align-bottom ml-1">{formattedDate}</div>
                            </div>
                            <div className="text-md font-medium text-gray-800 mt-3">
                                {schedule.employee.firstName} {schedule.employee.lastName}
                            </div>
                            <div className="text-sm text-gray-600">{schedule.seat.seat}</div>
                        </div>
                        <div className="space-x-2">
                            <button onClick={() => openEditModal(schedule)} className="px-2 py-1 bg-yellow-500 font-semibold text-white rounded hover:bg-yellow-600 transition"> 
                                Edit
                            </button>
                            <button onClick={() => handleDelete(schedule.scheduleId)} className="px-2 py-1 bg-red-500 font-semibold text-white rounded hover:bg-red-600 transition"> 
                                Delete
                            </button>
                        </div>
                    </div>
                )
               })}
            </div>
            {editModalOpen && editedSchedule && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="absolute inset-0 bg-black opacity-50"></div>
                    <div className="bg-blue-50 p-6 rounded shadow-lg z-50 w-full max-w-md">
                        <h3 className="text-3xl text-blue-900 font-bold mb-4">Edit Schedule</h3>
                        <div className="mb-4">
                            <label className="block font-semibold mb-1">Select Day</label>
                            <input type="date" value={editedSchedule.scheduleDate} onChange={(e) =>
                                handleEditChange("scheduleDate", e.target.value)
                            }
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block font-semibold mb-1">Select Seat</label>
                            <select 
                            value={editedSchedule.seat.seatId}
                            onChange={(e) => handleEditSeatChange(e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                            >
                                <option value="">Select a seat</option>
                                {seatOptions.map((seat) => (
                                    <option key={seat.seatId} value={seat.seatId}>
                                        {seat.seat}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex justify-end space-x-2">
                            <button onClick={() => setEditModalOpen(false)} className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-400 transition">
                                cancel
                            </button>
                            <button onClick={submitEdit} className="px-4 py-2 bg-blue-900 text-white rounded hover:bg-blue-800 transition">
                                Save
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </div>
    )
}