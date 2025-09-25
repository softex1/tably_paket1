// src/components/TableList.jsx
export default function TableList({ tables }) {
    return (
        <div>
            {tables.map(table => (
                <div key={table.id} style={{ marginBottom: "20px", border: "1px solid #ccc", padding: "10px" }}>
                    <p>Table {table.tableNumber} - {table.location} ({table.type})</p>
                    {table.qrCodeBase64 && (
                        <>
                            <a href={`data:image/png;base64,${table.qrCodeBase64}`} download={`table-${table.tableNumber}.png`}>
                                <button>Download QR</button>
                            </a>
                        </>
                    )}
                </div>
            ))}
        </div>
    );
}
