package mk.scan.horeca.service;

import mk.scan.horeca.model.TableEntity;
import mk.scan.horeca.repository.TableRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TableService {
    private final TableRepository repo;

    public TableService(TableRepository repo) {
        this.repo = repo;
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

    public void deleteTable(Long id) {
        if (!repo.existsById(id)) {
            throw new RuntimeException("Table not found with id: " + id);
        }
        repo.deleteById(id);
    }
}
