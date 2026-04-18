// =============================================================
// 01 - TIPOS BÁSICOS EN TYPESCRIPT
// =============================================================
export {};

// ------------------------------------------------------------
// 1. ANOTACIONES DE TIPO EXPLÍCITAS
// ------------------------------------------------------------
let nombre: string = "Ana García";
let edad: number = 30;
let estaActivo: boolean = true;
let sinValor: null = null;
let noDefinido: undefined = undefined;

console.log(nombre, edad, estaActivo);

// ------------------------------------------------------------
// 2. INFERENCIA DE TIPOS
// TypeScript deduce el tipo por el valor inicial
// ------------------------------------------------------------
let ciudad = "Córdoba";        // inferido como string
let año = 2026;                // inferido como number
let esAdmin = false;           // inferido como boolean

// ciudad = 42; // ❌ Error: Type 'number' is not assignable to type 'string'

// ------------------------------------------------------------
// 3. ARRAYS
// ------------------------------------------------------------
const frutas: string[] = ["manzana", "pera", "uva"];
const notas: number[] = [7, 8.5, 10];
const flags: Array<boolean> = [true, false, true]; // sintaxis alternativa

frutas.push("banana");         // ✅ es string
// frutas.push(123);           // ❌ Error: Argument of type 'number' is not assignable to string

// ------------------------------------------------------------
// 4. TUPLAS
// Arrays con posiciones y tipos fijos
// ------------------------------------------------------------
let coordenada: [number, number] = [-34.6, -58.4]; // [lat, lon]
let datosUsuario: [string, number, boolean] = ["Carlos", 25, true];

// Desestructuración (como useState en React)
const [latitud, longitud] = coordenada;
console.log(`Lat: ${latitud}, Lon: ${longitud}`);

// Ejemplo que imita useState internamente:
const estadoContador: [number, (n: number) => void] = [
  0,
  (nuevoValor: number) => console.log("Nuevo valor:", nuevoValor),
];
const [contador, setContador] = estadoContador;
setContador(5);

// ------------------------------------------------------------
// 5. TIPOS LITERALES
// Restringen la variable a valores exactos
// ------------------------------------------------------------
let direccion: "norte" | "sur" | "este" | "oeste";
direccion = "norte"; // ✅
// direccion = "arriba"; // ❌ Error

// Muy útil para props de componentes React:
type TamañoBoton = "sm" | "md" | "lg";
let tamaño: TamañoBoton = "md";
console.log("Tamaño del botón:", tamaño);

// ------------------------------------------------------------
// 6. ANY — evitar siempre que sea posible
// ------------------------------------------------------------
let datoAny: any = "texto";
datoAny = 42;     // TypeScript no se queja
datoAny = true;   // ni aquí
// Problema: perdiste toda la seguridad de tipos

// ------------------------------------------------------------
// 7. UNKNOWN — la alternativa segura a any
// ------------------------------------------------------------
function procesarEntrada(entrada: unknown): string {
  // No podés usarla directamente sin verificar el tipo
  if (typeof entrada === "string") {
    return entrada.toUpperCase(); // ✅ TypeScript ya sabe que es string
  }
  if (typeof entrada === "number") {
    return entrada.toFixed(2);    // ✅ TypeScript ya sabe que es number
  }
  return String(entrada);
}

console.log(procesarEntrada("hola"));   // "HOLA"
console.log(procesarEntrada(3.14159));  // "3.14"

// ------------------------------------------------------------
// 8. VOID — funciones sin valor de retorno
// ------------------------------------------------------------
function mostrarMensaje(msg: string): void {
  console.log("Mensaje:", msg);
  // No retorna nada con valor útil
}

mostrarMensaje("Hola TypeScript!");

// ------------------------------------------------------------
// 9. NEVER — funciones que nunca terminan normalmente
// ------------------------------------------------------------
function lanzarError(mensaje: string): never {
  throw new Error(mensaje);
}

function loopInfinito(): never {
  while (true) {
    // nunca termina
  }
}

// ------------------------------------------------------------
// 10. NULL + UNDEFINED con tipos unión
// Con strictNullChecks, hay que ser explícito
// ------------------------------------------------------------
let nombreOpcional: string | null = null;
nombreOpcional = "Juan"; // ✅

let indice: number | undefined = undefined;
indice = 5; // ✅

// Operador de coalescencia nula (??) — devuelve el lado derecho si es null/undefined
const nombreFinal = nombreOpcional ?? "Anónimo";
console.log(nombreFinal); // "Juan"

const indiceFinal = indice ?? 0;
console.log(indiceFinal); // 5

// ------------------------------------------------------------
// 11. RESUMEN DE TIPOS PRIMITIVOS
// ------------------------------------------------------------
const resumen: {
  texto: string;
  numero: number;
  booleano: boolean;
  nulo: null;
  indefinido: undefined;
} = {
  texto: "TypeScript",
  numero: 2026,
  booleano: true,
  nulo: null,
  indefinido: undefined,
};

console.log(resumen);
