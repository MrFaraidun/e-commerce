package com.example.backend.controller;

import com.example.backend.model.User;
import com.example.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private UserService userService;

    @Autowired
    private com.example.backend.repository.UserRepository userRepository;

    @GetMapping
    public List<User> getAll() {
        return userService.getAllUsers();
    }

    @GetMapping("/{id}")
    public org.springframework.http.ResponseEntity<?> getById(@PathVariable Long id, @org.springframework.security.core.annotation.AuthenticationPrincipal org.springframework.security.core.userdetails.UserDetails currentUser) {
        User dbUser = userRepository.findByEmail(currentUser.getUsername());
        if (dbUser == null) {
            return org.springframework.http.ResponseEntity.status(org.springframework.http.HttpStatus.UNAUTHORIZED).build();
        }
        if (!dbUser.getId().equals(id) && !dbUser.getRole().equals("ADMIN")) {
            return org.springframework.http.ResponseEntity.status(org.springframework.http.HttpStatus.FORBIDDEN).body("Access Denied");
        }
        User targetUser = userService.getUserById(id);
        if (targetUser == null) {
            return org.springframework.http.ResponseEntity.notFound().build();
        }
        return org.springframework.http.ResponseEntity.ok(targetUser);
    }

    @PostMapping
    public User create(@RequestBody User user) {
        return userService.saveUser(user);
    }

    @PutMapping("/{id}")
    public org.springframework.http.ResponseEntity<?> update(@PathVariable Long id, @RequestBody User userDetails, @org.springframework.security.core.annotation.AuthenticationPrincipal org.springframework.security.core.userdetails.UserDetails currentUser) {
        User dbUser = userRepository.findByEmail(currentUser.getUsername());
        if (dbUser == null) {
            return org.springframework.http.ResponseEntity.status(org.springframework.http.HttpStatus.UNAUTHORIZED).build();
        }
        if (!dbUser.getId().equals(id) && !dbUser.getRole().equals("ADMIN")) {
            return org.springframework.http.ResponseEntity.status(org.springframework.http.HttpStatus.FORBIDDEN).body("Access Denied");
        }
        
        User existingUser = userService.getUserById(id);
        if (existingUser == null) {
            return org.springframework.http.ResponseEntity.notFound().build();
        }
        
        existingUser.setUsername(userDetails.getUsername());
        existingUser.setEmail(userDetails.getEmail());
        
        // Only allow admins to promote user roles
        if (dbUser.getRole().equals("ADMIN") && userDetails.getRole() != null) {
            existingUser.setRole(userDetails.getRole());
        }
        
        return org.springframework.http.ResponseEntity.ok(userService.saveUser(existingUser));
    }

    @DeleteMapping("/{id}")
    public org.springframework.http.ResponseEntity<?> delete(@PathVariable Long id, @org.springframework.security.core.annotation.AuthenticationPrincipal org.springframework.security.core.userdetails.UserDetails currentUser) {
        User dbUser = userRepository.findByEmail(currentUser.getUsername());
        if (dbUser == null) {
            return org.springframework.http.ResponseEntity.status(org.springframework.http.HttpStatus.UNAUTHORIZED).build();
        }
        if (!dbUser.getId().equals(id) && !dbUser.getRole().equals("ADMIN")) {
            return org.springframework.http.ResponseEntity.status(org.springframework.http.HttpStatus.FORBIDDEN).body("Access Denied");
        }
        userService.deleteUser(id);
        return org.springframework.http.ResponseEntity.ok().build();
    }
}
