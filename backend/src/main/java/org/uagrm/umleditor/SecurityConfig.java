package org.uagrm.umleditor;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public InMemoryUserDetailsManager userDetailsService() {
        List<UserDetails> authUsers = new ArrayList<>();
        File file = new File("users.json");
        ObjectMapper mapper = new ObjectMapper();

        try {
            List<org.uagrm.umleditor.User> users = mapper.readValue(file, new TypeReference<List<org.uagrm.umleditor.User>>() {});
            for (org.uagrm.umleditor.User u : users) {
                authUsers.add(
                        org.springframework.security.core.userdetails.User.withDefaultPasswordEncoder()
                                .username(u.username())
                                .password(u.password())
                                .roles("USER")
                                .build()
                );
            }
        } catch (IOException e) {
            System.out.println("❌ No se pudo leer users.json: " + e.getMessage());
        }

        return new InMemoryUserDetailsManager(authUsers);
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf(AbstractHttpConfigurer::disable);
        http
                .authorizeHttpRequests((requests) ->
                        requests
                                .requestMatchers("/ws", "/ws/**", "/api/register").permitAll()
                                .requestMatchers("/api", "/api/**").authenticated()
                                .anyRequest().permitAll()
                )
                .logout(logout -> logout.permitAll())
                .httpBasic(Customizer.withDefaults());

        return http.build();
    }
}
