package org.uagrm.umleditor;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class UserRepository {

    private Logger log = LoggerFactory.getLogger(getClass());

    private ObjectMapper mapper = new ObjectMapper();

    @Autowired
    private InMemoryUserDetailsManager userDetailsManager;

   /* public void saveUser(User u) {
        userDetailsManager.createUser(org.springframework.security.core.userdetails.User.withDefaultPasswordEncoder()
                .username(u.username())
                .password(u.password())
                .roles("USER")
                .build());
    }*/

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
        File file = new File("user_diagrams.json");
        List<UserDiagram> users = new ArrayList<>();
        try {
            users.addAll(mapper.readValue(file, new TypeReference<List<UserDiagram>>() {
            }));
        } catch (IOException e) {
            log.error(e.getMessage(), e);
        }
        return users.stream().filter(u -> u.username().equals(username)).toList();
    }

    public UserDiagram saveDiagram(String id, String username, Map<String, Object> diagram) {
        File file = new File("user_diagrams.json");
        try {
            // 1) Leemos todos los diagramas
            List<UserDiagram> userDiagrams = mapper.readValue(
                    file, new TypeReference<List<UserDiagram>>() {});
            // 2) Buscamos si ya existía uno con este ID
            Optional<UserDiagram> existing = userDiagrams.stream()
                    .filter(d -> d.id().equals(id))
                    .findFirst();
            // 3) Determinamos el owner: si existía, lo mantenemos; si no, es quien crea por primera vez
            String owner = existing
                    .map(UserDiagram::username)
                    .orElse(username);
            // 4) Creamos el nuevo objeto con el owner correcto
            UserDiagram updated = new UserDiagram(id, owner, diagram);
            // 5) Reemplazamos la versión anterior (si la había)
            existing.ifPresent(userDiagrams::remove);
            userDiagrams.add(updated);
            // 6) Volvemos a escribir el JSON
            mapper.writeValue(file, userDiagrams);
            return updated;
        } catch (IOException e) {
            throw new IllegalArgumentException(e);
        }
    }


    public void deleteDiagram(String id) {
        File file = new File("user_diagrams.json");
        try {
            List<UserDiagram> userDiagrams = mapper.readValue(file, new TypeReference<List<UserDiagram>>() {
            });
            UserDiagram d = userDiagrams.stream().filter(t -> t.id().equals(id)).findFirst().get();
            userDiagrams.remove(d);
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

    public void addUser(User user) {
        File file = new File("users.json");
        try {
            List<User> users = mapper.readValue(file, new TypeReference<List<User>>() {});
            users.add(user);
            mapper.writeValue(file, users);
        } catch (IOException e) {
            log.error("Error al guardar usuario nuevo", e);
        }
    }

}
