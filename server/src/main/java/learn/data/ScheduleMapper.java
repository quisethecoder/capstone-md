package learn.data;

import learn.model.Employee;
import learn.model.Manager;
import learn.model.Schedule;
import learn.model.Seat;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class ScheduleMapper implements RowMapper<Schedule> {
    @Override
    public Schedule mapRow(ResultSet rs, int rowNum) throws SQLException {
        Schedule schedule = new Schedule();
        schedule.setScheduleId(rs.getInt("schedule_id"));
        schedule.setScheduleDate(rs.getDate("schedule_date").toLocalDate());

        Seat seat = new Seat();
        seat.setSeatId(rs.getInt("seat_id"));
        seat.setSeat(rs.getString("seat"));
        schedule.setSeat(seat);

        Employee employee = new Employee();
        employee.setEmployeeId(rs.getInt("employee_id"));
        employee.setFirstName(rs.getString("first_name"));
        employee.setLastName(rs.getString("last_name"));
        employee.setUsername(rs.getString("username"));
        employee.setPassword(rs.getString("password"));
        schedule.setEmployee(employee);

        Manager manager = new Manager();
        manager.setManagerId(rs.getInt("manager_id"));
        manager.setFirstName(rs.getString("m.first_name"));
        manager.setLastName(rs.getString("m.last_name"));
        manager.setUsername(rs.getString("m.username"));
        manager.setPassword(rs.getString("m.password"));
        employee.setManager(manager);



        return schedule;
    }
}
