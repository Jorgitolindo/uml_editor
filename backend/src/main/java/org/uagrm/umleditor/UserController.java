package org.uagrm.umleditor;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api")
public class UserController {

    private final Logger log = LoggerFactory.getLogger(getClass());

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/login")
    public User login(Principal principal) {
        log.info("Login " + principal.getName());
        return userRepository.listAll().stream()
                .filter(d -> d.username().equals(principal.getName()))
                .findFirst().get();
    }

    @GetMapping("/users")
    public List<User> getUsers() {
        return userRepository.listAll();
    }

    @GetMapping("/users/{username}/diagrams")
    public List<UserDiagram> getUserDiagrams(@PathVariable("username") String username) {
        return userRepository.listAllDiagrams(username);
    }

    @PostMapping("/users/{username}/diagrams")
    @ResponseBody
    public UserDiagram createDiagram(@PathVariable("username") String username) {
        String id = UUID.randomUUID().toString();
        UserDiagram diagram = new UserDiagram(id, username, new HashMap<>());
        userRepository.saveDiagram(id, username, new HashMap<>());
        return diagram;
    }

    @GetMapping("/users/diagrams/{id}")
    @ResponseBody
    public UserDiagram getDiagram(@PathVariable("id") String id) {
        return userRepository.getUserDiagram(id);
    }

    @PostMapping("/users/diagrams/{id}")
    public void uploadDiagram(Principal principal, @PathVariable("id") String id, @RequestBody Map<String, Object> diagram) {
        log.info("Data received for diagram " + id);
        userRepository.saveDiagram(id, principal.getName(), diagram);
    }

    @DeleteMapping("/users/diagrams/{id}")
    public void deleteDiagram(@PathVariable("id") String id) {
        userRepository.deleteDiagram(id);
    }

}
