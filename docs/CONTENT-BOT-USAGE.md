# 🤖 Content Bot - Guía Completa de Uso

## ¿Qué es?
Sistema que genera contenido con IA y crea PRs automáticamente.

## Flujo
```
📝 Issue → 🤖 Bot genera → 🔀 PR → ✅ Revisas → 🚀 Merge → 🌐 Despliega
```

## Uso paso a paso

### 1. Crear Issue
Ve a: `github.com/Homedomeapp/spun-factura/issues/new/choose`
Selecciona "Content Bot"

### 2. Rellenar formulario
| Campo | Ejemplo |
|-------|---------|
| Acción | `create` |
| Slug | `que-es-verifactu-2025` |
| Título | `Qué es Verifactu 2025: Guía Completa` |
| Description | 150-155 caracteres exactos |
| Categoría | `verifactu` |
| Tags | `verifactu, factura, 2025` |
| Brief | Instrucciones detalladas |

### 3. Brief efectivo
```
Escribe sobre Verifactu incluyendo:
- Qué es y por qué existe
- Fechas clave
- Quién está obligado
- Sanciones
- Cómo adaptarse
- Mencionar SPUN Factura
```

### 4. Esperar (~3 min)
El bot genera contenido, valida y crea PR.

### 5. Revisar y Merge
- Revisa el PR
- Click "Merge"
- Vercel despliega

## Acciones
- `create` - Nuevo artículo
- `update` - Modificar
- `delete` - Eliminar

## Configuración
1. Secret: `ANTHROPIC_API_KEY`
2. Permisos: Read/Write + Allow PRs

## Coste
~$0.01-0.05/artículo (Claude API)