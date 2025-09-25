package mk.scan.horeca.repository;

import mk.scan.horeca.model.TableEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface TableRepository extends JpaRepository<TableEntity, Long> {
    Optional<TableEntity> findByQrIdentifier(String qrIdentifier);
}
