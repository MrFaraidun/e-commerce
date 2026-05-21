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
@CrossOrigin(origins = "*")
public class OrderController {
    @Autowired
    private OrderService orderService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public List<Order> getAll() {
        return orderService.getAllOrders();
    }

    @GetMapping("/my-orders")
    public List<Order> getMyOrders(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) return List.of();
        User user = userRepository.findByEmail(userDetails.getUsername());
        return orderService.getOrdersByUser(user);
    }

    @GetMapping("/{id}")
    public Order getById(@PathVariable Long id) {
        return orderService.getOrderById(id);
    }

    @PostMapping
    public Order create(@RequestBody Order order, @AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails != null) {
            User user = userRepository.findByEmail(userDetails.getUsername());
            order.setUser(user);
        }
        order.setOrderDate(new java.util.Date());
        
        // Link items to the order so Hibernate can save the order_id correctly
        if (order.getItems() != null) {
            for (com.example.backend.model.OrderItem item : order.getItems()) {
                item.setOrder(order);
            }
        }
        
        return orderService.saveOrder(order);
    }

    @PutMapping("/{id}")
    public Order update(@PathVariable Long id, @RequestBody Order order) {
        Order existing = orderService.getOrderById(id);
        existing.setStatus(order.getStatus());
        return orderService.saveOrder(existing);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        orderService.deleteOrder(id);
    }
}
