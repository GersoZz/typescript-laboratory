// =============================================================
// 07 - ENUMS EN TYPESCRIPT
// =============================================================
export {};

// ------------------------------------------------------------
// 1. ENUM NUMÉRICO (por defecto comienza en 0)
// ------------------------------------------------------------
enum Direccion {
  Norte,   // 0
  Sur,     // 1
  Este,    // 2
  Oeste,   // 3
}

let miDireccion: Direccion = Direccion.Norte;
console.log("Dirección:", miDireccion);         // 0
console.log("Nombre:", Direccion[miDireccion]); // "Norte" (acceso inverso)
console.log("Este:", Direccion.Este);           // 2

// ------------------------------------------------------------
// 2. ENUM NUMÉRICO CON VALORES PERSONALIZADOS
// ------------------------------------------------------------
enum PrioridadTarea {
  Baja = 1,
  Media = 5,
  Alta = 10,
  Critica = 100,
}

function ordenarPorPrioridad(
  tareas: { nombre: string; prioridad: PrioridadTarea }[]
) {
  return [...tareas].sort((a, b) => b.prioridad - a.prioridad);
}

const tareas = [
  { nombre: "Revisar emails", prioridad: PrioridadTarea.Baja },
  { nombre: "Fix bug producción", prioridad: PrioridadTarea.Critica },
  { nombre: "Code review", prioridad: PrioridadTarea.Media },
  { nombre: "Deploy staging", prioridad: PrioridadTarea.Alta },
];

console.log("Tareas ordenadas:", ordenarPorPrioridad(tareas).map((t) => t.nombre));

// ------------------------------------------------------------
// 3. ENUM DE STRING — el más recomendado para legibilidad
// ------------------------------------------------------------
enum EstadoPedido {
  Pendiente = "PENDIENTE",
  Confirmado = "CONFIRMADO",
  EnPreparacion = "EN_PREPARACION",
  Enviado = "ENVIADO",
  Entregado = "ENTREGADO",
  Cancelado = "CANCELADO",
}

interface Pedido {
  id: string;
  cliente: string;
  total: number;
  estado: EstadoPedido;
}

function describir(pedido: Pedido): string {
  const mensajes: Record<EstadoPedido, string> = {
    [EstadoPedido.Pendiente]:      "Tu pedido está esperando confirmación.",
    [EstadoPedido.Confirmado]:     "Tu pedido fue confirmado.",
    [EstadoPedido.EnPreparacion]:  "Estamos preparando tu pedido.",
    [EstadoPedido.Enviado]:        "Tu pedido ya fue enviado.",
    [EstadoPedido.Entregado]:      "¡Tu pedido fue entregado! Gracias.",
    [EstadoPedido.Cancelado]:      "Tu pedido fue cancelado.",
  };
  return `[${pedido.id}] ${mensajes[pedido.estado]}`;
}

const pedido1: Pedido = {
  id: "ORD-001",
  cliente: "Ana García",
  total: 15500,
  estado: EstadoPedido.EnPreparacion,
};

console.log(describir(pedido1));

// Cambiar estado
pedido1.estado = EstadoPedido.Enviado;
console.log(describir(pedido1));

// ------------------------------------------------------------
// 4. ENUM EN SWITCH — TypeScript verifica exhaustividad
// ------------------------------------------------------------
enum TipoNotificacion {
  Info = "INFO",
  Exito = "EXITO",
  Advertencia = "ADVERTENCIA",
  Error = "ERROR",
}

function mostrarNotificacion(tipo: TipoNotificacion, mensaje: string): void {
  switch (tipo) {
    case TipoNotificacion.Info:
      console.log(`ℹ️  INFO: ${mensaje}`);
      break;
    case TipoNotificacion.Exito:
      console.log(`✅ ÉXITO: ${mensaje}`);
      break;
    case TipoNotificacion.Advertencia:
      console.log(`⚠️  ADVERTENCIA: ${mensaje}`);
      break;
    case TipoNotificacion.Error:
      console.log(`❌ ERROR: ${mensaje}`);
      break;
    default:
      // Si aggrego un nuevo valor al enum y olvido el case,
      // este never me avisa en compilación:
      const _exhaustivo: never = tipo;
      throw new Error(`Tipo no manejado: ${_exhaustivo}`);
  }
}

