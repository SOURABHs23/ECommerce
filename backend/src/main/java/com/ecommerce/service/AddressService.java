package com.ecommerce.service;

import com.ecommerce.dto.request.AddressRequest;
import com.ecommerce.dto.response.AddressResponse;
import com.ecommerce.entity.Address;
import com.ecommerce.entity.User;
import com.ecommerce.exception.ResourceNotFoundException;
import com.ecommerce.repository.AddressRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AddressService {

    private static final Logger logger = LoggerFactory.getLogger(AddressService.class);

    private final AddressRepository addressRepository;

    public AddressService(AddressRepository addressRepository) {
        this.addressRepository = addressRepository;
    }

    public List<AddressResponse> getUserAddresses(Long userId) {
        return addressRepository.findByUserIdOrderByIsDefaultDescCreatedAtDesc(userId).stream()
                .map(AddressResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public AddressResponse getAddressById(Long addressId, Long userId) {
        Address address = addressRepository.findByIdAndUserId(addressId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Address not found"));
        return AddressResponse.fromEntity(address);
    }

    @Transactional
    public AddressResponse createAddress(AddressRequest request, User user) {
        Address address = new Address();
        address.setUser(user);
        address.setFullName(request.getFullName());
        address.setPhone(request.getPhone());
        address.setAddressLine1(request.getAddressLine1());
        address.setAddressLine2(request.getAddressLine2());
        address.setCity(request.getCity());
        address.setState(request.getState());
        address.setPostalCode(request.getPostalCode());
        address.setCountry(request.getCountry());
        address.setType(request.getType());

        // If this is the first address or marked as default
        if (request.getIsDefault() || addressRepository.countByUserId(user.getId()) == 0) {
            addressRepository.clearDefaultAddress(user.getId());
            address.setIsDefault(true);
        }

        address = addressRepository.save(address);
        logger.info("Created address for user: {}", user.getEmail());
        return AddressResponse.fromEntity(address);
    }

    @Transactional
    public AddressResponse updateAddress(Long addressId, AddressRequest request, Long userId) {
        Address address = addressRepository.findByIdAndUserId(addressId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Address not found"));

        address.setFullName(request.getFullName());
        address.setPhone(request.getPhone());
        address.setAddressLine1(request.getAddressLine1());
        address.setAddressLine2(request.getAddressLine2());
        address.setCity(request.getCity());
        address.setState(request.getState());
        address.setPostalCode(request.getPostalCode());
        address.setCountry(request.getCountry());
        address.setType(request.getType());

        if (request.getIsDefault()) {
            addressRepository.clearDefaultAddress(userId);
            address.setIsDefault(true);
        }

        address = addressRepository.save(address);
        logger.info("Updated address: {}", addressId);
        return AddressResponse.fromEntity(address);
    }

    @Transactional
    public void setDefaultAddress(Long addressId, Long userId) {
        Address address = addressRepository.findByIdAndUserId(addressId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Address not found"));

        addressRepository.clearDefaultAddress(userId);
        address.setIsDefault(true);
        addressRepository.save(address);
        logger.info("Set default address: {}", addressId);
    }

    @Transactional
    public void deleteAddress(Long addressId, Long userId) {
        Address address = addressRepository.findByIdAndUserId(addressId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Address not found"));

        addressRepository.delete(address);
        logger.info("Deleted address: {}", addressId);
    }
}
