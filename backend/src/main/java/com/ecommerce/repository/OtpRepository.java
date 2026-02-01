package com.ecommerce.repository;

import com.ecommerce.entity.Otp;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Repository
public interface OtpRepository extends JpaRepository<Otp, Long> {

    Optional<Otp> findByJwt(String jwt);

    @Transactional
    @Modifying
    void deleteByJwt(String jwt);
}
