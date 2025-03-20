package learn.data;

import learn.model.Seat;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class SeatMapper implements RowMapper<Seat> {

    @Override
    public Seat mapRow(ResultSet rs, int rowNum) throws SQLException {
        Seat seat = new Seat();
        seat.setSeatId(rs.getInt("seat_id"));
        seat.setSeat(rs.getString("seat"));
        return seat;
    }
}
