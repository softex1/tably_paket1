package mk.scan.horeca.util;

import mk.scan.horeca.model.Admin;
import mk.scan.horeca.repository.AdminRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class PasswordMigration implements CommandLineRunner {

    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;

    public PasswordMigration(AdminRepository adminRepository, PasswordEncoder passwordEncoder) {
        this.adminRepository = adminRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        List<Admin> admins = adminRepository.findAll();

        for (Admin admin : admins) {
            // Check if password is already hashed with Argon2 (starts with $argon2)
            if (!admin.getPassword().startsWith("$argon2")) {
                System.out.println("Migrating password for user: " + admin.getUsername());
                String hashedPassword = passwordEncoder.encode(admin.getPassword());
                admin.setPassword(hashedPassword);
                adminRepository.save(admin);
            }
        }
    }
}