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
    
    private int rating;
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
