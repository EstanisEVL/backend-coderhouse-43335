/* Dados los objetos indicados: */
const objetos = [
  {
    manzanas: 3,
    peras: 2,
    carne: 1,
    jugos: 5,
    dulces: 2,
  },
  {
    manzanas: 1,
    sandias: 1,
    huevos: 6,
    jugos: 1,
    panes: 4,
  },
];

/*
Realizar una lista nueva (array) que contenga todos los tipos de productos (no cantidades), consejo: utilizar Object.keys y Array.includes. Mostrar el array por consola.
*/
const productos = Object.keys({...objetos[0], ...objetos[1]});
console.log(productos);
/*
Posteriormente, obtener el total de productos vendidos por todos los objetos (utilizar Object.values)
*/
let total = 0;

objetos.forEach(objeto => {
  const values = Object.values(objeto);

  total += values.reduce((initialValue, accumulatedValue) => initialValue + accumulatedValue);
})

console.log(`Total:  ${total}.`);

// Hands on lab:
class TicketManager {
  // Variable privada que no va a poder utilizarse fuera del scope de esta clase:
  #precioBaseGanancia = 0.15;

  constructor() {
    // Se define el constructor que se llama "eventos" que va a tener un arreglo vacío, para que el listado de eventos aparezca desde un inicio como vacío:
    this.eventos = [];
  }

  getEventos = () => {
    return this.eventos;
  };

  agregarEvento = (
    nombre,
    lugar,
    precio,
    capacidad = 50,
    fecha = new Date().toLocaleDateString()
  ) => {
    const evento = {
      nombre,
      lugar,
      precio,
      capacidad,
      fecha,
      participantes: [],
    };
    // El primer evento va a recibir el id 1 pero ocupara la posicion 0 del arreglo
    if (this.eventos.length === 0) {
      evento.id = 1;
    } else {
      evento.id = this.eventos[this.eventos.length - 1].id + 1;
    }

    this.eventos.push(evento);
  };

  agregarUsuario = (idEvento, idUsuario) => {
    const eventoIndex = this.eventos.findIndex(
      (evento) => evento.id === idEvento
    );
    if (eventoIndex === -1) {
      console.log("Evento no encontrado");
    }
    const usuarioRegistrado =
      this.eventos[eventoIndex].participantes.includes(idUsuario);
    if (usuarioRegistrado) {
      console.log("Usuario ya registrado");
      return;
    }
    this.eventos[eventoIndex].participantes.push(idUsuario);
  };
}

const manejadorEventos = new TicketManager();

manejadorEventos.agregarEvento("nombre", "Argentina", 12000);
manejadorEventos.agregarEvento("nombre2", "Argentina", 15000);

manejadorEventos.agregarUsuario(1, 1);
manejadorEventos.agregarUsuario(2, 2);

console.log(manejadorEventos.getEventos());