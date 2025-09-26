package mk.scan.horeca.repository;

import mk.scan.horeca.model.Session;
import org.springframework.data.jpa.repository.JpaRepository;


import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface SessionRepository extends JpaRepository<Session, Long> {

    Optional<Session> findByToken(String token);


    void deleteByExpiresAtBefore(LocalDateTime now);

    List<Session> findAllByActiveTrue();
}
