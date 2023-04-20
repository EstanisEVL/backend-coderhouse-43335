/* 
Creación de una clase contador:

¿Cómo lo hacemos? Se creará una clase que permitirá llevar cuentas individuales según cada responsable.

Definir clase Contador
La clase se creará con un nombre, representando al responsable del contador.
El contador debe inicializarse en 0
Debe existir una variable estática que funcione como contador global de todas las instancias de contador creadas.

Definir el método getResponsable, el cual debe devolver el responsable de dicho contador.

Definir el método contar, el cual debe incrementar, tanto su cuenta individual, como la cuenta global.

Definir el método getCuentaIndividual, el cual debe devolver sólo la cuenta individual del contador.

Definir el método getCuentaGlobal, el cual debe devolver la variable estática con el conteo global.

Realizar prueba de individualidad entre las instancias.

*/

class Contador {
  constructor(nombre, contador) {
    this.nombre = nombre;
    this.contador = contador;
  }

  static contador = 0;

  getResponsable = () => console.log(`Responsable: ${this.nombre}`);
  contar = () => {
    let resInd = this.contador + 1;
    let resGlo = Contador.contador + 1;
    console.log(`Cuenta individual + 1 = ${resInd} | Cuenta global + 1 = ${resGlo}`);
  };
  getCuentaIndividual = () =>
    console.log(`Cuenta individual del contador: ${this.contador}`);
  getCuentaGlobal = () => console.log(`Variable global: ${Contador.contador}`);
}

const contador1 = new Contador("Pepe", 5);

contador1.getResponsable();
contador1.getCuentaGlobal();
contador1.getCuentaIndividual();
contador1.contar();
