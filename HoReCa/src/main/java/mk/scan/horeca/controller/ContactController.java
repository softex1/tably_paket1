package mk.scan.horeca.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/contact")
public class ContactController {

    @Autowired
    private JavaMailSender mailSender;

    @PostMapping
    public ResponseEntity<?> sendContactMessage(@RequestBody ContactForm contactForm) {
        try {
            SimpleMailMessage mail = new SimpleMailMessage();
            mail.setTo("support@scan.mk"); // Your support email
            mail.setFrom(contactForm.getEmail()); // Optional: sender email from form
            mail.setSubject(contactForm.getSubject());
            mail.setText(
                    "Name: " + contactForm.getName() + "\n" +
                            "Email: " + contactForm.getEmail() + "\n\n" +
                            "Message:\n" + contactForm.getMessage()
            );

            mailSender.send(mail);

            return ResponseEntity.ok("Message sent successfully");
        } catch (Exception e) {
            e.printStackTrace(); // Logs errors to console
            return ResponseEntity.status(500).body("Failed to send message: " + e.getMessage());
        }
    }

    public static class ContactForm {
        private String name;
        private String email;
        private String subject;
        private String message;

        // Getters and setters
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getSubject() { return subject; }
        public void setSubject(String subject) { this.subject = subject; }
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
    }
}
