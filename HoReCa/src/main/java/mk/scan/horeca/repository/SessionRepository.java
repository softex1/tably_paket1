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

    Optional<Session> findByToken(String token);


    void deleteByExpiresAtBefore(LocalDateTime now);

    List<Session> findAllByActiveTrue();
}
