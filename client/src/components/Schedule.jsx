import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from "@fullcalendar/daygrid"
import { useEffect, useState } from 'react'


function getLocalDateString(date){
    const tzOffset = date.getTimezoneOffset() * 60000
    return new Date(date.getTime() - tzOffset).toISOString().split("T")[0]
}


export default function Schedule(){
    const [scheduleData, setScheduleData] = useState({})
    const [modalOpen, setModalOpen] = useState(false)
    const [modalContent, setModalContent] = useState(null)

    const totalSeats = 3

    useEffect(() => {
        fetch("http://localhost:8080/api/schedule")
        .then(res => res.json())
        .then(data => {
            const grouped = {};
            data.forEach(schedule => {
                const date = schedule.scheduleDate;
                if(!grouped[date]){
                    grouped[date] = []
                }
                grouped[date].push(schedule)
            })
            setScheduleData(grouped)
        })
        .catch(err => console.error("Error fethcing schedule data", err))
    }, [])

    const handleDayClick = (arg) => {
        const dateStr = getLocalDateString(arg.date)
        const schedules = scheduleData[dateStr] || [];
        setModalContent({date: dateStr, schedules})
        setModalOpen(true)
    }

    const renderDayCellContent = (arg) => {
        const dateStr = getLocalDateString(arg.date)
        const schedules = scheduleData[dateStr] || []
        const count = schedules.length
        const isFull = count>= totalSeats;

        const dotColor = isFull ? "bg-red-500" : "bg-green-500"

        const tooltipText = schedules.length > 0
        ? schedules.map(s => `${s.employee.firstName} ${s.employee.lastName}  (Seat: ${s.seat.seat})`).join(', ')
        : "No employees scheduled"

        return(
            <div className='relative'>
                <div>{arg.dayNumberText}</div>
                {count > 0 && (
                    <div title={tooltipText} className={`w-3 h-3 rounded-full ${dotColor} animate-pulse absolute top-1 left-1`}>
                    </div>
                )}
            </div>
        )
    }
    

    return(
        <div>
            <FullCalendar 
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            dayCellContent={renderDayCellContent}
            dateClick={handleDayClick}
            />

            {modalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="absolute inset-0 bg-black opacity-50" onClick={() => setModalOpen(false)}></div>
                    <div className="bg-white p-4 rounded shadow-lg z-50 transform transition-all duration-300 animate-fadeIn">
                        <h2 className="text-xl font-bold mb-2">Schedule for {modalContent.date}</h2>
                        <ul>
                            {modalContent.schedules.length > 0 ? (
                                modalContent.schedules.map(schedule => (
                                    <li key={schedule.scheduleId}>
                                        {schedule.employee.firstName} {schedule.employee.lastName} - Seat: {schedule.seat.seat}
                                    </li>
                                ))
                            ):( <li>No employees scheduled</li>
                            )}
                        </ul>
                        <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded" onClick={() => setModalOpen(false)}>Close</button>
                    </div>
                </div>
            )}
        </div>
    )
}