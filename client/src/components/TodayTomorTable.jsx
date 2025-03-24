import { useEffect, useState } from "react"

function formatDate(date) {
    const month = (date.getMonth() + 1).toString()
    const day = date.getDate().toString().padStart(2, "0")
    const year = date.getFullYear()
    return `${month}-${day}-${year}`
}

function getLocalDateString(date) {
    const tzOffset = date.getTimezoneOffset() * 60000
    return new Date(date.getTime() - tzOffset).toISOString().split("T")[0]
}


export default function TodayTomorTable() {
    const [todaySchedules, setTodaySchedules] = useState([])
    const [tomorrowSchedules, setTomorrowSchedules] = useState([])

    useEffect(() => {
        const today = new Date()
        const todayStr = getLocalDateString(today)

        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1)
        const tomorrowStr = getLocalDateString(tomorrow)

        fetch(`http://localhost:8080/api/schedule/date/${todayStr}`)
            .then((res) => res.json())
            .then((data) => setTodaySchedules(data))
            .catch((err) => console.error("Error getting today's schedule: ", err))

        fetch(`http://localhost:8080/api/schedule/date/${tomorrowStr}`)
            .then((res) => res.json())
            .then((data) => setTomorrowSchedules(data))
            .catch((err) => console.error("Error fetching tomorrow's schedule: ", err))

    }, [])

    return (
        <div className="border border-gray-300 rounded shadow p-4 bg-blue-100 mt-11 cursor-default">
            <div className="mb-6">
                <h2 className="text-xl font-bold mb-1">Onsite Today</h2>
                <p className="text-sm text-gray-600 mb-5">{formatDate(new Date())}</p>
                <ul className="list-inside space-y-2">
                    {todaySchedules.length > 0 ? (
                        todaySchedules.map((schedule) => (
                            <li key={schedule.scheduleId}>
                                <span className="font-semibold">{schedule.employee.firstName} {schedule.employee.lastName}</span>
                                {" - "}
                                <span className="text-sm text-gray-800">Seat: {schedule.seat.seat}</span>

                            </li>
                        ))

                    ) : (
                        <li>No employees scheduled for today.</li>
                    )}
                </ul>
            </div>
            <div>
                <h2 className="text-xl font-bold mb-1">Onsite Tomorrow</h2>
                <p className="text-sm text-gray-600 mb-5">{formatDate(new Date(new Date().setDate(new Date().getDate() + 1)))}</p>
                <ul className="list-inside space-y-2">
                    {tomorrowSchedules.length > 0 ? (
                        tomorrowSchedules.map((schedule) => (
                            <li key={schedule.scheduleId}>
                                <span className="font-semibold">{schedule.employee.firstName} {schedule.employee.lastName}</span>
                                {" - "}
                                <span className="text-sm text-gray-800">Seat: {schedule.seat.seat}</span>
                            </li>
                        ))

                    ) : (
                        <li>No employees scheduled for tomorrow.</li>
                    )}
                </ul>
            </div>
        </div>
    )
}