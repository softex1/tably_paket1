package mk.scan.horeca.controller;

import mk.scan.horeca.model.Session;
import mk.scan.horeca.model.TableEntity;
import mk.scan.horeca.repository.SessionRepository;
import mk.scan.horeca.repository.TableRepository;
import mk.scan.horeca.service.SessionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/sessions")
public class SessionController {

    private final SessionService sessionService;

    public SessionController(SessionService sessionService) {
        this.sessionService = sessionService;
    }

    // ✅ Only called when QR is scanned
    @PostMapping("/qr/{qrIdentifier}")
    public ResponseEntity<SessionResponse> scanQr(@PathVariable String qrIdentifier) {
        Session session = sessionService.createNewSession(qrIdentifier);
        return ResponseEntity.ok(new SessionResponse(session.getToken(), session.getExpiresAt().toString()));
    }

    // ✅ Called on page load / refresh to validate existing token
    @GetMapping("/validate")
    public ResponseEntity<Boolean> validate(@RequestHeader("X-Session-Token") String token) {
        boolean valid = sessionService.validateSession(token);
        return ResponseEntity.ok(valid);
    }

    public record SessionResponse(String token, String expiresAt) {}
}
