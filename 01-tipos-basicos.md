# 01 - Tipos Básicos en TypeScript

## ¿Por qué tipos?

En JavaScript podés hacer esto sin ningún error:

```js
let edad = 25;
edad = "veinticinco"; // JS no se queja
```

TypeScript detecta ese problema **en tiempo de compilación**, antes de que llegue a producción.

---

## Tipos primitivos

| Tipo        | Descripción                          | Ejemplo              |
|-------------|--------------------------------------|----------------------|
| `string`    | Cadenas de texto                     | `"Hola"`             |
| `number`    | Números enteros y decimales          | `42`, `3.14`         |
| `boolean`   | Verdadero o falso                    | `true`, `false`      |
| `null`      | Valor nulo explícito                 | `null`               |
| `undefined` | Variable no inicializada             | `undefined`          |
| `bigint`    | Enteros muy grandes                  | `9007199254740993n`  |
| `symbol`    | Identificadores únicos               | `Symbol("id")`       |

---

## Anotaciones de tipo

Se agregan con `: tipo` después del nombre de la variable:

```ts
let nombre: string = "Ana";
let edad: number = 30;
let activo: boolean = true;
```

---

## Inferencia de tipos

TypeScript **infiere** el tipo automáticamente cuando asignás un valor inicial. No siempre hace falta anotarlo:

```ts
let ciudad = "Buenos Aires"; // TypeScript infiere: string
let año = 2026;              // TypeScript infiere: number
```

---

## Arrays

```ts
let frutas: string[] = ["manzana", "pera", "uva"];
let notas: number[] = [7, 8, 10];

// Sintaxis alternativa con genérico
let colores: Array<string> = ["rojo", "verde", "azul"];
```

---

## Tuplas

Arrays de longitud y tipos fijos. Muy usados en React (ej: `useState`):

```ts
let coordenada: [number, number] = [40.7, -74.0];
let estado: [string, boolean] = ["activo", true];

// Así funciona internamente useState:
// const [count, setCount] = useState(0)
// es una tupla [number, (n: number) => void]
```

---

## `any` — el "modo escape"

Deshabilita el chequeo de tipos. Usarlo lo menos posible:

```ts
let dato: any = "texto";
dato = 42;       // TypeScript no se queja
dato = true;     // ni aquí tampoco
```

> ⚠️ Usar `any` es como volver a JavaScript. Evitalo salvo en situaciones muy específicas.

---

## `unknown` — la alternativa segura a `any`

Acepta cualquier valor pero **obliga a verificar el tipo antes de usarlo**:

```ts
let entrada: unknown = obtenerDato();

// Error: no podés usar entrada como string sin verificar
// entrada.toUpperCase(); ❌

if (typeof entrada === "string") {
  console.log(entrada.toUpperCase()); // ✅ ahora sí
}
```

---

## `void` y `never`

```ts
// void: la función no retorna ningún valor útil
function saludar(): void {
  console.log("Hola!");
}

// never: la función NUNCA termina (lanza error o loop infinito)
function lanzarError(mensaje: string): never {
  throw new Error(mensaje);
}
```

---

## Tipos literales

Podés restringir una variable a un valor exacto:

```ts
let direccion: "norte" | "sur" | "este" | "oeste";
direccion = "norte"; // ✅
direccion = "arriba"; // ❌ Error de compilación
```

> Esto es muy útil en React para props que solo aceptan ciertos valores (ej: `size: "sm" | "md" | "lg"`).

---

## Valor `null` y `undefined` con `strictNullChecks`

Con la opción `strictNullChecks` activada (recomendada), `null` y `undefined` no son asignables a otros tipos:

```ts
let nombre: string = null; // ❌ Error

let nombre: string | null = null; // ✅
```

---

## Resumen visual

```
JavaScript:  let x = 5;     → puede cambiar a cualquier tipo
TypeScript:  let x: number = 5; → solo puede ser number
```
