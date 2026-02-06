package com.ecommerce.controller;

import com.ecommerce.dto.request.AddressRequest;
import com.ecommerce.dto.response.AddressResponse;
import com.ecommerce.entity.User;
import com.ecommerce.service.AddressService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/addresses")
public class AddressController {

    private final AddressService addressService;

    public AddressController(AddressService addressService) {
        this.addressService = addressService;
    }

    @GetMapping
    public ResponseEntity<List<AddressResponse>> getUserAddresses(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(addressService.getUserAddresses(user.getId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<AddressResponse> getAddressById(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(addressService.getAddressById(id, user.getId()));
    }

    @PostMapping
    public ResponseEntity<AddressResponse> createAddress(
            @Valid @RequestBody AddressRequest addressRequest,
            @AuthenticationPrincipal User user) {
        AddressResponse address = addressService.createAddress(addressRequest, user);
        return ResponseEntity.status(HttpStatus.CREATED).body(address);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AddressResponse> updateAddress(
            @PathVariable Long id,
            @Valid @RequestBody AddressRequest addressRequest,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(addressService.updateAddress(id, addressRequest, user.getId()));
    }

    @PatchMapping("/{id}/default")
    public ResponseEntity<Void> setDefaultAddress(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {
        addressService.setDefaultAddress(id, user.getId());
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAddress(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {
        addressService.deleteAddress(id, user.getId());
        return ResponseEntity.noContent().build();
    }
}
