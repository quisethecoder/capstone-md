package learn.data;

import learn.model.Manager;

import java.util.List;

public interface ManagerRepository {

    public List<Manager> findAll();

    public Manager findById(int managerId);

    public Manager findByUsername(String username);

    public Manager create(Manager manager);
}
