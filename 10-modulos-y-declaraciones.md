# 10 - Módulos y Declaración de Tipos

## Módulos en TypeScript

TypeScript usa el mismo sistema de módulos ES que conocés de JavaScript, pero agregando la posibilidad de **importar y exportar tipos**.

---

## Exportar e importar tipos

```ts
// tipos.ts
export interface Usuario {
  id: number;
  nombre: string;
}

export type ID = string | number;

// Exportación por defecto (tipo)
export default interface Config {
  apiUrl: string;
}
```

```ts
// componente.ts
import type { Usuario, ID } from "./tipos";
import type Config from "./tipos";
```

> La palabra `import type` es una práctica recomendada: le dice al compilador (y a Vite/Next) que solo se importa el tipo, nunca el valor en runtime.

---

## Re-exportar tipos

Útil para crear un archivo `index.ts` que agrupe todos los tipos del módulo:

```ts
// tipos/index.ts
export type { Usuario } from "./usuario";
export type { Producto } from "./producto";
export type { Pedido } from "./pedido";
```

---

## Archivos de declaración `.d.ts`

Son archivos que **solo contienen tipos**, sin lógica. Se usan para:
1. Describir librerías que no tienen tipos propios
2. Declarar tipos globales del proyecto
3. Agregar propiedades a tipos existentes (declaration merging)

```ts
// tipos-globales.d.ts
declare global {
  interface Window {
    analytics: {
      track(evento: string, datos?: object): void;
    };
  }
}
```

---

## Tipos en `tsconfig.json`

El archivo de configuración principal de TypeScript tiene ajustes clave para React:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",          // Para React 17+
    "strict": true,              // ← Activar SIEMPRE
    "noImplicitAny": true,       // No permite 'any' implícito
    "strictNullChecks": true,    // null/undefined no asignables sin declararlo
    "noUnusedLocals": true,      // Avisa sobre variables sin usar
    "noUnusedParameters": true,  // Avisa sobre params sin usar
    "paths": {
      "@/*": ["./src/*"]         // Alias para imports limpios
    }
  }
}
```

---

## Organización de tipos en un proyecto React

La estructura más común:

```
src/
├── types/
│   ├── index.ts          ← re-exporta todo
│   ├── api.types.ts      ← tipos de respuestas de API
│   ├── models.ts         ← entidades del dominio (Usuario, Producto)
│   └── components.ts     ← tipos de props de componentes
├── components/
│   └── Boton/
│       ├── Boton.tsx
│       └── Boton.types.ts  ← tipos específicos del componente
```

---

## `@types` — tipos de librerías de terceros

Cuando una librería JavaScript no tiene tipos propios, los busca en paquetes `@types/...`:

```bash
npm install --save-dev @types/react @types/react-dom @types/node
```

Algunos paquetes modernos ya incluyen los tipos:
- `react` (desde v18) — usa `@types/react`
- `axios` — incluye tipos propios
- `react-router-dom` — incluye tipos propios

---

## Extender tipos de librerías (declaration merging)

```ts
// src/types/react-extend.d.ts
// Agregar propiedades personalizadas al tipo de props estándar
import "react";

declare module "react" {
  interface HTMLAttributes<T> {
    "data-testid"?: string; // agregar soporte para atributo de testing
  }
}
```

---

## Alias de paths con TypeScript

Configurar alias para evitar imports relativos profundos:

```ts
// tsconfig.json
{
  "paths": {
    "@/types/*":      ["./src/types/*"],
    "@/components/*": ["./src/components/*"],
    "@/hooks/*":      ["./src/hooks/*"],
    "@/utils/*":      ["./src/utils/*"],
  }
}

// En vez de esto:
import { Usuario } from "../../../types/models";

// Podés hacer esto:
import { Usuario } from "@/types/models";
```

---

## Tipos de entorno con `ImportMeta`

Para variables de entorno en Vite (muy común en proyectos React):

```ts
// src/types/env.d.ts
interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_APP_TITLE: string;
  readonly VITE_DEBUG: string;
}
```

---

## Resumen

| Concepto                     | Uso                                                      |
|------------------------------|----------------------------------------------------------|
| `export type`                | Exportar tipos e interfaces                              |
| `import type`                | Importar solo tipos (no afecta el bundle)                |
| Archivo `.d.ts`              | Declarar tipos sin lógica                                |
| `declare global`             | Agregar tipos globales                                   |
| `declare module`             | Extender tipos de librerías existentes                   |
| `tsconfig.json` `strict`     | Activar todas las verificaciones estrictas               |
| `@types/...`                 | Paquetes de tipos para librerías JS sin tipos propios    |
| `paths` en tsconfig          | Alias de imports para estructura limpia                  |
