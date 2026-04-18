# 07 - Enums

## ¿Qué es un enum?

Un **enum** (enumeración) es un conjunto de constantes con nombre. En lugar de usar strings "mágicos" o números sin significado, agrupás valores relacionados bajo un nombre descriptivo.

---

## Problema que resuelve

Sin enums:
```ts
const ESTADO_PEDIDO_PENDIENTE = "pendiente";
const ESTADO_PEDIDO_ENVIADO = "enviado";
const ESTADO_PEDIDO_ENTREGADO = "entregado";
// ...más constantes dispersas por el código
```

Con enums:
```ts
enum EstadoPedido {
  Pendiente = "pendiente",
  Enviado = "enviado",
  Entregado = "entregado",
}
```

---

## Enum numérico (por defecto)

```ts
enum Direccion {
  Norte,  // 0
  Sur,    // 1
  Este,   // 2
  Oeste,  // 3
}

let dir: Direccion = Direccion.Norte;
console.log(dir);             // 0
console.log(Direccion[0]);    // "Norte" (acceso inverso)
```

---

## Enum de string (el más recomendado)

Los string enums son más legibles y seguros de depurar:

```ts
enum EstadoOrden {
  Pendiente = "PENDIENTE",
  Procesando = "PROCESANDO",
  Completada = "COMPLETADA",
  Cancelada = "CANCELADA",
}

function procesarOrden(estado: EstadoOrden): void {
  switch (estado) {
    case EstadoOrden.Pendiente:
      console.log("Orden en espera de aprobación");
      break;
    case EstadoOrden.Completada:
      console.log("¡Orden finalizada!");
      break;
  }
}
```

---

## Enum `const`

Se reemplaza en tiempo de compilación (no genera código JS adicional). Es la opción más eficiente:

```ts
const enum RolUsuario {
  Admin = "ADMIN",
  Editor = "EDITOR",
  Lector = "LECTOR",
}

// En el JS compilado, RolUsuario.Admin se convierte directamente en "ADMIN"
const rol: RolUsuario = RolUsuario.Admin;
```

---

## Alternativa moderna: union types de strings

En React moderno es más común usar **union literals** en vez de enums:

```ts
// Con enum:
enum Variante { Primary = "primary", Secondary = "secondary", Danger = "danger" }

// Con union type (más ligero, más idiomático en TS moderno):
type Variante = "primary" | "secondary" | "danger";
```

**¿Cuándo preferir enums?**
- Cuando el conjunto de valores es grande y queda más organizado con un nombre
- Cuando necesitás iterar sobre los valores
- Cuando compartís tipos entre backend y frontend

**¿Cuándo preferir union types?**
- En componentes React con pocas variantes
- Cuando querés el código más simple y directo

---

## Enums como objetos `as const` (la mejor alternativa)

```ts
// Esto es lo que muchos proyectos modernos prefieren:
const HttpStatus = {
  Ok: 200,
  Created: 201,
  BadRequest: 400,
  Unauthorized: 401,
  NotFound: 404,
  InternalError: 500,
} as const;

type HttpStatusType = typeof HttpStatus[keyof typeof HttpStatus];
// = 200 | 201 | 400 | 401 | 404 | 500
```

---

## Uso en React

```tsx
enum TemaApp {
  Claro = "light",
  Oscuro = "dark",
  Sistema = "system",
}

interface ConfigTema {
  tema: TemaApp;
  color: string;
}

// En un selector de tema:
function SelectorTema({ onChange }: { onChange: (t: TemaApp) => void }) {
  return (
    <select onChange={(e) => onChange(e.target.value as TemaApp)}>
      <option value={TemaApp.Claro}>Claro</option>
      <option value={TemaApp.Oscuro}>Oscuro</option>
      <option value={TemaApp.Sistema}>Sistema</option>
    </select>
  );
}
```

---

## Resumen

| Tipo de enum         | Cuándo usarlo                                 |
|----------------------|-----------------------------------------------|
| Numérico             | Flags, bitmasks, comparaciones numéricas      |
| De string            | Estados, categorías, valores legibles         |
| `const enum`         | Performance, cuando no se necesita iteración  |
| Union type           | Props de componentes, casos simples           |
| `as const`           | Alternativa moderna y flexible a los enums    |
