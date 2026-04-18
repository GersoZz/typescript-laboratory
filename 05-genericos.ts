// =============================================================
// 05 - GENÉRICOS (GENERICS) EN TYPESCRIPT
// =============================================================

// ------------------------------------------------------------
// 1. EL PROBLEMA SIN GENÉRICOS — código duplicado
// ------------------------------------------------------------
function primerStringV1(arr: string[]): string | undefined {
  return arr[0];
}
function primerNumberV1(arr: number[]): number | undefined {
  return arr[0];
}
// ... habría que repetir para boolean, object, etc.

// ------------------------------------------------------------
// 2. SOLUCIÓN: FUNCIÓN GENÉRICA
// <T> es el "parámetro de tipo"
// ------------------------------------------------------------
function primero<T>(arr: T[]): T | undefined {
  return arr[0];
}

function ultimo<T>(arr: T[]): T | undefined {
  return arr[arr.length - 1];
}

function identidad<T>(valor: T): T {
  return valor;
}

console.log(primero([1, 2, 3]));          // 1 (number)
console.log(primero(["a", "b", "c"]));    // "a" (string)
console.log(primero([true, false]));      // true (boolean)
console.log(ultimo([10, 20, 30]));        // 30

// TypeScript infiere T automáticamente:
identidad("hola");   // T = string
identidad(42);       // T = number

// O podés especificarlo:
identidad<string>("mundo");

// ------------------------------------------------------------
// 3. INTERFACES Y TYPES GENÉRICOS
// ------------------------------------------------------------
interface Caja<T> {
  contenido: T;
  etiqueta: string;
  sellada: boolean;
}

const cajaNum: Caja<number> = { contenido: 100, etiqueta: "cantidad", sellada: true };
const cajaTxt: Caja<string> = { contenido: "secreto", etiqueta: "mensaje", sellada: false };
const cajaArr: Caja<string[]> = {
  contenido: ["a", "b", "c"],
  etiqueta: "lista",
  sellada: true,
};

console.log(cajaNum, cajaTxt);

// Type alias genérico con múltiples parámetros
type Par<Clave, Valor> = {
  clave: Clave;
  valor: Valor;
};

const parEdad: Par<string, number> = { clave: "edad", valor: 30 };
const parFlag: Par<string, boolean> = { clave: "activo", valor: true };

console.log(parEdad, parFlag);

// ------------------------------------------------------------
// 4. RESPUESTA DE API — el genérico más útil en React
// ------------------------------------------------------------
interface RespuestaApi<T> {
  datos: T;
  exito: boolean;
  mensaje: string;
  total?: number;
  pagina?: number;
}

interface Usuario {
  id: number;
  nombre: string;
  email: string;
}

interface Producto {
  id: number;
  nombre: string;
  precio: number;
  stock: number;
}

// La misma estructura para diferentes entidades
type RespuestaUsuarios = RespuestaApi<Usuario[]>;
type RespuestaProducto = RespuestaApi<Producto>;
type RespuestaPaginada<T> = RespuestaApi<T> & { total: number; pagina: number };

// Simulación de respuestas
const respUsuarios: RespuestaUsuarios = {
  datos: [
    { id: 1, nombre: "Ana", email: "ana@test.com" },
    { id: 2, nombre: "Bob", email: "bob@test.com" },
  ],
  exito: true,
  mensaje: "OK",
};

const respProducto: RespuestaProducto = {
  datos: { id: 101, nombre: "Teclado", precio: 15000, stock: 50 },
  exito: true,
  mensaje: "OK",
};

console.log("Usuarios:", respUsuarios.datos.length);
console.log("Producto:", respProducto.datos.nombre);

// ------------------------------------------------------------
// 5. RESTRICCIONES con extends
// Limitan qué tipos acepta el genérico
// ------------------------------------------------------------

// Solo acepta tipos que tengan propiedad 'id'
function obtenerPorId<T extends { id: number }>(lista: T[], id: number): T | undefined {
  return lista.find((item) => item.id === id);
}

const usuarios: Usuario[] = respUsuarios.datos;
console.log("Usuario 1:", obtenerPorId(usuarios, 1));
console.log("Usuario 99:", obtenerPorId(usuarios, 99)); // undefined

// Solo acepta claves existentes del objeto (keyof)
function obtenerPropiedad<T, K extends keyof T>(objeto: T, clave: K): T[K] {
  return objeto[clave];
}

const usuario = usuarios[0];
console.log(obtenerPropiedad(usuario, "nombre")); // "Ana"
console.log(obtenerPropiedad(usuario, "email"));  // "ana@test.com"
// obtenerPropiedad(usuario, "telefono"); // ❌ 'telefono' no existe en Usuario

