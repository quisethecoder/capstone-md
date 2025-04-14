package learn.controller;


import at.favre.lib.crypto.bcrypt.BCrypt;
import io.jsonwebtoken.Jwts;
import learn.domain.ManagerService;
import learn.domain.Result;
import learn.domain.ResultType;
import learn.model.Manager;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/managers")
public class ManagerController {
    private ManagerService service;

    private SecretSigningKey secretSigningKey;

    public ManagerController(ManagerService service, SecretSigningKey secretSigningKey) {
        this.service = service;
        this.secretSigningKey = secretSigningKey;
    }

    @GetMapping
    public List<Manager> findAll(){
        return service.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Manager> findById(@PathVariable int id){
        Manager manager = service.findById(id);
        if(manager == null){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return ResponseEntity.ok(manager);
    }

    @PostMapping
    public ResponseEntity<Object> create(@RequestBody Manager manager){
        Result<Manager> result = service.create(manager);

        if(result.isSuccess()){
            Map<String, String> output = createJwtFromManager(result.getPayload());
            return new ResponseEntity<>(output, HttpStatus.OK);
        }else {
            return new ResponseEntity<>(result.getErrorMessages(), HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<Object> login(@RequestBody Manager manager){
        Result<Manager> managerResult = service.findByUsername(manager.getUsername());

        if(managerResult.getResultType() == ResultType.NOT_FOUND){
            return new ResponseEntity<>(managerResult.getErrorMessages(), HttpStatus.NOT_FOUND);
        }

        char[] proposedPassword = manager.getPassword().toCharArray();
        char[] existingPassword = managerResult.getPayload().getPassword().toCharArray();

        if(BCrypt.verifyer().verify(proposedPassword, existingPassword).verified){
            Map<String, String> jwtMap = createJwtFromManager(managerResult.getPayload());
            return new ResponseEntity<>(jwtMap, HttpStatus.OK);
        }else{
            return new ResponseEntity<>(List.of("Username and password do not match"), HttpStatus.UNAUTHORIZED);
        }
    }




    private Map<String, String> createJwtFromManager(Manager manager){
        String jwt = Jwts.builder()
                .claim("firstName", manager.getFirstName())
                .claim("lastName", manager.getLastName())
                .claim("username", manager.getUsername())
                .claim("managerId", manager.getManagerId())
                .signWith(secretSigningKey.getKey())
                .compact();
        Map<String, String> output = new HashMap<>();
        output.put("jwt", jwt);
        return output;
    }

}
