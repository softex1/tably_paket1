package mk.scan.horeca.util;

import de.mkammerer.argon2.Argon2;
import de.mkammerer.argon2.Argon2Factory;
import org.springframework.stereotype.Component;

@Component
public class PasswordEncoder {

    private final Argon2 argon2;

    public PasswordEncoder() {
        // Use Argon2i for password hashing (resistant to side-channel attacks)
        this.argon2 = Argon2Factory.create(Argon2Factory.Argon2Types.ARGON2id);
    }

    public String encode(String rawPassword) {
        try {
            return argon2.hash(10, 65536, 2, rawPassword.toCharArray());
        } finally {
            // Wipe sensitive data from memory
            argon2.wipeArray(rawPassword.toCharArray());
        }
    }

    public boolean matches(String rawPassword, String encodedPassword) {
        try {
            return argon2.verify(encodedPassword, rawPassword.toCharArray());
        } finally {
            // Wipe sensitive data from memory
            argon2.wipeArray(rawPassword.toCharArray());
        }
    }

    // Add password validation
    public boolean isPasswordValid(String password) {
        if (password == null || password.length() < 8) {
            return false;
        }

        // Enforce maximum length to prevent DoS attacks
        if (password.length() > 128) {
            return false;
        }

        // Check for common weak patterns
        if (password.matches("(?i)^(password|123456|admin|qwerty).*")) {
            return false;
        }

        return password.matches(".*\\d.*") && // at least one digit
                password.matches(".*[a-z].*") && // at least one lowercase
                password.matches(".*[A-Z].*") && // at least one uppercase
                password.matches(".*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>\\/?].*"); // special char
    }
}