// ------------------------------------------------------------
// 6. MÚLTIPLES PARÁMETROS DE TIPO
// ------------------------------------------------------------
function zipArrays<A, B>(arrA: A[], arrB: B[]): [A, B][] {
  const resultado: [A, B][] = [];
  const longitud = Math.min(arrA.length, arrB.length);
  for (let i = 0; i < longitud; i++) {
    resultado.push([arrA[i], arrB[i]]);
  }
  return resultado;
}

const nombres = ["Ana", "Bob", "Carol"];
const edades = [30, 25, 35];
const zipped = zipArrays(nombres, edades);
console.log("Zipped:", zipped); // [["Ana", 30], ["Bob", 25], ["Carol", 35]]

function mapear<Entrada, Salida>(
  lista: Entrada[],
  transformar: (item: Entrada) => Salida
): Salida[] {
  return lista.map(transformar);
}

const precios = mapear(
  [{ nombre: "A", precio: 100 }, { nombre: "B", precio: 200 }],
  (p) => p.precio * 1.21  // agregar IVA
);
console.log("Precios con IVA:", precios);

// ------------------------------------------------------------
// 7. FETCH TIPADO CON GENÉRICOS
// El patrón más común al trabajar con APIs en React
// ------------------------------------------------------------
async function fetchData<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
  }
  return response.json() as Promise<T>;
}

// Uso — TypeScript sabe el tipo exacto del resultado:
// const usuarios = await fetchData<Usuario[]>("/api/usuarios");
// const producto = await fetchData<Producto>("/api/productos/1");

// Versión simulada para demostración:
async function fetchMock<T>(datos: T): Promise<RespuestaApi<T>> {
  return { datos, exito: true, mensaje: "OK" };
}

fetchMock<Usuario[]>([{ id: 1, nombre: "Test", email: "test@test.com" }])
  .then((r) => console.log("Mock fetch:", r.exito, r.datos.length, "items"));

// ------------------------------------------------------------
// 8. CLASE GENÉRICA — Stack/Pila
// ------------------------------------------------------------
class Pila<T> {
  private items: T[] = [];

  push(item: T): void {
    this.items.push(item);
  }

  pop(): T | undefined {
    return this.items.pop();
  }

  peek(): T | undefined {
    return this.items[this.items.length - 1];
  }

  get tamaño(): number {
    return this.items.length;
  }

  estaVacia(): boolean {
    return this.items.length === 0;
  }
}

const pilaNumeros = new Pila<number>();
pilaNumeros.push(1);
pilaNumeros.push(2);
pilaNumeros.push(3);
console.log("Tope:", pilaNumeros.peek());   // 3
console.log("Pop:", pilaNumeros.pop());     // 3
console.log("Tamaño:", pilaNumeros.tamaño); // 2

const pilaTextos = new Pila<string>();
pilaTextos.push("primer");
pilaTextos.push("segundo");
console.log("Pop texto:", pilaTextos.pop()); // "segundo"

// ------------------------------------------------------------
// 9. GENÉRICOS CON VALORES PREDETERMINADOS
// ------------------------------------------------------------
interface Estado<T = null> {
  cargando: boolean;
  datos: T | null;
  error: string | null;
}

// Sin especificar tipo → T = null
const estadoVacio: Estado = { cargando: false, datos: null, error: null };

// Especificando tipo
const estadoConUsuarios: Estado<Usuario[]> = {
  cargando: false,
  datos: usuarios,
  error: null,
};

console.log("Estado vacío:", estadoVacio);
console.log("Estado con usuarios:", estadoConUsuarios.datos?.length, "usuarios");

// ------------------------------------------------------------
// 10. UTILIDADES GENÉRICAS PROPIAS (adelanto de Utility Types)
// ------------------------------------------------------------

// Hace todas las propiedades opcionales
type HacerOpcional<T> = { [K in keyof T]?: T[K] };

// Hace todas las propiedades readonly
type HacerReadonly<T> = { readonly [K in keyof T]: T[K] };

// Extrae solo algunas propiedades
type Extraer<T, K extends keyof T> = { [P in K]: T[P] };

type UsuarioParcial = HacerOpcional<Usuario>;
const parcial: UsuarioParcial = { nombre: "Solo nombre" }; // ✅ sin id ni email

type UsuarioReadonly = HacerReadonly<Usuario>;
const soloLectura: UsuarioReadonly = { id: 1, nombre: "Ana", email: "ana@test.com" };
// soloLectura.nombre = "Cambio"; // ❌ readonly

console.log("Parcial:", parcial);
console.log("Solo lectura:", soloLectura);
