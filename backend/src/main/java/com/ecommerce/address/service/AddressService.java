package com.ecommerce.address.service;

import com.ecommerce.address.dto.AddressRequest;
import com.ecommerce.address.dto.AddressResponse;

import java.util.List;

public interface AddressService {
    List<AddressResponse> getUserAddresses(Long userId);

    AddressResponse getAddressById(Long addressId, Long userId);

    AddressResponse createAddress(AddressRequest request, Long userId);

    AddressResponse updateAddress(Long addressId, AddressRequest request, Long userId);

    void setDefaultAddress(Long addressId, Long userId);

    void deleteAddress(Long addressId, Long userId);
}
