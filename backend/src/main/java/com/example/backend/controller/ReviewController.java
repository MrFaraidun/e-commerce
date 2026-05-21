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
@CrossOrigin(origins = "*")
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
    public Review create(@RequestBody Review review, Principal principal) {
        User user = userRepository.findByEmail(principal.getName());
        review.setUser(user);
        return reviewService.saveReview(review);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id, Principal principal) {
        // Ownership check can be added here
        reviewService.deleteReview(id);
    }
}
