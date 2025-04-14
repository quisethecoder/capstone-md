import { useEffect, useState } from "react"



export default function SeatsList(){
    const [seats, setSeats] = useState([])
    const [modalOpen, setModalOpen] = useState(false)
    const [editingSeat, setEditingSeat] = useState(null)
    const [confirmDelete, setConfirmDelete] = useState(null)

    useEffect(() => {
        fetch("http://localhost:8080/api/seats")
        .then((res) => res.json())
        .then((data) => setSeats(data))
        .catch((err) => console.error("Error fetching seats", err))
    },[])

    const openEditModal = (seat) => {
        setEditingSeat(seat)
        setModalOpen(true)
    }

    const openAddModal = () => {
        setEditingSeat({seat: ""})
        setModalOpen(true)
    }

    const submitSeat = () => {
        if(editingSeat.seatId){
            fetch(`http://localhost:8080/api/seats/${editingSeat.seatId}`, {
                method: "PUT",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(editingSeat),
            })
            .then((res) => {
                if(!res.ok) throw new Error("Failed to update seat");
                setSeats((prev) => 
                    prev.map((s) =>
                    s.seatId === editingSeat.seatId ? editingSeat : s
                    ) 
                )
                setModalOpen(false)
                setEditingSeat(null)
            })
            .catch((err) => console.error("Error updating seat", err))
        }else{
            fetch("http://localhost:8080/api/seats", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(editingSeat),
            })
            .then((res) => {
                if(!res.ok) throw new Error("Failed to add seat");
                return res.json()
            })
            .then((newSeat) => {
                setSeats((prev) => [...prev, newSeat])
                setModalOpen(false)
                setEditingSeat(null)
            })
            .catch((err) => console.error("Error adding seat", err))
        }
    }

    const confirmDeleteSeat = (seat) =>{
        setConfirmDelete(seat)
    }

    const deleteSeat = () => {
        if(!confirmDelete) return;
        fetch(`http://localhost:8080/api/seats/${confirmDelete.seatId}`, {
            method: "DELETE",
        })
        .then((res) => {
            if(!res.ok) throw new Error("Failed to delete seat");
            setSeats((prev) => 
            prev.filter((s) => s.seatId !== confirmDelete.seatId)
            )
            setConfirmDelete(null)
        })
        .catch((err) => console.error("Error deleteing seat", err))
    }


    return(
        <div className="p-4 bg-blue-100 rounded shadow mb-4">
            <div className="flex flex-col md:flex-row gap-4 ">
            <h2 className="text-4xl font-bold text-blue-900">Seats List</h2>
            <button onClick={openAddModal} className="mb-5 mt-2 ml-26 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition">
                Add Seat
            </button>
            </div>
            <ul className="space-y-2">
                {seats.map((seat) => (
                    <li key={seat.seatId} className="flex justify-between items-center border border-gray-300 p-2 rounded bg-blue-50 shadow-sm">
                        <span >{seat.seat}</span>
                        <div className="space-x-2">
                            <button onClick={() => openEditModal(seat)} className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition">
                                Edit
                            </button>
                            <button onClick={() => confirmDeleteSeat(seat)} className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition">
                                Delete
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
            {modalOpen && editingSeat && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="absolute inset-0 bg-black opacity-50" onClick={() => setModalOpen(false)}></div>
                    <div className="bg-blue-100 p-6 rounded shadow-lg z-50 w-full max-w-md">
                        <h3 className="text-3xl font-bold mb-4 text-blue-900">
                            {editingSeat.seatId ? "Edit Seat" : "Add Seat"}
                        </h3>
                        <input
                        type="text"
                        value={editingSeat.seat}
                        onChange={(e) => 
                            setEditingSeat({...editingSeat, seat: e.target.value})
                        }
                        placeholder="Seat name"
                        className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-blue-50"
                        />
                        <div className="flex justify-end space-x-2">
                            <button onClick={() => setModalOpen(false)} className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-400 transition">
                                Cancel
                            </button>
                            <button onClick={submitSeat} className="px-4 py-2 bg-blue-900 text-white rounded hover:bg-blue-800 transition">
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {confirmDelete && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="absolute inset-0 bg-black opacity-50" onClick={() => setConfirmDelete(null)}></div>
                    <div className="bg-blue-100 p-6 rounded shadow-lg z-50 w-full max-w-md">
                        <h3 className="text-2xl font-bold mb-4 text-blue-900">Confirm Delete</h3>
                        <p className="mb-4 text-lg">
                            Are you sure you want to delete seat:{" "}
                            <strong>{confirmDelete.seat}</strong>?
                        </p>
                        <div className="flex justify-end space-x-2">
                            <button onClick={() => setConfirmDelete(null)} className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-400 transition">Cancel</button>
                            <button onClick={deleteSeat} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-400 transition">Confirm</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
} 