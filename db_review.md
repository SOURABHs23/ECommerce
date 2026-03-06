# 🔍 Senior Architect — Database Design Review

> Reviewed all **11 entity models**, **8 repositories**, and **3 service implementations** across the ECommerce project.

---

## Verdict: ✅ Solid Foundation with Fixable Issues

The overall schema design is **well-structured** — proper normalization, good use of audit timestamps, clean separation of concerns. However, there are **critical** and **important** issues that should be addressed before production.

---

## 🔴 Critical Issues

### 1. Race Condition on Stock Decrement

> [!CAUTION]
> **Two users ordering the same product simultaneously can oversell stock.**

**Where:** [OrderServiceImpl.java](file:///Users/sourabhgarg/ECommerce/backend/src/main/java/com/ecommerce/order/service/OrderServiceImpl.java#L84-L106)

The code reads stock, checks it in Java, then decrements — a classic **check-then-act** race condition.

```java
// ❌ Current: vulnerable to concurrent overselling
if (product.getStock() < cartItem.getQuantity()) { ... }
product.setStock(product.getStock() - cartItem.getQuantity());
```

**Fix:** Use pessimistic locking or an atomic DB-level update:

```java
// ✅ Option A: @Lock on Repository
@Lock(LockModeType.PESSIMISTIC_WRITE)
@Query("SELECT p FROM Product p WHERE p.id = :id")
Optional<Product> findByIdForUpdate(@Param("id") Long id);

// ✅ Option B: Atomic UPDATE (best)
@Modifying
@Query("UPDATE Product p SET p.stock = p.stock - :qty WHERE p.id = :id AND p.stock >= :qty")
int decrementStock(@Param("id") Long id, @Param("qty") int qty);
// Returns 0 if stock insufficient → throw exception
```

---

### 2. Missing Database Indexes

> [!CAUTION]
> **Queries are running full table scans on high-traffic columns.**

Your repositories query these columns frequently but **none have indexes defined** in the entity:

| Table | Column(s) | Query | Impact |
|-------|-----------|-------|--------|
| `products` | `active` | `findByActiveTrue()` | Every product page load |
| `products` | `category_id + active` | `findByCategoryIdAndActiveTrue()` | Category browsing |
| `products` | `featured + active` | `findByFeaturedTrueAndActiveTrue()` | Homepage |
| `products` | `name, description, brand` | `searchProducts()` | Every search |
| `orders` | `user_id + created_at` | `findByUserIdOrderByCreatedAtDesc()` | Order history |
| `addresses` | `user_id + is_default` | `findByUserIdOrderByIsDefaultDesc()` | Checkout |
| `cart_items` | `cart_id + product_id` | `findByCartIdAndProductId()` | Add to cart |

**Fix:** Add `@Table` indexes on the entity:

```java
@Table(name = "products", indexes = {
    @Index(name = "idx_product_active", columnList = "active"),
    @Index(name = "idx_product_category_active", columnList = "category_id, active"),
    @Index(name = "idx_product_featured_active", columnList = "featured, active")
})
```

---

### 3. Dangerous `CascadeType.ALL` on Category → Products

> [!CAUTION]
> **Deleting a category will cascade-delete ALL its products**, including products referenced by existing orders.

**Where:** [Category.java:L44](file:///Users/sourabhgarg/ECommerce/backend/src/main/java/com/ecommerce/category/model/Category.java#L44)

```java
// ❌ Cascade ALL = deleting a category destroys all products under it
@OneToMany(mappedBy = "category", cascade = CascadeType.ALL)
private List<Product> products = new ArrayList<>();
```

**Fix:** Remove cascade or limit to safe operations:

```java
// ✅ No cascade — products managed independently
@OneToMany(mappedBy = "category")
private List<Product> products = new ArrayList<>();
```

---

## 🟡 Important Issues

### 4. SKU Has No Unique Constraint in DB

The service checks `existsBySku()` in Java, but nothing prevents a race condition at DB level.

```java
// ❌ Java-level check only (race condition)
if (request.getSku() != null && productRepository.existsBySku(request.getSku())) { ... }
```

**Fix:** Add unique constraint on the entity:
```java
@Column(unique = true)
private String sku;
```

---

### 5. OTP Not Linked to User

The `Otp` entity has no foreign key to `User` — it only stores a JWT. This means:
- Cannot query "all OTPs for a user" directly
- Cannot enforce one-active-OTP-per-user at DB level
- No cleanup if user is deleted

**Fix:** Add user reference:
```java
@ManyToOne(fetch = FetchType.LAZY)
@JoinColumn(name = "user_id")
private User user;

@Column(nullable = false)
private String purpose; // "EMAIL_VERIFICATION", "PASSWORD_RESET"
```

---

### 6. No JPA Validation Annotations

Entities rely entirely on DB-level `nullable = false` but have **zero `@NotBlank`, `@Email`, `@Size`, `@Min`** annotations. Errors only surface as ugly SQL exceptions instead of clean validation messages.

**Fix on User.java:**
```java
@NotBlank(message = "First name is required")
private String firstname;

@Email(message = "Invalid email format")
@NotBlank(message = "Email is required")
@Column(unique = true, nullable = false)
private String email;

@Size(min = 8, message = "Password must be at least 8 characters")
private String password;
```

**Fix on Product.java:**
```java
@NotBlank(message = "Product name is required")
private String name;

@Min(value = 0, message = "Price cannot be negative")
@Column(nullable = false, precision = 10, scale = 2)
private BigDecimal price;

@Min(value = 0, message = "Stock cannot be negative")
private Integer stock = 0;
```

---

### 7. Address Deletion Can Break Orders

An `Address` referenced by `orders.shipping_address_id` (NOT NULL FK) can be freely deleted. This would either:
- Cause a **FK violation** error, or
- With cascade, destroy order data

**Fix:** Add soft-delete to Address:
```java
private Boolean deleted = false; // soft-delete flag
```

---

### 8. No Unique Constraint on Cart per Product

A user can add the same product to their cart multiple times as separate rows. The service checks this in Java via `findByCartIdAndProductId()`, but there's no DB guarantee.

**Fix:**
```java
@Table(name = "cart_items", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"cart_id", "product_id"})
})
```

---

## 🟢 Nice-to-Have Improvements

### 9. `User.mobile` Should Be `String`, Not `Long`

Phone numbers with leading zeros (e.g., `091-xxx`) get truncated as `Long`. International numbers with `+` prefix can't be stored.

```java
// ❌ Current
private Long mobile;

// ✅ Better
@Column(length = 15)
private String mobile;
```

---

### 10. Missing `@Version` for Optimistic Locking

No entity has `@Version`, so concurrent updates silently overwrite each other ("last write wins"). Key entities like `Product` and `Order` should have:

```java
@Version
private Long version;
```

---

### 11. Order Uses `@PrePersist` UUID — Consider DB Sequence

The UUID-based order number (`ORD-XXXXXXXX`) uses only 8 hex chars = ~4 billion combinations. For a high-volume system, consider a DB sequence:

```java
// ✅ Guaranteed unique, sortable, shorter
@Column(unique = true, nullable = false)
private String orderNumber; // "ORD-000001234"
// Generated from: PostgreSQL SEQUENCE
```

---

### 12. No `@EntityGraph` — N+1 Query Risk

Fetching a list of orders causes N+1 queries to load items. The `findByUserIdOrderByCreatedAtDesc()` paginated query doesn't fetch-join items.

**Fix:** Use `@EntityGraph`:
```java
@EntityGraph(attributePaths = {"items", "shippingAddress"})
Page<Order> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);
```

---

## Summary Scorecard

| Area | Score | Notes |
|------|-------|-------|
| **Normalization** | ⭐⭐⭐⭐⭐ | Properly normalized, no redundancy |
| **Relationships** | ⭐⭐⭐⭐ | Good structure, fix cascade on Category→Product |
| **Data Integrity** | ⭐⭐⭐ | Missing unique constraints, no optimistic locking |
| **Concurrency Safety** | ⭐⭐ | Race conditions on stock, no `@Version` |
| **Indexing** | ⭐⭐ | Zero custom indexes on frequently queried columns |
| **Validation** | ⭐⭐ | No `@NotBlank`/`@Size`/`@Min` annotations |
| **Audit & Soft Delete** | ⭐⭐⭐⭐ | Good timestamps, missing soft-delete on Address |
| **Scalability** | ⭐⭐⭐ | Pagination present, but N+1 risks and LIKE search |

> **Overall: 3.5/5** — Great foundation. Fix the 🔴 critical items (stock race condition, indexes, cascade) and you'll be production-ready.
