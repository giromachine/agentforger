# PROTOCOL.md — Estándar de Comunicación MITLA ERP

Este archivo es la fuente de verdad para el formato de comunicación entre todos los
agentes MITLA y el Auditor externo. Todos los agentes deben leer y respetar este
protocolo. Ningún agente puede inventar formatos propios.

---

## FORMATO A — Reporte de mitla-pm al Auditor

Usar este formato cada vez que mitla-pm entrega un reporte de progreso al Auditor.

```
## REPORTE MITLA-PM
Fecha: YYYY-MM-DD HH:MM
Módulo activo: [nombre]
Ciclo: [número o etiqueta]

### ESTADO GENERAL
[VERDE | AMARILLO | ROJO] — [resumen en 1 línea]

### COMPLETADO (desde último reporte)
- [AGENTE] → [descripción] | Artefacto: [archivo/endpoint/componente]

### EN PROGRESO
- [AGENTE] → [descripción] | Avance: [estimado %]

### BLOQUEADO
- [AGENTE] → [descripción] | Razón: [bloqueo] | Requiere: [acción]

### PRÓXIMOS PASOS PROPUESTOS
1. [tarea] → [agente] | Depende de: [tarea anterior o NINGUNA]

### SOLICITA AL AUDITOR
[pregunta concreta o aprobación requerida — omitir sección si no aplica]
```

---

## FORMATO B — Request del Auditor a mitla-pm

Usar este formato cuando el Auditor entrega instrucciones a mitla-pm.
mitla-pm debe leerlo completo antes de actuar y NO ejecutar nada directamente.

```
## REQUEST AUDITOR → MITLA-PM
Fecha: YYYY-MM-DD
Prioridad: [CRÍTICA | ALTA | MEDIA | BAJA]
Tipo: [BUILD | FIX | FEATURE | REFACTOR | AUDIT]

### OBJETIVO
[qué se quiere lograr, en términos de negocio y técnicos]

### CONTEXTO TÉCNICO
[estado actual relevante del proyecto según la última auditoría]

### TAREAS REQUERIDAS
1. [tarea] → [agente sugerido] | AC: [criterio de aceptación]
2. ...

### RESTRICCIONES TÉCNICAS
- [convenciones del proyecto que aplican]
- [patrones a evitar]

### CRITERIOS DE ACEPTACIÓN GLOBALES
- [ ] [condición 1]
- [ ] [condición 2]

### DEPENDENCIAS
[qué debe estar listo antes de comenzar — o NINGUNA]
```

---

## FORMATO C — Tarea de mitla-pm a agente especialista

Usar este formato cada vez que mitla-pm delega trabajo a un agente del equipo.

```
## TAREA [MOD-NNN] — [AGENTE DESTINO]
Fecha: YYYY-MM-DD
Prioridad: [CRÍTICA | ALTA | MEDIA | BAJA]
Módulo: [nombre]
Depende de: [MOD-NNN o NINGUNA]

### OBJETIVO
[qué debe lograr — una sola cosa concreta]

### CONTEXTO
[información mínima necesaria para ejecutar sin ambigüedad]

### ENTREGABLES ESPERADOS
- [artefacto 1]: [descripción precisa]
- [artefacto 2]: [descripción precisa]

### CRITERIOS DE ACEPTACIÓN
- [ ] [criterio verificable 1]
- [ ] [criterio verificable 2]

### RESTRICCIONES TÉCNICAS
- [reglas técnicas del proyecto que aplican a esta tarea]

### REPORTE DE VUELTA A mitla-pm
Usar exactamente uno de estos formatos al terminar:
COMPLETADO | [MOD-NNN] | [artefactos entregados] | [notas]
BLOQUEADO | [MOD-NNN] | [razón del bloqueo] | [acción requerida]
```

---

## REGLA CRÍTICA DE DELEGACIÓN

**mitla-pm NUNCA ejecuta tareas técnicas directamente.**

mitla-pm es un coordinador, no un ejecutor. Al recibir un REQUEST del Auditor,
su única responsabilidad es:

1. Leer y entender el REQUEST completo
2. Descomponer las tareas en unidades delegables (FORMATO C)
3. Asignar cada tarea al agente especialista correcto según su rol
4. Hacer seguimiento del progreso
5. Reportar al Auditor usando FORMATO A

Los agentes responsables de ejecutar son:
- mitla-tech-lead → contratos de interfaz, arquitectura, schema governance
- mitla-backend → implementación de servicios y endpoints
- mitla-frontend → implementación de páginas y componentes
- mitla-db → migraciones y modelo de datos
- mitla-qa → tests y validación
- mitla-integration → go/no-go de integración entre módulos
- mitla-architect → decisiones estructurales de alto nivel
- mitla-ventas → especialista módulo Ventas
- mitla-cobranza → especialista módulo Cobranza
- mitla-logistica → especialista módulo Logística
- mitla-facturacion → especialista módulo Facturación
- mitla-proveedores → especialista módulo Proveedores
- mitla-pagos → especialista módulo Pagos

Si mitla-pm escribe código o modifica archivos del proyecto directamente,
es una violación de protocolo.

---

## REGLA DE IDs DE TAREA

El formato de ID es: [SIGLA-MÓDULO]-[NNN]

| Módulo | Sigla |
|--------|-------|
| Ventas | VEN |
| Cobranza | COB |
| Logística | LOG |
| Facturación | FAC |
| Proveedores | PRV |
| Pagos | PAG |
| Admin | ADM |
| Auth | AUT |
| Transversal | TRX |

Ejemplo: VEN-001, COB-012, TRX-003

Los IDs son secuenciales por módulo y nunca se reutilizan.