mostrarNotificacion(TipoNotificacion.Exito, "Datos guardados correctamente");
mostrarNotificacion(TipoNotificacion.Error, "No se pudo conectar al servidor");

// ------------------------------------------------------------
// 5. CONST ENUM — más eficiente (inline en tiempo de compilación)
// ------------------------------------------------------------
const enum RolUsuario {
  Administrador = "ADMIN",
  Editor = "EDITOR",
  Lector = "LECTOR",
  Moderador = "MODERADOR",
}

function verificarPermiso(rol: RolUsuario, accion: string): boolean {
  const permisosAdmin = ["crear", "editar", "eliminar", "ver"];
  const permisosEditor = ["crear", "editar", "ver"];
  const permisosLector = ["ver"];
  const permisosMod = ["editar", "eliminar", "ver"];

  const permisosPorRol: Record<RolUsuario, string[]> = {
    [RolUsuario.Administrador]: permisosAdmin,
    [RolUsuario.Editor]: permisosEditor,
    [RolUsuario.Lector]: permisosLector,
    [RolUsuario.Moderador]: permisosMod,
  };

  return permisosPorRol[rol].includes(accion);
}

console.log("Admin puede eliminar:", verificarPermiso(RolUsuario.Administrador, "eliminar")); // true
console.log("Lector puede editar:", verificarPermiso(RolUsuario.Lector, "editar")); // false

// ------------------------------------------------------------
// 6. ITERAR SOBRE LOS VALORES DE UN ENUM (numérico)
// Los enum de string no se pueden iterar directamente de esta forma
// ------------------------------------------------------------
enum DiaSemana {
  Lunes = 1,
  Martes,
  Miercoles,
  Jueves,
  Viernes,
  Sabado,
  Domingo,
}

// Iterar solo las claves que son nombres (no números)
const diasHabiles = Object.keys(DiaSemana)
  .filter((k) => isNaN(Number(k)))
  .slice(0, 5); // Lunes a Viernes

console.log("Días hábiles:", diasHabiles);

// ------------------------------------------------------------
// 7. ALTERNATIVA MODERNA: as const
// Más idiomático en TypeScript moderno
// ------------------------------------------------------------
const HttpStatus = {
  Ok: 200,
  Created: 201,
  NoContent: 204,
  BadRequest: 400,
  Unauthorized: 401,
  Forbidden: 403,
  NotFound: 404,
  InternalError: 500,
} as const;

// Extraer el tipo de los valores
type HttpStatusCode = typeof HttpStatus[keyof typeof HttpStatus];
// = 200 | 201 | 204 | 400 | 401 | 403 | 404 | 500

function manejarError(codigo: HttpStatusCode): string {
  if (codigo >= 500) return "Error del servidor";
  if (codigo >= 400) return "Error del cliente";
  return "Éxito";
}

console.log(manejarError(HttpStatus.NotFound));  // "Error del cliente"
console.log(manejarError(HttpStatus.InternalError)); // "Error del servidor"
console.log(manejarError(HttpStatus.Ok));        // "Éxito"

// ------------------------------------------------------------
// 8. COMPARANDO: ENUM vs UNION TYPE vs AS CONST
// ------------------------------------------------------------

// ---- Opción A: Enum ----
enum ColorEnum {
  Rojo = "rojo",
  Verde = "verde",
  Azul = "azul",
}
let c1: ColorEnum = ColorEnum.Rojo;

// ---- Opción B: Union type (más simple, más común en React) ----
type ColorUnion = "rojo" | "verde" | "azul";
let c2: ColorUnion = "rojo";

// ---- Opción C: as const ----
const Color = { Rojo: "rojo", Verde: "verde", Azul: "azul" } as const;
type ColorConst = typeof Color[keyof typeof Color];
let c3: ColorConst = Color.Rojo;

console.log(c1, c2, c3); // "rojo", "rojo", "rojo"

// Para React, la opción B (union type) es la más común y directa.
// Para proyectos más grandes con muchos valores, prefieren enum o as const.
