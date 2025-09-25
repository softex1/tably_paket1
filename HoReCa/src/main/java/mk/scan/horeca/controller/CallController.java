package mk.scan.horeca.controller;

import mk.scan.horeca.model.*;
import mk.scan.horeca.service.CallService;
import mk.scan.horeca.service.SessionService;
import mk.scan.horeca.service.TableService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/calls")
public class CallController {

    private final CallService callService;
    private final TableService tableService;
    private final SessionService sessionService;

    public CallController(CallService callService, TableService tableService, SessionService sessionService) {
        this.callService = callService;
        this.tableService = tableService;
        this.sessionService = sessionService;
    }

    @PostMapping("/{qrIdentifier}/{type}")
    public ResponseEntity<?> createCall(
            @PathVariable String qrIdentifier,
            @PathVariable String type,
            @RequestHeader(value = "X-Session-Token", required = false) String sessionToken) {

        try {
            // 1️⃣ Check if session token is provided
            if (sessionToken == null || !sessionService.validateSession(sessionToken)) {
                return ResponseEntity.status(403)
                        .body("Session expired or invalid. Please rescan QR code.");
            }

            // 2️⃣ Retrieve session by token
            var sessionOpt = sessionService.getSessionByToken(sessionToken);
            if (sessionOpt.isEmpty()) {
                return ResponseEntity.status(403).body("Invalid session token.");
            }

            var session = sessionOpt.get();

            // 3️⃣ Check if session is active and not expired
            if (!session.isActive() || session.isExpired()) {
                sessionService.expireSession(session); // mark as inactive
                return ResponseEntity.status(403)
                        .body("Session expired. Please rescan QR code.");
            }

            // 4️⃣ Ensure the session belongs to this table
            if (!session.getTable().getQrIdentifier().equals(qrIdentifier)) {
                return ResponseEntity.status(403)
                        .body("Session token does not belong to this table.");
            }

            // 5️⃣ Retrieve table entity
            TableEntity table = tableService.getByQrIdentifier(qrIdentifier);
            if (table == null) {
                return ResponseEntity.badRequest().body("Table not found for QR: " + qrIdentifier);
            }

            // 6️⃣ Create call
            CallType callType;
            try {
                callType = CallType.valueOf(type.toUpperCase());
            } catch (IllegalArgumentException ex) {
                return ResponseEntity.badRequest().body("Invalid call type: " + type);
            }

            Call call = callService.createCall(table, callType);
            return ResponseEntity.ok(call);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }
}
