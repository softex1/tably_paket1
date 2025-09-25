package mk.scan.horeca.controller;

import mk.scan.horeca.model.Admin;
import mk.scan.horeca.repository.AdminRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AdminRepository adminRepository;

    public AuthController(AdminRepository adminRepository) {
        this.adminRepository = adminRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        String password = request.get("password");

        Optional<Admin> adminOpt = adminRepository.findByUsername(username);
        if (adminOpt.isEmpty()) {
            return ResponseEntity.status(401).body("Invalid username or password");
        }

        Admin admin = adminOpt.get();

        // ⚠️ Right now, plain text check (later use BCrypt)
        if (!admin.getPassword().equals(password)) {
            return ResponseEntity.status(401).body("Invalid username or password");
        }

        // Generate a simple token (store it with user info)
        String token = UUID.randomUUID().toString();

        // In a real app, you'd store this token in a database with admin ID
        // For now, we'll return the admin ID so frontend can store it
        return ResponseEntity.ok(Map.of(
                "token", token,
                "adminId", admin.getId(),
                "username", admin.getUsername()
        ));
    }
}