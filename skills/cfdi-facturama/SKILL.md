---
name: cfdi-facturama
description: Reusable integration patterns for CFDI 4.0 electronic invoicing via the Facturama PAC API. Covers invoice creation, stamping, cancellation, complemento de pago, and PDF/XML retrieval.
version: 1.0.0
author: agentforger
tags: [cfdi, facturama, invoicing, mexico, sat, fiscal, pac, integration]
---

# cfdi-facturama

Reusable skill for integrating with the Facturama PAC API to handle CFDI 4.0 electronic invoicing in the Mitla ERP system.

## Purpose

Provide standardized patterns and procedures for:
- Creating and stamping CFDI 4.0 invoices via Facturama
- Cancelling invoices with SAT-compliant motives
- Generating complemento de pago (payment receipt) CFDIs
- Retrieving stamped PDF and XML documents
- Managing SAT catalogs (uso de CFDI, forma de pago, método de pago, régimen fiscal)

This skill is consumed by `mitla-facturacion` (domain requirements) and implemented by `mitla-backend` (API integration code).

## Limits

- Does not store Facturama API credentials — those must be managed via environment variables
- Does not implement business rules about when to invoice — that is `mitla-facturacion` domain
- Does not handle payment collection or receivables — that is `mitla-cobranza` domain
- Does not define UI components — that is `mitla-frontend`
- Does not bypass SAT validation rules — all CFDIs must be structurally valid before submission
- Does not support PACs other than Facturama without explicit extension

## Inputs / Outputs

### Inputs
- Invoice data: customer info (RFC, razón social, régimen fiscal, domicilio fiscal, uso de CFDI), line items (concepto, cantidad, valor unitario, impuestos), payment terms (forma de pago, método de pago)
- Cancellation requests: UUID of CFDI to cancel, cancellation motive (SAT catalog), replacement UUID if applicable
- Payment data: related CFDI UUIDs, payment amount, payment method, payment date
- Environment: `FACTURAMA_API_USER`, `FACTURAMA_API_KEY`, `FACTURAMA_API_URL` (sandbox vs production)

### Outputs
- Stamped CFDI: UUID, XML content, PDF content, fiscal stamp (timbre fiscal digital)
- Cancellation acknowledgment: cancellation status, SAT response
- Complemento de pago: stamped payment receipt CFDI
- Error responses: structured error with SAT validation details

## Workflow

### 1 — Environment setup
- Configure Facturama API credentials via environment variables
- Use sandbox URL for development/testing: `https://apisandbox.facturama.mx`
- Use production URL for live: `https://api.facturama.mx`
- Authentication: HTTP Basic Auth with API user and key

### 2 — Invoice creation (CFDI Ingreso)
1. Validate all required fields against SAT catalogs before API call
2. Build CFDI payload following Facturama's API schema:
   - Receptor (customer): RFC, nombre, domicilioFiscalReceptor, regimenFiscalReceptor, usoCfdi
   - Conceptos (line items): claveProdServ, cantidad, claveUnidad, descripcion, valorUnitario, impuestos
   - Comprobante: formaPago, metodoPago, tipoDeComprobante ("I" for ingreso), moneda, tipoCambio
3. POST to `/api/3/cfdis` (multi-emisor) or `/api/2/cfdis` (single-emisor)
4. Handle response: extract UUID, XML, PDF download URLs
5. Store CFDI metadata in local database (UUID, status, timestamps, amounts)

### 3 — Invoice cancellation
1. Determine cancellation motive from SAT catalog:
   - "01" — CFDI emitido con errores con relación (requires replacement UUID)
   - "02" — CFDI emitido con errores sin relación
   - "03" — No se llevó a cabo la operación
   - "04" — Operación nominativa relacionada en una factura global
2. DELETE to `/api/cfdi/{id}` with motive and replacement UUID if applicable
3. Handle SAT response: may be immediate acceptance or pending (requires receiver acceptance)
4. Update local CFDI status accordingly

### 4 — Complemento de pago
1. Build payment receipt payload:
   - Related CFDIs (documentos relacionados): UUID, serie, folio, moneda, monto parcialidad
   - Payment details: fechaPago, formaDePagoP, monedaP, monto
2. POST to payment complement endpoint
3. Store complemento metadata linked to original CFDI(s)

### 5 — PDF/XML retrieval
- GET PDF: `/api/cfdi/pdf/{format}/{id}`
- GET XML: `/api/cfdi/xml/{id}`
- Store documents in configured file storage
- Link to CFDI record in database

### 6 — Error handling
- Facturama returns structured errors with SAT validation codes
- Map Facturama error codes to user-friendly messages
- Common errors:
  - Invalid RFC format
  - Missing required SAT catalog values
  - Duplicate CFDI (same receptor + amounts + date)
  - Cancellation not permitted (receiver rejected)
- Retry logic: network errors only; never retry on validation errors

## Quality criteria

- All Facturama API calls must use environment-based configuration (no hardcoded URLs or credentials)
- Every CFDI creation must validate against SAT catalogs BEFORE calling the API
- Error responses must include the original SAT validation error code and a human-readable message
- Cancellation must always include the correct motive code per SAT catalog
- PDF and XML must be retrievable for every successfully stamped CFDI
- Integration tests must run against Facturama sandbox (not production)
- No credential or API key may appear in source code, logs, or generated artifacts

## SAT catalog reference

Key catalogs used in CFDI 4.0:
- **c_UsoCFDI**: uso del CFDI (G01 Adquisición de mercancías, G03 Gastos en general, etc.)
- **c_FormaPago**: forma de pago (01 Efectivo, 03 Transferencia, 04 Tarjeta de crédito, 99 Por definir, etc.)
- **c_MetodoPago**: método de pago (PUE Pago en una sola exhibición, PPD Pago en parcialidades o diferido)
- **c_RegimenFiscal**: régimen fiscal del emisor/receptor (601 General de Ley, 612 Personas Físicas con Actividades Empresariales, 626 RESICO, etc.)
- **c_ClaveProdServ**: clave de producto o servicio del SAT
- **c_ClaveUnidad**: clave de unidad de medida (E48 Unidad de servicio, H87 Pieza, etc.)
- **c_Moneda**: moneda (MXN, USD, EUR, etc.)

## Examples

**Create invoice**:
> Backend receives validated invoice data from sales order → builds Facturama payload → calls POST /api/3/cfdis → stores UUID and metadata → returns CFDI details to caller

**Cancel invoice**:
> User requests cancellation with motive "02" → backend calls DELETE /api/cfdi/{id} with motive → handles SAT response → updates CFDI status

**Payment complement**:
> Payment recorded in Cobranza → backend builds complemento payload linking to original CFDI → calls Facturama → stores complemento CFDI
