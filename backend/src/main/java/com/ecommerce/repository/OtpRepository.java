package com.ecommerce.repository;

import com.ecommerce.entity.Otp;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OtpRepository extends JpaRepository<Otp, Long> {

    Optional<Otp> findByJwt(String jwt);

    void deleteByJwt(String jwt);
}
