package com.example.backend.repository;

import com.example.backend.model.Wishlist;
import com.example.backend.model.User;
import com.example.backend.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface WishlistRepository extends JpaRepository<Wishlist, Long> {
    List<Wishlist> findByUser(User user);
    Optional<Wishlist> findByUserAndProduct(User user, Product product);
    void deleteByUserAndProduct(User user, Product product);
}
