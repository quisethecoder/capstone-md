

export default function ManagerProfile({loggedInManager}){

    if(!loggedInManager){
        return<div>Please log in as a manager to view profile</div>
    }

    return(
        <div>Manager profile is a work in progress</div>
    )
}