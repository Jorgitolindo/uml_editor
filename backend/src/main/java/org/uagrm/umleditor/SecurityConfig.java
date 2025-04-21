package org.uagrm.umleditor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;

import java.util.ArrayList;
import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private UserRepository userRepository;

    @Bean
    public InMemoryUserDetailsManager userDetailsService() {
        List<UserDetails> authUsers = new ArrayList<>();
        userRepository.listAll().forEach(u -> {
            authUsers.add(
                    User.withDefaultPasswordEncoder()
                            .username(u.username())
                            .password(u.password())
                            .roles("USER")
                            .build()
            );
        });

        return new InMemoryUserDetailsManager(authUsers);
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf(AbstractHttpConfigurer::disable);
        http
                .authorizeHttpRequests((requests) ->
                        requests.anyRequest().authenticated()
                ).logout((logout) -> logout.permitAll())
                .httpBasic(Customizer.withDefaults());
        return http.build();
    }
}
