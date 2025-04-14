package learn.data;

import learn.model.Seat;

import java.util.List;

public interface SeatRepository {
    List<Seat> findAll();

    Seat findById(int seatId);

    Seat create(Seat seat);

    boolean update(Seat seat);

    boolean delete(int seatId);


}
