package learn.model;

import java.util.Objects;

public class Seat {
    private int seatId;
    private String seat;

    public Seat(int seatId, String seat) {
        this.seatId = seatId;
        this.seat = seat;
    }

    public Seat() {

    }

    public int getSeatId() {
        return seatId;
    }

    public void setSeatId(int seatId) {
        this.seatId = seatId;
    }

    public String getSeat() {
        return seat;
    }

    public void setSeat(String seat) {
        this.seat = seat;
    }


    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        Seat seat1 = (Seat) o;
        return seatId == seat1.seatId && Objects.equals(seat, seat1.seat);
    }

    @Override
    public int hashCode() {
        return Objects.hash(seatId, seat);
    }
}
