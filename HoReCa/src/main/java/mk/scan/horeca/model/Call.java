package mk.scan.horeca.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "calls")
public class Call {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private TableEntity table;

    @Enumerated(EnumType.STRING)
    private CallType type;

    private boolean resolved = false;
    private LocalDateTime createdAt = LocalDateTime.now();

    // getters & setters
    public Long getId() { return id; }
    public TableEntity getTable() { return table; }
    public void setTable(TableEntity table) { this.table = table; }
    public CallType getType() { return type; }
    public void setType(CallType type) { this.type = type; }
    public boolean isResolved() { return resolved; }
    public void setResolved(boolean resolved) { this.resolved = resolved; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
