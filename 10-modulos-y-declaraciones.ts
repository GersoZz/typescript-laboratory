// =============================================================
// 10 - MÓDULOS Y DECLARACIÓN DE TIPOS EN TYPESCRIPT
// =============================================================
// NOTA: Este archivo simula cómo se organizan los tipos en un
// proyecto real de React. Los imports/exports se usan entre
// archivos reales del proyecto.
// =============================================================

// ------------------------------------------------------------
// SECCIÓN A: SIMULACIÓN DE MÓDULO DE MODELOS (models.ts)
// En un proyecto real esto estaría en src/types/models.ts
// ------------------------------------------------------------

// Tipos del dominio
export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol: RolUsuario;
  activo: boolean;
  creadoEn: Date;
}

export interface Producto {
  id: string;
  nombre: string;
  precio: number;
  stock: number;
  categoria: Categoria;
  imagen?: string;
}

export interface Pedido {
  id: string;
  cliente: Pick<Usuario, "id" | "nombre" | "email">;
  items: LineaPedido[];
  total: number;
  estado: EstadoPedido;
  creadoEn: Date;
}

export interface LineaPedido {
  producto: Pick<Producto, "id" | "nombre" | "precio">;
  cantidad: number;
  subtotal: number;
}

// Enums y tipos de dominio
export type RolUsuario = "admin" | "editor" | "lector";
export type EstadoPedido = "pendiente" | "procesando" | "enviado" | "entregado" | "cancelado";
export type Categoria = "electronica" | "ropa" | "hogar" | "deportes" | "libros";

// Tipo ID genérico
export type ID = string | number;

// ------------------------------------------------------------
// SECCIÓN B: SIMULACIÓN DE TIPOS DE API (api.types.ts)
// En un proyecto real esto estaría en src/types/api.types.ts
// ------------------------------------------------------------

export interface RespuestaApi<T> {
  datos: T;
  exito: boolean;
  mensaje: string;
}

export interface RespuestaPaginada<T> extends RespuestaApi<T[]> {
  total: number;
  pagina: number;
  porPagina: number;
  totalPaginas: number;
}

export interface ErrorApi {
  codigo: number;
  mensaje: string;
  detalles?: Record<string, string[]>;
}

// Resultado discrimando: éxito o error
export type ResultadoApi<T> =
  | { ok: true; respuesta: RespuestaApi<T> }
  | { ok: false; error: ErrorApi };

// Tipos de CRUD genérico
export type CrearDto<T> = Omit<T, "id" | "creadoEn">;
export type ActualizarDto<T> = Pick<T, "id"> & Partial<Omit<T, "id" | "creadoEn">>;
export type ListarParams = {
  pagina?: number;
  porPagina?: number;
  ordenPor?: string;
  orden?: "asc" | "desc";
  busqueda?: string;
};

// ------------------------------------------------------------
// SECCIÓN C: SIMULACIÓN DE TIPOS DE COMPONENTES (component.types.ts)
// En un proyecto real esto estaría junto al componente o en types/
// ------------------------------------------------------------

// Props base que todos los componentes deberían soportar
export interface PropsBase {
  className?: string;
  style?: Record<string, string | number>;
  testId?: string;
}

// Props para componentes con children
export interface PropsConChildren extends PropsBase {
  children: unknown; // En React sería React.ReactNode
}

// Variantes de UI comunes
export type Variante = "primary" | "secondary" | "danger" | "warning" | "success" | "ghost";
export type Tamaño = "xs" | "sm" | "md" | "lg" | "xl";
export type Alineacion = "left" | "center" | "right";

// Ejemplo de props tipadas de componente Boton
export interface BotonProps extends PropsBase {
  texto: string;
  variante?: Variante;
  tamaño?: Tamaño;
  disabled?: boolean;
  cargando?: boolean;
  onClick?: () => void;
  tipo?: "button" | "submit" | "reset";
}

// Props de un componente Modal
export interface ModalProps extends PropsConChildren {
  abierto: boolean;
  titulo: string;
  onCerrar: () => void;
  tamaño?: "sm" | "md" | "lg" | "fullscreen";
  cerrarAlClickFuera?: boolean;
}

// Props de un componente de campo de formulario
export interface CampoFormProps extends PropsBase {
  nombre: string;
  etiqueta: string;
  valor: string;
  onChange: (valor: string) => void;
  error?: string;
  requerido?: boolean;
  disabled?: boolean;
  placeholder?: string;
}

// ------------------------------------------------------------
// SECCIÓN D: TIPOS DE ESTADO DE LA APLICACIÓN
// En un proyecto real: store/types.ts o context/types.ts
// ------------------------------------------------------------

// Estado global de la app (para Context o Redux)
export interface EstadoGlobal {
  auth: EstadoAuth;
  ui: EstadoUI;
  notificaciones: Notificacion[];
}

export interface EstadoAuth {
  usuario: Usuario | null;
  token: string | null;
  estaAutenticado: boolean;
  cargando: boolean;
}

export interface EstadoUI {
  tema: "light" | "dark" | "system";
  sidebarAbierto: boolean;
  idioma: "es" | "en" | "pt";
}

export interface Notificacion {
  id: string;
  tipo: "info" | "exito" | "advertencia" | "error";
  mensaje: string;
  duracion?: number;
  creadaEn: Date;
}

// ------------------------------------------------------------
// SECCIÓN E: USO DE LOS TIPOS DEFINIDOS (main.ts equivalente)
// ------------------------------------------------------------

