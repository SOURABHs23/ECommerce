package com.ecommerce.address.service;

import com.ecommerce.address.model.Address;
import com.ecommerce.address.repository.AddressRepository;
import com.ecommerce.address.dto.AddressRequest;
import com.ecommerce.address.dto.AddressResponse;

import com.ecommerce.common.exception.ResourceNotFoundException;
import com.ecommerce.user.model.User;
import com.ecommerce.user.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AddressServiceImpl implements AddressService {

    private static final Logger logger = LoggerFactory.getLogger(AddressServiceImpl.class);

    private final AddressRepository addressRepository;
    private final UserService userService;

    public AddressServiceImpl(AddressRepository addressRepository, UserService userService) {
        this.addressRepository = addressRepository;
        this.userService = userService;
    }

    @Override
    public List<AddressResponse> getUserAddresses(Long userId) {
        return addressRepository.findByUserIdOrderByIsDefaultDescCreatedAtDesc(userId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public AddressResponse getAddressById(Long addressId, Long userId) {
        Address address = addressRepository.findByIdAndUserId(addressId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Address not found"));
        return toResponse(address);
    }

    @Override
    @Transactional
    public AddressResponse createAddress(AddressRequest request, Long userId) {
        User user = userService.findById(userId);

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
        address.setIsDefault(request.getIsDefault());

        if (request.getIsDefault()) {
            addressRepository.findByUserIdOrderByIsDefaultDescCreatedAtDesc(userId).forEach(a -> {
                a.setIsDefault(false);
                addressRepository.save(a);
            });
        }

        address = addressRepository.save(address);
        logger.info("Created address {} for user {}", address.getId(), userId);
        return toResponse(address);
    }

    @Override
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

        address = addressRepository.save(address);
        logger.info("Updated address {} for user {}", addressId, userId);
        return toResponse(address);
    }

    @Override
    @Transactional
    public void setDefaultAddress(Long addressId, Long userId) {
        addressRepository.findByUserIdOrderByIsDefaultDescCreatedAtDesc(userId).forEach(a -> {
            a.setIsDefault(a.getId().equals(addressId));
            addressRepository.save(a);
        });
        logger.info("Set default address {} for user {}", addressId, userId);
    }

    @Override
    @Transactional
    public void deleteAddress(Long addressId, Long userId) {
        Address address = addressRepository.findByIdAndUserId(addressId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Address not found"));
        addressRepository.delete(address);
        logger.info("Deleted address {} for user {}", addressId, userId);
    }

    private AddressResponse toResponse(Address address) {
        return AddressResponse.builder()
                .id(address.getId())
                .fullName(address.getFullName())
                .phone(address.getPhone())
                .addressLine1(address.getAddressLine1())
                .addressLine2(address.getAddressLine2())
                .city(address.getCity())
                .state(address.getState())
                .postalCode(address.getPostalCode())
                .country(address.getCountry())
                .type(address.getType())
                .isDefault(address.getIsDefault())
                .build();
    }
}
