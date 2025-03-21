package learn.controller;


import learn.domain.Result;
import learn.domain.ScheduleService;
import learn.model.Schedule;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/schedule")
public class ScheduleController {
    private ScheduleService service;

    public ScheduleController(ScheduleService service) {
        this.service = service;
    }

    @GetMapping
    public List<Schedule> findAll(){
        return service.findAll();
    }

    @GetMapping("/{scheduleId}")
    public ResponseEntity<Schedule> findById(@PathVariable int scheduleId){
        Schedule schedule = service.findById(scheduleId);

        if(schedule == null){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return ResponseEntity.ok(schedule);
    }

    @GetMapping("/employee/{employeeId}")
    public List<Schedule> findDatesByEmployee(@PathVariable int employeeId){
        return service.findDatesByEmployee(employeeId);
    }

    @GetMapping("/date/{scheduleDate}")
    public List<Schedule> findByDate(@PathVariable String scheduleDate){
        return service.findByDate(LocalDate.parse(scheduleDate));
    }

    @PostMapping
    public ResponseEntity<Object> create(@RequestBody Schedule schedule){
        Result<Schedule> result = service.create(schedule);

        if(result == null){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(result, HttpStatus.CREATED);
    }

    @PutMapping("/{scheduleId}")
    public ResponseEntity<Object> update(@PathVariable int scheduleId, @RequestBody Schedule schedule){
        schedule.setScheduleId(scheduleId);

        Result<Schedule> result = service.update(schedule);

        if(result == null){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @DeleteMapping("/{scheduleId}")
    public ResponseEntity<Void> delete(@PathVariable int scheduleId){
        Result<Void> result = service.delete(scheduleId);

        if(result.isSuccess()){
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }else{
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
