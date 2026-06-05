package com.example.backend.controller;

import com.example.backend.model.Order;
import com.example.backend.model.User;
import com.example.backend.service.OrderService;
import com.example.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    @Autowired
    private OrderService orderService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public org.springframework.http.ResponseEntity<?> getAll(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername());
        if (user == null || !user.getRole().equals("ADMIN")) {
            return org.springframework.http.ResponseEntity.status(org.springframework.http.HttpStatus.FORBIDDEN).body("Access Denied");
        }
        return org.springframework.http.ResponseEntity.ok(orderService.getAllOrders());
    }

    @GetMapping("/my-orders")
    public List<Order> getMyOrders(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) return List.of();
        User user = userRepository.findByEmail(userDetails.getUsername());
        return orderService.getOrdersByUser(user);
    }

    @GetMapping("/{id}")
    public org.springframework.http.ResponseEntity<?> getById(@PathVariable Long id, @AuthenticationPrincipal UserDetails userDetails) {
        Order order = orderService.getOrderById(id);
        if (order == null) {
            return org.springframework.http.ResponseEntity.notFound().build();
        }
        User user = userRepository.findByEmail(userDetails.getUsername());
        if (user == null) {
            return org.springframework.http.ResponseEntity.status(org.springframework.http.HttpStatus.UNAUTHORIZED).build();
        }
        if (!order.getUser().getId().equals(user.getId()) && !user.getRole().equals("ADMIN")) {
            return org.springframework.http.ResponseEntity.status(org.springframework.http.HttpStatus.FORBIDDEN).body("Access Denied");
        }
        return org.springframework.http.ResponseEntity.ok(order);
    }

    @PostMapping
    public org.springframework.http.ResponseEntity<?> create(@RequestBody Order order, @AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return org.springframework.http.ResponseEntity.status(org.springframework.http.HttpStatus.UNAUTHORIZED).build();
        }
        User user = userRepository.findByEmail(userDetails.getUsername());
        if (user == null) {
            return org.springframework.http.ResponseEntity.status(org.springframework.http.HttpStatus.UNAUTHORIZED).build();
        }
        order.setUser(user);
        order.setOrderDate(new java.util.Date());
        
        // Link items to the order so Hibernate can save the order_id correctly
        if (order.getItems() != null) {
            for (com.example.backend.model.OrderItem item : order.getItems()) {
                item.setOrder(order);
            }
        }
        
        return org.springframework.http.ResponseEntity.ok(orderService.saveOrder(order));
    }

    @PutMapping("/{id}")
    public org.springframework.http.ResponseEntity<?> update(@PathVariable Long id, @RequestBody Order order, @AuthenticationPrincipal UserDetails userDetails) {
        Order existing = orderService.getOrderById(id);
        if (existing == null) {
            return org.springframework.http.ResponseEntity.notFound().build();
        }
        User user = userRepository.findByEmail(userDetails.getUsername());
        if (user == null) {
            return org.springframework.http.ResponseEntity.status(org.springframework.http.HttpStatus.UNAUTHORIZED).build();
        }
        if (!existing.getUser().getId().equals(user.getId()) && !user.getRole().equals("ADMIN")) {
            return org.springframework.http.ResponseEntity.status(org.springframework.http.HttpStatus.FORBIDDEN).body("Access Denied");
        }
        existing.setStatus(order.getStatus());
        return org.springframework.http.ResponseEntity.ok(orderService.saveOrder(existing));
    }

    @DeleteMapping("/{id}")
    public org.springframework.http.ResponseEntity<?> delete(@PathVariable Long id, @AuthenticationPrincipal UserDetails userDetails) {
        Order existing = orderService.getOrderById(id);
        if (existing == null) {
            return org.springframework.http.ResponseEntity.notFound().build();
        }
        User user = userRepository.findByEmail(userDetails.getUsername());
        if (user == null) {
            return org.springframework.http.ResponseEntity.status(org.springframework.http.HttpStatus.UNAUTHORIZED).build();
        }
        if (!existing.getUser().getId().equals(user.getId()) && !user.getRole().equals("ADMIN")) {
            return org.springframework.http.ResponseEntity.status(org.springframework.http.HttpStatus.FORBIDDEN).body("Access Denied");
        }
        orderService.deleteOrder(id);
        return org.springframework.http.ResponseEntity.ok().build();
    }
}
