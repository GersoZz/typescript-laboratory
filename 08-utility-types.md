# 08 - Tipos Utilitarios (Utility Types)

## ¿Qué son?

TypeScript incluye una biblioteca de **tipos genéricos predefinidos** que transforman tipos existentes. Son atajos para patrones muy comunes, y en React los vas a usar constantemente.

---

## `Partial<T>` — todas las propiedades opcionales

Útil para **actualizaciones parciales** de objetos:

```ts
interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol: string;
}

// Solo envío las propiedades que quiero actualizar
function actualizarUsuario(id: number, cambios: Partial<Usuario>): void {
  // cambios puede tener ninguna, algunas o todas las propiedades
}

actualizarUsuario(1, { nombre: "Nuevo Nombre" });      // ✅
actualizarUsuario(1, { email: "nuevo@email.com" });    // ✅
actualizarUsuario(1, { nombre: "X", rol: "admin" });   // ✅
```

---

## `Required<T>` — todas las propiedades obligatorias

Lo opuesto de `Partial`. También elimina el `?`:

```ts
interface ConfigOpcional {
  tema?: string;
  idioma?: string;
  timeout?: number;
}

// ConfigCompleta tiene todas las propiedades como obligatorias
type ConfigCompleta = Required<ConfigOpcional>;
```

---

## `Readonly<T>` — no se puede modificar nada

Perfecto para estados en React que no deben ser mutados directamente:

```ts
type EstadoReadonly = Readonly<{
  usuarios: Usuario[];
  total: number;
}>;

const estado: EstadoReadonly = { usuarios: [], total: 0 };
// estado.total = 5; // ❌ Error
```

---

## `Pick<T, K>` — seleccionar propiedades

Crea un nuevo tipo con **solo algunas** propiedades del original:

```ts
interface PerfilCompleto {
  id: number;
  nombre: string;
  email: string;
  password: string;   // ← no queremos exponer esto
  direccion: string;
  telefono: string;
}

// Solo lo que necesitamos mostrar en la UI
type PerfilPublico = Pick<PerfilCompleto, "id" | "nombre" | "email">;
```

---

## `Omit<T, K>` — excluir propiedades

Lo opuesto de `Pick`. Crea un tipo **sin** ciertas propiedades:

```ts
// Tipo para crear (sin id, que lo genera el servidor)
type CrearUsuario = Omit<PerfilCompleto, "id">;

// Tipo para actualizar (sin id ni password)
type ActualizarUsuario = Omit<PerfilCompleto, "id" | "password">;
```

---

## `Record<K, V>` — objeto con claves y valores tipados

Crea un tipo de objeto donde todas las claves son de tipo K y los valores de tipo V:

```ts
type RolPermisos = Record<"admin" | "editor" | "lector", string[]>;

const permisos: RolPermisos = {
  admin: ["crear", "editar", "eliminar", "ver"],
  editor: ["crear", "editar", "ver"],
  lector: ["ver"],
};
```

---

## `Exclude<T, U>` y `Extract<T, U>`

Operan sobre **uniones** de tipos:

```ts
type Evento = "click" | "focus" | "blur" | "change" | "submit";

// Excluir ciertos valores de la unión
type EventosSinFoco = Exclude<Evento, "focus" | "blur">;
// = "click" | "change" | "submit"

// Quedarse solo con ciertos valores
type EventosDeFormulario = Extract<Evento, "change" | "submit" | "focus">;
// = "change" | "submit" | "focus"
```

---

## `NonNullable<T>` — elimina null y undefined

```ts
type ConNullable = string | number | null | undefined;
type SinNullable = NonNullable<ConNullable>;
// = string | number
```

---

## `ReturnType<T>` — tipo del valor de retorno de una función

```ts
function obtenerUsuario() {
  return { id: 1, nombre: "Ana", activo: true };
}

type TipoRetorno = ReturnType<typeof obtenerUsuario>;
// = { id: number; nombre: string; activo: boolean }
```

---

## `Parameters<T>` — tipos de los parámetros de una función

```ts
function crearProducto(nombre: string, precio: number, stock: number) {
  return { nombre, precio, stock };
}

type ParamsProducto = Parameters<typeof crearProducto>;
// = [nombre: string, precio: number, stock: number]
```

---

## Combinando utility types — muy común en React

```ts
interface Articulo {
  id: string;
  titulo: string;
  contenido: string;
  autor: string;
  fechaPublicacion: Date;
  publicado: boolean;
}

// Para creación: sin id (lo genera el servidor) y sin fechaPublicacion
type CrearArticulo = Omit<Articulo, "id" | "fechaPublicacion">;

// Para edición: todo opcional excepto el id
type EditarArticulo = Pick<Articulo, "id"> & Partial<Omit<Articulo, "id">>;

// Para listado: solo datos de "cabecera"
type ResumenArticulo = Pick<Articulo, "id" | "titulo" | "autor" | "publicado">;
```

---

## Resumen de los más usados en React

| Utility Type     | Para qué sirve en React                                     |
|------------------|-------------------------------------------------------------|
| `Partial<T>`     | Props con valores por defecto, formularios de edición       |
| `Readonly<T>`    | Estado de Redux/Context, props que no deben mutar           |
| `Pick<T, K>`     | Props de un subconjunto de una entidad                      |
| `Omit<T, K>`     | Excluir campos del backend (id, timestamps) en formularios  |
| `Record<K, V>`   | Mapas de configuración, índices de caché                    |
| `NonNullable<T>` | Después de verificar que algo no es null                    |
| `ReturnType<T>`  | Inferir el tipo de retorno de una función o hook            |
