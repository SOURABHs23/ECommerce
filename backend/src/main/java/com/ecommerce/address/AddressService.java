package com.ecommerce.address;

import com.ecommerce.address.AddressRequest;
import com.ecommerce.address.AddressResponse;
import com.ecommerce.user.User;

import java.util.List;

public interface AddressService {
    List<AddressResponse> getUserAddresses(Long userId);

    AddressResponse getAddressById(Long addressId, Long userId);

    AddressResponse createAddress(AddressRequest request, User user);

    AddressResponse updateAddress(Long addressId, AddressRequest request, Long userId);

    void setDefaultAddress(Long addressId, Long userId);

    void deleteAddress(Long addressId, Long userId);
}
