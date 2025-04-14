import { useEffect, useState } from 'react'


function getLocalDateString(date) {
    const tzOffset = date.getTimezoneOffset() * 60000
    return new Date(date.getTime() - tzOffset).toISOString().split("T")[0]
}


function generateCalendarDays(year, month) {
    const days = []
    const firstDay = new Date(year, month, 1)
    const startWeekday = firstDay.getDay()

    for (let i = 0; i < startWeekday; i++) {
        days.push(null)
    }

    const lastDay = new Date(year, month + 1, 0)
    const numDays = lastDay.getDate()

    for (let d = 1; d <= numDays; d++) {
        days.push(new Date(year, month, d))
    }

    while (days.length % 7 !== 0) {
        days.push(null)
    }
    return days;

}



export default function Schedule() {
    const today = new Date()
    const [scheduleData, setScheduleData] = useState({})
    const [modalOpen, setModalOpen] = useState(false)
    const [modalContent, setModalContent] = useState(null)
    const [currentYear, setCurrentYear] = useState(today.getFullYear())
    const [currentMonth, setCurrentMonth] = useState(today.getMonth())

    const days = generateCalendarDays(currentYear, currentMonth)
    
    const totalSeats = 5

    useEffect(() => {
        fetch("http://localhost:8080/api/schedule")
            .then(res => res.json())
            .then(data => {
                const grouped = {};
                data.forEach(schedule => {
                    const date = schedule.scheduleDate;
                    if (!grouped[date]) {
                        grouped[date] = []
                    }
                    grouped[date].push(schedule)
                })
                setScheduleData(grouped)
            })
            .catch(err => console.error("Error fethcing schedule data", err))
    }, [])

    const handleDayClick = (date) => {
        const dateStr = getLocalDateString(date)
        const schedules = scheduleData[dateStr] || [];
        setModalContent({ date: dateStr, schedules })
        setModalOpen(true)
    }

    const renderDayCell = (date, index) => {
        if (!date) {
            return <div key={index} className="p-2 border border-gray-200 min-h-[70px]"></div>
        }

        const dateStr = getLocalDateString(date)
        const schedules = scheduleData[dateStr] || []
        const count = schedules.length
        const isFull = count >= totalSeats;

        const dotColor = isFull ? "bg-red-500" : "bg-green-500"

        const tooltipText = schedules.length > 0
            ? schedules.map(s => `${s.employee.firstName} ${s.employee.lastName}  (Seat: ${s.seat.seat})`).join(', ')
            : "No employees scheduled"

        return (
            <div key={index} className="p-2 border border-gray-200 relative cursor-pointer hover:bg-blue-100 min-h-[70px]" onClick={() => handleDayClick(date)} title={tooltipText}>
                <div className="text-sm font-semibold">{date.getDate()}</div>
                <div title={tooltipText} className={`w-3 h-3 rounded-full ${dotColor} animate-pulse absolute bottom-1 right-1`}></div>
            </div>
        )
    }

   
   const headerDate = new Date(currentYear, currentMonth, 1)
   const monthHeader = new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
   }).format(headerDate)

   const previousMonth = () => {
    if(currentMonth === 0){
        setCurrentYear((prev) => prev - 1)
        setCurrentMonth(11)
    }else{
        setCurrentMonth((prev) => prev - 1)
    }
   }

   const nextMonth = () => {
    if(currentMonth === 11){
        setCurrentYear((prev) => prev + 1)
        setCurrentMonth(0)
    }else{
        setCurrentMonth((prev) => prev + 1)
    }
   }



    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-blue-50 pb-5 pt-7">
            <div className="w-full max-w-4xl p-4 bg-indigo-200 shadow-lg rounded">
                <div className="flex items-center justify-between mb-4">
                    <div className="w-1/4"></div>
                <h1 className="text-5xl text-blue-900 font-bold text-center flex-1 mr-29 mb-4">
                    {monthHeader}
                </h1>
                <button onClick={previousMonth} className="px-2 py-2 text-indigo-200 text-xl bg-blue-900 rounded shadow-lg">
                    &larr;
                </button>
                <button onClick={nextMonth} className="px-2 py-2 text-indigo-200 text-xl bg-blue-900 rounded shadow-lg ml-1 mr-1">
                    &rarr;
                </button>
                </div>


                <div className="grid grid-cols-7 text-center font-bold">
                    {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((day, idx) => (
                        <div key={idx} className="p-2">
                            {day}
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                    {days.map((date, idx) => renderDayCell(date, idx))}
                </div>
                {modalOpen && modalContent && (
                    <div className="fixed inset-0 flex items-center justify-center z-50">
                        <div className="absolute inset-0 bg-black opacity-50" onClick={() => setModalOpen(false)}></div>
                        <div className="bg-blue-100 p-4 rounded shadow-lg z-50 transform transition-all duration-300 max-h-[50vh] overflow-y-auto">
                            <h2 className="text-xl font-bold mb-2">Schedule for {modalContent.date}</h2>
                            <ul>
                                {modalContent.schedules.length > 0 ? (
                                    modalContent.schedules.map((schedule) => (
                                        <li key={schedule.scheduleId}>
                                            {schedule.employee.firstName} {schedule.employee.lastName} - Seat:{" "} {schedule.seat.seat}
                                        </li>
                                    ))
                                ) : (
                                    <li>No emplooyees scheduled</li>
                                )}
                            </ul>
                            <button className="mt-4 px-4 py-2 bg-blue-900 text-white rounded" onClick={() => setModalOpen(false)}>Close</button>
                        </div>
                     </div>
                )}

            </div>
        </div>
    )
}