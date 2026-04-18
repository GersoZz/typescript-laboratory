// =============================================================
// 06 - CLASES EN TYPESCRIPT
// =============================================================
export {};

// ------------------------------------------------------------
// 1. CLASE BÁSICA CON TIPOS
// ------------------------------------------------------------
class Persona {
  nombre: string;
  edad: number;
  email: string;

  constructor(nombre: string, edad: number, email: string) {
    this.nombre = nombre;
    this.edad = edad;
    this.email = email;
  }

  saludar(): string {
    return `Hola, soy ${this.nombre} y tengo ${this.edad} años.`;
  }

  cumplirAños(): void {
    this.edad += 1;
    console.log(`¡Feliz cumpleaños ${this.nombre}! Ahora tenés ${this.edad} años.`);
  }
}

const persona1 = new Persona("Ana García", 30, "ana@email.com");
console.log(persona1.saludar());
persona1.cumplirAños();

// ------------------------------------------------------------
// 2. MODIFICADORES DE ACCESO
// public, private, protected, readonly
// ------------------------------------------------------------
class CuentaBancaria {
  public titular: string;
  private saldo: number;
  protected numeroCuenta: string;
  readonly fechaCreacion: Date;

  constructor(titular: string, saldoInicial: number, numeroCuenta: string) {
    this.titular = titular;
    this.saldo = saldoInicial;
    this.numeroCuenta = numeroCuenta;
    this.fechaCreacion = new Date();
  }

  depositar(monto: number): void {
    if (monto <= 0) throw new Error("El monto debe ser positivo");
    this.saldo += monto;
    console.log(`Depósito de $${monto}. Nuevo saldo: $${this.saldo}`);
  }

  extraer(monto: number): void {
    if (monto > this.saldo) throw new Error("Saldo insuficiente");
    this.saldo -= monto;
    console.log(`Extracción de $${monto}. Nuevo saldo: $${this.saldo}`);
  }

  get saldoActual(): number {
    return this.saldo;
  }

  get resumen(): string {
    return `Cuenta: ${this.numeroCuenta} | Titular: ${this.titular} | Saldo: $${this.saldo}`;
  }
}

const cuenta = new CuentaBancaria("Ana García", 50000, "CBU-0001-2345");
cuenta.depositar(10000);
cuenta.extraer(5000);
console.log(cuenta.resumen);
console.log("Saldo:", cuenta.saldoActual);

// cuenta.saldo = 999999;      // ❌ 'saldo' is private
// cuenta.fechaCreacion = new Date(); // ❌ 'fechaCreacion' is readonly

// ------------------------------------------------------------
// 3. SHORTHAND CONSTRUCTOR
// Declara y asigna propiedades en los parámetros
// ------------------------------------------------------------
class Producto {
  constructor(
    public nombre: string,
    public precio: number,
    private stock: number,
    readonly id: string,
    public activo: boolean = true,
  ) {}

  verificarDisponibilidad(cantidad: number): boolean {
    return this.stock >= cantidad;
  }

  vender(cantidad: number): void {
    if (!this.verificarDisponibilidad(cantidad)) {
      throw new Error(`Stock insuficiente. Disponible: ${this.stock}`);
    }
    this.stock -= cantidad;
    console.log(`Vendidas ${cantidad} unidades de ${this.nombre}. Stock restante: ${this.stock}`);
  }

  get info(): string {
    return `[${this.id}] ${this.nombre} - $${this.precio} (stock: ${this.stock})`;
  }
}

const teclado = new Producto("Teclado Mecánico", 25000, 50, "prod-001");
const mouse = new Producto("Mouse Gamer", 8000, 100, "prod-002");

console.log(teclado.info);
teclado.vender(3);
console.log(mouse.info);

// ------------------------------------------------------------
// 4. GETTERS Y SETTERS
// ------------------------------------------------------------
class Temperatura {
  private _celsius: number;

  constructor(celsius: number) {
    if (celsius < -273.15) throw new Error("Temperatura por debajo del cero absoluto");
    this._celsius = celsius;
  }

  get celsius(): number {
    return this._celsius;
  }

  set celsius(valor: number) {
    if (valor < -273.15) throw new Error("Temperatura por debajo del cero absoluto");
    this._celsius = valor;
  }

  get fahrenheit(): number {
    return this._celsius * (9 / 5) + 32;
  }

  set fahrenheit(f: number) {
    this.celsius = (f - 32) * (5 / 9);
  }

  get kelvin(): number {
    return this._celsius + 273.15;
  }

  toString(): string {
    return `${this._celsius}°C = ${this.fahrenheit}°F = ${this.kelvin}K`;
  }
}

const agua = new Temperatura(100);
console.log("Agua hirviendo:", agua.toString());

agua.fahrenheit = 32;
console.log("Agua helada:", agua.toString());

// ------------------------------------------------------------
// 5. HERENCIA CON extends
// ------------------------------------------------------------
class Animal {
  constructor(
    public nombre: string,
    protected energia: number = 100,
  ) {}

  comer(alimento: string): void {
    this.energia += 20;
    console.log(`${this.nombre} comió ${alimento}. Energía: ${this.energia}`);
  }

  mover(distancia: number): void {
    this.energia -= distancia * 2;
    console.log(`${this.nombre} se movió ${distancia}m. Energía: ${this.energia}`);
  }

  toString(): string {
    return `${this.nombre} (energía: ${this.energia})`;
  }
}

class Perro extends Animal {
  constructor(
    nombre: string,
    public raza: string,
    private dueno: string,
  ) {
    super(nombre, 100); // obligatorio llamar super()
  }

