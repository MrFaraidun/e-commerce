package com.example.backend.controller;

import com.example.backend.model.Review;
import com.example.backend.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

import com.example.backend.repository.UserRepository;
import com.example.backend.model.User;
import java.security.Principal;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {
    @Autowired
    private ReviewService reviewService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/product/{productId}")
    public List<Review> getByProduct(@PathVariable Long productId) {
        return reviewService.getReviewsByProductId(productId);
    }

    @PostMapping
    public org.springframework.http.ResponseEntity<?> create(@RequestBody Review review, Principal principal) {
        if (principal == null) {
            return org.springframework.http.ResponseEntity.status(org.springframework.http.HttpStatus.UNAUTHORIZED).build();
        }
        User user = userRepository.findByEmail(principal.getName());
        if (user == null) {
            return org.springframework.http.ResponseEntity.status(org.springframework.http.HttpStatus.UNAUTHORIZED).build();
        }
        review.setUser(user);
        return org.springframework.http.ResponseEntity.ok(reviewService.saveReview(review));
    }

    @DeleteMapping("/{id}")
    public org.springframework.http.ResponseEntity<?> delete(@PathVariable Long id, Principal principal) {
        if (principal == null) {
            return org.springframework.http.ResponseEntity.status(org.springframework.http.HttpStatus.UNAUTHORIZED).build();
        }
        Review review = reviewService.getReviewById(id);
        if (review == null) {
            return org.springframework.http.ResponseEntity.notFound().build();
        }
        User user = userRepository.findByEmail(principal.getName());
        if (user == null) {
            return org.springframework.http.ResponseEntity.status(org.springframework.http.HttpStatus.UNAUTHORIZED).build();
        }
        if (!review.getUser().getId().equals(user.getId()) && !user.getRole().equals("ADMIN")) {
            return org.springframework.http.ResponseEntity.status(org.springframework.http.HttpStatus.FORBIDDEN).body("Access Denied");
        }
        reviewService.deleteReview(id);
        return org.springframework.http.ResponseEntity.ok().build();
    }
}
