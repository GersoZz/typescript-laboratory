// =============================================================
// 04 - UNIÓN E INTERSECCIÓN DE TIPOS
// =============================================================
export {};

// ------------------------------------------------------------
// 1. UNIÓN DE TIPOS con |
// "puede ser uno u otro"
// ------------------------------------------------------------
type ID = string | number;

let userId: ID = 1;
userId = "abc-123"; // también válido

function mostrarId(id: ID): void {
  if (typeof id === "number") {
    console.log("ID numérico:", id.toFixed(0));
  } else {
    console.log("ID textual:", id.toUpperCase());
  }
}

mostrarId(42);
mostrarId("usr-007");

// ------------------------------------------------------------
// 2. UNIÓN CON LITERALES DE STRING
// Muy usados para props de componentes React
// ------------------------------------------------------------
type Variante = "primary" | "secondary" | "danger" | "ghost";
type Tamaño = "xs" | "sm" | "md" | "lg" | "xl";
type Alineacion = "left" | "center" | "right" | "justify";

interface BotonProps {
  texto: string;
  variante: Variante;
  tamaño?: Tamaño;
  disabled?: boolean;
}

function renderBoton(props: BotonProps): string {
  const { texto, variante, tamaño = "md", disabled = false } = props;
  return `<button class="btn btn-${variante} btn-${tamaño}" ${disabled ? "disabled" : ""}>${texto}</button>`;
}

console.log(renderBoton({ texto: "Guardar", variante: "primary" }));
console.log(renderBoton({ texto: "Eliminar", variante: "danger", tamaño: "sm" }));
// renderBoton({ texto: "X", variante: "invalid" }); // ❌ Error

// ------------------------------------------------------------
// 3. ESTADO ASÍNCRONO CON UNIÓN LITERAL
// Patrón muy común en React con fetch/API calls
// ------------------------------------------------------------
type EstadoCarga = "idle" | "cargando" | "exito" | "error";

interface EstadoFetch<T> {
  estado: EstadoCarga;
  datos: T | null;
  error: string | null;
}

// Estado inicial
let estadoUsuarios: EstadoFetch<string[]> = {
  estado: "idle",
  datos: null,
  error: null,
};

// Transiciones de estado
function iniciarCarga<T>(estado: EstadoFetch<T>): EstadoFetch<T> {
  return { ...estado, estado: "cargando", error: null };
}

function cargaExitosa<T>(estado: EstadoFetch<T>, datos: T): EstadoFetch<T> {
  return { ...estado, estado: "exito", datos };
}

function cargaFallida<T>(estado: EstadoFetch<T>, error: string): EstadoFetch<T> {
  return { ...estado, estado: "error", datos: null, error };
}

estadoUsuarios = iniciarCarga(estadoUsuarios);
console.log("Cargando:", estadoUsuarios.estado);

estadoUsuarios = cargaExitosa(estadoUsuarios, ["Ana", "Bob", "Carol"]);
console.log("Datos:", estadoUsuarios.datos);

// ------------------------------------------------------------
// 4. DISCRIMINATED UNIONS — el patrón más poderoso
// Campo discriminante permite a TS inferir el tipo exacto
// ------------------------------------------------------------

// Formas geométricas
type Circulo = {
  tipo: "circulo";
  radio: number;
};

type Rectangulo = {
  tipo: "rectangulo";
  ancho: number;
  alto: number;
};

type Triangulo = {
  tipo: "triangulo";
  base: number;
  altura: number;
};

type Forma = Circulo | Rectangulo | Triangulo;

function calcularArea(forma: Forma): number {
  switch (forma.tipo) {
    case "circulo":
      // TypeScript sabe que forma es Circulo acá
      return Math.PI * forma.radio ** 2;
    case "rectangulo":
      // TypeScript sabe que forma es Rectangulo acá
      return forma.ancho * forma.alto;
    case "triangulo":
      // TypeScript sabe que forma es Triangulo acá
      return (forma.base * forma.altura) / 2;
  }
}

function describir(forma: Forma): string {
  switch (forma.tipo) {
    case "circulo":
      return `Círculo (radio: ${forma.radio})`;
    case "rectangulo":
      return `Rectángulo (${forma.ancho} × ${forma.alto})`;
    case "triangulo":
      return `Triángulo (base: ${forma.base}, altura: ${forma.altura})`;
  }
}

const circulo: Circulo = { tipo: "circulo", radio: 5 };
const rect: Rectangulo = { tipo: "rectangulo", ancho: 4, alto: 6 };
const tri: Triangulo = { tipo: "triangulo", base: 8, altura: 3 };

