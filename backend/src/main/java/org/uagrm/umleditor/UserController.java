package org.uagrm.umleditor;

import jakarta.websocket.server.PathParam;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class UserController {

    private final Logger log = LoggerFactory.getLogger(getClass());

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/users")
    public List<User> getUsers() {
        return userRepository.listAll();
    }

    @GetMapping("/users/{username}/diagram")
    @ResponseBody
    public Map<String, Object> getDiagram(@PathVariable("username") String username) {
        return userRepository.getUserDiagram(username).diagram();
    }

    @PostMapping("/users/{username}/diagram")
    public void uploadDiagram(@PathVariable("username") String username, @RequestBody Map<String, Object> diagram) {
        log.info("Data received for " + username);
        userRepository.saveDiagram(username, diagram);
    }

}
