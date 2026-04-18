# 03 - Funciones Tipadas

## Funciones en JavaScript vs TypeScript

En JavaScript las funciones aceptan cualquier argumento sin restricciones. En TypeScript, especificás exactamente qué reciben y qué devuelven.

---

## Tipado de parámetros y retorno

```ts
// JavaScript
function sumar(a, b) {
  return a + b;
}

// TypeScript
function sumar(a: number, b: number): number {
  return a + b;
}
```

El tipo de retorno va después de los paréntesis con `:`.

---

## Inferencia en funciones

TypeScript puede inferir el tipo de retorno, pero **es recomendable anotarlo** para mayor claridad:

```ts
// TypeScript infiere que retorna number
function multiplicar(a: number, b: number) {
  return a * b;
}

// Explícito — preferible en funciones importantes
function dividir(a: number, b: number): number {
  if (b === 0) throw new Error("División por cero");
  return a / b;
}
```

---

## Parámetros opcionales con `?`

```ts
function saludar(nombre: string, titulo?: string): string {
  if (titulo) {
    return `Hola, ${titulo} ${nombre}`;
  }
  return `Hola, ${nombre}`;
}

saludar("Ana");          // "Hola, Ana"
saludar("Ana", "Dr.");   // "Hola, Dr. Ana"
```

---

## Parámetros con valor por defecto

```ts
function crearUsuario(nombre: string, rol: string = "usuario"): object {
  return { nombre, rol };
}

crearUsuario("Juan");            // { nombre: "Juan", rol: "usuario" }
crearUsuario("Admin", "admin");  // { nombre: "Admin", rol: "admin" }
```

---

## Parámetros rest (`...`)

```ts
function sumarTodos(...numeros: number[]): number {
  return numeros.reduce((acc, n) => acc + n, 0);
}

sumarTodos(1, 2, 3);          // 6
sumarTodos(10, 20, 30, 40);   // 100
```

---

## Funciones como tipos

En JavaScript los callbacks son muy comunes. En TypeScript podés tipar exactamente la firma de una función:

```ts
// Tipo de función: recibe dos numbers, devuelve number
type Operacion = (a: number, b: number) => number;

const sumar: Operacion = (a, b) => a + b;
const restar: Operacion = (a, b) => a - b;

function operar(a: number, b: number, fn: Operacion): number {
  return fn(a, b);
}

operar(10, 5, sumar);  // 15
operar(10, 5, restar); // 5
```

---

## Funciones flecha tipadas

```ts
// Las dos formas son equivalentes:

// Forma 1: tipo en la variable
const doblar: (n: number) => number = (n) => n * 2;

// Forma 2: tipos en los parámetros
const triplicar = (n: number): number => n * 3;

// Más concisa y legible
const cuadrado = (n: number) => n * n;
```

---

## Callbacks tipados

Este patrón es **muy común en React**: event handlers, `Array.map`, `Array.filter`, etc.

```ts
interface Usuario {
  id: number;
  nombre: string;
  activo: boolean;
}

const usuarios: Usuario[] = [
  { id: 1, nombre: "Ana", activo: true },
  { id: 2, nombre: "Bob", activo: false },
  { id: 3, nombre: "Carol", activo: true },
];

// callback tipado en .filter()
const activos = usuarios.filter((u: Usuario) => u.activo);

// callback tipado en .map()
const nombres = usuarios.map((u: Usuario): string => u.nombre);

console.log(activos);  // [Ana, Carol]
console.log(nombres);  // ["Ana", "Bob", "Carol"]
```

---

## Sobrecarga de funciones

Cuando una función puede recibir distintos tipos de argumentos:

```ts
function formatear(valor: string): string;
function formatear(valor: number): string;
function formatear(valor: string | number): string {
  if (typeof valor === "number") {
    return valor.toLocaleString("es-AR");
  }
  return valor.trim().toLowerCase();
}

formatear(1500000); // "1.500.000"
formatear("  HOLA  ");  // "hola"
```

---

## Tipo `void` en callbacks

Cuando un callback no necesita retornar nada:

```ts
// Evento de click en React
type ClickHandler = (evento: MouseEvent) => void;

// Función que acepta ese callback
function configurarBoton(handler: ClickHandler): void {
  document.addEventListener("click", handler);
}
```

---

## Funciones genéricas (adelanto)

```ts
// Función que devuelve el primero de un array (de cualquier tipo)
function primero<T>(lista: T[]): T | undefined {
  return lista[0];
}

primero([1, 2, 3]);          // number
primero(["a", "b", "c"]);    // string
primero([true, false]);       // boolean
```

> Los genéricos se profundizan en el tema 05.

---

## Resumen

| Concepto                  | Ejemplo                                      |
|---------------------------|----------------------------------------------|
| Parámetro tipado          | `(nombre: string)`                           |
| Retorno tipado            | `): number {`                                |
| Parámetro opcional        | `(titulo?: string)`                          |
| Valor por defecto         | `(rol = "usuario")`                          |
| Rest params               | `(...nums: number[])`                        |
| Tipo de función           | `type Fn = (a: number) => string`            |
| Callback                  | `(callback: () => void)`                     |
