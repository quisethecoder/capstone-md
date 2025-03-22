import { useEffect, useState } from "react"

function getLocalDateString(date){
    const tzOffset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - tzOffset).toISOString().split("T")[0]
}

function formatDate(date){
    const month = (date.getMonth() + 1).toString().padStart(2,"0")
    const day = date.getDate().toString().padStart(2,"0")
    const year = date.getFullYear()
    return `${month}-${day}-${year}`
}


export default function WeeklyScheduleTable(){
    const [weeklySchedules, setWeeklySchedules] = useState([])

    useEffect(() => {
        const fetchDataForDay = async (date) => {

            const localDateStr = getLocalDateString(date)
            try{
                const response = await fetch(`http://localhost:8080/api/schedule/date/${localDateStr}`)
                const data = await response.json()
                return data
            }catch (error){
                console.error("Error fetching data for", isoDate, error)
                return[]
            }
        }

        const getWeeklySchedules = async () => {
            const schedules = []
            const startDate = new Date();
            for(let i = 0; i < 5; i++){
                const currentDate = new Date(startDate)
                currentDate.setDate(startDate.getDate() + i)
                const data = await fetchDataForDay(currentDate)
                schedules.push({date: currentDate, schedules: data})
            }
            setWeeklySchedules(schedules)
        }
        getWeeklySchedules()
    }, [])

    const monthHeader = new Intl.DateTimeFormat("en-US",{
        month: "long",
        year: "numeric"
    }).format(new Date())



    return(
        <div className="p-4">
            <h1 className="test-2xl font-bold mb-4">{monthHeader}</h1>
            <div className="flex justify-between space-x-4">
                {weeklySchedules.map((dayData, index) => (
                <div key={index} className="border border-blue-300 p-4 flex-1 mx-2">
                    <h3 className="text-xl font-semibold">{dayData.date.getDate()}</h3>
                    <p className="text-gray-500">{dayData.date.toLocaleDateString("en-US", {weekday: "long"})}</p>
                    <ul className="mt-2">
                        {dayData.schedules.length > 0 ? (
                            dayData.schedules.map((schedule) => (
                            <li key={schedule.scheduleId}>
                                {schedule.employee.firstName} {schedule.employee.lastName} Seat: {" "} {schedule.seat.seat}
                            </li>
                            ))
                        ) : (
                            <li>No employees scheduled.</li>
                        )}
                    </ul>
                </div>
                ))}

            </div>
        </div>
    )
}