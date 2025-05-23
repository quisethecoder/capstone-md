package learn.domain;


import at.favre.lib.crypto.bcrypt.BCrypt;
import learn.data.EmployeeRepository;
import learn.data.ManagerRepository;
import learn.model.Employee;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmployeeService {
    private final int BCRYPT_COST = 12;

    private EmployeeRepository repository;
    private ManagerRepository managerRepository;

    public EmployeeService(EmployeeRepository repository, ManagerRepository managerRepository) {
        this.repository = repository;
        this.managerRepository = managerRepository;
    }

    public List<Employee> findAll(){
        return repository.findAll();
    }

    public Employee findById(int employeeId){
        return repository.findById(employeeId);
    }

    public List<Employee> listOfEmployeesForManager(int managerId){
        return repository.listOfEmployeesForManager(managerId);
    }

    public List<Employee> findEmployeesByManagerId(int managerId){
        return repository.findEmployeesByManagerId(managerId);
    }

    public Result<Employee> findByUsername(String username){
        Result<Employee> result = new Result<>();
        Employee foundEmployee = repository.findByUsername(username);

        if(foundEmployee == null){
            result.addErrorMessage("Could not find employee with that username", ResultType.NOT_FOUND);
        }else{
            result.setPayload(foundEmployee);
        }
        return result;
    }

    public Result<Employee> create(Employee employee){
        Result<Employee> result = new Result<>();

        if(employee.getFirstName().isBlank() || employee.getLastName().isBlank()){
            result.addErrorMessage("Cannot leave name blank", ResultType.INVALID);
        }

        if(employee.getUsername().isBlank()){
            result.addErrorMessage("Username cannot be blank", ResultType.INVALID);
        }

        if(employee.getPassword().isBlank()){
            result.addErrorMessage("Password cannot be blank", ResultType.INVALID);
        }

        if(repository.findByUsername(employee.getUsername()) != null){
            result.addErrorMessage("Username is already taken", ResultType.INVALID);
        }

        if (employee.getManager() == null || employee.getManager().getManagerId() <=0){
            result.addErrorMessage("Select a manager", ResultType.INVALID);
        }

        if(result.isSuccess()){
            String hashedPassword = BCrypt.withDefaults().hashToString(BCRYPT_COST, employee.getPassword().toCharArray());

            employee.setPassword(hashedPassword);
            Employee createdEmployee = repository.create(employee);
            result.setPayload(createdEmployee);
        }

        return result;

    }

    public Result<Void> deleteById(int employeeId){
        Result<Void> result = new Result<>();
        if(!repository.deleteById(employeeId)){
            result.addErrorMessage("Could not find employee with that id", ResultType.NOT_FOUND);
        }
        return result;
    }

}
