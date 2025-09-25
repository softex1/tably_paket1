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

        // Generate a fake token (you can implement JWT later)
        String token = UUID.randomUUID().toString();

        return ResponseEntity.ok(Map.of("token", token));
    }
}
