package mk.scan.horeca.model;

import jakarta.persistence.*;

@Entity
@Table(name = "tables")
public class TableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String tableNumber; // e.g. "8"
    private String location;    // e.g. "Near window"
    private String type;        // e.g. "High" or "Low"

    @Column(unique = true, nullable = false)
    private String qrIdentifier; // random UUID string


    // getters & setters
    public Long getId() { return id; }

    public String getTableNumber() { return tableNumber; }
    public void setTableNumber(String tableNumber) { this.tableNumber = tableNumber; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getQrIdentifier() { return qrIdentifier; }
    public void setQrIdentifier(String qrIdentifier) { this.qrIdentifier = qrIdentifier; }

}
