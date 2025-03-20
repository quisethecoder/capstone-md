package learn.model;

public class Seat {
    private int seatId;
    private String seat;

    public Seat(int seatId, String seat) {
        this.seatId = seatId;
        this.seat = seat;
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
}
