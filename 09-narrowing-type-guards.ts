// =============================================================
// 09 - NARROWING Y TYPE GUARDS EN TYPESCRIPT
// =============================================================
export {};

// ------------------------------------------------------------
// 1. typeof — narrowing de tipos primitivos
// ------------------------------------------------------------
function procesar(valor: string | number | boolean): string {
  if (typeof valor === "string") {
    // Aquí TypeScript sabe que valor es string
    return `Texto: "${valor.toUpperCase()}"`;
  }
  if (typeof valor === "number") {
    // Aquí TypeScript sabe que valor es number
    return `Número: ${valor.toFixed(2)}`;
  }
  // Aquí TypeScript sabe que valor es boolean
  return `Booleano: ${valor ? "Verdadero" : "Falso"}`;
}

console.log(procesar("hola"));   // Texto: "HOLA"
console.log(procesar(3.14159));  // Número: 3.14
console.log(procesar(true));     // Booleano: Verdadero

// ------------------------------------------------------------
// 2. instanceof — narrowing de instancias de clases
// ------------------------------------------------------------
function describir(valor: Date | Error | RegExp| string): string {
  if (valor instanceof Date) {
    return `Fecha: ${valor.toLocaleDateString("es-AR")}`;
  }
  if (valor instanceof Error) {
    return `Error [${valor.name}]: ${valor.message}`;
  }
  if (valor instanceof RegExp) {
    return `RegExp: ${valor.source}`;
  }
  return `String: ${valor}`;
}

console.log(describir(new Date("2026-03-07")));           // Fecha: 7/3/2026
console.log(describir(new TypeError("tipo incorrecto"))); // Error [TypeError]: tipo incorrecto
console.log(describir(/\d+/g));                           // RegExp: \d+

// ------------------------------------------------------------
// 3. in — verificar si un objeto tiene una propiedad
// ------------------------------------------------------------
interface Perro {
  nombre: string;
  raza: string;
  ladrar(): void;
}

interface Gato {
  nombre: string;
  color: string;
  maullar(): void;
}

interface Pez {
  nombre: string;
  especie: string;
  nadar(): void;
}

type Mascota = Perro | Gato | Pez;

function hacerSonido(mascota: Mascota): string {
  if ("ladrar" in mascota) {
    mascota.ladrar(); // TypeScript sabe que es Perro
    return "Guau!";
  }
  if ("maullar" in mascota) {
    mascota.maullar(); // TypeScript sabe que es Gato
    return "Miau!";
  }
  // TypeScript sabe que es Pez
  return `${mascota.nombre} nada silenciosamente...`;
}

const rex: Perro = { nombre: "Rex", raza: "Labrador", ladrar: () => console.log("Guau!") };
const luna: Gato = { nombre: "Luna", color: "gris", maullar: () => console.log("Miau!") };
const nemo: Pez = { nombre: "Nemo", especie: "Pez payaso", nadar: () => {} };

console.log(hacerSonido(rex));
console.log(hacerSonido(luna));
console.log(hacerSonido(nemo));

// ------------------------------------------------------------
// 4. DISCRIMINATED UNIONS — el narrowing más limpio
// ------------------------------------------------------------
type ResultadoOk<T> = {
  ok: true;
  datos: T;
  timestamp: number;
};

type ResultadoError = {
  ok: false;
  error: string;
  codigo: number;
};

type Resultado<T> = ResultadoOk<T> | ResultadoError;

function manejarResultado<T>(resultado: Resultado<T>): void {
  if (resultado.ok) {
    // TypeScript sabe que resultado es ResultadoOk<T>
    console.log("✅ Éxito:", resultado.datos, "(ts:", resultado.timestamp, ")");
  } else {
    // TypeScript sabe que resultado es ResultadoError
    console.error(`❌ Error ${resultado.codigo}: ${resultado.error}`);
  }
}

const exito: Resultado<string[]> = {
  ok: true,
  datos: ["Ana", "Bob"],
  timestamp: Date.now(),
};

const error: Resultado<never> = {
  ok: false,
  error: "No autorizado",
  codigo: 401,
};

