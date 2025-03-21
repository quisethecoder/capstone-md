package learn.domain;


import learn.data.SeatRepository;
import learn.model.Seat;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

@Service
public class SeatService {
    private SeatRepository repository;

    public SeatService(SeatRepository repository) {
        this.repository = repository;
    }

    public List<Seat> findAll(){
        return repository.findAll();
    };

    public Seat findById(int seatId){
        return repository.findById(seatId);
    };

    public Result<Seat> create(Seat seat){
        Result<Seat> result = new Result<>();

        if(seat.getSeat().isBlank()){
            result.addErrorMessage("Cannot leave seat blank", ResultType.INVALID);
        }

        if(repository.findAll().stream().anyMatch(s -> s.getSeat().equals(seat.getSeat()))){
            result.addErrorMessage("Seat already exists", ResultType.INVALID);
        }

        if(result.isSuccess()){
//            result.setPayload(repository.create(seat));
            Seat createdSeat = repository.create(seat);
            result.setPayload(createdSeat);
        }

        return result;

    };

    public Result<Seat> update(Seat seat){
        Result<Seat> result = new Result<>();

        if(seat.getSeat().isBlank()){
            result.addErrorMessage("Cannot leave seat blank", ResultType.INVALID);
        }


        if(Objects.equals(seat.getSeat(), repository.findById(seat.getSeatId()).getSeat())){
            result.addErrorMessage("Seat already exists", ResultType.INVALID);
        }

        if(result.isSuccess()){
            boolean success = repository.update(seat);
            if(!success){
                result.addErrorMessage("Could not find seat with that id", ResultType.NOT_FOUND);
            }
        }
        return result;
    };

    public Result<Void> delete(int seatId){
        Result<Void> result = new Result<>();
        
        if(result.isSuccess()){
            boolean success = repository.delete(seatId);
            if(!success){
                result.addErrorMessage("Could not find seat with that id", ResultType.NOT_FOUND);
            }
        }

        return result;
    };


}
