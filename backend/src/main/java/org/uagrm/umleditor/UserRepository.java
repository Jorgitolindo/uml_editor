package org.uagrm.umleditor;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Stream;

@Service
public class UserRepository {

    private Logger log = LoggerFactory.getLogger(getClass());

    private ObjectMapper mapper = new ObjectMapper();

    public List<User> listAll() {
        File file = new File("users.json");
        List<User> users = new ArrayList<>();
        try {
            users.addAll(mapper.readValue(file, new TypeReference<List<User>>() {
            }));
        } catch (IOException e) {
            log.error(e.getMessage(), e);
        }
        return users;
    }

    public void saveDiagram(String username, Map<String, Object> diagram) {
        File file = new File("user_diagrams.json");
        try {
            List<UserDiagram> userDiagrams = mapper.readValue(file, new TypeReference<List<UserDiagram>>() {
            });
            userDiagrams.removeIf(d -> d.username().equals(username));
            userDiagrams.add(new UserDiagram(username, diagram));
            mapper.writeValue(file, userDiagrams);
        } catch (IOException e) {
            log.error(e.getMessage(), e);
        }
    }

    public UserDiagram getUserDiagram(String username) {
        File file = new File("user_diagrams.json");
        try {
            List<UserDiagram> userDiagrams = mapper.readValue(file, new TypeReference<List<UserDiagram>>() {
            });
            Optional<UserDiagram> userDiagram = userDiagrams.stream().filter(d -> d.username().equals(username)).findFirst();
            if (userDiagram.isPresent()) {
                return userDiagram.get();
            }
            throw new IllegalArgumentException("Diagram not found for username: " + username);
        } catch (IOException e) {
            throw new IllegalArgumentException(e);
        }
    }
}
