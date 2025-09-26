package mk.scan.horeca.controller;

import mk.scan.horeca.model.Admin;
import mk.scan.horeca.repository.AdminRepository;
import mk.scan.horeca.util.PasswordEncoder;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin/users")
public class UserController {

    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;

    public UserController(AdminRepository adminRepository, PasswordEncoder passwordEncoder) {
        this.adminRepository = adminRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping
    public List<Admin> getAllUsers() {
        // Don't return password hashes in response
        return adminRepository.findAll().stream()
                .map(admin -> {
                    Admin sanitized = new Admin();
                    sanitized.setId(admin.getId());
                    sanitized.setUsername(admin.getUsername());
                    // Don't set password
                    return sanitized;
                })
                .toList();
    }

    @PostMapping
    public ResponseEntity<?> createUser(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        String password = request.get("password");

        if (username == null || password == null) {
            return ResponseEntity.badRequest().body("Username and password are required");
        }

        // Validate username
        if (username.length() < 3 || username.length() > 50) {
            return ResponseEntity.badRequest().body("Username must be between 3 and 50 characters");
        }

        // Validate password strength
        if (!passwordEncoder.isPasswordValid(password)) {
            return ResponseEntity.badRequest().body(
                    "Password must be 8-128 characters with uppercase, lowercase, numbers, and special characters"
            );
        }

        // Check if username already exists
        if (adminRepository.findByUsername(username).isPresent()) {
            return ResponseEntity.badRequest().body("Username already exists");
        }

        Admin admin = new Admin();
        admin.setUsername(username.trim());
        admin.setPassword(passwordEncoder.encode(password));

        adminRepository.save(admin);

        return ResponseEntity.ok("User created successfully");
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUserPassword(@PathVariable Long id, @RequestBody Map<String, String> request) {
        String oldPassword = request.get("oldPassword");
        String newPassword = request.get("newPassword");

        if (oldPassword == null || newPassword == null) {
            return ResponseEntity.badRequest().body("Old password and new password are required");
        }

        // Validate new password strength
        if (!passwordEncoder.isPasswordValid(newPassword)) {
            return ResponseEntity.badRequest().body(
                    "New password must be 8-128 characters with uppercase, lowercase, numbers, and special characters"
            );
        }

        // Prevent setting the same password
        if (oldPassword.equals(newPassword)) {
            return ResponseEntity.badRequest().body("New password must be different from old password");
        }

        Optional<Admin> userOptional = adminRepository.findById(id);
        if (userOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Admin user = userOptional.get();

        // Verify old password
        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            return ResponseEntity.badRequest().body("Old password is incorrect");
        }

        // Update password
        user.setPassword(passwordEncoder.encode(newPassword));
        adminRepository.save(user);

        return ResponseEntity.ok("Password updated successfully");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        Optional<Admin> userOptional = adminRepository.findById(id);
        if (userOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        adminRepository.delete(userOptional.get());
        return ResponseEntity.ok("User deleted successfully");
    }
}