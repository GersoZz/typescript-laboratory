// =============================================================
// 02 - INTERFACES Y TYPE ALIASES EN TYPESCRIPT
// =============================================================
export {};
// ------------------------------------------------------------
// 1. TYPE ALIAS — poner nombre a cualquier tipo
// ------------------------------------------------------------
type Nombre = string;
type Edad = number;
type EsAdmin = boolean;

const miNombre: Nombre = "Lucía";
const miEdad: Edad = 28;
const admin: EsAdmin = true;

// Type alias para objetos
type Punto = {
  x: number;
  y: number;
};

const origen: Punto = { x: 0, y: 0 };
const destino: Punto = { x: 10, y: -5 };

console.log("Origen:", origen);
console.log("Destino:", destino);

// ------------------------------------------------------------
// 2. INTERFACE — contrato para la forma de un objeto
// ------------------------------------------------------------
interface Usuario {
  id: number;
  nombre: string;
  email: string;
  edad: number;
}

const usuario1: Usuario = {
  id: 1,
  nombre: "Ana García",
  email: "ana@email.com",
  edad: 30,
};

// Si le falta una propiedad o tiene una de más → error de compilación
// const usuarioMal: Usuario = { id: 2, nombre: "Bob" }; // ❌ faltan email y edad

console.log("Usuario:", usuario1);

// ------------------------------------------------------------
// 3. PROPIEDADES OPCIONALES con ?
// ------------------------------------------------------------
interface Producto {
  id: number;
  nombre: string;
  precio: number;
  descripcion?: string;  // opcional
  imagen?: string;       // opcional
}

const teclado: Producto = {
  id: 101,
  nombre: "Teclado Mecánico",
  precio: 25000,
  // descripcion e imagen no son obligatorias
};

const monitor: Producto = {
  id: 102,
  nombre: "Monitor 24\"",
  precio: 85000,
  descripcion: "Panel IPS, 144Hz",
  imagen: "monitor.png",
};

console.log(teclado);
console.log(monitor);

// Verificar si la propiedad opcional existe antes de usarla
if (teclado.descripcion) {
  console.log("Descripción:", teclado.descripcion.toUpperCase());
} else {
  console.log("Sin descripción");
}

// ------------------------------------------------------------
// 4. PROPIEDADES READONLY
// ------------------------------------------------------------
interface ConfigApp {
  readonly apiUrl: string;
  readonly appVersion: string;
  tiempoDeEspera: number; // esta sí se puede modificar
}

const config: ConfigApp = {
  apiUrl: "https://api.miapp.com",
  appVersion: "2.1.0",
  tiempoDeEspera: 5000,
};

// config.apiUrl = "otro";      // ❌ Error: Cannot assign to 'apiUrl' because it is a read-only property
config.tiempoDeEspera = 10000;  // ✅ Esta sí se puede cambiar
console.log("Config:", config);

// ------------------------------------------------------------
// 5. EXTENSIÓN DE INTERFACES con extends
// ------------------------------------------------------------
interface Persona {
  nombre: string;
  edad: number;
}

interface Empleado extends Persona {
  empresa: string;
  salario: number;
  cargo?: string;
}

interface Gerente extends Empleado {
  departamento: string;
  equipoACargo: number;
}

const empleado: Empleado = {
  nombre: "Carlos López",
  edad: 35,
  empresa: "TechCorp SA",
  salario: 120000,
  cargo: "Desarrollador Senior",
};

const gerente: Gerente = {
  nombre: "María Rodríguez",
  edad: 45,
  empresa: "TechCorp SA",
  salario: 250000,
  departamento: "Ingeniería",
  equipoACargo: 12,
};

console.log("Empleado:", empleado);
console.log("Gerente:", gerente);

// ------------------------------------------------------------
// 6. INTERSECCIÓN DE TIPOS con &
// Combina múltiples tipos en uno
// ------------------------------------------------------------

type ConFechas = {
  creadoEn: Date;
  actualizadoEn: Date;
};

type ConId = {
  id: string;
};

// Producto persistido = Producto + ID + fechas
type ProductoPersistido = Producto & ConId & ConFechas;

// const productoDB: ProductoPersistido = {
//   id: "abc-123",
//   nombre: "Auriculares",
//   precio: 18000,
//   creadoEn: new Date("2026-01-15"),
//   actualizadoEn: new Date("2026-02-20"),
// };

// console.log("Producto en DB:", productoDB);

// ------------------------------------------------------------
// 7. INTERFACES CON MÉTODOS
// ------------------------------------------------------------
interface Repositorio<T> {
  obtenerPorId(id: number): T | null;
  guardar(entidad: T): void;
  eliminar(id: number): boolean;
  listarTodos(): T[];
}

// Una implementación simple
const repoUsuarios: Repositorio<Usuario> = {
  private_data: [usuario1] as Usuario[], // truco para simular estado
  obtenerPorId(id: number): Usuario | null {
    return usuario1.id === id ? usuario1 : null;
  },
  guardar(u: Usuario): void {
    console.log("Guardando usuario:", u.nombre);
  },
  eliminar(id: number): boolean {
    console.log("Eliminando id:", id);
    return true;
  },
  listarTodos(): Usuario[] {
    return [usuario1];
  },
} as unknown as Repositorio<Usuario>; // simplificado para el ejemplo

// ------------------------------------------------------------
// 8. INDEX SIGNATURES — propiedades dinámicas
// ------------------------------------------------------------
interface Diccionario {
  [clave: string]: string;
}

const traducciones: Diccionario = {
  hola: "hello",
  adios: "goodbye",
  gato: "cat",
  perro: "dog",
};

const palabra = "gato";
console.log(`"${palabra}" en inglés es "${traducciones[palabra]}"`);

// Otro ejemplo: mapa de errores de validación (muy común en formularios React)
interface ErroresFormulario {
  [campo: string]: string | undefined;
}

const errores: ErroresFormulario = {
  nombre: "El nombre es requerido",
  email: "El email no es válido",
  // password no tiene error
};

console.log("Errores:", errores);

// ------------------------------------------------------------
// 9. SIMULANDO PROPS DE COMPONENTE REACT (sin JSX)
// ------------------------------------------------------------
interface BotonProps {
  texto: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "danger";
  size?: "sm" | "md" | "lg";
}

// Función que recibe props tipadas (simula un componente React)
function crearBoton(props: BotonProps): string {
  const { texto, disabled = false, variant = "primary", size = "md" } = props;
  return `<button class="${variant} ${size}" ${disabled ? "disabled" : ""}>${texto}</button>`;
}

const botonGuardar = crearBoton({
  texto: "Guardar",
  onClick: () => console.log("Guardando..."),
  variant: "primary",
});

const botonEliminar = crearBoton({
  texto: "Eliminar",
  onClick: () => console.log("Eliminando..."),
  variant: "danger",
  size: "sm",
});

console.log(botonGuardar);
console.log(botonEliminar);

// ------------------------------------------------------------
// 10. type vs interface — diferencias clave
// ------------------------------------------------------------

// ✅ type puede describir tipos union
type StringONumero = string | number;
let valor: StringONumero = "hola";
valor = 42;

// ✅ type puede describir tuplas
type Par = [string, number];
const dupla: Par = ["edad", 30];

// ✅ interface soporta declaration merging (reapertura)
interface Configuracion {
  idioma: string;
}
interface Configuracion {
  tema: string; // se fusiona con la anterior
}
// Ahora Configuracion tiene idioma Y tema
const conf: Configuracion = { idioma: "es", tema: "dark" };
console.log("Configuración:", conf);
