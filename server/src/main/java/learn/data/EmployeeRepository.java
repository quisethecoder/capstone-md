package learn.data;

import learn.model.Employee;
import learn.model.Manager;

import java.util.List;

public interface EmployeeRepository {
    public List<Employee> findAll();

    public List<Employee> findEmployeesByManagerId(int managerId);

    public Employee findById(int employeeId);

    public Employee findByUsername(String username);

    public Employee create(Employee employee);

    public boolean deleteById(int employeeId);
}
