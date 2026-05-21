package com.example.backend.controller;

import com.example.backend.model.Product;
import com.example.backend.model.User;
import com.example.backend.model.Wishlist;
import com.example.backend.repository.ProductRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.repository.WishlistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/wishlist")
@CrossOrigin(origins = "*")
public class WishlistController {

    @Autowired
    private WishlistRepository wishlistRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @GetMapping
    public List<Wishlist> getWishlist(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null)
            return List.of();
        User user = userRepository.findByEmail(userDetails.getUsername());
        return wishlistRepository.findByUser(user);
    }

    @PostMapping("/toggle/{productId}")
    public ResponseEntity<?> toggleWishlist(@AuthenticationPrincipal UserDetails userDetails, @PathVariable Long productId) {
        if (userDetails == null) return ResponseEntity.status(401).body("User not authenticated");
        
        User user = userRepository.findByEmail(userDetails.getUsername());
        Product product = productRepository.findById(productId).orElseThrow();

        Optional<Wishlist> existing = wishlistRepository.findByUserAndProduct(user, product);

        if (existing.isPresent()) {
            wishlistRepository.delete(existing.get());
            return ResponseEntity.ok("Removed from wishlist");

        } else {
            Wishlist wishlist = new Wishlist();
            wishlist.setUser(user);
            wishlist.setProduct(product);
            wishlistRepository.save(wishlist);
            return ResponseEntity.ok("Added to wishlist");
        }
    }
}
