package mk.scan.horeca.repository;

import mk.scan.horeca.model.Call;
import mk.scan.horeca.model.CallType;
import mk.scan.horeca.model.TableEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface CallRepository extends JpaRepository<Call, Long> {
    List<Call> findByResolvedFalseOrderByCreatedAtDesc();
    Optional<Call> findTopByTableAndTypeAndResolvedFalseOrderByCreatedAtDesc(
            TableEntity table, CallType type
    );
    List<Call> findByResolvedFalseAndCreatedAtAfterOrderByCreatedAtDesc(LocalDateTime cutoff);

    void deleteAllByTableId(Long tableId); // deletes all calls referencing the table
}
