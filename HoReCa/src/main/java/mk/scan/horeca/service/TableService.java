package mk.scan.horeca.service;

import jakarta.transaction.Transactional;
import mk.scan.horeca.model.TableEntity;
import mk.scan.horeca.repository.CallRepository;
import mk.scan.horeca.repository.TableRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TableService {
    private final TableRepository repo;
    private final CallRepository callRepository;

    public TableService(TableRepository repo, CallRepository callRepository) {
        this.repo = repo;
        this.callRepository = callRepository;
    }

    public TableEntity save(TableEntity table) {
        return repo.save(table);
    }

    public List<TableEntity> getAll() {
        return repo.findAll();
    }

    public TableEntity getByQrIdentifier(String qrIdentifier) {
        return repo.findByQrIdentifier(qrIdentifier)
                .orElseThrow(() -> new RuntimeException("Table not found"));
    }

    @Transactional
    public void deleteTable(Long tableId) throws Exception {
        // Delete all dependent calls first
        callRepository.deleteAllByTableId(tableId);

        // Then delete the table
        repo.deleteById(tableId);
    }
}
