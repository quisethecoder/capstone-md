package learn.data;

import learn.model.Manager;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class ManagerMapper implements RowMapper<Manager> {
    @Override
    public Manager mapRow(ResultSet rs, int rowNum) throws SQLException {
        Manager manager = new Manager();
        manager.setManagerId(rs.getInt("manager_id"));
        manager.setFirstName(rs.getString("first_name"));
        manager.setLastName(rs.getString("last_name"));
        manager.setUsername(rs.getString("username"));
        manager.setPassword(rs.getString("password"));
        return manager;
    }
}
