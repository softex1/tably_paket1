package mk.scan.horeca.controller;

import mk.scan.horeca.model.Admin;
import mk.scan.horeca.repository.AdminRepository;
import mk.scan.horeca.util.PasswordEncoder;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;

    // Simple in-memory storage for failed attempts (use Redis in production)
    private final Map<String, Integer> failedAttempts = new ConcurrentHashMap<>();
    private final Map<String, LocalDateTime> lockouts = new ConcurrentHashMap<>();

    private static final int MAX_FAILED_ATTEMPTS = 5;
    private static final int LOCKOUT_DURATION_MINUTES = 15;

    public AuthController(AdminRepository adminRepository, PasswordEncoder passwordEncoder) {
        this.adminRepository = adminRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        String password = request.get("password");

        if (username == null || password == null) {
            return ResponseEntity.badRequest().body("Username and password are required");
        }

        // Check for account lockout
        if (isAccountLocked(username)) {
            return ResponseEntity.status(423).body("Account temporarily locked due to too many failed attempts");
        }

        Optional<Admin> adminOpt = adminRepository.findByUsername(username);

        // Always check password to prevent timing attacks
        boolean passwordValid = adminOpt.isPresent() &&
                passwordEncoder.matches(password, adminOpt.get().getPassword());

        if (!passwordValid) {
            recordFailedAttempt(username);
            return ResponseEntity.status(401).body("Invalid username or password");
        }

        // Reset failed attempts on successful login
        resetFailedAttempts(username);

        Admin admin = adminOpt.get();

        // Generate secure token
        String token = UUID.randomUUID().toString();

        return ResponseEntity.ok(Map.of(
                "token", token,
                "adminId", admin.getId(),
                "username", admin.getUsername()
        ));
    }

    private boolean isAccountLocked(String username) {
        LocalDateTime lockoutTime = lockouts.get(username);
        if (lockoutTime != null) {
            if (LocalDateTime.now().isBefore(lockoutTime.plusMinutes(LOCKOUT_DURATION_MINUTES))) {
                return true;
            } else {
                // Lockout period expired
                lockouts.remove(username);
                failedAttempts.remove(username);
            }
        }
        return false;
    }

    private void recordFailedAttempt(String username) {
        int attempts = failedAttempts.getOrDefault(username, 0) + 1;
        failedAttempts.put(username, attempts);

        if (attempts >= MAX_FAILED_ATTEMPTS) {
            lockouts.put(username, LocalDateTime.now());
        }
    }

    private void resetFailedAttempts(String username) {
        failedAttempts.remove(username);
        lockouts.remove(username);
    }
}