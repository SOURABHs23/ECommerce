package com.ecommerce.service;

import com.ecommerce.dto.request.AddressRequest;
import com.ecommerce.dto.response.AddressResponse;
import com.ecommerce.entity.User;

import java.util.List;

public interface AddressService {
    List<AddressResponse> getUserAddresses(Long userId);

    AddressResponse getAddressById(Long addressId, Long userId);

    AddressResponse createAddress(AddressRequest request, User user);

    AddressResponse updateAddress(Long addressId, AddressRequest request, Long userId);

    void setDefaultAddress(Long addressId, Long userId);

    void deleteAddress(Long addressId, Long userId);
}
