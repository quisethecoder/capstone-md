import { useEffect, useState } from "react"

function getLocalDateString(date){
    const tzOffset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - tzOffset).toISOString().split("T")[0]
}

function formatDate(date){
    const month = (date.getMonth() + 1).toString()
    const day = date.getDate().toString().padStart(2,"0")
    const year = date.getFullYear()
    return `${month}-${day}-${year}`
}

function getDaySuffix(day){
    if(day >= 11 && day <= 13){
        return "TH"
    }

    switch(day % 10){
        case 1: return "ST";
        case 2: return "ND";
        case 3: return "RD";
        default: return "TH";
    }
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
        <div className="p-4 bg-blue-50 mt-5 cursor-default">
            <h1 className="text-7xl font-bold ml-3 text-blue-900">{monthHeader}</h1>

            <div className="grid grid-cols-5 gap-4">
                {weeklySchedules.map((dayData, index) => {
                    const dayNumber = dayData.date.getDate()
                    const daySuffix = getDaySuffix(dayNumber)
                    const dayName = dayData.date.toLocaleDateString("en-us", {
                        weekday: "long",
                    })


                    return(
                        <div key={index} className="p-4">
                            <div className="text-7xl font-extrabold text-blue-900">
                                {dayNumber}
                                <span className="text-lg align-bottom ml-1">{daySuffix}</span>
                            </div>
                            <div className="text-sm font-semibold text-gray-700 uppercase">
                                {dayName}
                            </div>
                            <div className="mt-4 space-y-2">
                                {dayData.schedules.length > 0 ? (
                                    dayData.schedules.map((schedule) => (
                                        <div key={schedule.scheduleId} className="flex flex-col ">
                                            <div className="text-sm font-medium text-gray-800">
                                                {schedule.employee.firstName} {schedule.employee.lastName}
                                            </div>
                                            <div className="text-xs text-gray-600">
                                                Seat: {schedule.seat.seat}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-sm text-gray-500">
                                        No employees scheduled.
                                    </div>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}