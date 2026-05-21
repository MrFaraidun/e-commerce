package com.example.backend.config;

import com.example.backend.model.Category;
import com.example.backend.model.Product;
import com.example.backend.repository.CategoryRepository;
import com.example.backend.repository.ProductRepository;
import com.example.backend.model.User;
import com.example.backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Arrays;
import java.util.ArrayList;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner initDatabase(CategoryRepository categoryRepo, ProductRepository productRepo, UserRepository userRepo, PasswordEncoder passwordEncoder) {
        return args -> {
            if (categoryRepo.count() == 0) {
                // Create Categories
                Category electronics = new Category(null, "Electronics", "Zap", null);
                Category fashion = new Category(null, "Fashion", "Shirt", null);
                Category furniture = new Category(null, "Furniture", "Sofa", null);
                Category accessories = new Category(null, "Accessories", "Watch", null);
                categoryRepo.saveAll(Arrays.asList(electronics, fashion, furniture, accessories));

                // Create Products
                productRepo.save(new Product(null, "Wireless Pro Headphones", "High-fidelity noise cancelling headphones with 30-hour battery life.", 299.99, "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400", electronics, null));
                productRepo.save(new Product(null, "Smart Watch Elite", "Premium titanium casing with health monitoring and 4-day battery.", 450.00, "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400", electronics, null));
                productRepo.save(new Product(null, "Minimalist Desk Lamp", "Adjustable warm-to-cool LED lighting for your workspace.", 89.00, "https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?w=400", furniture, null));
                productRepo.save(new Product(null, "Leather Portfolio", "Hand-stitched Italian leather portfolio for professionals.", 120.00, "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400", fashion, null));
                productRepo.save(new Product(null, "Ergonomic Office Chair", "Premium mesh chair with lumbar support and adjustable armrests.", 890.00, "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=400", furniture, null));
                productRepo.save(new Product(null, "Canvas Backpack", "Water-resistant canvas with leather accents. Fits 15\" laptop.", 159.00, "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400", accessories, null));
                productRepo.save(new Product(null, "Bluetooth Speaker", "360-degree sound with deep bass and 12-hour playtime.", 79.99, "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400", electronics, null));
                productRepo.save(new Product(null, "Sunglasses Classic", "Polarized UV400 lenses with lightweight titanium frame.", 195.00, "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400", accessories, null));

                System.out.println("✅ Database Seeded Successfully!");
            }
            
            if (userRepo.count() == 0) {
                User admin = new User();
                admin.setUsername("Admin User");
                admin.setPassword(passwordEncoder.encode("admin123"));
                admin.setEmail("admin@enterprise.com");
                admin.setRole("ADMIN");
                admin.setAddresses(new ArrayList<>());
                admin.setOrders(new ArrayList<>());
                admin.setReviews(new ArrayList<>());
                userRepo.save(admin);

                User normalUser = new User();
                normalUser.setUsername("John Doe");
                normalUser.setPassword(passwordEncoder.encode("user123"));
                normalUser.setEmail("user@enterprise.com");
                normalUser.setRole("USER");
                normalUser.setAddresses(new ArrayList<>());
                normalUser.setOrders(new ArrayList<>());
                normalUser.setReviews(new ArrayList<>());
                userRepo.save(normalUser);

                System.out.println("✅ Users Seeded! Admin: admin@enterprise.com/admin123 | User: user@enterprise.com/user123");
            }
        };
    }
}

