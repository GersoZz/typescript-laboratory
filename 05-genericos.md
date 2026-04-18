# 05 - Genéricos (Generics)

## ¿Qué problema resuelven?

Sin genéricos, para una función que devuelve el primer elemento de un array tendrías que crear una versión por tipo:

```ts
function primerString(arr: string[]): string { return arr[0]; }
function primerNumber(arr: number[]): number { return arr[0]; }
// etc...
```

Con genéricos escribís **una sola función** que funciona para cualquier tipo:

```ts
function primero<T>(arr: T[]): T | undefined {
  return arr[0];
}
```

---

## Sintaxis de genéricos

```ts
// Función genérica
function identidad<T>(valor: T): T {
  return valor;
}

// TypeScript infiere T automáticamente:
identidad("hola");    // T = string
identidad(42);        // T = number
identidad(true);      // T = boolean

// O podés especificarlo explícitamente:
identidad<string>("hola");
```

---

## Interfaces y types genéricos

```ts
// Interface genérica
interface Caja<T> {
  contenido: T;
  etiqueta: string;
}

const cajaDeNumero: Caja<number> = { contenido: 42, etiqueta: "número" };
const cajaDeTexto: Caja<string> = { contenido: "Hola", etiqueta: "texto" };

// Type alias genérico
type Par<A, B> = {
  primero: A;
  segundo: B;
};

const par: Par<string, number> = { primero: "edad", segundo: 30 };
```

---

## Respuestas de API — el genérico más usado en React

```ts
interface RespuestaApi<T> {
  datos: T;
  exito: boolean;
  mensaje: string;
  timestamp: number;
}

interface Usuario { id: number; nombre: string; }
interface Producto { id: number; nombre: string; precio: number; }

// La misma estructura, diferente payload
type RespuestaUsuario = RespuestaApi<Usuario[]>;
type RespuestaProducto = RespuestaApi<Producto>;
```

---

## Restricciones de genéricos con `extends`

Podés limitar qué tipos acepta el genérico:

```ts
// Solo acepta tipos que tengan propiedad 'id'
function obtenerPorId<T extends { id: number }>(
  lista: T[],
  id: number
): T | undefined {
  return lista.find((item) => item.id === id);
}

// Solo acepta objetos (no primitivos)
function clonar<T extends object>(obj: T): T {
  return { ...obj };
}
```

---

## Múltiples parámetros de tipo

```ts
function crearPar<K, V>(clave: K, valor: V): [K, V] {
  return [clave, valor];
}

crearPar("nombre", "Ana");   // [string, string]
crearPar(1, true);           // [number, boolean]
crearPar("id", 42);          // [string, number]
```

---

## Genéricos en React — los más comunes

```tsx
// useState es genérico internamente:
// const [state, setState] = useState<T>(initialValue)

const [usuarios, setUsuarios] = useState<Usuario[]>([]);
const [cargando, setCargando] = useState<boolean>(false);
const [error, setError] = useState<string | null>(null);

// useRef también:
const inputRef = useRef<HTMLInputElement>(null);

// Props genéricas:
interface ListaProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  keyExtractor: (item: T) => string;
}
```

---

## Función `fetch` tipada con genéricos

```ts
async function fetchData<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
  return response.json() as Promise<T>;
}

// Uso con tipo explícito
const usuarios = await fetchData<Usuario[]>("/api/usuarios");
const producto = await fetchData<Producto>("/api/productos/1");
```

---

## Resumen

- `<T>` es el parámetro de tipo, como un parámetro de función pero para tipos
- Permiten escribir código reutilizable y seguro sin sacrificar tipos
- `<T extends AlgunTipo>` restringe los tipos aceptados
- En React se usan en `useState`, `useRef`, `fetch`, componentes de lista, etc.
