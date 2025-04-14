package learn.controller;


import at.favre.lib.crypto.bcrypt.BCrypt;
import io.jsonwebtoken.Jwts;
import learn.domain.EmployeeService;
import learn.domain.Result;
import learn.domain.ResultType;
import learn.model.Employee;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/employees")
public class EmployeeController {
    private EmployeeService service;

    private SecretSigningKey secretSigningKey;

    public EmployeeController(EmployeeService service, SecretSigningKey secretSigningKey) {
        this.service = service;
        this.secretSigningKey = secretSigningKey;
    }

    @GetMapping
    public List<Employee> findAll(){
        return service.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Employee> findById(@PathVariable int id){
        Employee employee = service.findById(id);
        if(employee == null){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return ResponseEntity.ok(employee);
    }

    @GetMapping("/manager/list/{id}")
    public List<Employee> listOfEmployeesForManager(@PathVariable int id){
        return service.listOfEmployeesForManager(id);
    }

    @GetMapping("/manager/{id}")
    public List<Employee> findEmployeesByManagerId(@PathVariable int id){
        return service.findEmployeesByManagerId(id);
    }

    @PostMapping
    public ResponseEntity<Object> create(@RequestBody Employee employee){
        Result<Employee> result = service.create(employee);

        if(result.isSuccess()){
            Map<String, String> output = createJwtFromEmployee(result.getPayload());
            return new ResponseEntity<>(output, HttpStatus.OK);
        }else{
            return new ResponseEntity<>(result.getErrorMessages(), HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<Object> login(@RequestBody Employee employee){
        Result<Employee> employeeResult = service.findByUsername(employee.getUsername());

        if(employeeResult.getResultType() == ResultType.NOT_FOUND){
            return new ResponseEntity<>(employeeResult.getErrorMessages(), HttpStatus.NOT_FOUND);
        }

        char[] proposedPassword = employee.getPassword().toCharArray();
        char[] existingPassword = employeeResult.getPayload().getPassword().toCharArray();

        if(BCrypt.verifyer().verify(proposedPassword, existingPassword).verified){
            Map<String, String> jwtMap = createJwtFromEmployee(employeeResult.getPayload());
            return new ResponseEntity<>(jwtMap, HttpStatus.OK);
        }else{
            return new ResponseEntity<>(List.of("Username and password do not match"), HttpStatus.UNAUTHORIZED);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable int id){
        Result<Void> result = service.deleteById(id);

        if(result.isSuccess()){
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }else{
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }



    private Map<String, String> createJwtFromEmployee(Employee employee){
        String jwt = Jwts.builder()
                .claim("firstName", employee.getFirstName())
                .claim("lastName", employee.getLastName())
                .claim("username", employee.getUsername())
                .claim("manager", employee.getManager().getManagerId())
                .claim("employeeId", employee.getEmployeeId())
                .signWith(secretSigningKey.getKey())
                .compact();
        Map<String, String> output = new HashMap<>();
        output.put("jwt", jwt);
        return output;
    }


}
