package com.ecommerce.controller;

import com.ecommerce.dto.request.AddressRequest;
import com.ecommerce.dto.response.AddressResponse;
import com.ecommerce.entity.User;
import com.ecommerce.repository.UserRepository;
import com.ecommerce.security.JwtTokenProvider;
import com.ecommerce.security.JwtUtils;
import com.ecommerce.service.AddressService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/addresses")
public class AddressController {

    private final AddressService addressService;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserRepository userRepository;

    public AddressController(AddressService addressService, JwtTokenProvider jwtTokenProvider,
            UserRepository userRepository) {
        this.addressService = addressService;
        this.jwtTokenProvider = jwtTokenProvider;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<List<AddressResponse>> getUserAddresses(HttpServletRequest request) {
        User user = getCurrentUser(request);
        return ResponseEntity.ok(addressService.getUserAddresses(user.getId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<AddressResponse> getAddressById(
            @PathVariable Long id,
            HttpServletRequest request) {
        User user = getCurrentUser(request);
        return ResponseEntity.ok(addressService.getAddressById(id, user.getId()));
    }

    @PostMapping
    public ResponseEntity<AddressResponse> createAddress(
            @Valid @RequestBody AddressRequest addressRequest,
            HttpServletRequest request) {
        User user = getCurrentUser(request);
        AddressResponse address = addressService.createAddress(addressRequest, user);
        return ResponseEntity.status(HttpStatus.CREATED).body(address);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AddressResponse> updateAddress(
            @PathVariable Long id,
            @Valid @RequestBody AddressRequest addressRequest,
            HttpServletRequest request) {
        User user = getCurrentUser(request);
        return ResponseEntity.ok(addressService.updateAddress(id, addressRequest, user.getId()));
    }

    @PatchMapping("/{id}/default")
    public ResponseEntity<Void> setDefaultAddress(
            @PathVariable Long id,
            HttpServletRequest request) {
        User user = getCurrentUser(request);
        addressService.setDefaultAddress(id, user.getId());
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAddress(
            @PathVariable Long id,
            HttpServletRequest request) {
        User user = getCurrentUser(request);
        addressService.deleteAddress(id, user.getId());
        return ResponseEntity.noContent().build();
    }

    private User getCurrentUser(HttpServletRequest request) {
        String jwt = JwtUtils.extractJwtFromRequest(request);
        String userId = jwtTokenProvider.getUserIdFromToken(jwt);
        return userRepository.findById(Long.parseLong(userId))
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
