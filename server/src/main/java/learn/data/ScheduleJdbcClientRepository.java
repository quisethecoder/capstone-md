package learn.data;

import learn.model.Schedule;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public class ScheduleJdbcClientRepository implements ScheduleRepository {

    JdbcClient client;

    public ScheduleJdbcClientRepository(JdbcClient client) {
        this.client = client;
    }


    @Override
    public List<Schedule> findAll() {
        final String sql = """
                select sc.schedule_id, sc.schedule_date, se.seat_id, se.seat, e.employee_id, e.first_name,
                e.last_name, e.username, e.`password`, m.manager_id, m.first_name, m.last_name,
                m.username, m.`password`
                from schedules sc
                join employee e on e.employee_id = sc.employee_id
                join seats se on se.seat_id = sc.seat_id
                join manager m on m.manager_id = e.manager_id;
                """;

        return client.sql(sql)
                .query(new ScheduleMapper())
                .list();
    }

    @Override
    public Schedule findById(int scheduleId) {
        final String sql = """
                select sc.schedule_id, sc.schedule_date, se.seat_id, se.seat, e.employee_id, e.first_name,
                e.last_name, e.username, e.`password`, m.manager_id, m.first_name, m.last_name,
                m.username, m.`password`
                from schedules sc
                join employee e on e.employee_id = sc.employee_id
                join seats se on se.seat_id = sc.seat_id
                join manager m on m.manager_id = e.manager_id
                where sc.schedule_id = ?;
                """;

        return client.sql(sql)
                .param(scheduleId)
                .query(new ScheduleMapper())
                .optional().orElse(null);
    }

    @Override
    public List<Schedule> findDatesByEmployee(int employeeId) {
        final String sql = """
                select sc.schedule_id, sc.schedule_date, se.seat_id, se.seat, e.employee_id, e.first_name,
                e.last_name, e.username, e.`password`, m.manager_id, m.first_name, m.last_name,
                m.username, m.`password`
                from schedules sc
                join employee e on e.employee_id = sc.employee_id
                join seats se on se.seat_id = sc.seat_id
                join manager m on m.manager_id = e.manager_id
                where e.employee_id = ?;
                """;

        return client.sql(sql)
                .param(employeeId)
                .query(new ScheduleMapper())
                .list();
    }

    @Override
    public List<Schedule> findByDate(LocalDate scheduleDate) {
        final String sql = """
                select sc.schedule_id, sc.schedule_date, se.seat_id, se.seat, e.employee_id, e.first_name,
                e.last_name, e.username, e.`password`, m.manager_id, m.first_name, m.last_name,
                m.username, m.`password`
                from schedules sc
                join employee e on e.employee_id = sc.employee_id
                join seats se on se.seat_id = sc.seat_id
                join manager m on m.manager_id = e.manager_id
                where sc.schedule_date = ? order by se.seat_id;
                """;

        return client.sql(sql)
                .param(scheduleDate)
                .query(new ScheduleMapper())
                .list();
    }

    @Override
    public Schedule create(Schedule schedule) {
        final String sql = """
                insert into schedules (schedule_date, employee_id, seat_id)
                values(:schedule_date, :employee_id, :seat_id)
                """;

        KeyHolder keyHolder = new GeneratedKeyHolder();

        int rowsAffected = client.sql(sql)
                .param("schedule_date", schedule.getScheduleDate())
                .param("employee_id", schedule.getEmployee().getEmployeeId())
                .param("seat_id", schedule.getSeat().getSeatId())
                .update(keyHolder);

        if(rowsAffected <= 0){
            return null;
        }

        int scheduleId = keyHolder.getKey().intValue();
        schedule.setScheduleId(scheduleId);
        return schedule;
    }

    @Override
    public boolean update(Schedule schedule) {
        final String sql = """
                update schedules set
                schedule_date = ?
                where schedule_id = ?;
                """;

        int rowsAffected = client.sql(sql)
                .param(schedule.getScheduleDate())
                .param(schedule.getScheduleId())
                .update();

        return rowsAffected > 0;
    }

    @Override
    public boolean delete(int scheduleId) {
        final String sql = """
                delete from schedules
                where schedule_id = ?
                """;

        int rowsAffected = client.sql(sql)
                .param(scheduleId)
                .update();

        return rowsAffected == 1;
    }
}
