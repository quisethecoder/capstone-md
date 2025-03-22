import HuddleLeader from "./HuddleLeader";
import TodayTomorTable from "./TodayTomorTable";
import WeeklyScheduleTable from "./WeeklyScheduleTable";



export default function Home(){
    return(
        <div>
            <TodayTomorTable />
            <HuddleLeader/>
            <WeeklyScheduleTable />
        </div>
        
        
    )
}