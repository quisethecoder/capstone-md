package learn.data;


import learn.model.Employee;
import learn.model.Manager;
import learn.model.Schedule;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class EmployeeJdbcClientRepository implements EmployeeRepository{

    JdbcClient client;

    public EmployeeJdbcClientRepository(JdbcClient client) {
        this.client = client;
    }


    @Override
    public List<Employee> findAll() {
        final String sql = """
                select e.employee_id,  e.first_name, e.last_name, e.username, e.password,
                m.manager_id, m.first_name, m.last_name, m.username, m.password
                from employee e
                left join manager m on e.manager_id = m.manager_id;
                """;

        return client.sql(sql)
                .query(new EmployeeMapper())
                .list();
    }

    @Override
    public List<Employee> findEmployeesByManagerId(int managerId) {
        final String sql = """
                select sc.schedule_id, sc.schedule_date, se.seat_id, se.seat, e.employee_id, e.first_name,
                e.last_name, e.username, e.`password`, m.manager_id, m.first_name, m.last_name,
                m.username, m.`password`
                from schedules sc
                join employee e on e.employee_id = sc.employee_id
                join seats se on se.seat_id = sc.seat_id
                join manager m on m.manager_id = e.manager_id
                where m.manager_id = ?;
                """;

        return client.sql(sql)
                .param(managerId)
                .query(new EmployeeMapper())
                .list();
    }

    @Override
    public List<Employee> listOfEmployeesForManager(int managerId) {
        final String sql = """
                select e.employee_id, e.first_name,
                e.last_name, e.username, e.`password`, m.manager_id, m.first_name, m.last_name,
                m.username, m.`password`
                from employee e
                join manager m on m.manager_id = e.manager_id
                where m.manager_id = ?;
                """;


        return client.sql(sql)
                .param(managerId)
                .query(new EmployeeMapper())
                .list();
    }

    @Override
    public Employee findById(int employeeId) {
        final String sql = """
                select   e.employee_id,  e.first_name, e.last_name, e.username, e.password,
                m.manager_id, m.first_name, m.last_name, m.username, m.password
                from employee e
                left join manager m on e.manager_id = m.manager_id
                where e.employee_id = ?;
                """;

        return client.sql(sql)
                .param(employeeId)
                .query(new EmployeeMapper())
                .optional().orElse(null);
    }


    @Override
    public Employee findByUsername(String username) {
        final String sql = """
                select   e.employee_id,  e.first_name, e.last_name, e.username, e.password,
                m.manager_id, m.first_name, m.last_name, m.username, m.password
                from employee e
                left join manager m on e.manager_id = m.manager_id
                where e.username = ?;
                """;

        return client.sql(sql)
                .param(username)
                .query(new EmployeeMapper())
                .optional().orElse(null);
    }

    @Override
    public Employee create(Employee employee) {
        final String sql = """
                insert into employee (first_name, last_name, username, password, manager_id)
                values (:first_name, :last_name, :username, :password, :manager_id)
                """;

        KeyHolder keyHolder = new GeneratedKeyHolder();

        int rowsAffected = client.sql(sql)
                .param("first_name", employee.getFirstName())
                .param("last_name", employee.getLastName())
                .param("username", employee.getUsername())
                .param("password", employee.getPassword())
                .param("manager_id", employee.getManager().getManagerId())
                .update(keyHolder);

        if(rowsAffected <= 0){
            return null;
        }

        int employeeId = keyHolder.getKey().intValue();
        employee.setEmployeeId(employeeId);
        return employee;

    }

    @Override
    public boolean deleteById(int employeeId) {
        final String sql = """
                delete from employee
                where employee_id = ?
                """;

        int rowsAffected = client.sql(sql)
                .param(employeeId)
                .update();

        return rowsAffected > 0;
    }
}
