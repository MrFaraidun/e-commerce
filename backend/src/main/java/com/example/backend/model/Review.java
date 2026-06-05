package com.example.backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.Date;
import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @jakarta.validation.constraints.Min(value = 1, message = "Rating must be at least 1")
    @jakarta.validation.constraints.Max(value = 5, message = "Rating must be at most 5")
    private int rating;
    
    @jakarta.validation.constraints.NotBlank(message = "Comment cannot be blank")
    @jakarta.validation.constraints.Size(max = 1000, message = "Comment must not exceed 1000 characters")
    private String comment;
    
    private Date date;

    @ManyToOne
    @JoinColumn(name = "product_id")
    @com.fasterxml.jackson.annotation.JsonIgnoreProperties({"reviews"})
    private Product product;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @com.fasterxml.jackson.annotation.JsonIgnoreProperties({"reviews", "orders", "addresses", "wishlist", "password"})
    private User user;
}
