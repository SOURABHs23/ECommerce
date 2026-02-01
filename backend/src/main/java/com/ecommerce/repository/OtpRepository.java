package com.ecommerce.repository;

import com.ecommerce.entity.Otp;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OtpRepository extends MongoRepository<Otp, String> {

    Optional<Otp> findByJwt(String jwt);

    void deleteByJwt(String jwt);
}
