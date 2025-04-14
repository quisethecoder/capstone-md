import { useEffect, useState } from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

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
    const [weekStartDate, setWeekStartDate] = useState(null)


    useEffect(() => {
        const today = new Date()
        const offset = today.getDay() === 0 ? -6 : 1 - today.getDay()
        const monday = new Date(today)
        monday.setDate(today.getDate() + offset)
        setWeekStartDate(monday)
    }, [])

    useEffect(() => {
        const fetchDataForDay = async (date) => {
            const localDateStr = getLocalDateString(date)
            try{
                const response = await fetch(`http://localhost:8080/api/schedule/date/${localDateStr}`)
                const data = await response.json()
                return data
            }catch (error){
                console.error("Error fetching data for", localDateStr, error)
                return[]
            }
        }

        const getWeeklySchedules = async () => {
            const schedules = []
            for(let i = 0; i < 5; i++){
                const currentDate = new Date(weekStartDate)
                currentDate.setDate(weekStartDate.getDate() + i)
                const data = await fetchDataForDay(currentDate)
                schedules.push({date: currentDate, schedules: data})
            }
            setWeeklySchedules(schedules)
        }
        getWeeklySchedules()
    }, [weekStartDate])

    let monthHeader = ""
    if(weekStartDate){
        const mondayHeader = new Intl.DateTimeFormat("en-us", {
            month: "long",
            year: "numeric",
        }).format(weekStartDate)
        
        const friday = new Date(weekStartDate)
        friday.setDate(weekStartDate.getDate() + 4)
        
        const fridayHeader = new Intl.DateTimeFormat("en-US", {
            month: "long",
            year: "numeric",
        }).format(friday)

        monthHeader = mondayHeader === fridayHeader ? mondayHeader : `${mondayHeader}/${fridayHeader}`;
    }

   


    return(
        <div className="p-4 bg-blue-50 mt-5 cursor-default">
            <div className="flex items-center justify-between">
            <h1 className="text-5xl font-bold ml-3 text-blue-900">{monthHeader}</h1>
            <div className="mr-8">
            <button onClick={() => {
                const newMonday = new Date(weekStartDate)
                newMonday.setDate(newMonday.getDate() - 7)
                setWeekStartDate(newMonday)
            }} className="px-2 py-0 text-blue-100 text-3xl bg-blue-900 rounded shadow-lg pb-1">&larr;</button>
            <button onClick={() => {
                const newMonday = new Date(weekStartDate)
                newMonday.setDate(newMonday.getDate() + 7)
                setWeekStartDate(newMonday)

            }} className="px-2 py-0 text-blue-100 text-3xl bg-blue-900 rounded shadow-lg pb-1 ml-1">&rarr;</button>
            </div>
            </div>

            <div className="grid grid-cols-5 gap-4">
                {weeklySchedules.map((dayData, index) => {
                    const dayNumber = dayData.date.getDate()
                    const daySuffix = getDaySuffix(dayNumber)
                    const dayName = dayData.date.toLocaleDateString("en-us", {
                        weekday: "long",
                    })


                    return(
                        <div key={index} className="p-4">
                            <div className="text-6xl font-extrabold text-blue-900">
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