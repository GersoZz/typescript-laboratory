# 04 - Unión e Intersección de Tipos

## Unión de tipos (`|`)

Una variable puede ser de **uno u otro** tipo. Se usa el operador `|`:

```ts
type ID = string | number;

let userId: ID = 1;
userId = "abc-123"; // también válido
```

---

## Casos de uso comunes

### Props opcionales con `null`

```ts
type Nullable<T> = T | null;

let imagen: Nullable<string> = null;
imagen = "https://...foto.jpg"; // válido
```

### Estado asíncrono

```ts
type EstadoCarga = "idle" | "cargando" | "exito" | "error";

let estado: EstadoCarga = "idle";
estado = "cargando";
estado = "exito";
// estado = "fallido"; // ❌ no es un valor válido
```

> Este patrón es frecuente en React para manejar estados de fetching.

---

## Discriminated Unions (Uniones Discriminadas)

Es el patrón más poderoso de TypeScript. Cada variante del tipo tiene una propiedad discriminante (`tipo`, `kind`, `tag`, etc.):

```ts
type CirculoShape = {
  tipo: "circulo";
  radio: number;
};

type RectanguloShape = {
  tipo: "rectangulo";
  ancho: number;
  alto: number;
};

type Forma = CirculoShape | RectanguloShape;

function calcularArea(forma: Forma): number {
  switch (forma.tipo) {
    case "circulo":
      return Math.PI * forma.radio ** 2; // TypeScript sabe que es CirculoShape
    case "rectangulo":
      return forma.ancho * forma.alto;   // TypeScript sabe que es RectanguloShape
  }
}
```

> En React, este patrón se usa para manejar distintos tipos de acciones en un reducer.

---

## Intersección de tipos (`&`)

Combina **todos** los miembros de varios tipos en uno solo:

```ts
type ConTimestamps = {
  creadoEn: Date;
  actualizadoEn: Date;
};

type ConAuditoria = {
  creadoPor: string;
  modificadoPor: string;
};

type EntidadCompleta = ConTimestamps & ConAuditoria & {
  id: string;
};
```

---

## Unión vs Intersección

| Operador | Semántica         | El objeto tiene...                        |
|----------|-------------------|-------------------------------------------|
| `A \| B` | A **o** B         | las propiedades de A **o** las de B       |
| `A & B`  | A **y** B         | las propiedades de A **y** también las de B |

---

## Unión con literales de string

Muy usado para definir variantes de componentes React:

```ts
type Variante = "primary" | "secondary" | "danger" | "ghost";
type Tamaño = "xs" | "sm" | "md" | "lg" | "xl";
type Posicion = "top" | "bottom" | "left" | "right";

interface TooltipProps {
  contenido: string;
  posicion: Posicion;
  visible: boolean;
}
```

---

## Reducers con Discriminated Unions (patrón Redux/useReducer)

```ts
// Tipos de acciones
type AccionContador =
  | { tipo: "INCREMENTAR" }
  | { tipo: "DECREMENTAR" }
  | { tipo: "RESETEAR" }
  | { tipo: "ESTABLECER"; payload: number };

// Estado
interface EstadoContador {
  valor: number;
  historial: number[];
}

// Reducer completamente tipado
function reducerContador(
  estado: EstadoContador,
  accion: AccionContador
): EstadoContador {
  switch (accion.tipo) {
    case "INCREMENTAR":
      return { ...estado, valor: estado.valor + 1 };
    case "DECREMENTAR":
      return { ...estado, valor: estado.valor - 1 };
    case "RESETEAR":
      return { ...estado, valor: 0 };
    case "ESTABLECER":
      return { ...estado, valor: accion.payload }; // payload solo disponible aquí
  }
}
```

---

## Resumen

- `A | B`: el valor puede ser A **o** B
- `A & B`: el valor debe ser A **y** B a la vez
- Las **discriminated unions** son ideales para modelar estados y acciones en React
- Los **literales de string** en uniones son perfectos para props de componentes