console.log(describir(circulo), "-> Área:", calcularArea(circulo).toFixed(2));
console.log(describir(rect), "-> Área:", calcularArea(rect));
console.log(describir(tri), "-> Área:", calcularArea(tri));

// ------------------------------------------------------------
// 5. PATTERN: REDUCER CON DISCRIMINATED UNIONS
// Igual a useReducer en React
// ------------------------------------------------------------
interface EstadoCarrito {
  items: { id: number; nombre: string; cantidad: number; precio: number }[];
  total: number;
}

type AccionCarrito =
  | { tipo: "AGREGAR"; payload: { id: number; nombre: string; precio: number } }
  | { tipo: "QUITAR"; payload: { id: number } }
  | { tipo: "CAMBIAR_CANTIDAD"; payload: { id: number; cantidad: number } }
  | { tipo: "VACIAR" };

function reducerCarrito(estado: EstadoCarrito, accion: AccionCarrito): EstadoCarrito {
  switch (accion.tipo) {
    case "AGREGAR": {
      const existe = estado.items.find((i) => i.id === accion.payload.id);
      const items = existe
        ? estado.items.map((i) =>
            i.id === accion.payload.id ? { ...i, cantidad: i.cantidad + 1 } : i
          )
        : [...estado.items, { ...accion.payload, cantidad: 1 }];
      return {
        items,
        total: items.reduce((sum, i) => sum + i.precio * i.cantidad, 0),
      };
    }
    case "QUITAR": {
      const items = estado.items.filter((i) => i.id !== accion.payload.id);
      return { items, total: items.reduce((sum, i) => sum + i.precio * i.cantidad, 0) };
    }
    case "CAMBIAR_CANTIDAD": {
      const items = estado.items.map((i) =>
        i.id === accion.payload.id ? { ...i, cantidad: accion.payload.cantidad } : i
      );
      return { items, total: items.reduce((sum, i) => sum + i.precio * i.cantidad, 0) };
    }
    case "VACIAR":
      return { items: [], total: 0 };
  }
}

let carrito: EstadoCarrito = { items: [], total: 0 };
carrito = reducerCarrito(carrito, { tipo: "AGREGAR", payload: { id: 1, nombre: "Libro TS", precio: 2500 } });
carrito = reducerCarrito(carrito, { tipo: "AGREGAR", payload: { id: 2, nombre: "Curso React", precio: 5000 } });
carrito = reducerCarrito(carrito, { tipo: "AGREGAR", payload: { id: 1, nombre: "Libro TS", precio: 2500 } });
console.log("Carrito:", carrito.items);
console.log("Total:", carrito.total);

// ------------------------------------------------------------
// 6. INTERSECCIÓN DE TIPOS con &
// "debe tener TODO de A y TODO de B"
// ------------------------------------------------------------
type ConId = { id: string };
type ConTimestamps = { creadoEn: Date; actualizadoEn: Date };
type ConAuditoria = { creadoPor: string; modificadoPor: string };

// Entidad persistida = tipo base + id + timestamps + auditoría
type Persistido<T> = T & ConId & ConTimestamps & ConAuditoria;

interface PerfilUsuario {
  nombre: string;
  email: string;
  avatar?: string;
}

type PerfilCompleto = Persistido<PerfilUsuario>;

const perfil: PerfilCompleto = {
  id: "usr-001",
  nombre: "Ana García",
  email: "ana@email.com",
  creadoEn: new Date("2025-01-10"),
  actualizadoEn: new Date("2026-02-20"),
  creadoPor: "admin",
  modificadoPor: "ana",
};

console.log("Perfil completo:", perfil);

// ------------------------------------------------------------
// 7. NULLABLE TYPES — unión con null/undefined
// ------------------------------------------------------------
type Nullable<T> = T | null;
type Opcional<T> = T | undefined;
type NullableOpcional<T> = T | null | undefined;

interface ComponenteProps {
  titulo: string;
  subtitulo: Nullable<string>;
  imagen: Nullable<string>;
  onClose: Opcional<() => void>;
}

const propsModal: ComponenteProps = {
  titulo: "Confirmación",
  subtitulo: null,        // no hay subtítulo
  imagen: null,           // no hay imagen
  onClose: undefined,     // no hay handler de cierre
};

// Uso seguro con operadores de null-safety
const textoSubtitulo = propsModal.subtitulo ?? "Sin subtítulo";
const srcImagen = propsModal.imagen ?? "/default-image.png";

console.log("Subtítulo:", textoSubtitulo);
console.log("Imagen:", srcImagen);
propsModal.onClose?.(); // No hace nada si es undefined (optional chaining)
