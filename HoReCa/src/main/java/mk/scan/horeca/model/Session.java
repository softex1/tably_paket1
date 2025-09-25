package mk.scan.horeca.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
public class Session {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private TableEntity table;

    @Column(nullable = false, unique = true)
    private String token;

    private LocalDateTime createdAt;
    private LocalDateTime expiresAt;

    private boolean active = true;

    public Session() {}

    public Session(TableEntity table) {
        this.table = table;
        this.token = UUID.randomUUID().toString();
        this.createdAt = LocalDateTime.now();
        this.expiresAt = LocalDateTime.now().plusMinutes(1);
    }

    public boolean isExpired() {
        boolean expired = LocalDateTime.now().isAfter(expiresAt);
        if (expired && active) {
            // Auto-deactivate when expired
            active = false;
        }
        return expired;
    }

    // Add a method to check validity that includes both active status and expiration
    public boolean isValid() {
        return active && !isExpired();
    }

    // Rest of your getters and setters remain the same...
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public boolean isActive() {
        return active;
    }

    public TableEntity getTable() {
        return table;
    }

    public void setTable(TableEntity table) {
        this.table = table;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getExpiresAt() {
        return expiresAt;
    }

    public void setExpiresAt(LocalDateTime expiresAt) {
        this.expiresAt = expiresAt;
    }

    public void setActive(boolean active) {
        this.active = active;
    }
}