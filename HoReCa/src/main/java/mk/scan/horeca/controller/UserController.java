package mk.scan.horeca.controller;

import mk.scan.horeca.model.Admin;
import mk.scan.horeca.repository.AdminRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin/users")
public class UserController {

    private final AdminRepository adminRepository;

    public UserController(AdminRepository adminRepository) {
        this.adminRepository = adminRepository;
    }

    @GetMapping
    public List<Admin> getAllUsers() {
        return adminRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<?> createUser(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        String password = request.get("password");

        if (username == null || password == null) {
            return ResponseEntity.badRequest().body("Username and password are required");
        }

        // Check if username already exists
        if (adminRepository.findByUsername(username).isPresent()) {
            return ResponseEntity.badRequest().body("Username already exists");
        }

        // Create new admin user
        Admin admin = new Admin();
        admin.setUsername(username);
        admin.setPassword(password); // In production, hash this password

        adminRepository.save(admin);

        return ResponseEntity.ok("User created successfully");
    }
}