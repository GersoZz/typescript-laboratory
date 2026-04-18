# TypeScript para ReactJS — Guía de Estudio

Material de repaso de TypeScript orientado a desarrolladores que **ya saben JavaScript** y quieren arrancar ReactJS con la base de tipos necesaria.

---

## Temario

| #  | Tema                             | Archivos                                                         |
|----|----------------------------------|------------------------------------------------------------------|
| 01 | Tipos básicos                    | [MD](./01-tipos-basicos.md) · [TS](./01-tipos-basicos.ts)        |
| 02 | Interfaces y Type Aliases        | [MD](./02-interfaces-y-types.md) · [TS](./02-interfaces-y-types.ts) |
| 03 | Funciones Tipadas                | [MD](./03-funciones-tipadas.md) · [TS](./03-funciones-tipadas.ts) |
| 04 | Unión e Intersección de Tipos    | [MD](./04-union-e-interseccion.md) · [TS](./04-union-e-interseccion.ts) |
| 05 | Genéricos                        | [MD](./05-genericos.md) · [TS](./05-genericos.ts)                |
| 06 | Clases en TypeScript             | [MD](./06-clases.md) · [TS](./06-clases.ts)                      |
| 07 | Enums                            | [MD](./07-enums.md) · [TS](./07-enums.ts)                        |
| 08 | Tipos Utilitarios                | [MD](./08-utility-types.md) · [TS](./08-utility-types.ts)        |
| 09 | Narrowing y Type Guards          | [MD](./09-narrowing-type-guards.md) · [TS](./09-narrowing-type-guards.ts) |
| 10 | Módulos y Declaración de Tipos   | [MD](./10-modulos-y-declaraciones.md) · [TS](./10-modulos-y-declaraciones.ts) |

---

## Cómo usar este material

Cada tema tiene dos archivos:
- **`.md`**: explicación del concepto con ejemplos de código
- **`.ts`**: archivo TypeScript con código ejecutable y comentado

### Ejecutar los archivos `.ts`

```bash
# Instalar ts-node globalmente (una sola vez)
npm install -g ts-node typescript

# Ejecutar un archivo
ts-node 01-tipos-basicos.ts
```

O con `npx` sin instalación global:

```bash
npx ts-node 05-genericos.ts
```

---

## Orden de estudio recomendado

```
01 → 02 → 03   (fundamentos)
        ↓
04 → 05         (composición de tipos)
        ↓
06 → 07         (estructuras)
        ↓
08 → 09         (herramientas avanzadas)
        ↓
10              (organización en proyectos)
```

---

## Relación con React

| TypeScript                  | React                                         |
|-----------------------------|-----------------------------------------------|
| Interface / type            | Props de componentes                          |
| Tipos opcionales `?`        | Props con valor por defecto                   |
| Genéricos `<T>`             | `useState<T>`, `useRef<T>`, listas genéricas  |
| Union types                 | Variantes de botones, estados de carga         |
| Discriminated unions        | `useReducer`, Redux actions                   |
| Utility Types (`Partial`, `Omit`, `Pick`) | Formularios de creación/edición |
| Narrowing / Type Guards     | Manejo de errores en fetch, eventos DOM       |
| Módulos `export type`       | Organización de tipos en `src/types/`         |
| `ReturnType`                | Tipar el retorno de hooks personalizados      |

---

## Configuración TypeScript recomendada para React (Vite)

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

> La opción más importante: **`"strict": true`** — activa todas las verificaciones.
