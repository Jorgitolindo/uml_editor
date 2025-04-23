package org.uagrm.umleditor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.stereotype.Service;

@Service
public class UserAuthService {

    @Autowired
    private InMemoryUserDetailsManager userDetailsManager;

    public void saveUser(org.uagrm.umleditor.User u) {
        userDetailsManager.createUser(User.withDefaultPasswordEncoder()
                .username(u.username())
                .password(u.password())
                .roles("USER")
                .build());
    }
}
