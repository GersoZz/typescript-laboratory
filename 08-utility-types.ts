// =============================================================
// 08 - TIPOS UTILITARIOS (UTILITY TYPES) EN TYPESCRIPT
// =============================================================
export {};

// Tipo base que usaremos en los ejemplos
interface Usuario {
  id: number;
  nombre: string;
  email: string;
  password: string;
  rol: "admin" | "editor" | "lector";
  activo: boolean;
  creadoEn: Date;
}

// ------------------------------------------------------------
// 1. Partial<T> — todas las propiedades opcionales
// Ideal para actualizaciones parciales (PATCH) y formularios de edición
// ------------------------------------------------------------
type ActualizarUsuario = Partial<Usuario>;
// Es equivalente a: { id?: number; nombre?: string; email?: string; ... }

function patchUsuario(id: number, cambios: Partial<Usuario>): void {
  console.log(`Actualizando usuario ${id} con:`, cambios);
}

patchUsuario(1, { nombre: "Nuevo Nombre" });        // ✅ solo nombre
patchUsuario(1, { email: "nuevo@email.com" });      // ✅ solo email
patchUsuario(2, { rol: "admin", activo: false });   // ✅ varios campos
patchUsuario(3, {});                                 // ✅ ningún campo

// Función para mergear objetos con Partial
function mergear<T>(base: T, cambios: Partial<T>): T {
  return { ...base, ...cambios };
}

const usuarioOriginal: Usuario = {
  id: 1, nombre: "Ana", email: "ana@test.com",
  password: "hash123", rol: "lector", activo: true, creadoEn: new Date()
};

const usuarioActualizado = mergear(usuarioOriginal, { nombre: "Ana García", rol: "editor" });
console.log("Actualizado:", usuarioActualizado.nombre, usuarioActualizado.rol);

// ------------------------------------------------------------
// 2. Required<T> — todas las propiedades obligatorias
// Lo opuesto de Partial
// ------------------------------------------------------------
interface ConfigApp {
  apiUrl?: string;
  timeout?: number;
  maxRetries?: number;
  debug?: boolean;
}

// Para inicializar la config con todos los valores:
type ConfigCompleta = Required<ConfigApp>;

function inicializarConfig(config: ConfigCompleta): void {
  console.log("Config:", config);
}

inicializarConfig({
  apiUrl: "https://api.test.com",
  timeout: 5000,
  maxRetries: 3,
  debug: false,
});

// ------------------------------------------------------------
// 3. Readonly<T> — no se puede modificar nada
// Importante en el estado de React: ¡nunca mutés el estado directamente!
// ------------------------------------------------------------
type EstadoApp = Readonly<{
  usuarios: readonly Usuario[];
  total: number;
  cargando: boolean;
}>;

const estado: EstadoApp = {
  usuarios: [usuarioOriginal],
  total: 1,
  cargando: false,
};

// estado.total = 5;      // ❌ Error: Cannot assign to 'total' because it is a read-only property
// estado.usuarios = [];  // ❌ Error

// Para "actualizar" creamos un nuevo objeto (como en React):
const nuevoEstado: EstadoApp = { ...estado, total: 2, cargando: true };
console.log("Nuevo estado:", nuevoEstado.total);

// ------------------------------------------------------------
// 4. Pick<T, Keys> — seleccionar propiedades
// Útil para mostrar solo datos necesarios (sin info sensible)
// ------------------------------------------------------------
type PerfilPublico = Pick<Usuario, "id" | "nombre" | "email">;
type HeaderUsuario = Pick<Usuario, "id" | "nombre" | "rol">;
type DatosLoginForm = Pick<Usuario, "email" | "password">;

const perfilPublico: PerfilPublico = {
  id: 1,
  nombre: "Ana García",
  email: "ana@test.com",
  // password, rol, activo, creadoEn → no están disponibles aquí
};

const datosLogin: DatosLoginForm = {
  email: "ana@test.com",
  password: "mi-password",
};

console.log("Perfil público:", perfilPublico);

// ------------------------------------------------------------
// 5. Omit<T, Keys> — excluir propiedades
// El opuesto de Pick
// ------------------------------------------------------------
// Para crear un usuario (sin id ni creadoEn, los genera el servidor)
type CrearUsuario = Omit<Usuario, "id" | "creadoEn">;

// Para respuestas de API (sin password)
type UsuarioRespuesta = Omit<Usuario, "password">;

// Para formulario de registro
type FormularioRegistro = Omit<Usuario, "id" | "creadoEn" | "activo" | "rol">;

const nuevoUsuario: CrearUsuario = {
  nombre: "Carlos Pérez",
  email: "carlos@test.com",
  password: "hash-seguro",
  rol: "lector",
  activo: true,
};

const usuarioApi: UsuarioRespuesta = {
  id: 2, nombre: "Carlos", email: "carlos@test.com",
  rol: "lector", activo: true, creadoEn: new Date()
};

console.log("Nuevo usuario:", nuevoUsuario);
console.log("Usuario API (sin pwd):", usuarioApi);

// ------------------------------------------------------------
// 6. Record<Keys, Value> — mapa tipado de clave-valor
// ------------------------------------------------------------
type PermisosPorRol = Record<"admin" | "editor" | "lector", string[]>;

const permisos: PermisosPorRol = {
  admin:  ["crear", "editar", "eliminar", "ver", "exportar"],
  editor: ["crear", "editar", "ver"],
  lector: ["ver"],
};

