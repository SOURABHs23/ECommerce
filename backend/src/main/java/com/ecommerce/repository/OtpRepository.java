package com.ecommerce.repository;

import com.ecommerce.entity.Otp;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface OtpRepository extends JpaRepository<Otp, Long> {

    Optional<Otp> findByJwt(String jwt);

    @Transactional
    @Modifying
    void deleteByJwt(String jwt);

    /**
     * Delete all OTPs created before the specified time.
     * 
     * @param expirationTime the cutoff time - OTPs created before this will be
     *                       deleted
     * @return the number of deleted records
     */
    @Transactional
    @Modifying
    @Query("DELETE FROM Otp o WHERE o.createdAt < :expirationTime")
    int deleteExpiredOtps(@Param("expirationTime") LocalDateTime expirationTime);
}