  ladrar(): void {
    this.energia -= 5;
    console.log(`${this.nombre} dice: ¡Guau! Energía: ${this.energia}`);
  }

  // Sobreescribir con override (buena práctica)
  override mover(distancia: number): void {
    console.log(`${this.nombre} corre hacia ${this.dueno}...`);
    super.mover(distancia);
  }

  override toString(): string {
    return `${super.toString()} | Raza: ${this.raza} | Dueño: ${this.dueno}`;
  }
}

class GatoSiames extends Animal {
  private vidas: number = 9;

  constructor(nombre: string) {
    super(nombre, 80);
  }

  maullar(): void {
    console.log(`${this.nombre}: Miau~`);
  }

  override mover(distancia: number): void {
    console.log(`${this.nombre} camina con elegancia...`);
    super.mover(distancia * 0.5); // los gatos gastan menos energía
  }
}

const rex = new Perro("Rex", "Labrador", "Juan");
const luna = new GatoSiames("Luna");

rex.ladrar();
rex.mover(10);
rex.comer("croquetas");
console.log(rex.toString());

luna.maullar();
luna.mover(5);
console.log(luna.toString());

// ------------------------------------------------------------
// 6. IMPLEMENTACIÓN DE INTERFACES
// ------------------------------------------------------------
interface Serializable {
  serializar(): string;
}

interface Validable {
  esValido(): boolean;
  obtenerErrores(): string[];
}

interface Comparable<T> {
  comparar(otro: T): number; // -1, 0, 1
}

class Empleado implements Serializable, Validable, Comparable<Empleado> {
  constructor(
    public readonly id: string,
    public nombre: string,
    public email: string,
    public salario: number,
    public departamento: string,
  ) {}

  serializar(): string {
    return JSON.stringify({
      id: this.id,
      nombre: this.nombre,
      email: this.email,
      salario: this.salario,
      departamento: this.departamento,
    });
  }

  esValido(): boolean {
    return this.obtenerErrores().length === 0;
  }

  obtenerErrores(): string[] {
    const errores: string[] = [];
    if (!this.nombre.trim()) errores.push("El nombre es requerido");
    if (!this.email.includes("@")) errores.push("El email no es válido");
    if (this.salario <= 0) errores.push("El salario debe ser positivo");
    return errores;
  }

  comparar(otro: Empleado): number {
    if (this.salario < otro.salario) return -1;
    if (this.salario > otro.salario) return 1;
    return 0;
  }
}

const emp1 = new Empleado("e1", "Ana López", "ana@corp.com", 120000, "Ingeniería");
const emp2 = new Empleado("e2", "Bob Martínez", "bob@corp.com", 95000, "Diseño");

console.log("Empleado válido:", emp1.esValido());
console.log("Comparación salarial:", emp1.comparar(emp2)); // 1 (ana gana más)

const empInvalido = new Empleado("e3", "", "notEmail", -1, "HR");
console.log("Errores:", empInvalido.obtenerErrores());

// ------------------------------------------------------------
// 7. CLASES ABSTRACTAS
// ------------------------------------------------------------
abstract class Repositorio<T extends { id: number }> {
  protected items: T[] = [];

  abstract validar(item: T): boolean;

  guardar(item: T): void {
    if (!this.validar(item)) throw new Error("El item no es válido");
    const indice = this.items.findIndex((i) => i.id === item.id);
    if (indice >= 0) {
      this.items[indice] = item;
    } else {
      this.items.push(item);
    }
  }

  obtenerPorId(id: number): T | undefined {
    return this.items.find((i) => i.id === id);
  }

  eliminar(id: number): boolean {
    const anterior = this.items.length;
    this.items = this.items.filter((i) => i.id !== id);
    return this.items.length < anterior;
  }

  listarTodos(): T[] {
    return [...this.items];
  }
}

interface UsuarioSimple {
  id: number;
  nombre: string;
  email: string;
}

class RepositorioUsuarios extends Repositorio<UsuarioSimple> {
  validar(usuario: UsuarioSimple): boolean {
    return (
      usuario.nombre.trim().length > 0 &&
      usuario.email.includes("@") &&
      usuario.id > 0
    );
  }
}

const repo = new RepositorioUsuarios();
repo.guardar({ id: 1, nombre: "Ana", email: "ana@test.com" });
repo.guardar({ id: 2, nombre: "Bob", email: "bob@test.com" });

console.log("Todos:", repo.listarTodos());
console.log("Buscar id 1:", repo.obtenerPorId(1));
console.log("Eliminar id 2:", repo.eliminar(2));
console.log("Después de eliminar:", repo.listarTodos());

// ------------------------------------------------------------
// 8. PATRÓN SINGLETON — clase con una sola instancia
// ------------------------------------------------------------
class ConfiguracionApp {
  private static instancia: ConfiguracionApp | null = null;

  private constructor(
    public readonly apiUrl: string,
    public readonly version: string,
    public tema: "light" | "dark" = "light",
  ) {}

  static obtenerInstancia(): ConfiguracionApp {
    if (!ConfiguracionApp.instancia) {
      ConfiguracionApp.instancia = new ConfiguracionApp(
        "https://api.miapp.com",
        "2.1.0",
      );
    }
    return ConfiguracionApp.instancia;
  }
}

const config1 = ConfiguracionApp.obtenerInstancia();
const config2 = ConfiguracionApp.obtenerInstancia();
config1.tema = "dark";

console.log("Misma instancia:", config1 === config2);         // true
console.log("Tema en config2:", config2.tema);               // "dark" (misma instancia)
console.log("API URL:", config1.apiUrl);
