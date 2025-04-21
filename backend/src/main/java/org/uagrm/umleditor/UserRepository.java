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


    public List<UserDiagram> listAllDiagrams(String username) {
        File file = new File("users_diagrams.json");
        List<UserDiagram> users = new ArrayList<>();
        try {
            users.addAll(mapper.readValue(file, new TypeReference<List<UserDiagram>>() {
            }));
        } catch (IOException e) {
            log.error(e.getMessage(), e);
        }
        return users.stream().filter(u -> u.username().equals(username)).toList();
    }

    public void saveDiagram(String id, Map<String, Object> diagram) {
        File file = new File("user_diagrams.json");
        try {
            List<UserDiagram> userDiagrams = mapper.readValue(file, new TypeReference<List<UserDiagram>>() {
            });
            UserDiagram d = userDiagrams.stream().filter(t -> t.id().equals(id)).findFirst().get();
            userDiagrams.remove(d);
            userDiagrams.add(new UserDiagram(d.id(), d.username(), diagram));
            mapper.writeValue(file, userDiagrams);
        } catch (IOException e) {
            log.error(e.getMessage(), e);
        }
    }

    public UserDiagram getUserDiagram(String id) {
        File file = new File("user_diagrams.json");
        try {
            List<UserDiagram> userDiagrams = mapper.readValue(file, new TypeReference<List<UserDiagram>>() {
            });
            Optional<UserDiagram> userDiagram = userDiagrams.stream().filter(d -> d.id().equals(id)).findFirst();
            if (userDiagram.isPresent()) {
                return userDiagram.get();
            }
            throw new IllegalArgumentException("Diagram not found for id: " + id);
        } catch (IOException e) {
            throw new IllegalArgumentException(e);
        }
    }
}
