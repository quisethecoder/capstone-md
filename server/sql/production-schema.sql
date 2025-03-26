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

create table seats(
seat_id int primary key auto_increment,
seat text
);


create table schedules (
   schedule_id int primary key auto_increment,
   schedule_date date,
   employee_id int,
   seat_id int,
    constraint fk_schedules_employee_id
    foreign key (employee_id) 
    references employee(employee_id),
    constraint fk_schedules_seat_id
    foreign key (seat_id) 
    references seats(seat_id)
);






-- initial data

insert into manager (first_name, last_name, username, `password`)
		values
		('Marie','Corona','testmanager1', 'manager1'),
		('Delisha','Bobbs','testmanager2', 'manager2');

	insert into employee (first_name, last_name, username, `password`, manager_id)
			values
			('Marquis', 'Adams','employee1','password1', 2),
			('Darryl', 'Johnson', 'employee2', 'password2', 2),
			('Justin', 'Smith', 'employee3', 'password3', 1),
            ('Jasmine', 'Jones', 'employee4', 'password4', 1),
            ('Wayne', 'Carter', 'employee5', 'password5', 2);
            
            
	insert into seats (seat)
    		values
    		('B200'),
    		('B201'),
    		('B202'),
            ('B203'),
            ('B204');

            
            
	insert into schedules (schedule_date, employee_id, seat_id)
			values
			('2025-04-01', 1, 1),
			('2025-04-02', 1, 1),
			('2025-04-09', 1, 1),
			('2025-04-10', 1, 1),
			('2025-04-01', 2, 2),
            ('2025-04-02', 2, 3),
            ('2025-04-09', 2, 5),
            ('2025-04-10', 2, 4),
            ('2025-04-01', 3, 3),
			('2025-04-02', 3, 2),
			('2025-04-09', 3, 2),
			('2025-04-10', 3, 2);
			

  


-- select e.employee_id, e.first_name,
-- e.last_name, e.username, e.`password`, m.manager_id, m.first_name, m.last_name,
-- m.username, m.`password` 
-- from employee e 
-- join manager m on m.manager_id = e.manager_id
-- where m.manager_id = 3;



