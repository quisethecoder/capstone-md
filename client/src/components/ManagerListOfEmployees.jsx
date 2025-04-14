import { useEffect, useState } from "react"


export default function ManagerListOfEmployees({ managerId }) {
    const [employees, setEmployees] = useState([])
    const [confirmDelete, setConfirmDelete] = useState(null)

    useEffect(() => {
        fetch(`http://localhost:8080/api/employees/manager/list/${managerId}`)
            .then((res) => res.json())
            .then((data) => setEmployees(data))
            .catch((err) => console.error("Error fethcing employees", err))
    }, [managerId])

    const confirmDeleteEmployee = (employee) => {
        setConfirmDelete(employee)
    }

    const deleteEmployee = () => {
        fetch(`http://localhost:8080/api/employees/${confirmDelete.employeeId}`, {
            method: "DELETE",
        })
            .then((res) => {
                setEmployees((prev) => prev.filter((e) => e.employeeId !== confirmDelete.employeeId))
                setConfirmDelete(null)
            })
            .catch((err) => console.error("Error deleting employee", err))
    }


    return (
        <div className="p-4 bg-blue-100 rounded shadow mb-4">
            <h2 className="text-3xl font-bold text-blue-900 mb-2">Employee List</h2>
            <ul className="space-y-2">
                {employees.map((employee) => (
                    <li key={employee.employeeId} className="flex justify-between items-center border border-gray-300 p-2 rounded bg-blue-50 shadow-sm">
                        <span>{employee.firstName} {employee.lastName}</span>
                        <button onClick={() => confirmDeleteEmployee(employee)} className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition">Delete</button>
                    </li>
                ))}
                {confirmDelete && (
                    <div className="fixed inset-0 flex items-center justify-center z-50">
                        <div onClick={() => setConfirmDelete(null)} className="absolute inset-0 bg-black opacity-50"></div>
                        <div className="bg-blue-100 p-6 rounded shadow-lg z-50 w-full max-w-md">
                            <h3 className="text-2xl font-bold mb-4">Confirm Delete</h3>
                            <p className="mb-4"> Are you sure you want to delete employee: {" "} <strong>{confirmDelete.firstName} {confirmDelete.lastName}</strong>?</p>
                            <div className="flex justify-end space-x-2">
                                <button onClick={() => setConfirmDelete(null)} className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-400 transition">Cancel</button>
                                <button onClick={deleteEmployee} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition">Confirm</button>
                            </div>
                        </div>
                    </div>
                )}
            </ul>
        </div>
    )
}