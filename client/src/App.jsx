import { useState } from 'react'
import {BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import Nav from './components/Nav'
import ManagerForm from './components/ManagerForm'
import ManagerLoginForm from './components/ManagerLoginForm'
import EmployeeFormLogin from './components/EmployeeLoginForm'
import EmployeeForm from './components/EmployeeForm'
import ChooseRoute from './components/ChooseRoute'
import Home from './components/Home'
import Schedule from './components/Schedule'

function App() {
  const[loggedInManager, setLoggedInManager] = useState(null)
  const[loggedInEmployee, setLoggedInEmployee] = useState(null)

  const[hasFinishedCheckingLocalStorage, setHasFinishedCheckingLocalStorage] = useState(false)


  useState(() => {
    if (localStorage.getItem("loggedInManager") !== undefined){
      setLoggedInManager(JSON.parse(localStorage.getItem("loggedInManager")))
    }else if(localStorage.getItem("loggedInEmployee") !== undefined){
      setLoggedInEmployee(JSON.parse(localStorage.getItem("loggedInEmployee")))
    }
    setHasFinishedCheckingLocalStorage(true)
  }, [])

  if(!hasFinishedCheckingLocalStorage){
    return null
  }


  return (
    <Router>
      <div>
        <Nav loggedInManager={loggedInManager} setLoggedInManager={setLoggedInManager} loggedInEmployee={loggedInEmployee} setLoggedInEmployee={setLoggedInEmployee}/>
        <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/schedule" element={<Schedule />} />

          <Route path="choose-route/:choose" element={<ChooseRoute/>} />

          <Route path="/employeesignup" element={loggedInEmployee === null ? 
            <EmployeeForm setLoggedInEmployee={setLoggedInEmployee} /> :
            <Navigate to={"/"} />
          }
          />

          <Route path="/employeelogin" element={loggedInEmployee === null ? 
            <EmployeeFormLogin setLoggedInEmployee={setLoggedInEmployee} /> :
            <Navigate to={"/"} />
          }
          />

          <Route path="/managersignup" element={loggedInManager === null ? 
            <ManagerForm setLoggedInManager={setLoggedInManager} /> :
            <Navigate to={"/"} />
          }
          />

          <Route path="/managerlogin" element={loggedInManager === null ? 
            <ManagerLoginForm setLoggedInManager={setLoggedInManager} /> :
            <Navigate to={"/"} />
          }
          />

          <Route path="*" element={<div>This page does not exist</div>} />
        </Routes>
        </main>
      </div>
    </Router>
    
  )
}

export default App
