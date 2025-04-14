package learn.domain;


import at.favre.lib.crypto.bcrypt.BCrypt;
import learn.data.ManagerRepository;
import learn.model.Manager;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ManagerService {
    private final int BCRYPT_COST = 12;

    private ManagerRepository repository;

    public ManagerService(ManagerRepository repository) {
        this.repository = repository;
    }

    public List<Manager> findAll(){
       return repository.findAll();
    }

    public Manager findById(int managerId){
        return repository.findById(managerId);
    }

    public Result<Manager> findByUsername(String username){
        Result<Manager> result = new Result<>();
        Manager foundManager = repository.findByUsername(username);

        if (foundManager == null){
            result.addErrorMessage("Could not find manager with that username", ResultType.NOT_FOUND);
        }else{
            result.setPayload(foundManager);
        }
        return result;
    }

    public Result<Manager> create(Manager manager){
        Result<Manager> result = new Result<>();

        if(manager.getFirstName().isBlank() || manager.getLastName().isBlank()){
            result.addErrorMessage("Cannot leave name blank", ResultType.INVALID);
        }

        if(manager.getUsername().isBlank()){
            result.addErrorMessage("Username cannot be blank", ResultType.INVALID);
        }

        if(manager.getPassword().isBlank()){
            result.addErrorMessage("Password cannot be blank", ResultType.INVALID);
        }

        if(repository.findByUsername(manager.getUsername()) != null){
            result.addErrorMessage("Username is already taken", ResultType.INVALID);
        }

        if(result.isSuccess()){
            String hashedPassword = BCrypt.withDefaults().hashToString(BCRYPT_COST, manager.getPassword().toCharArray());

            manager.setPassword(hashedPassword);
            Manager createdManager = repository.create(manager);
            result.setPayload(createdManager);
        }

        return result;
    }



}