manejarResultado(exito);
manejarResultado(error);

// Patrón muy usado en React con fetch:
async function fetchConResultado<T>(url: string): Promise<Resultado<T>> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      return { ok: false, error: response.statusText, codigo: response.status };
    }
    const datos = await response.json() as T;
    return { ok: true, datos, timestamp: Date.now() };
  } catch (e) {
    return { ok: false, error: String(e), codigo: 0 };
  }
}

// ------------------------------------------------------------
// 5. TYPE GUARDS — predicados de tipo reutilizables
// La sintaxis: función que retorna "valor is Tipo"
// ------------------------------------------------------------
interface UsuarioAdmin {
  tipo: "admin";
  nombre: string;
  permisos: string[];
}

interface UsuarioCliente {
  tipo: "cliente";
  nombre: string;
  compras: number;
}

type UsuarioApp = UsuarioAdmin | UsuarioCliente;

// Type guard: enseña a TypeScript a reconocer el tipo
function esAdmin(usuario: UsuarioApp): usuario is UsuarioAdmin {
  return usuario.tipo === "admin";
}

function esCliente(usuario: UsuarioApp): usuario is UsuarioCliente {
  return usuario.tipo === "cliente";
}

function mostrarPerfil(usuario: UsuarioApp): void {
  if (esAdmin(usuario)) {
    console.log(`Admin: ${usuario.nombre} | Permisos: ${usuario.permisos.join(", ")}`);
  } else {
    console.log(`Cliente: ${usuario.nombre} | Compras: ${usuario.compras}`);
  }
}

const admin: UsuarioAdmin = { tipo: "admin", nombre: "Ana", permisos: ["crear", "eliminar"] };
const cliente: UsuarioCliente = { tipo: "cliente", nombre: "Bob", compras: 15 };

mostrarPerfil(admin);
mostrarPerfil(cliente);

// Type guard para verificar si es array
function esArray<T>(valor: T | T[]): valor is T[] {
  return Array.isArray(valor);
}

function procesarUnoOVarios(tags: string | string[]): string[] {
  if (esArray(tags)) {
    return tags.map((t) => t.toLowerCase());
  }
  return [tags.toLowerCase()];
}

console.log(procesarUnoOVarios("TypeScript"));          // ["typescript"]
console.log(procesarUnoOVarios(["React", "Node"]));     // ["react", "node"]

// ------------------------------------------------------------
// 6. ASSERTION FUNCTIONS
// Lanzan error si la condición no se cumple, y le comunican el tipo a TS
// ------------------------------------------------------------
function asegurar(condicion: boolean, mensaje: string): asserts condicion {
  if (!condicion) throw new Error(`Aserción fallida: ${mensaje}`);
}

function asegurarDefinido<T>(
  valor: T | null | undefined,
  nombre: string = "valor"
): asserts valor is T {
  if (valor == null) {
    throw new Error(`${nombre} no puede ser null o undefined`);
  }
}

function asegurarString(valor: unknown): asserts valor is string {
  if (typeof valor !== "string") {
    throw new TypeError(`Se esperaba string, se recibió ${typeof valor}`);
  }
}

// Uso:
let nombre: string | null = "Ana";
asegurarDefinido(nombre, "nombre");
console.log(nombre.toUpperCase()); // ✅ TypeScript lo sabe seguro

const inputValue: unknown = "texto del usuario";
asegurarString(inputValue);
console.log(inputValue.toUpperCase()); // ✅

// ------------------------------------------------------------
// 7. EXHAUSTIVIDAD CON never
// Garantiza que todos los casos están cubiertos
// ------------------------------------------------------------
type Figura = "circulo" | "cuadrado" | "triangulo" | "hexagono";

function areaFigura(figura: Figura, medida: number): number {
  switch (figura) {
    case "circulo":
      return Math.PI * medida ** 2;
    case "cuadrado":
      return medida ** 2;
    case "triangulo":
      return (Math.sqrt(3) / 4) * medida ** 2;
    case "hexagono":
      return (3 * Math.sqrt(3) / 2) * medida ** 2;
    default:
      // Si agregas una figura nueva y olvidás el case → error de compilación
      const _exhaustivo: never = figura;
      throw new Error(`Figura no manejada: ${_exhaustivo}`);
  }
}