// Usar los tipos del dominio
const usuario: Usuario = {
  id: 1,
  nombre: "Ana García",
  email: "ana@empresa.com",
  rol: "admin",
  activo: true,
  creadoEn: new Date("2025-01-15"),
};

const producto: Producto = {
  id: "prod-001",
  nombre: "Laptop Pro",
  precio: 350000,
  stock: 15,
  categoria: "electronica",
};

// Usar los tipos de API
const respuesta: RespuestaApi<Usuario> = {
  datos: usuario,
  exito: true,
  mensaje: "OK",
};

const respuestaPaginada: RespuestaPaginada<Producto> = {
  datos: [producto],
  exito: true,
  mensaje: "OK",
  total: 1,
  pagina: 1,
  porPagina: 10,
  totalPaginas: 1,
};

// Usar los DTOs genéricos
type CrearUsuario = CrearDto<Usuario>;
type ActualizarUsuario = ActualizarDto<Usuario>;

const nuevoUsuario: CrearUsuario = {
  nombre: "Carlos López",
  email: "carlos@empresa.com",
  rol: "lector",
  activo: true,
};

const cambiosUsuario: ActualizarUsuario = {
  id: 1,
  nombre: "Ana García Rodríguez",
};

console.log("Usuario:", usuario.nombre);
console.log("Respuesta API:", respuesta.mensaje);
console.log("Paginado:", respuestaPaginada.total, "items");
console.log("Nuevo usuario:", nuevoUsuario);
console.log("Cambios:", cambiosUsuario);

// Usar el resultado discriminado
const resultado: ResultadoApi<Usuario[]> = {
  ok: true,
  respuesta: { datos: [usuario], exito: true, mensaje: "OK" },
};

if (resultado.ok) {
  console.log("Usuarios encontrados:", resultado.respuesta.datos.length);
} else {
  console.error("Error:", resultado.error.mensaje);
}

// ------------------------------------------------------------
// SECCIÓN F: NAMESPACE (agrupación de tipos relacionados)
// Alternativa a múltiples archivos para proyectos pequeños
// ------------------------------------------------------------
namespace FormularioRegistro {
  export interface Campos {
    nombre: string;
    email: string;
    password: string;
    confirmarPassword: string;
    aceptaTerminos: boolean;
  }

  export interface Errores {
    nombre?: string;
    email?: string;
    password?: string;
    confirmarPassword?: string;
    aceptaTerminos?: string;
  }

  export type Estado = "sin_enviar" | "validando" | "enviando" | "enviado" | "error";

  export function validar(campos: Campos): Errores {
    const errores: Errores = {};

    if (!campos.nombre.trim()) {
      errores.nombre = "El nombre es requerido";
    }
    if (!campos.email.includes("@")) {
      errores.email = "El email no es válido";
    }
    if (campos.password.length < 8) {
      errores.password = "La contraseña debe tener al menos 8 caracteres";
    }
    if (campos.password !== campos.confirmarPassword) {
      errores.confirmarPassword = "Las contraseñas no coinciden";
    }
    if (!campos.aceptaTerminos) {
      errores.aceptaTerminos = "Debés aceptar los términos";
    }

    return errores;
  }

  export function esCamposValidos(errores: Errores): boolean {
    return Object.keys(errores).length === 0;
  }
}

// Uso del namespace
const camposForm: FormularioRegistro.Campos = {
  nombre: "Ana",
  email: "ana@test.com",
  password: "password123",
  confirmarPassword: "password123",
  aceptaTerminos: true,
};

const erroresForm: FormularioRegistro.Errores = FormularioRegistro.validar(camposForm);

if (FormularioRegistro.esCamposValidos(erroresForm)) {
  console.log("✅ Formulario válido");
} else {
  console.log("❌ Errores:", erroresForm);
}

// Formulario con error
const camposConError: FormularioRegistro.Campos = {
  nombre: "",
  email: "email-incorrecto",
  password: "123",
  confirmarPassword: "456",
  aceptaTerminos: false,
};

const erroresConError = FormularioRegistro.validar(camposConError);
console.log("Errores encontrados:", erroresConError);

// ------------------------------------------------------------
// SECCIÓN G: TIPOS CONDICIONALES (avanzado)
// ------------------------------------------------------------

// Un tipo que depende de otro tipo
type EsString<T> = T extends string ? "sí es string" : "no es string";

type Resultado1 = EsString<string>;   // "sí es string"
type Resultado2 = EsString<number>;   // "no es string"
type Resultado3 = EsString<boolean>;  // "no es string"

// Extraer el tipo del elemento de un array
type ElementoDe<T> = T extends (infer E)[] ? E : never;

type TipoElemento1 = ElementoDe<string[]>;    // string
type TipoElemento2 = ElementoDe<Usuario[]>;   // Usuario
type TipoElemento3 = ElementoDe<number>;      // never

// Hacer tipos opcionales solo para ciertas propiedades
type HacerOpcionalesExcepto<T, K extends keyof T> =
  Omit<T, K> & Partial<Pick<T, K>>;

// Usuario donde solo nombre y email son siempre requeridos
type UsuarioConOpcionales = HacerOpcionalesExcepto<Usuario, "rol" | "activo" | "creadoEn">;

const usuarioMinimo: UsuarioConOpcionales = {
  id: 1,
  nombre: "Test",
  email: "test@test.com",
  // rol, activo, creadoEn son opcionales ahora
};

console.log("Usuario mínimo:", usuarioMinimo);
