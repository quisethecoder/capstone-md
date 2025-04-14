package learn.data;

import com.mysql.cj.result.Row;
import learn.model.Employee;
import learn.model.Manager;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class EmployeeMapper implements RowMapper<Employee> {

    @Override
    public Employee mapRow(ResultSet rs, int rowNum) throws SQLException {
        Employee employee = new Employee();
        employee.setEmployeeId(rs.getInt("employee_id"));
        employee.setFirstName(rs.getString("first_name"));
        employee.setLastName(rs.getString("last_name"));
        employee.setUsername(rs.getString("username"));
        employee.setPassword(rs.getString("password"));

        Manager manager = new Manager();
        manager.setManagerId(rs.getInt("manager_id"));
        manager.setFirstName(rs.getString("m.first_name"));
        manager.setLastName(rs.getString("m.last_name"));
        manager.setUsername(rs.getString("m.username"));
        manager.setPassword(rs.getString("m.password"));
        employee.setManager(manager);

        return employee;
    }
}
