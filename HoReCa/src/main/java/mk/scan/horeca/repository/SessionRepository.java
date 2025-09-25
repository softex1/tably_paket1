package mk.scan.horeca.repository;

import mk.scan.horeca.model.Session;
import mk.scan.horeca.model.TableEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface SessionRepository extends JpaRepository<Session, Long> {

    Optional<Session> findByTokenAndActiveTrue(String token);

    Optional<Session> findByTableAndActiveTrue(TableEntity table);

    Optional<Session> findByToken(String token);

    Optional<Session> findByTableId(Long id);

    void deleteByExpiresAtBefore(LocalDateTime now);

    // ✅ find all sessions for a table
    List<Session> findByTable(TableEntity table);

    List<Session> findAllByTableAndActive(TableEntity table, boolean active); // <-- new

    Optional<Session> findByTableAndActive(TableEntity table, boolean b);

    List<Session> findAllByActiveTrue();
}
