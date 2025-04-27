package org.uagrm.umleditor;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
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
    @Autowired
    private UserAuthService userAuthService;

    @Autowired
    private SimpMessagingTemplate template;

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
        UserDiagram d = userRepository.saveDiagram(id, principal.getName(), diagram);
        // 2) Construimos un payload que lleve al editor actual:
        Map<String,Object> msg = Map.of(
                "id",      d.id(),
                "username", principal.getName(),   // <-- aquí ponemos EL EDITOR
                "diagram", d.diagram()
        );

        // 3) Publicamos ese msg por STOMP en /topic/notifications
        template.convertAndSend("/topic/notifications", msg);

    }



    @DeleteMapping("/users/diagrams/{id}")
    public void deleteDiagram(@PathVariable("id") String id) {
        userRepository.deleteDiagram(id);
    }

    void notifyDiagramUpdate(UserDiagram d) {
        // Antes:
         template.convertAndSend("/topic/notifications", d);
    }


    @PostMapping("/register")
    public User register(@RequestBody Map<String, String> userData) {
        String username = userData.get("username");
        String password = userData.get("password");
        String fullName = userData.get("fullName");

        User newUser = new User(username, password, fullName);
        userRepository.addUser(newUser);          // ✅ Guarda en users.json
        userAuthService.saveUser(newUser);        // ✅ Agrega al InMemoryUserDetailsManager

        return newUser;
    }

}
