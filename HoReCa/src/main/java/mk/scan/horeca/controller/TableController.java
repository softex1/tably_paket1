package mk.scan.horeca.controller;

import mk.scan.horeca.model.TableEntity;
import mk.scan.horeca.repository.TableRepository;
import mk.scan.horeca.service.QRCodeService;
import mk.scan.horeca.service.SessionService;
import mk.scan.horeca.service.TableService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/tables")
public class TableController {
    private final TableService tableService;
    private final QRCodeService qrCodeService;
    private final SessionService sessionService;
    private final TableRepository tableRepo;

    public TableController(TableService tableService,
                           QRCodeService qrCodeService,
                           SessionService sessionService,
                           TableRepository tableRepo) {
        this.tableService = tableService;
        this.qrCodeService = qrCodeService;
        this.sessionService = sessionService;
        this.tableRepo = tableRepo;
    }

    // Create a new table
    @PostMapping
    public ResponseEntity<?> createTable(@RequestBody TableEntity table) throws Exception {
        // generate a unique QR identifier
        String qrIdentifier = UUID.randomUUID().toString().substring(0, 8);
        table.setQrIdentifier(qrIdentifier);

        TableEntity savedTable = tableService.save(table);

        // QR URL points to frontend table page
        String qrUrl = "https://localhost:5173/table/" + savedTable.getQrIdentifier();
        String qrCodeBase64 = qrCodeService.generateQRCodeBase64(qrUrl, 250, 250);

        return ResponseEntity.ok(Map.of(
                "table", savedTable,
                "qrUrl", qrUrl,
                "qrCodeBase64", qrCodeBase64
        ));
    }

    // Get QR URL for a specific table
    @GetMapping("/{qrIdentifier}/qr")
    public ResponseEntity<String> getQr(@PathVariable String qrIdentifier) {
        TableEntity table = tableRepo.findByQrIdentifier(qrIdentifier)
                .orElseThrow(() -> new RuntimeException("Table not found"));

        // QR URL only needs the table identifier
        String qrUrl = "https://192.168.100.145:5173/table/" + table.getQrIdentifier();

        return ResponseEntity.ok(qrUrl);
    }

    // List all tables with QR codes
    @GetMapping
    public List<Map<String, Object>> getAll() throws Exception {
        List<TableEntity> tables = tableService.getAll();
        List<Map<String, Object>> result = new ArrayList<>();

        for (TableEntity table : tables) {
            String qrUrl = "http://192.168.100.145:5173/table/" + table.getQrIdentifier();
            String qrCodeBase64 = qrCodeService.generateQRCodeBase64(qrUrl, 250, 250);

            Map<String, Object> map = Map.of(
                    "id", table.getId(),
                    "tableNumber", table.getTableNumber(),
                    "location", table.getLocation(),
                    "type", table.getType(),
                    "qrCodeBase64", qrCodeBase64,
                    "qrUrl", qrUrl
            );
            result.add(map);
        }

        return result;
    }

    // Get table by QR identifier
    @GetMapping("/qr/{qrIdentifier}")
    public TableEntity getByQrIdentifier(@PathVariable String qrIdentifier) {
        return tableService.getByQrIdentifier(qrIdentifier);
    }

    // Delete table
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTable(
            @PathVariable Long id,
            @RequestHeader(value = "X-Session-Token", required = false) String sessionToken) {

        if (sessionToken == null || !sessionService.validateSession(sessionToken)) {
            return ResponseEntity.status(403).body("Unauthorized: session expired or invalid.");
        }

        tableService.deleteTable(id);
        return ResponseEntity.noContent().build();
    }
}
