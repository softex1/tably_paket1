package mk.scan.horeca.service;

import mk.scan.horeca.model.Call;
import mk.scan.horeca.model.CallType;
import mk.scan.horeca.model.TableEntity;
import mk.scan.horeca.repository.CallRepository;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class CallService {

    private final CallRepository repo;
    private final SimpMessagingTemplate messagingTemplate;

    private static final Duration SESSION_DURATION = Duration.ofMinutes(10); // session validity
    private static final Duration COOLDOWN = Duration.ofMinutes(3);         // minimum gap between calls

    public CallService(CallRepository repo, SimpMessagingTemplate messagingTemplate) {
        this.repo = repo;
        this.messagingTemplate = messagingTemplate;
    }

    public synchronized Call createCall(TableEntity table, CallType type) {

        LocalDateTime now = LocalDateTime.now();


        Optional<Call> lastCallOpt = repo.findTopByTableAndTypeAndResolvedFalseOrderByCreatedAtDesc(table, type);

        if (lastCallOpt.isPresent()) {
            Call lastCall = lastCallOpt.get();
            Duration elapsed = Duration.between(lastCall.getCreatedAt(), now);

            // Cooldown: reject if clicked again too soon
            if (elapsed.compareTo(COOLDOWN) < 0) {
                throw new RuntimeException("You can only call " + type + " once every " + COOLDOWN.toMinutes() + " minutes.");
            }

            // Session expired: mark old call as resolved
            if (elapsed.compareTo(SESSION_DURATION) >= 0) {
                lastCall.setResolved(true);
                repo.save(lastCall);
            }
        }

        // Create new call
        Call call = new Call();
        call.setTable(table);
        call.setType(type);
        call.setResolved(false);
        call.setCreatedAt(now);
        repo.save(call);

        // Notify admin clients in real-time
        messagingTemplate.convertAndSend("/topic/calls", call);

        return call;
    }

    public List<Call> getActiveCalls() {
        return repo.findByResolvedFalseOrderByCreatedAtDesc();
    }

    public Call resolve(Long id) {
        Call call = repo.findById(id).orElseThrow();
        call.setResolved(true);
        Call saved = repo.save(call);

        // Notify admin that call has been resolved
        messagingTemplate.convertAndSend("/topic/calls", saved);
        return saved;
    }

    public List<Call> getRecentActiveCalls() {
        LocalDateTime cutoff = LocalDateTime.now().minusMinutes(10);
        return repo.findByResolvedFalseAndCreatedAtAfterOrderByCreatedAtDesc(cutoff);
    }

}
