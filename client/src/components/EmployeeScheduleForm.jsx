import { useEffect, useState } from "react"



export default function EmployeeScheduleForm({employeeId, onNewSchedules}){

    const [entries, setEntries] = useState([{id: Date.now(), date: '', seatId: ''}])
    const [seatOptions, setSeatOptions] = useState([])

    useEffect(() => {
        fetch("http://localhost:8080/api/seats")
        .then(res => res.json())
        .then(data => {
            setSeatOptions(data)
        })
        .catch(err => console.error("Error fetching seats", err))
    }, [])

    const handleAddRow = () =>{
        setEntries([...entries, {id: Date.now(), date: '', seatId: ''}])
    }

    const handleRemoveRow = (id) =>{
        setEntries(entries.filter(entry => entry.id !== id))
    }

    const handleChange = (id, field, value) => {
        setEntries(entries.map(entry => entry.id === id ? {...entry, [field]: value} : entry))
    }

    const handleSubmit = (e) =>{
        e.preventDefault()

        const validEntries = entries.filter(entry => entry.date && entry.seatId)
        if(validEntries.length === 0) return;

        Promise.all(validEntries.map(entry => {

            const schedule = {
                employee: {employeeId},
                seat: {seatId: parseInt(entry.seatId)},
                scheduleDate: entry.date
            }
            return fetch("http://localhost:8080/api/schedule", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(schedule)
            })
            .then(res => {
                if(!res.ok){
                    throw new Error("Failed to create schedule")
                }
                return res.json()
            })
        }))
        .then(results => {
            onNewSchedules(results)
            setEntries([{id: Date.now(), date: '', seatId: ''}])
        })
        .catch(err => console.error("Error creating schedules", err))
    }


    return(
        <form onSubmit={handleSubmit} className="p-4 border border-gray-300 shadow rounded mb-4 bg-blue-100">
            <h2 className="text-2xl font-bold mb-4 text-blue-900">Schedule Your Onsite Days</h2> 
            {entries.map((entry, index) => (
            <div key={entry.id} className="flex items-center space-x-2 mb-1">
                <input
                type="date"
                value={entry.date}
                onChange={(e) => handleChange(entry.id, 'date', e.target.value)}
                className="border p-2 rounded"
                required
                />
                <select
                value={entry.seatId}
                onChange={(e) => handleChange(entry.id, 'seatId', e.target.value)}
                className="border p-2 rounded"
                required
                >
                    <option value="">Select Seat</option>
                    {seatOptions.map(seat => (
                        <option key={seat.seatId} value={seat.seatId}>
                            {seat.seat}
                        </option>
                    ))}
                </select>
                {entries.length > 1 && (
                    <button
                    type="button"
                    onClick={() => handleRemoveRow(entry.id)}
                    className="text-red-500 border rounded p-2 bg-red-300 font-bold">-</button>
                )}
                {index === entries.length -1 && (
                    <button
                    type="button"
                    onClick={handleAddRow}
                    className="text-green-500 border p-2 rounded bg-green-100 font-bold">+</button>
                )}
            </div>
            ))}
            <button type="submit" className="mt-4 w-full font-semibold py-2 bg-blue-900 text-white rounded hover:bg-blue-800 transition">Submit</button>
        </form>
    )
}