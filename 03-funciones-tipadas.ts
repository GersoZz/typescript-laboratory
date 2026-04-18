// =============================================================
// 03 - FUNCIONES TIPADAS EN TYPESCRIPT
// =============================================================
export {};

// ------------------------------------------------------------
// 1. TIPADO BÁSICO DE PARÁMETROS Y RETORNO
// ------------------------------------------------------------
function sumar(a: number, b: number): number {
  return a + b;
}

function concatenar(a: string, b: string): string {
  return a + " " + b;
}

function esMayor(a: number, b: number): boolean {
  return a > b;
}

console.log(sumar(5, 3));             // 8
console.log(concatenar("Hola", "TypeScript")); // "Hola TypeScript"
console.log(esMayor(10, 7));          // true

// ------------------------------------------------------------
// 2. INFERENCIA DE RETORNO
// TypeScript puede deducirlo, pero anotar es buena práctica
// ------------------------------------------------------------
const cuadrado = (n: number) => n * n; // retorno inferido: number

// Explícito — más legible en proyectos grandes
function dividir(a: number, b: number): number {
  if (b === 0) throw new Error("División por cero");
  return a / b;
}

// ------------------------------------------------------------
// 3. PARÁMETROS OPCIONALES con ?
// Deben ir al final
// ------------------------------------------------------------
function saludar(nombre: string, titulo?: string): string {
  if (titulo) {
    return `Hola, ${titulo} ${nombre}`;
  }
  return `Hola, ${nombre}`;
}

console.log(saludar("Ana"));           // "Hola, Ana"
console.log(saludar("Ana", "Dr."));    // "Hola, Dr. Ana"
console.log(saludar("López", "Lic.")); // "Hola, Lic. López"

// ------------------------------------------------------------
// 4. PARÁMETROS CON VALOR POR DEFECTO
// ------------------------------------------------------------
function crearPassword(longitud: number = 12, incluirSimbolos: boolean = true): string {
  const base = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const simbolos = "!@#$%^&*";
  const chars = incluirSimbolos ? base + simbolos : base;
  return Array.from({ length: longitud }, () =>
    chars[Math.floor(Math.random() * chars.length)]
  ).join("");
}

console.log(crearPassword());          // 12 chars con símbolos
console.log(crearPassword(8));         // 8 chars con símbolos
console.log(crearPassword(16, false)); // 16 chars sin símbolos

// ------------------------------------------------------------
// 5. PARÁMETROS REST
// ------------------------------------------------------------
function sumarTodos(...numeros: number[]): number {
  return numeros.reduce((acumulador, numero) => acumulador + numero, 0);
}

function unirConSeparador(separador: string, ...palabras: string[]): string {
  return palabras.join(separador);
}

console.log(sumarTodos(1, 2, 3));          // 6
console.log(sumarTodos(10, 20, 30, 40));   // 100
console.log(unirConSeparador(" | ", "uno", "dos", "tres")); // "uno | dos | tres"

// ------------------------------------------------------------
// 6. FUNCIONES COMO TIPOS
// ------------------------------------------------------------
type Operacion = (a: number, b: number) => number;
type Predicado<T> = (item: T) => boolean;
type Transformador<T, R> = (item: T) => R;

const sumar2: Operacion = (a, b) => a + b;
const restar: Operacion = (a, b) => a - b;
const multiplicar: Operacion = (a, b) => a * b;

function aplicarOperacion(a: number, b: number, fn: Operacion): number {
  return fn(a, b);
}

console.log(aplicarOperacion(10, 5, sumar2));      // 15
console.log(aplicarOperacion(10, 5, restar));      // 5
console.log(aplicarOperacion(10, 5, multiplicar)); // 50

// Operación personalizada pasada inline
console.log(aplicarOperacion(10, 5, (a, b) => a ** b)); // 100000

// ------------------------------------------------------------
// 7. CALLBACKS TIPADOS — muy comunes en React
// ------------------------------------------------------------
interface Tarea {
  id: number;
  titulo: string;
  completada: boolean;
  prioridad: "alta" | "media" | "baja";
}

const tareas: Tarea[] = [
  { id: 1, titulo: "Diseñar componentes", completada: true,  prioridad: "alta" },
  { id: 2, titulo: "Conectar a la API",   completada: false, prioridad: "alta" },
  { id: 3, titulo: "Escribir tests",      completada: false, prioridad: "media" },
  { id: 4, titulo: "Deploy",              completada: false, prioridad: "baja" },
];

