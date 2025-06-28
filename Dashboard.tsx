import React, { useState } from "react";
import { format, startOfWeek, addWeeks } from "date-fns";
import { AlertTriangle, CheckCircle2, Package, Search, Calendar as CalendarIcon, Circle, Clock, FileUp, MoreHorizontal } from "lucide-react";
import { Button, Card, Badge, Popover, Table, Form } from 'react-bootstrap'; // Usando react-bootstrap
import { PopoverTrigger, PopoverContent } from '@radix-ui/react-popover'; // Import PopoverTrigger and PopoverContent

type Import = {
  id: string;
  product: string;
  origin: string;
  destination: string;
  status: "In Transit" | "Customs" | "Delivered" | "Delayed";
  lastUpdate: string;
  booking: string;
  invoice: string;
  permissions: boolean;
  eta?: Date;
  classification: string;
  tasks: {
    prepareClassification: boolean;
    requestArrivalNotice: boolean;
    receiveInvoice: boolean;
    importerPayment: boolean;
    requestBlCas: boolean;
    blReceived: boolean;
    casReceived: boolean;
  };
};

const initialImportsData: Import[] = [
  // Datos de importación (lo mismo que en tu código original)
];

export default function Dashboard() {
  const [imports, setImports] = useState<Import[]>(initialImportsData);
  const [selectedImportId, setSelectedImportId] = useState<string | null>(initialImportsData.length > 0 ? initialImportsData[0].id : null);
  const [searchTerm, setSearchTerm] = useState("");

  const selectedImport = imports.find((imp) => imp.id === selectedImportId);

  const filteredImports = imports.filter((imp) => imp.id.toLowerCase().includes(searchTerm.toLowerCase()) || imp.product.toLowerCase().includes(searchTerm.toLowerCase()));

  const updateSelectedImport = (updatedData: Partial<Import>) => {
    if (!selectedImportId) return;
    setImports((prevImports) =>
      prevImports.map((imp) =>
        imp.id === selectedImportId ? { ...imp, ...updatedData, lastUpdate: new Date().toISOString().split("T")[0] } : imp
      )
    );
  };

  const getEtaStatus = (date: Date | undefined): { color: string; label: string } => {
    if (!date) return { color: "text-muted-foreground", label: "Seleccionar fecha" };

    const now = new Date();
    const startOfThisWeek = startOfWeek(now, { weekStartsOn: 1 });
    const endOfThisWeek = addWeeks(startOfThisWeek, 1);
    const endOfNextWeek = addWeeks(startOfThisWeek, 2);

    if (date >= startOfThisWeek && date < endOfThisWeek) {
      return { color: "text-red-500", label: "Llega esta semana" };
    }
    if (date >= endOfThisWeek && date < endOfNextWeek) {
      return { color: "text-yellow-500", label: "Llega la próxima semana" };
    }
    if (date >= endOfNextWeek) {
      return { color: "text-green-500", label: "Llega en 2+ semanas" };
    }

    return { color: "text-muted-foreground", label: "Fecha pasada" };
  };

  const etaStatus = getEtaStatus(selectedImport?.eta);

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-8">
        <div className="flex items-center gap-2">
          <Package className="h-6 w-6 text-primary" />
          <h1 className="font-headline text-xl font-bold">Gestión de Importaciones</h1>
        </div>
        <div className="ml-auto flex flex-1 items-center gap-4 md:flex-initial">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Form.Control
              type="search"
              placeholder="Buscar importaciones..."
              className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" size="sm" onClick={() => alert("Agregar nueva importación")}>
            <MoreHorizontal className="mr-2 h-4 w-4" />
            Agregar Importación
          </Button>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card>
          <Card.Body>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Producto</th>
                  <th>Origen</th>
                  <th>Destino</th>
                  <th>Estado</th>
                  <th>Última Actualización</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredImports.map((item) => (
                  <tr key={item.id} onClick={() => setSelectedImportId(item.id)}>
                    <td>{item.id}</td>
                    <td>{item.product}</td>
                    <td>{item.origin}</td>
                    <td>{item.destination}</td>
                    <td>
                      <Badge bg={item.status === "Delivered" ? "success" : item.status === "Delayed" ? "danger" : "warning"}>{item.status}</Badge>
                    </td>
                    <td>{item.lastUpdate}</td>
                    <td>
                      <Button size="sm" variant="ghost">
                        Ver Detalles
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>

        {selectedImport && (
          <Card>
            <Card.Body>
              <h3>Detalles de Importación</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="product" className="form-label">Producto</label>
                  <Form.Control id="product" value={selectedImport.product} onChange={(e) => updateSelectedImport({ product: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <label htmlFor="booking" className="form-label">Número de Booking</label>
                  <Form.Control id="booking" value={selectedImport.booking} onChange={(e) => updateSelectedImport({ booking: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <label htmlFor="eta" className="form-label">Fecha de Llegada ETA</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button>{selectedImport.eta ? format(selectedImport.eta, "PPP") : "Seleccionar fecha"}</Button>
                    </PopoverTrigger>
                    <PopoverContent>
                      <CalendarIcon />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </Card.Body>
          </Card>
        )}
      </main>
    </div>
  );
}
