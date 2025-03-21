package learn.domain;


import learn.data.EmployeeRepository;
import learn.data.ManagerRepository;
import learn.data.ScheduleRepository;
import learn.data.SeatRepository;
import learn.model.Schedule;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class ScheduleService {
    private ScheduleRepository repository;
    private EmployeeRepository employeeRepository;
    private SeatRepository seatRepository;
    private ManagerRepository managerRepository;

    public ScheduleService(ScheduleRepository repository, EmployeeRepository employeeRepository, SeatRepository seatRepository, ManagerRepository managerRepository) {
        this.repository = repository;
        this.employeeRepository = employeeRepository;
        this.seatRepository = seatRepository;
        this.managerRepository = managerRepository;
    }

    public List<Schedule> findAll(){
        return repository.findAll();
    };

    public Schedule findById(int scheduleId){
        return repository.findById(scheduleId);
    };

    public List<Schedule> findDatesByEmployee(int employeeId){
        return repository.findDatesByEmployee(employeeId);
    };

    public List<Schedule> findByDate(LocalDate scheduleDate){
        return repository.findByDate(scheduleDate);
    };

    public Result<Schedule> create(Schedule schedule){
        Result<Schedule> result = new Result<>();

        List<Schedule> schedules = repository.findAll();
        int employeeCount = 0;
        int seatCount = 0;
        for(Schedule s : schedules){
            if(s.getEmployee().getEmployeeId() == schedule.getEmployee().getEmployeeId()){
                employeeCount++;
            }
            if(s.getSeat().getSeatId() == schedule.getSeat().getSeatId()){
                seatCount++;
            }
        }

        if(employeeCount >= seatCount){
            result.addErrorMessage("Cannot have more employees than seats", ResultType.INVALID);
        }

        if(schedule.getEmployee() == null){
            result.addErrorMessage("Employee cannot be null", ResultType.INVALID);
        }else if(employeeRepository.findById(schedule.getEmployee().getEmployeeId()) == null){
            result.addErrorMessage("Employee does not exist", ResultType.INVALID);
        }

        if(schedule.getSeat() == null){
            result.addErrorMessage("Seat cannot be null", ResultType.INVALID);
        }else if(seatRepository.findById(schedule.getSeat().getSeatId()) == null){
            result.addErrorMessage("Seat does not exist", ResultType.INVALID);
        }

        if(schedule.getScheduleDate() == null){
            result.addErrorMessage("Schedule date cannot be null", ResultType.INVALID);
        }

        List<Schedule> employeeSchedules = repository.findDatesByEmployee(schedule.getEmployee().getEmployeeId());
        for(Schedule s : employeeSchedules){
            if(s.getScheduleDate().equals(schedule.getScheduleDate())){
                result.addErrorMessage("Employee is already scheduled for that date", ResultType.INVALID);
            }
        }

        if(schedule.getScheduleDate().isBefore(LocalDate.now())){
            result.addErrorMessage("Cannot schedule for a date in the past", ResultType.INVALID);
        }

        if(schedule.getScheduleDate().toString().isBlank()){
            result.addErrorMessage("Schedule date cannot be empty", ResultType.INVALID);
        }

        if(result.isSuccess()){
            Schedule createdSchedule = repository.create(schedule);
            result.setPayload(createdSchedule);
        }
        return result;
    };

    public Result<Schedule> update(Schedule schedule){
        Result<Schedule> result = new Result<>();

        if(schedule.getEmployee() == null || employeeRepository.findById(schedule.getEmployee().getEmployeeId()) == null){
            result.addErrorMessage("Employee does not exist", ResultType.INVALID);
        }


        if(schedule.getSeat() == null || seatRepository.findById(schedule.getSeat().getSeatId()) == null){
            result.addErrorMessage("Seat does not exist", ResultType.INVALID);
        }

        if(schedule.getScheduleDate() == null ){
            result.addErrorMessage("Schedule date cannot be null", ResultType.INVALID);
        }

        //check if date is empty string
        if(schedule.getScheduleDate().toString().isBlank()){
            result.addErrorMessage("Schedule date cannot be empty", ResultType.INVALID);
        }

        if(schedule.getScheduleDate().isBefore(LocalDate.now())){
            result.addErrorMessage("Cannot schedule for a date in the past", ResultType.INVALID);
        }

        List<Schedule> employeeSchedules = repository.findDatesByEmployee(schedule.getEmployee().getEmployeeId());
        for(Schedule s : employeeSchedules){
            if(s.getScheduleDate().equals(schedule.getScheduleDate())){
                result.addErrorMessage("Employee is already scheduled for that date", ResultType.INVALID);
            }
        }



        if(result.isSuccess()){
            boolean success = repository.update(schedule);
            if(!success){
                result.addErrorMessage("Could not find schedule with that id", ResultType.NOT_FOUND);
            }
        }

        return result;
    };

    public Result<Void> delete(int scheduleId){
        Result<Void> result = new Result<>();

        if(result.isSuccess()){
            boolean success = repository.delete(scheduleId);
            if(!success){
                result.addErrorMessage("Could not find schedule with that id", ResultType.NOT_FOUND);
            }
        }

        return result;
    };


}
