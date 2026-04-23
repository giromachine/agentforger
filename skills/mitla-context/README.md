# skill: mitla-context
Referencia técnica del proyecto Productos Mitla ERP.
Leer completo antes de escribir cualquier código del proyecto.

## Stack
- Backend: Node.js + Express + Prisma + TypeScript (strict mode)
- Frontend: React 19 + Vite + Ant Design 5 + TypeScript (strict mode)
- BD: PostgreSQL 16 (Docker)
- Puerto backend: 4000
- Puerto frontend: 5175 (no 5173 — configurado en vite.config.ts)

## Convenciones de respuesta HTTP (backend)
- Éxito: { success: true, data: {...} }
- Error: { success: false, message: "..." }
- Paginado: { success: true, data: { data: [...], pagination: { page, limit, total, totalPages } } }

## Extracción de respuestas paginadas (frontend)
// ❌ MAL
const items = result.data;
// ✅ BIEN
const items = result.data.data;
const pagination = result.data.pagination;

## Roles válidos (todos en minúsculas)
administrador | vendedor | cobranza | logistica | facturacion | pagos | proveedores
El middleware normaliza con .toLowerCase(). NUNCA usar "Administrador" con mayúscula.
El rol `administrador` tiene alcance de todos los módulos — no duplicar lógica en middleware.

## Soft delete
Entidades core (Customer, Prospect, Quote, SalesOrder, Invoice, etc.) tienen campo deletedAt.
TODOS los queries deben filtrar: WHERE deletedAt IS NULL
Nunca hacer hard delete en estas entidades.

## IDs
Generados como CUID. Nunca usar autoincrement ni UUID.

## Audit fields
Todas las tablas tienen createdAt y updatedAt. Las entidades core tienen createdById.

## Operaciones monetarias
Usar tipo Decimal de Prisma (@db.Decimal(14,2)) para todos los campos de dinero.
Nunca usar Float. Siempre redondear con precisión consistente antes de persistir.

## Patrones prohibidos en frontend

### ❌ Infinite render loop — NO usar Form.useWatch + useEffect + setState
const docType = Form.useWatch('documentType', form);
useEffect(() => { setPreviewTotals(calcular(docType)); }, [docType]); // LOOP

### ✅ Usar useState + onChange directo + useMemo
const [docType, setDocType] = useState('REMISION');
<Radio.Group onChange={(e) => setDocType(e.target.value)} />
const previewTotals = useMemo(() => calcular(docType, items), [docType, items]);

## Patrones prohibidos en backend
- Nunca usar `any` en TypeScript — crear tipos explícitos siempre
- Nunca usar console.log() — usar el logger configurado (logger.info / logger.error)
- Nunca lanzar MulterError con códigos inventados — MulterError solo acepta
 ErrorCode válidos de multer. Para validación de tipo de archivo usar new Error()

## Estructura de API calls (frontend)
- Todas las llamadas al API van en api.ts del módulo correspondiente
- Nunca hacer fetch/axios directo desde componentes o páginas
- Tipos en types.ts por módulo, nunca inferidos ni `any`

## Flujos de negocio críticos

### Cliente PREPAGO
Cotización → SalesOrder DRAFT → CONFIRMED → IN_COLLECTIONS
→ Cobranza registra pago → READY_FOR_LOGISTICS
→ Shipment creado automático → Logística + Facturación en paralelo

### Cliente CRÉDITO
Cotización → SalesOrder DRAFT → CONFIRMED → READY_FOR_LOGISTICS directo
→ Shipment creado automático → Logística + Facturación en paralelo
→ Cobranza recibe documento, inician días de crédito (paymentTermsDays)

### Criterio de facturación
Solo pedidos en READY_FOR_LOGISTICS o HANDED_OFF pueden facturarse.

## Enums de estado clave
SalesOrderStatus: DRAFT | CONFIRMED | IN_COLLECTIONS | READY_FOR_LOGISTICS | HANDED_OFF | COMPLETED | CANCELLED
DebtStatus: OUTSTANDING | PARTIALLY_PAID | OVERDUE | SETTLED | WRITTEN_OFF
ShipmentStatus: RECEIVED | PREPARED | DISPATCHED | DELIVERED | COMPLETED
InvoiceStatus: DRAFT | ISSUED | CANCELLED
PaymentType: PREPAGO | CREDITO

## Campo oficial de días de crédito
Customer.paymentTermsDays — el campo creditDays está DEPRECADO. Nunca usarlo.

## Pagos sin cliente
Usar sinCliente: true en el payload. No pasar customerId: null directamente.

## Facturación v1
No hay integración con PAC. El usuario sube PDF + XML generados en ContPAQi.
Endpoints: POST /billing/invoices/:id/files (multipart/form-data)
 GET /billing/invoices/:id/files
Archivos en filesystem: /uploads/invoices/{invoiceId}/factura.pdf y factura.xml
cfdi-facturama está pendiente para v2.
