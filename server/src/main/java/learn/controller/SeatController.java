package learn.controller;


import learn.domain.Result;
import learn.domain.SeatService;
import learn.model.Seat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.ErrorResponse;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/seats")
public class SeatController {
    private SeatService service;

    public SeatController(SeatService service) {
        this.service = service;
    }

    @GetMapping
    public List<Seat> findAll(){
        return service.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Seat> findById(@PathVariable int id){
        Seat seat = service.findById(id);

        if(seat == null){
          return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return ResponseEntity.ok(seat);
    }

   @PostMapping
    public ResponseEntity<Object> create(@RequestBody Seat seat){
        Result<Seat> result = service.create(seat);

        if(result.isSuccess()){
            return new ResponseEntity<>(result.getPayload(), HttpStatus.CREATED);
        }else{
            return new ResponseEntity<>(result.getErrorMessages(), HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Object> update(@PathVariable int id, @RequestBody Seat seat){
       seat.setSeatId(id);

        Result<Seat> result = service.update(seat);

        if(result.isSuccess()){
            return new ResponseEntity<>(HttpStatus.OK);
        }else{
            return new ResponseEntity<>(result.getErrorMessages(), HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable int id){
        Result<Void> result = service.delete(id);

        if(result.isSuccess()){
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }else{
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }



}
