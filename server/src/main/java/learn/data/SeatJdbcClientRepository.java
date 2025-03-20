package learn.data;


import learn.model.Seat;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class SeatJdbcClientRepository implements SeatRepository {
    JdbcClient client;

    public SeatJdbcClientRepository(JdbcClient client) {
        this.client = client;
    }

    @Override
    public List<Seat> findAll() {
        final String sql = """
                select seat_id, seat from seats;
                """;


        return client.sql(sql)
                .query(new SeatMapper())
                .list();
    }

    @Override
    public Seat findById(int seatId) {
        final String sql = """
                select * from seats where seat_id = ?;
                """;

        return client.sql(sql)
                .param(seatId)
                .query(new SeatMapper())
                .optional().orElse(null);
    }

    @Override
    public Seat create(Seat seat) {
        final String sql = """
                insert into seats (seat)
                values(:seat)
                """;

        KeyHolder keyHolder = new GeneratedKeyHolder();

        int rowsAffected = client.sql(sql)
                .param("seat", seat.getSeat())
                .update(keyHolder, "seat_id");

        if(rowsAffected <= 0){
            return null;
        }

        seat.setSeatId(keyHolder.getKey().intValue());
        return seat;
    }

    @Override
    public boolean update(Seat seat) {
        final String sql = """
                update seats set
                seat = ?
                where seat_id = ?;
                """;

        int rowsAffected = client.sql(sql)
                .param(seat.getSeat())
                .param(seat.getSeatId())
                .update();


        return rowsAffected > 0;
    }

    @Override
    public boolean delete(int seatId) {
        final String sql = """
                delete from seats
                where seat_id = ?
                """;

        int rowsAffected = client.sql(sql)
                .param(seatId)
                .update();

        return rowsAffected == 1;
    }
}
