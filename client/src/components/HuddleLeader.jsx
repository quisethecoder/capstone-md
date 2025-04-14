import { useEffect, useState } from "react"



function shuffleArray(array) {
   const arr = [...array]
   for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
   }
   return arr;
}


export default function HuddleLeader() {
   const [fullEmployees, setFullEmployees] = useState([])
   const [availableEmployees, setAvailableEmployees] = useState([])
   const [thisWeek, setThisWeek] = useState({ HB: null, PB: null })
   const [nextWeek, setNextWeek] = useState({ HB: null, PB: null })


   useEffect(() => {
      fetch("http://localhost:8080/api/employees")
         .then((res) => res.json())
         .then((data) => {
            setFullEmployees(data)
            setAvailableEmployees(data)
         })
         .catch((err) => console.error("Error fetching employees", err))
   }, [])

   const getRandomPair = () => {
      let avail = [...availableEmployees]
      if (avail.length < 2) {
         avail = [...fullEmployees]
      }
      const shuffled = shuffleArray(avail)
      const pair = [shuffled[0], shuffled[1]]

      const remaining = availableEmployees.filter(
         (e) => e.employeeId !== pair[0].employeeId && e.employeeId !== pair[1].employeeId
      )

      setAvailableEmployees(remaining.length > 0 ? remaining : [...fullEmployees])
      return pair
   }

   const generateHuddleLeaders = () => {
      const pair1 = getRandomPair()
      const pair2 = getRandomPair()
      setThisWeek({ HB: pair1[0], PB: pair1[1] })
      setNextWeek({ HB: pair2[0], PB: pair2[1] })
   }

   useEffect(() => {
      if (fullEmployees.length > 0) {
         generateHuddleLeaders()
      }
   }, [fullEmployees])

   const advanceWeek = () => {
      setThisWeek(nextWeek)
      const newPair = getRandomPair()
      setNextWeek({HB: newPair[0], PB: newPair[1]})
   }


   return (
      <div className="p-4 bg-blue-100 rounded shadow mb-4">
         <h2 className="text-3xl font-bold text-blue-900 mb-4 text-center">Huddle Leader</h2>
         <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 border border-gray-300 p-4 rounded bg-blue-50 shadow">
               <h3 className="text-xl font-semibold text-blue-900 mb-2 text-center">This Week</h3>
               <div className="mb-2">
                  <span className="font-bold">HB:</span> {" "}
                  {thisWeek.HB ? `${thisWeek.HB.firstName} ${thisWeek.HB.lastName}` : "N/A"}
               </div>
               <div>
                  <span className="font-bold">PB:</span> {" "}
                  {thisWeek.PB ? `${thisWeek.PB.firstName} ${thisWeek.PB.lastName}` : "N/A"}
               </div>
            </div>
         </div>
         <div className="flex-1 border p-4 rounded bg-white shadow">
            <h3 className="text-xl font-semibold text-blue-900 mb-2 text-center">Next Week</h3>
            <div className="mb-2">
               <span className="font-bold">HB:</span> {" "}
               {nextWeek.HB ? `${nextWeek.HB.firstName} ${nextWeek.HB.lastName}` : "N/A"}
            </div>
            <div>
               <span className="font-bold">PB:</span> {" "}
               {nextWeek.PB ? `${nextWeek.PB.firstName} ${nextWeek.PB.lastName}` : "N/A"}
            </div>
         </div>
      </div>
   )
}