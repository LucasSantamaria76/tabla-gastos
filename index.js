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

let data = [];

const renderTabla = () => {
  let tabla = '';
  data.forEach((item) => {
    let fila = document.createElement('tr');
    fila.classList.add(item.tipo === 'ingreso' ? 'table-ingreso' : 'table-egreso');
    const ImporteFila = `$ ${parseFloat(item.importe).toFixed(2)}`;
    fila.innerHTML = `
      <td>${item.descripcion}</td>
      <td>${item.tipo}</td>
      <td>${ImporteFila}</td>
      `;
    tabla += fila.outerHTML;
  });
  const total = data.reduce(
    (total, item) => (item.tipo === 'ingreso' ? (total += parseFloat(item.importe)) : (total -= parseFloat(item.importe))),
    0
  );
  totalTabla.textContent = `$ ${total.toFixed(2)}`;
  tbody.innerHTML = tabla;
};

const saveData = () => {
  const { descripcion, tipo, importe } = getData();
  if (importe && descripcion) data.push({ descripcion, tipo, importe });
  else {
    alert('Faltan datos');
    return;
  }

  localStorage.setItem('data', JSON.stringify(data));
  console.log('data', data);
  inputDescr.value = '';
  inputImporte.value = '';
  renderTabla();
  inputDescr.focus();
};

const getData = () => {
  const descripcion = inputDescr.value;
  const tipo = inputTipo.value;
  const importe = inputImporte.value;
  return { descripcion, tipo, importe };
};

document.addEventListener('DOMContentLoaded', () => {
  data = JSON.parse(localStorage.getItem('data')) || [];
  renderTabla();
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  saveData();
});
