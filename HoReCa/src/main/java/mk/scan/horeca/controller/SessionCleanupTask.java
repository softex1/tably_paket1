package mk.scan.horeca.controller;

import mk.scan.horeca.repository.SessionRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class SessionCleanupTask {

    private final SessionRepository sessionRepo;

    public SessionCleanupTask(SessionRepository sessionRepo) {
        this.sessionRepo = sessionRepo;
    }

    // Run every 5 minutes
    @Scheduled(fixedRate = 5 * 60 * 1000)
    public void cleanupExpiredSessions() {
        LocalDateTime now = LocalDateTime.now();
        sessionRepo.deleteByExpiresAtBefore(now);
    }
}
