package mk.scan.horeca.controller;

import mk.scan.horeca.dto.DeleteTableRequest;
import mk.scan.horeca.model.Admin;
import mk.scan.horeca.model.TableEntity;
import mk.scan.horeca.repository.AdminRepository;
import mk.scan.horeca.repository.TableRepository;
import mk.scan.horeca.service.QRCodeService;
import mk.scan.horeca.service.TableService;
import mk.scan.horeca.util.PasswordEncoder;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/tables")
public class TableController {
    private final TableService tableService;
    private final QRCodeService qrCodeService;
    private final TableRepository tableRepo;
    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;

    String domain = "http://app1.scan.mk";

    public TableController(TableService tableService,
                           QRCodeService qrCodeService,
                           TableRepository tableRepo, AdminRepository adminRepository, PasswordEncoder passwordEncoder) {
        this.tableService = tableService;
        this.qrCodeService = qrCodeService;
        this.tableRepo = tableRepo;
        this.adminRepository = adminRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // Create a new table
    @PostMapping
    public ResponseEntity<?> createTable(@RequestBody TableEntity table) throws Exception {
        // generate a unique QR identifier
        String qrIdentifier = UUID.randomUUID().toString().substring(0, 8);
        table.setQrIdentifier(qrIdentifier);

        TableEntity savedTable = tableService.save(table);

        // QR URL points to frontend table page
        String qrUrl = domain + "/table/" + savedTable.getQrIdentifier();
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
        String qrUrl = domain + "/table/" + table.getQrIdentifier();

        return ResponseEntity.ok(qrUrl);
    }

    // List all tables with QR codes
    @GetMapping
    public List<Map<String, Object>> getAll() throws Exception {
        List<TableEntity> tables = tableService.getAll();
        List<Map<String, Object>> result = new ArrayList<>();

        for (TableEntity table : tables) {
            String qrUrl = domain + "/table/" + table.getQrIdentifier();
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

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTable(
            @PathVariable Long id,
            @RequestHeader(value = "Authorization") String authHeader,
            @RequestBody DeleteTableRequest request) {

        // Validate Authorization header
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
        }

        String token = authHeader.substring(7);
        String password = request.getPassword();

        if (password == null || password.isBlank()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Password required");
        }

        Optional<Admin> adminOpt = adminRepository.findAll().stream().findFirst();
        if (adminOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Admin not found");
        }

        Admin admin = adminOpt.get();

        if (!passwordEncoder.matches(password, admin.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid password");
        }

        if (!tableRepo.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Table not found");
        }

        try {
            tableService.deleteTable(id); // deletes table + dependent calls
            return ResponseEntity.ok("Table deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error deleting table: " + e.getMessage());
        }
    }



}
