drop database if exists scheduler_test;
create database scheduler_test;
use scheduler_test;


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


create table seats(
seat_id int primary key auto_increment,
seat text,
schedule_id int,
employee_id int,
constraint fk_seats_schedule_id
    foreign key (schedule_id) 
    references schedules(schedule_id),
constraint fk_seats_employee_id
    foreign key (employee_id) 
    references employee(employee_id)
);



delimiter //
create procedure set_known_good_state()
begin
	delete from manager;
    alter table manager auto_increment = 1;
	delete from employee;
    alter table employee auto_increment = 1;
    delete from schedules;
    alter table answers auto_increment = 1;
    delete from seats;
        alter table seats auto_increment = 1;
	

	insert into manager (first_name, last_name, username, `password`)
		values
		('Marie','Corona','testmanager1', 'manager1'),
		('Delisha','Bobbs','testmanager2', 'manager2');

	insert into employee (first_name, last_name, username, `password`, manager_id)
			values
			('Marquise', 'Dawkins','employee1','password1', 2),
			('Darryl', 'Johnson', 'employee2', 'password2', 2),
			('Justin', 'Smith', 'employee3', 'password3', 1),
            ('Jasmine', 'Jones', 'employee4', 'password4', 1),
            ('Wayne', 'Carter', 'employee5', 'password5', 2);


	insert into schedules (schedule_date, employee_id)
			values
			('2025-04-01', 1),
			('2025-04-02', 1),
			('2025-04-09', 1),
			('2025-04-10', 1),
			('2025-04-02', 2),
            ('2025-04-02', 2),
            ('2025-04-09', 2),
            ('2025-04-01', 2),
            ('2025-04-10', 3),
            ('2025-04-17', 3),
            ('2025-04-24', 3),
            ('2025-04-25', 3),
            ('2025-04-01', 4),
            ('2025-04-02', 4),
            ('2025-04-09', 4),
            ('2025-04-10', 4),
            ('2025-04-02', 5),
            ('2025-04-02', 5),
            ('2025-04-09', 5),
            ('2025-04-01', 5),
            ('2025-04-10', 5);

    insert into seats (seat, schedule_id, employee_id)
    		values
    		('B200',1, 1),
    		('B201', 1, 2),
    		('B202', 1, 3),
            ('B203', 1, 4),
            ('B204', 1, 5);


end//
delimiter ;