console.log("Área círculo (r=5):", areaFigura("circulo", 5).toFixed(2));
console.log("Área cuadrado (l=4):", areaFigura("cuadrado", 4).toFixed(2));

// ------------------------------------------------------------
// 8. OPTIONAL CHAINING ?. y NULLISH COALESCING ??
// El narrowing más conciso para null/undefined
// ------------------------------------------------------------
interface Direccion {
  calle: string;
  ciudad: string;
  pais?: string;
}

interface Perfil {
  avatar?: string;
  bio?: string;
}

interface UsuarioCompleto {
  id: number;
  nombre: string;
  email: string;
  direccion?: Direccion;
  perfil?: Perfil;
  notificar?: (msg: string) => void;
}

const usuarioConDatos: UsuarioCompleto = {
  id: 1,
  nombre: "Ana",
  email: "ana@test.com",
  direccion: { calle: "Av. Corrientes 1234", ciudad: "Buenos Aires" },
};

const usuarioSinDatos: UsuarioCompleto = {
  id: 2,
  nombre: "Bob",
  email: "bob@test.com",
};

// ?. — accede de forma segura (retorna undefined si algún eslabón es null/undefined)
const ciudad1 = usuarioConDatos.direccion?.ciudad ?? "Ciudad desconocida";
const ciudad2 = usuarioSinDatos.direccion?.ciudad ?? "Ciudad desconocida";
const avatar1 = usuarioConDatos.perfil?.avatar ?? "/default-avatar.png";

console.log("Ciudad 1:", ciudad1);   // "Buenos Aires"
console.log("Ciudad 2:", ciudad2);   // "Ciudad desconocida"
console.log("Avatar:", avatar1);     // "/default-avatar.png"

// ?. para llamar métodos opcionales
usuarioConDatos.notificar?.("Mensaje de prueba"); // No hace nada (no definido)
usuarioSinDatos.notificar?.("Hola");              // No hace nada (no definido)

// Encadenamiento profundo
const pais = usuarioConDatos.direccion?.pais?.toUpperCase() ?? "AR";
console.log("País:", pais); // "AR" (pais es undefined)

// ?? vs || (diferencia importante)
// Usamos variables tipadas para que TypeScript no optimice los literales
const num: number | null | undefined = 0;   // 0 es un valor válido (no nullish)
const str: string | null | undefined = "";  // "" es un valor válido (no nullish)

const valor1 = num ?? "default";    // 0    (0 no es null/undefined → se usa 0)
const valor2 = num || "default";    // "default" (0 es falsy → se usa "default")
const valor3 = str ?? "default";    // ""   ("" no es null/undefined → se usa "")
const valor4 = str || "default";    // "default" ("" es falsy → se usa "default")

console.log("?? con 0:", valor1);   // 0
console.log("|| con 0:", valor2);   // "default"
console.log("?? con '':", valor3);  // ""
console.log("|| con '':", valor4);  // "default"

// ------------------------------------------------------------
// 9. NARROWING EN MANEJO DE ERRORES
// Común en React al hacer fetch o usar try/catch
// ------------------------------------------------------------
function manejarError(error: unknown): string {
  // En TypeScript 4+, los errores en catch son 'unknown' con strict mode
  if (error instanceof Error) {
    return `Error: ${error.message}`;
  }
  if (typeof error === "string") {
    return `Error string: ${error}`;
  }
  if (typeof error === "object" && error !== null && "message" in error) {
    return `Error objeto: ${String((error as { message: unknown }).message)}`;
  }
  return `Error desconocido: ${String(error)}`;
}

try {
  throw new TypeError("Tipo inválido");
} catch (e) {
  console.log(manejarError(e));
}

try {
  throw "un error de string";
} catch (e) {
  console.log(manejarError(e));
}
