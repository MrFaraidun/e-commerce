package com.example.backend.controller;

import com.example.backend.model.Address;
import com.example.backend.service.AddressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

import com.example.backend.repository.UserRepository;
import com.example.backend.model.User;
import java.security.Principal;

@RestController
@RequestMapping("/api/addresses")
public class AddressController {
    @Autowired
    private AddressService addressService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/my")
    public List<Address> getMyAddresses(Principal principal) {
        if (principal == null) return List.of();
        return addressService.getAddressesByUserEmail(principal.getName());
    }

    @PostMapping
    public org.springframework.http.ResponseEntity<?> create(@RequestBody Address address, Principal principal) {
        if (principal == null) {
            return org.springframework.http.ResponseEntity.status(org.springframework.http.HttpStatus.UNAUTHORIZED).build();
        }
        User user = userRepository.findByEmail(principal.getName());
        if (user == null) {
            return org.springframework.http.ResponseEntity.status(org.springframework.http.HttpStatus.UNAUTHORIZED).build();
        }
        address.setUser(user);
        return org.springframework.http.ResponseEntity.ok(addressService.saveAddress(address));
    }

    @DeleteMapping("/{id}")
    public org.springframework.http.ResponseEntity<?> delete(@PathVariable Long id, Principal principal) {
        if (principal == null) {
            return org.springframework.http.ResponseEntity.status(org.springframework.http.HttpStatus.UNAUTHORIZED).build();
        }
        Address address = addressService.getAddressById(id);
        if (address == null) {
            return org.springframework.http.ResponseEntity.notFound().build();
        }
        User user = userRepository.findByEmail(principal.getName());
        if (user == null) {
            return org.springframework.http.ResponseEntity.status(org.springframework.http.HttpStatus.UNAUTHORIZED).build();
        }
        if (!address.getUser().getId().equals(user.getId()) && !user.getRole().equals("ADMIN")) {
            return org.springframework.http.ResponseEntity.status(org.springframework.http.HttpStatus.FORBIDDEN).body("Access Denied");
        }
        addressService.deleteAddress(id);
        return org.springframework.http.ResponseEntity.ok().build();
    }
}
