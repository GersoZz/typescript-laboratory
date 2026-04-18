# 06 - Clases en TypeScript

## Diferencias clave con JavaScript

TypeScript agrega a las clases de JS:
- **Modificadores de acceso**: `public`, `private`, `protected`
- **Propiedades tipadas** con declaración explícita
- **`readonly`**: propiedades que no se pueden cambiar después de crearse
- **Interfaces e implementaciones** (`implements`)
- **Clases abstractas**

---

## Declaración básica

```ts
class Persona {
  nombre: string;
  edad: number;

  constructor(nombre: string, edad: number) {
    this.nombre = nombre;
    this.edad = edad;
  }

  saludar(): string {
    return `Hola, soy ${this.nombre}`;
  }
}

const p = new Persona("Ana", 30);
console.log(p.saludar()); // "Hola, soy Ana"
```

---

## Modificadores de acceso

| Modificador   | Accesible desde                          |
|---------------|------------------------------------------|
| `public`      | Desde cualquier lugar (por defecto)      |
| `private`     | Solo dentro de la misma clase            |
| `protected`   | Dentro de la clase y sus subclases       |
| `readonly`    | Solo lectura (se asigna en constructor)  |

```ts
class CuentaBancaria {
  public titular: string;
  private saldo: number;
  readonly numeroCuenta: string;

  constructor(titular: string, saldo: number, numero: string) {
    this.titular = titular;
    this.saldo = saldo;
    this.numeroCuenta = numero;
  }

  depositar(monto: number): void {
    this.saldo += monto;
  }

  // Getter: permite leer sin modificar
  get saldoActual(): number {
    return this.saldo;
  }
}

const cuenta = new CuentaBancaria("Ana", 1000, "CBU-001");
cuenta.depositar(500);
console.log(cuenta.saldoActual);      // 1500
// cuenta.saldo = 999999;            // ❌ private
// cuenta.numeroCuenta = "otro";     // ❌ readonly
```

---

## Shorthand constructor

TypeScript permite declarar y asignar propiedades directamente en los parámetros:

```ts
class Producto {
  constructor(
    public nombre: string,
    public precio: number,
    private stock: number,
    readonly id: string,
  ) {}
  // Las propiedades se crean y asignan automáticamente
}

const p = new Producto("Teclado", 15000, 50, "prod-001");
console.log(p.nombre); // "Teclado"
```

---

## Herencia con `extends`

```ts
class Animal {
  constructor(public nombre: string) {}

  mover(distancia: number = 0): void {
    console.log(`${this.nombre} se movió ${distancia}m`);
  }
}

class Perro extends Animal {
  constructor(nombre: string, public raza: string) {
    super(nombre); // ¡obligatorio llamar a super!
  }

  ladrar(): void {
    console.log("¡Guau!");
  }

  // Sobreescribir método del padre
  mover(distancia: number = 5): void {
    console.log("Corriendo...");
    super.mover(distancia);
  }
}
```

---

## Clases que implementan interfaces

```ts
interface Serializable {
  serializar(): string;
  deserializar(data: string): void;
}

interface Validable {
  esValido(): boolean;
  errores(): string[];
}

class Formulario implements Serializable, Validable {
  constructor(private campos: Record<string, string>) {}

  serializar(): string {
    return JSON.stringify(this.campos);
  }

  deserializar(data: string): void {
    Object.assign(this.campos, JSON.parse(data));
  }

  esValido(): boolean {
    return Object.values(this.campos).every((v) => v.trim().length > 0);
  }

  errores(): string[] {
    return Object.entries(this.campos)
      .filter(([, v]) => !v.trim())
      .map(([k]) => `${k} es requerido`);
  }
}
```

---

## Clases abstractas

No se pueden instanciar directamente, sirven como base:

```ts
abstract class Figura {
  abstract calcularArea(): number;
  abstract calcularPerimetro(): number;

  describir(): string {
    return `Área: ${this.calcularArea().toFixed(2)}, Perímetro: ${this.calcularPerimetro().toFixed(2)}`;
  }
}

class Circulo extends Figura {
  constructor(private radio: number) { super(); }

  calcularArea(): number { return Math.PI * this.radio ** 2; }
  calcularPerimetro(): number { return 2 * Math.PI * this.radio; }
}
```

---

## Getters y Setters

```ts
class Temperatura {
  private _celsius: number;

  constructor(celsius: number) {
    this._celsius = celsius;
  }

  get fahrenheit(): number {
    return this._celsius * 9/5 + 32;
  }

  set fahrenheit(f: number) {
    this._celsius = (f - 32) * 5/9;
  }

  get celsius(): number { return this._celsius; }
  set celsius(c: number) { this._celsius = c; }
}

const temp = new Temperatura(100);
console.log(temp.fahrenheit); // 212
temp.fahrenheit = 32;
console.log(temp.celsius);    // 0
```

---

## Relevancia en React

En React moderno (con hooks) se usan menos las clases en componentes, pero siguen siendo importantes para:
- **Servicios**: `ApiService`, `AuthService`, `LocalStorageService`
- **Modelos de dominio**: `Usuario`, `Producto`, `Pedido`
- **Patrones**: Repository, Factory, Singleton
- **Error boundaries** (solo disponibles como clases en React)

---

## Resumen

| Concepto           | Sintaxis                      |
|--------------------|-------------------------------|
| Propiedad pública  | `public nombre: string`       |
| Propiedad privada  | `private saldo: number`       |
| Solo lectura       | `readonly id: string`         |
| Shorthand          | `constructor(public x: T)`    |
| Herencia           | `class B extends A`           |
| Implementar        | `class C implements I`        |
| Abstracta          | `abstract class A`            |
| Getter             | `get propiedad(): T`          |
| Setter             | `set propiedad(v: T)`         |
