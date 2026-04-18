# 09 - Narrowing y Type Guards

## ¿Qué es el narrowing?

**Narrowing** (estrechar/acotar) es el proceso por el cual TypeScript **reduce** el tipo posible de una variable dentro de un bloque de código, basándose en condiciones que vos escribís.

Tenés una variable de tipo `string | number`, y TypeScript necesita saber cuál de los dos es antes de dejarte usar métodos específicos de cada tipo.

---

## `typeof` — el más básico

```ts
function procesar(valor: string | number): string {
  if (typeof valor === "string") {
    // Aquí TypeScript sabe que valor es string
    return valor.toUpperCase();
  }
  // Aquí TypeScript sabe que valor es number
  return valor.toFixed(2);
}
```

`typeof` funciona con: `"string"`, `"number"`, `"boolean"`, `"bigint"`, `"symbol"`, `"undefined"`, `"function"`, `"object"`

---

## `instanceof` — para clases

```ts
function formatearFecha(fecha: Date | string): string {
  if (fecha instanceof Date) {
    return fecha.toLocaleDateString("es-AR");
  }
  return new Date(fecha).toLocaleDateString("es-AR");
}
```

---

## Verificación de propiedades con `in`

```ts
interface Perro { raza: string; ladrar(): void; }
interface Gato  { color: string; maullar(): void; }

function hacerSonido(animal: Perro | Gato): void {
  if ("ladrar" in animal) {
    animal.ladrar(); // TypeScript sabe que es Perro
  } else {
    animal.maullar(); // TypeScript sabe que es Gato
  }
}
```

---

## Discriminated Union narrowing

Con una propiedad discriminante (como `tipo`), TypeScript hace el narrowing automáticamente:

```ts
type Exito<T> = { ok: true;  datos: T };
type Error    = { ok: false; error: string };
type Resultado<T> = Exito<T> | Error;

function manejar(resultado: Resultado<number>): void {
  if (resultado.ok) {
    console.log("Datos:", resultado.datos); // TypeScript sabe que es Exito<number>
  } else {
    console.log("Error:", resultado.error); // TypeScript sabe que es Error
  }
}
```

---

## Type Guards — predicados de tipo

Son funciones que devuelven `valor is Tipo`. Le enseñan a TypeScript a reconocer tipos complejos:

```ts
interface Admin    { tipo: "admin";    permisos: string[] }
interface Cliente  { tipo: "cliente";  compras: number }

function esAdmin(usuario: Admin | Cliente): usuario is Admin {
  return usuario.tipo === "admin";
}

function procesar(usuario: Admin | Cliente): void {
  if (esAdmin(usuario)) {
    console.log("Permisos:", usuario.permisos); // Admin
  } else {
    console.log("Compras:", usuario.compras);   // Cliente
  }
}
```

---

## Assertion functions

Lanzan error si la condición no se cumple, actuando como "aserciones":

```ts
function asegurar(condicion: boolean, mensaje: string): asserts condicion {
  if (!condicion) throw new Error(mensaje);
}

function asegurarDefinido<T>(valor: T | null | undefined): asserts valor is T {
  if (valor == null) throw new Error("El valor no puede ser null/undefined");
}

let nombre: string | null = obtenerNombre();
asegurarDefinido(nombre);
// A partir de aquí TypeScript sabe que nombre es string
console.log(nombre.toUpperCase()); // ✅
```

---

## Exhaustividad — el patrón `never`

Cuando hacés narrowing con switch, podés usar `never` para verificar que todas las variantes están cubiertas:

```ts
type Animal = "perro" | "gato" | "pájaro";

function hablar(animal: Animal): string {
  switch (animal) {
    case "perro": return "¡Guau!";
    case "gato":  return "Miau";
    case "pájaro": return "Pío pío";
    default:
      const _exhaustivo: never = animal; // Error si falta algún caso
      throw new Error(`Animal no manejado: ${_exhaustivo}`);
  }
}
```

---

## Nullish coalescing `??` y optional chaining `?.`

```ts
// ?? devuelve el valor de la derecha si el de la izquierda es null/undefined
const nombre = usuario?.nombre ?? "Anónimo";

// ?. accede a propiedades/métodos solo si el objeto no es null/undefined
const email = usuario?.perfil?.email?.toLowerCase();

// ?. también en llamadas a métodos
usuario?.notificar("Hola!"); // No falla si usuario es null
```

---

## En React: narrowing de eventos

```tsx
function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
  if (e.target instanceof HTMLInputElement) {
    console.log("Input:", e.target.value, "Tipo:", e.target.type);
  } else {
    console.log("Select:", e.target.value);
  }
}
```

---

## Resumen

| Técnica                   | Cuándo usarla                                     |
|---------------------------|---------------------------------------------------|
| `typeof`                  | Primitivos: string, number, boolean, etc.         |
| `instanceof`              | Clases: Date, Error, Map, clases propias          |
| `in`                      | Verificar si un objeto tiene una propiedad        |
| Campo discriminante       | Uniones con propiedad `tipo`/`kind`               |
| Type guard (is)           | Funciones de verificación reutilizables           |
| `never` exhaustivo        | Verificar que todos los casos están cubiertos     |
| `??` y `?.`               | Manejo seguro de null y undefined                 |
