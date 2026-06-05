package com.example.backend.service;

import com.example.backend.model.Address;
import com.example.backend.repository.AddressRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class AddressService {
    @Autowired
    private AddressRepository addressRepository;

    public List<Address> getAddressesByUserEmail(String email) {
        return addressRepository.findByUserEmail(email);
    }

    public Address saveAddress(Address address) {
        return addressRepository.save(address);
    }

    public Address getAddressById(Long id) {
        return addressRepository.findById(id).orElse(null);
    }

    public void deleteAddress(Long id) {
        addressRepository.deleteById(id);
    }
}
