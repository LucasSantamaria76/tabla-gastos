/*
Desarrollar un sistema que permita al usuario realizar un seguimiento de sus ingresos y egresos monetarios.
Para esto, el usuario debe poder seleccionar si el dato que está cargando es un INGRESO o un EGRESO. Seguidamente, debe
poder ingresar una descripción del movimiento que está ingresando (ej. honorarios, sueldo, comprar milanesas, etc). Por
último, debe poder cargar el importe del movimiento.

Al final, debe tocar un botón que guardará la información.

Al tocar el botón, se mostrarán en pantalla los movimientos en forma de tabla. Los movimiento del tipo INGRESO deben
tener un fondo de color verde (#4cd463) y los de EGRESO, color rojo (#e8574d).

En el pie de la tabla, se debe mostrar un resumen de la tabla, sumando todos los ingresos y restandole los egresos. Si
el monto final es > 0, debe tener el color rojo y si es mayor, el verde.
*/
const inputDescr = document.getElementById('descripcion');
const inputTipo = document.getElementById('tipo');
const inputImporte = document.getElementById('importe');
const form = document.getElementById('form');
const tbody = document.querySelector('tbody');
const totalTabla = document.querySelector('#total');
const inputFecha = document.getElementById('fecha');

let data = [];

const limpiarTabla = () => {
  while (tbody.firstChild) tbody.removeChild(tbody.firstChild);
};

const renderTabla = () => {
  limpiarTabla();
  data.forEach((mov) => {
    let fila = document.createElement('tr');
    fila.classList.add(mov.tipo);
    Object.keys(mov).forEach((key) => {
      let celda = document.createElement('td');
      const text = document.createTextNode(key === 'importe' ? `$ ${parseFloat(mov[key]).toFixed(2)}` : mov[key]);
      celda.appendChild(text);
      fila.appendChild(celda);
    });
    tbody.appendChild(fila);
  });
  const total = data.reduce(
    (total, item) => (item.tipo === 'Ingreso' ? (total += parseFloat(item.importe)) : (total -= parseFloat(item.importe))),
    0
  );
  totalTabla.textContent = `$ ${total.toFixed(2)}`;
};

const limpiarCampos = () => {
  [inputDescr, inputImporte].forEach((input) => (input.value = ''));
  inputDescr.focus();
};

const saveData = () => {
  const newMov = getData();

  if (!newMov) return alert('Completa todos los datos');

  data.push(newMov);
  localStorage.setItem('data', JSON.stringify(data));
  renderTabla();
  limpiarCampos();
};

const getData = () => {
  const newMov = {
    descripcion: inputDescr.value,
    tipo: inputTipo.value,
    fecha: inputFecha.value.split('-').reverse().join('/'),
    importe: inputImporte.value,
  };

  if (!newMov.descripcion.trim() || !newMov.fecha || newMov.importe <= 0) {
    return null;
  } else {
    return newMov;
  }
};

document.addEventListener('DOMContentLoaded', () => {
  data = JSON.parse(localStorage.getItem('data')) || [];
  renderTabla();
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  saveData();
});

tbody.addEventListener('dblclick', (e) => {
  if (e.target.tagName === 'TD') {
    const index = e.target.parentElement.rowIndex;
    data.splice(index - 1, 1);
    localStorage.setItem('data', JSON.stringify(data));
    renderTabla();
  }
});
