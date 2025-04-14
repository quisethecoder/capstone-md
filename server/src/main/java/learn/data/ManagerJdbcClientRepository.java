package learn.data;


import learn.model.Manager;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class ManagerJdbcClientRepository implements ManagerRepository {
    JdbcClient client;

    public ManagerJdbcClientRepository(JdbcClient client) {
        this.client = client;
    }

    @Override
    public List<Manager> findAll() {
        final String sql = """
                select manager_id, first_name, last_name, username, `password`
                 from manager;
                """;

        return client.sql(sql)
                .query(new ManagerMapper())
                .list();
    }

    @Override
    public Manager findById(int managerId) {
        final String sql = """
                select * from manager where manager_id =?;
                """;

        return client.sql(sql)
                .param(managerId)
                .query(new ManagerMapper())
                .optional().orElse(null);
    }

    @Override
    public Manager findByUsername(String username) {
        final String sql = """
                select * from manager where username = ?;
                """;

        return client.sql(sql)
                .param(username)
                .query(new ManagerMapper())
                .optional().orElse(null);
    }

    @Override
    public Manager create(Manager manager) {
        final String sql = """
                insert into manager (first_name, last_name, username, password)
                values (:first_name, :last_name, :username, :password)
                """;

        KeyHolder keyHolder = new GeneratedKeyHolder();

        int rowsAffected = client.sql(sql)
                .param("first_name", manager.getFirstName())
                .param("last_name", manager.getLastName())
                .param("username", manager.getUsername())
                .param("password", manager.getPassword())
                .update(keyHolder, "manager_id");

        if(rowsAffected <= 0){
            return null;
        }

        manager.setManagerId(keyHolder.getKey().intValue());
        return manager;
    }
}