function tienePermiso(rol: "admin" | "editor" | "lector", accion: string): boolean {
  return permisos[rol].includes(accion);
}

console.log("Admin puede eliminar:", tienePermiso("admin", "eliminar")); // true
console.log("Lector puede editar:", tienePermiso("lector", "editar"));   // false

// Record con tipo dinámico — en React: caché de datos
type CacheUsuarios = Record<string, Usuario>;

const cache: CacheUsuarios = {};
cache["usr-001"] = usuarioOriginal;
console.log("Cache:", Object.keys(cache).length, "usuarios");

// ------------------------------------------------------------
// 7. Exclude<T, U> y Extract<T, U> — filtrar uniones
// ------------------------------------------------------------
type EventoDOM = "click" | "focus" | "blur" | "change" | "submit" | "keydown";

// Excluir eventos de foco de la unión
type EventosSinFoco = Exclude<EventoDOM, "focus" | "blur">;
// = "click" | "change" | "submit" | "keydown"

// Solo quedarse con eventos de formulario
type EventosFormulario = Extract<EventoDOM, "change" | "submit" | "focus">;
// = "change" | "submit" | "focus"

const escucharEvento = (evento: EventosSinFoco, handler: () => void) => {
  console.log(`Escuchando: ${evento}`);
};

escucharEvento("click", () => console.log("click!"));
// escucharEvento("focus", () => {}); // ❌ "focus" no está en EventosSinFoco

// ------------------------------------------------------------
// 8. NonNullable<T> — elimina null y undefined
// ------------------------------------------------------------
type ConNulos = string | number | null | undefined | boolean;
type SinNulos = NonNullable<ConNulos>;
// = string | number | boolean

// Función que filtra nulos de un array
function filtrarNulos<T>(arr: (T | null | undefined)[]): T[] {
  return arr.filter((item): item is T => item != null);
}

const conNulos = ["Ana", null, "Bob", undefined, "Carol", null];
const sinNulos = filtrarNulos(conNulos);
console.log("Sin nulos:", sinNulos); // ["Ana", "Bob", "Carol"]

// ------------------------------------------------------------
// 9. ReturnType<T> — tipo del valor de retorno de una función
// Útil cuando no querés (o podés) importar el tipo pero sí inferirlo
// ------------------------------------------------------------
function crearContextoAuth() {
  return {
    usuario: null as Usuario | null,
    estaAutenticado: false,
    token: null as string | null,
    login: (email: string, pwd: string) => Promise.resolve(true),
    logout: () => {},
  };
}

type ContextoAuth = ReturnType<typeof crearContextoAuth>;
// TypeScript infiere exactamente la estructura del retorno

// Otro ejemplo: inferir el tipo de un hook personalizado
function useContador(inicial: number) {
  let count = inicial;
  return {
    valor: count,
    incrementar: () => count++,
    decrementar: () => count--,
    resetear: () => (count = inicial),
  };
}

type EstadoContador = ReturnType<typeof useContador>;
// = { valor: number; incrementar: () => number; decrementar: () => number; resetear: () => number }

// ------------------------------------------------------------
// 10. Parameters<T> — tipos de los parámetros
// ------------------------------------------------------------
function crearProducto(
  nombre: string,
  precio: number,
  stock: number,
  categoria: string,
) {
  return { nombre, precio, stock, categoria };
}

type ParamsProducto = Parameters<typeof crearProducto>;
// = [nombre: string, precio: number, stock: number, categoria: string]

// Útil para crear wrappers o decoradores
function conLog<T extends (...args: unknown[]) => unknown>(fn: T) {
  return (...args: Parameters<T>): ReturnType<T> => {
    console.log("Llamando con:", args);
    const resultado = fn(...args);
    console.log("Resultado:", resultado);
    return resultado as ReturnType<T>;
  };
}

const crearProductoConLog = conLog(crearProducto);
crearProductoConLog("Teclado", 15000, 50, "Periféricos");

// ------------------------------------------------------------
// 11. COMBINANDO UTILITY TYPES — patrón CRUD tipado
// El más común en proyectos React con APIs
// ------------------------------------------------------------
interface Articulo {
  id: string;
  titulo: string;
  contenido: string;
  autor: string;
  etiquetas: string[];
  publicado: boolean;
  fechaCreacion: Date;
  fechaActualizacion: Date;
}

// Para crear: sin campos generados por el servidor
type CrearArticulo = Omit<Articulo, "id" | "fechaCreacion" | "fechaActualizacion">;

// Para editar: id requerido, resto opcional
type EditarArticulo = Pick<Articulo, "id"> & Partial<Omit<Articulo, "id">>;

// Para listar: solo campos de resumen
type ResumenArticulo = Pick<Articulo, "id" | "titulo" | "autor" | "publicado" | "fechaCreacion">;

// Para mostrar en card: sin contenido completo
type CardArticulo = Omit<Articulo, "contenido">;

const datosCreacion: CrearArticulo = {
  titulo: "Introducción a TypeScript",
  contenido: "TypeScript es un superset de JavaScript...",
  autor: "Ana García",
  etiquetas: ["typescript", "javascript"],
  publicado: false,
};

const datosEdicion: EditarArticulo = {
  id: "art-001",
  titulo: "Guía Completa de TypeScript", // solo título actualizado
};

console.log("Crear:", datosCreacion);
console.log("Editar:", datosEdicion);
