package mk.scan.horeca.service;

import mk.scan.horeca.model.Session;
import mk.scan.horeca.model.TableEntity;
import mk.scan.horeca.repository.SessionRepository;
import mk.scan.horeca.repository.TableRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class SessionService {

    private final SessionRepository sessionRepo;
    private final TableRepository tableRepo;

    public SessionService(SessionRepository sessionRepo, TableRepository tableRepo) {
        this.sessionRepo = sessionRepo;
        this.tableRepo = tableRepo;
    }

    /** ✅ Only called when QR is scanned */
    @Transactional
    public Session createNewSession(String qrIdentifier) {
        TableEntity table = tableRepo.findByQrIdentifier(qrIdentifier)
                .orElseThrow(() -> new RuntimeException("Table not found"));

        // 🟢 REMOVED the session deactivation - allow multiple sessions
        // var activeSessions = sessionRepo.findAllByTableAndActive(table, true);
        // for (Session s : activeSessions) {
        //     s.setActive(false);
        //     sessionRepo.save(s);
        // }

        // Create new session for the new phone
        Session session = new Session();
        session.setTable(table);
        session.setToken(UUID.randomUUID().toString());
        session.setCreatedAt(LocalDateTime.now());
        session.setExpiresAt(LocalDateTime.now().plusMinutes(1));
        session.setActive(true);

        return sessionRepo.save(session);
    }

    /** ✅ Validate a token */
    public boolean validateSession(String token) {
        return sessionRepo.findByToken(token)
                .filter(Session::isActive)
                .filter(s -> !s.isExpired())
                .isPresent();
    }

    /** ✅ Retrieve session by token (needed in CallController) */
    public Optional<Session> getSessionByToken(String token) {
        return sessionRepo.findByToken(token);
    }

    /** ✅ Manually expire a session */
    public void expireSession(Session session) {
        session.setActive(false);
        sessionRepo.save(session);
    }

    /** ✅ Clean up expired sessions periodically */
    @Scheduled(fixedRate = 5000) // Run every minute
    @Transactional
    public void cleanupExpiredSessions() {
        List<Session> activeSessions = sessionRepo.findAllByActiveTrue();
        for (Session session : activeSessions) {
            if (session.isExpired()) {
                sessionRepo.save(session); // This will save with active=false
            }
        }
    }
}
