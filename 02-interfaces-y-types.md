# 02 - Interfaces y Type Aliases

## El problema: objetos sin forma definida

En JavaScript, los objetos no tienen una "forma" garantizada. TypeScript soluciona esto permitiendo definir la **estructura exacta** que debe tener un objeto.

---

## `type` — Alias de tipo

Un `type` pone nombre a cualquier tipo, desde uno simple hasta uno complejo:

```ts
type Nombre = string;
type Edad = number;

type Usuario = {
  nombre: string;
  edad: number;
  email: string;
};
```

---

## `interface` — Contratos de forma de objetos

Una `interface` describe la forma que debe tener un objeto:

```ts
interface Usuario {
  nombre: string;
  edad: number;
  email: string;
}

const usuario: Usuario = {
  nombre: "Ana",
  edad: 30,
  email: "ana@email.com",
};
```

---

## Propiedades opcionales con `?`

```ts
interface Producto {
  id: number;
  nombre: string;
  descripcion?: string;  // opcional: puede no estar
  precio: number;
}

const prod: Producto = {
  id: 1,
  nombre: "Teclado",
  precio: 15000,
  // descripcion no es obligatoria
};
```

> En React esto es fundamental para las **props de componentes**: no todas las props son obligatorias.

---

## Propiedades de solo lectura con `readonly`

```ts
interface Config {
  readonly apiUrl: string;
  readonly version: number;
  timeout: number;
}

const config: Config = {
  apiUrl: "https://api.ejemplo.com",
  version: 1,
  timeout: 5000,
};

// config.apiUrl = "otro"; // ❌ Error: no se puede reasignar readonly
config.timeout = 10000;    // ✅ sí se puede
```

---

## `type` vs `interface` — ¿Cuál usar?

| Característica                        | `interface` | `type` |
|---------------------------------------|:-----------:|:------:|
| Describir objetos                     | ✅          | ✅     |
| Extender/heredar                      | ✅ `extends`| ✅ `&` |
| Unión de tipos (`\|`)                 | ❌          | ✅     |
| Reapertura (declaration merging)      | ✅          | ❌     |
| Tipos primitivos, tuplas, funciones   | ❌          | ✅     |

**Regla práctica para React:**
- Usá `interface` para describir objetos y props de componentes.
- Usá `type` para uniones, tuplas y tipos más complejos.

---

## Extensión de interfaces

```ts
interface Animal {
  nombre: string;
  edad: number;
}

interface Perro extends Animal {
  raza: string;
  ladra(): void;
}

const miPerro: Perro = {
  nombre: "Rex",
  edad: 3,
  raza: "Labrador",
  ladra: () => console.log("¡Guau!"),
};
```

---

## Intersección de tipos con `&`

Combina dos tipos en uno:

```ts
type PersonaBase = {
  nombre: string;
  edad: number;
};

type Empleado = PersonaBase & {
  empresa: string;
  salario: number;
};

const empleado: Empleado = {
  nombre: "Carlos",
  edad: 28,
  empresa: "TechCorp",
  salario: 80000,
};
```

---

## Interfaces en React: Props de componentes

Este es el uso más frecuente en React:

```tsx
// Definir la forma de las props
interface BotonProps {
  texto: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "danger";
}

// Usar la interface en el componente
function Boton({ texto, onClick, disabled = false, variant = "primary" }: BotonProps) {
  return (
    <button onClick={onClick} disabled={disabled} className={variant}>
      {texto}
    </button>
  );
}
```

---

## Index signatures (firmas de índice)

Cuando no sabés de antemano los nombres de las propiedades:

```ts
interface Diccionario {
  [clave: string]: string;
}

const traducciones: Diccionario = {
  hola: "hello",
  adios: "goodbye",
  gato: "cat",
};
```

---

## Interfaces con métodos

```ts
interface Calculadora {
  sumar(a: number, b: number): number;
  restar(a: number, b: number): number;
  limpiar(): void;
}

const calc: Calculadora = {
  sumar: (a, b) => a + b,
  restar: (a, b) => a - b,
  limpiar: () => console.log("Limpiado"),
};
```

---

## Resumen

- **`interface`**: ideal para definir la forma de objetos y props de componentes React
- **`type`**: más flexible, sirve para uniones, tuplas y alias de cualquier tipo
- **`?`**: hace una propiedad opcional
- **`readonly`**: impide modificar la propiedad después de la creación
