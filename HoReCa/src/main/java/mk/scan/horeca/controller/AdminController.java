package mk.scan.horeca.controller;

import mk.scan.horeca.model.Call;
import mk.scan.horeca.service.CallService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
    private final CallService callService;

    public AdminController(CallService callService) {
        this.callService = callService;
    }

    @GetMapping("/calls")
    public List<Call> getActiveCalls() {
        return callService.getActiveCalls();
    }

    @PostMapping("/calls/{id}/resolve")
    public ResponseEntity<Call> resolve(@PathVariable Long id) {
        return ResponseEntity.ok(callService.resolve(id));
    }

    @GetMapping("/calls/recent")
    public ResponseEntity<List<Call>> getRecentCalls() {
        return ResponseEntity.ok(callService.getRecentActiveCalls());
    }

}
