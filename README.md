# capstone-md

# Technologies
Java/Spring
React.js
tailwind.css

https://tailwindcss.com/





# Scheduler App

While Logged In

User logout out
user can schedule days they want on site
User can delete or edit their days
once seats are filled user cannot pick that day
User cannot change date that has past
There can only be 4 people per day


While Logged Out

User Sign in 
main page has a section that shows the people that should be on site today and the next day
Users can see all of their days on their page
Manager has a list of schedule on their page
Manager can see who has not put in days for their schedule
a calander on the main page shows the schedule for everyone
Manager can add and remove employees



Stretch Goals

Users can request pto days
user can request to swap days(Manager must approve)
Manager accepts PTO
Manager has a request section for swapping days
manager has a request section for accepting pto
calander on main page shows scheduled employee pto for the month
main page shows the huddle leaders for current week and next week
Employee can see pto on their page once manager accepts
employee can see pto on main page calander once manager accepts
Future months should be locked until manager opens it up 





# Database tables for scheduler

Manager table
employee table
timeoff table
schedule table
seats



# http

employee.http
manager.http
schedule.http
pto.http
seat.http





# Controller

SecretSigningKey
ManagerController
EmployeeController
PtoController
ScheduleController
SeatController







# Data Layer

ManagerJdbcClientRepository
ManagerMapper
ManagerRepository
EmployeeJdbcClientRepository
EmployeeMapper
EmployeeRepository
PtoJdbcClientRepository
PtoMapper
PtoRepository
ScheduleJdbcClientRepository
ScheduleMapper
ScheduleRepository
SeatsJdbcClientRepository
SeatsMapper
SeatsRepository



# Domain Layer

ResultType
Results
ManagerService
EmployeeService
PTOService
ScheduleService
SeatsService



# Models
Manager
Employee
Pto
Schedule
Seat



# React Components
Nav.jsx
manager.jsx
EmployeeList
EmloyeeTable
ScheduleTable
ScheduleForm
ptolist
ptoform
protable
loginform
registerform



 

 

 