// .filter() con callback tipado
const pendientes: Tarea[] = tareas.filter((t: Tarea) => !t.completada);
const altaPrioridad: Tarea[] = tareas.filter(
  (t: Tarea) => t.prioridad === "alta" && !t.completada
);

// .map() con callback tipado
const titulos: string[] = tareas.map((t: Tarea): string => t.titulo);
const resumenes = tareas.map((t: Tarea) => ({
  id: t.id,
  info: `[${t.prioridad.toUpperCase()}] ${t.titulo}`,
  estado: t.completada ? "✅" : "⏳",
}));

console.log("Pendientes:", pendientes.length);
console.log("Alta prioridad pendiente:", altaPrioridad.map((t) => t.titulo));
console.log("Resúmenes:", resumenes);

// ------------------------------------------------------------
// 8. FUNCIONES COMO PARÁMETROS (HOF — Higher Order Functions)
// ------------------------------------------------------------
function filtrarYTransformar<Entrada, Salida>(
  lista: Entrada[],
  filtro: Predicado<Entrada>,
  transformar: Transformador<Entrada, Salida>
): Salida[] {
  return lista.filter(filtro).map(transformar);
}

const titulosPendientes = filtrarYTransformar(
  tareas,
  (t) => !t.completada,
  (t) => t.titulo.toUpperCase()
);
console.log("Títulos pendientes:", titulosPendientes);

// ------------------------------------------------------------
// 9. FUNCIONES QUE RETORNAN FUNCIONES (currying)
// ------------------------------------------------------------
function crearMultiplicador(factor: number): (n: number) => number {
  return (n: number) => n * factor;
}

const doble = crearMultiplicador(2);
const triple = crearMultiplicador(3);
const decuple = crearMultiplicador(10);

console.log(doble(5));    // 10
console.log(triple(5));   // 15
console.log(decuple(5));  // 50

// En React esto es útil para crear handlers configurables:
function crearHandler(accion: string): () => void {
  return () => console.log(`Ejecutando acción: ${accion}`);
}

const handleGuardar = crearHandler("GUARDAR");
const handleEliminar = crearHandler("ELIMINAR");
handleGuardar();  // "Ejecutando acción: GUARDAR"
handleEliminar(); // "Ejecutando acción: ELIMINAR"

// ------------------------------------------------------------
// 10. SOBRECARGA DE FUNCIONES
// Misma función, distintas firmas
// ------------------------------------------------------------
function formatearValor(valor: number): string;
function formatearValor(valor: string): string;
function formatearValor(valor: boolean): string;
function formatearValor(valor: number | string | boolean): string {
  if (typeof valor === "number") {
    return valor.toLocaleString("es-AR", { style: "decimal" });
  }
  if (typeof valor === "boolean") {
    return valor ? "Sí" : "No";
  }
  return valor.trim();
}

console.log(formatearValor(1500000));   // "1.500.000"
console.log(formatearValor(true));      // "Sí"
console.log(formatearValor("  hola ")); // "hola"

// ------------------------------------------------------------
// 11. SIMULANDO EVENT HANDLERS DE REACT (sin DOM real)
// ------------------------------------------------------------
// En React, los tipos de eventos son MouseEvent, ChangeEvent, etc.
// Aquí simulamos la firma típica:

type ChangeHandler = (valor: string) => void;
type SubmitHandler = (datos: Record<string, string>) => void;

function simularInput(handler: ChangeHandler): void {
  // Simula que el usuario escribió algo
  handler("texto ingresado por el usuario");
}

function simularSubmit(handler: SubmitHandler): void {
  handler({ nombre: "Ana", email: "ana@test.com" });
}

simularInput((valor) => console.log("Input cambiado:", valor));
simularSubmit((datos) => console.log("Formulario enviado:", datos));

// ------------------------------------------------------------
// 12. FUNCIONES ASÍNCRONAS TIPADAS
// ------------------------------------------------------------
interface RespuestaApi {
  data: unknown;
  status: number;
  mensaje: string;
}

async function fetchDatos(url: string): Promise<RespuestaApi> {
  // Simulación de fetch
  return {
    data: { id: 1, nombre: "Ejemplo" },
    status: 200,
    mensaje: "OK",
  };
}

// Llamada con await (dentro de async context)
fetchDatos("https://api.ejemplo.com/usuarios")
  .then((respuesta) => console.log("Respuesta:", respuesta.status, respuesta.mensaje))
  .catch((error: Error) => console.error("Error:", error.message));
