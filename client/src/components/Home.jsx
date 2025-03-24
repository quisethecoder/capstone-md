import HuddleLeader from "./HuddleLeader";
import TodayTomorTable from "./TodayTomorTable";
import WeeklyScheduleTable from "./WeeklyScheduleTable";



export default function Home() {
    return (
        <div className="max-w-8xl mx-auto p-10 flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-1 bg-blue-50">
            <div className="md:w-1/4">
                <TodayTomorTable />
            </div>
            <div className="md:w-3/4">
                <WeeklyScheduleTable />
            </div>

            {/* <HuddleLeader/> */}

        </div>


    )
}