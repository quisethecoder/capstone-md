drop database if exists scheduler;
create database scheduler;
use scheduler;

create table manager (
	manager_id int primary key auto_increment,
    first_name varchar(50),
    last_name varchar(50),
    username varchar(255) unique,
    `password` text
);

create  table employee (
employee_id int primary key auto_increment,
first_name varchar(50),
    last_name varchar(50),
    username varchar(255) unique,
    `password` text,
    manager_id int,
    constraint fk_employee_manager_id
    foreign key (manager_id) 
    references manager(manager_id)
);

create table timeoff_requests(
request_id int primary key auto_increment,
start_date date,
end_date date,
employee_id int,
constraint fk_timeoff_requests_employee_id
    foreign key (employee_id) 
    references employee(employee_id)
);

create table schedules (
   schedule_id int primary key auto_increment,
   schedule_date date,
   employee_id int,
    constraint fk_schedule_employee_id
    foreign key (employee_id) 
    references employee(employee_id)
);




-- create table seats(
-- seat_id int primary key auto_increment,
-- seat text,
-- schedule_id int,
-- employee_id int,
-- constraint fk_seats_schedule_id
--     foreign key (schedule_id) 
--     references schedules(schedule_id),
-- constraint fk_seats_employee_id
--     foreign key (employee_id) 
--     references employee(employee_id)
-- );





