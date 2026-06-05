package com.example.backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.Date;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "customer_order", indexes = {
    @Index(name = "idx_order_user_id", columnList = "user_id"),
    @Index(name = "idx_order_address_id", columnList = "address_id")
}) // 'order' is a reserved word in MySQL
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String status;
    private Double totalPrice;
    private Date orderDate;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonIgnoreProperties({ "orders", "addresses", "reviews", "wishlist", "password" })
    private User user;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    @JsonManagedReference("order-items")
    private List<OrderItem> items;

    @ManyToOne
    @JoinColumn(name = "address_id")
    private Address shippingAddress;
}
