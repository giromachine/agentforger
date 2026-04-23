---
name: mitla-context
description: Referencia técnica del proyecto Productos Mitla ERP. Convenciones de respuesta, roles, patrones prohibidos, flujos de negocio, enums de estado y restricciones técnicas vigentes.
version: 1.0.0
author: agentforger
tags: [mitla, erp, reference, technical, conventions, patterns]
---

# mitla-context

Referencia técnica del proyecto Productos Mitla ERP.

## Purpose

Documentar las convenciones técnicas reales del proyecto Productos Mitla ERP para que todos los agentes MITLA tengan una fuente de verdad única. Esta skill previene bugs recurrentes causados por información desactualizada o incorrecta (tipos inválidos de multer, puerto de frontend incorrecto, capitalización de roles, uso de campos deprecated).

## Limits

- No contiene requisitos de negocio — eso es responsabilidad de cada agente dominio (mitla-ventas, mitla-cobranza, etc.)
- No define arquitectura de nuevos módulos — eso es mitla-architect
- No prescribe patrones de testing — eso es mitla-qa
- Los flujos de negocio documentados son los vigentes en v1; pueden cambiar cuando el Auditor autorice v2

## Inputs / Outputs

### Inputs
- Ninguno requerido. Esta skill es de solo lectura.

### Outputs
- Archivo `README.md` con la referencia técnica completa del proyecto.

## Workflow

Esta skill no tiene un flujo de ejecución. Es un archivo de consulta.

1. Antes de escribir código o tomar decisiones técnicas sobre el proyecto, leer `README.md` completo.
2. Consultar las secciones relevantes según la tarea en curso:
   - ¿Vas a tocar el frontend? → lee puerto 5175, patrones prohibidos, extracción de respuestas paginadas
   - ¿Vas a tocar el backend? → lee convenciones HTTP, tipos Decimal, soft delete, prohibidos
   - ¿Vas a definir modelos de datos? → lee CUID, Decimal, audit fields, soft delete
   - ¿Vas a escribir tests E2E? → lee flujos críticos, puertos, roles válidos

## Quality criteria

- La referencia siempre refleja el estado real del código en producción
- Si el código cambia y la referencia queda desactualizada, cualquier agente debe reportarlo vía mitla-pm al Auditor
- Ningún agente debe inventar convenciones que no estén en esta skill
