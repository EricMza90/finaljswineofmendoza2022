
const array = [];

function jsonALocalStorage() {


  fetch("../json/articulos.json")
    .then((respuesta) => respuesta.json())
    .then((data) => {
      if (typeof data === "string") {
        data = JSON.parse(data);
      } else
        data.forEach(function (item) {
          array.push(item);
        });

      localStorage.setItem("json", JSON.stringify(array));
    });
}
const carrito = [];

function stockEnLS() {
  return JSON.parse(localStorage.getItem("json")) || [];
}

function guardarStockCarritoLS(array) {
  localStorage.setItem("elegidos", JSON.stringify(array));
}

function itemsElegidosCarritoLS() {
  return JSON.parse(localStorage.getItem("elegidos")) || [];
}

function stock() {
  const stockTienda = stockEnLS();

  let contenido = "";

  stockTienda.forEach((vino) => {
    contenido += `<div id="${vino.id}" class= "col-md-4 container-tarjeta" style="width: 300px;">
      <div class="card text-center text-white fw-bold mb-3" id="card-vinos" >
      <img src="image/${vino.imagen}" class="card-img-top" alt="${vino.nombre}">
      <div class="card-body">
        <h6 class="card-title fw-bold ">${vino.varietal}</h6>
        <p class="card-text">${vino.nombre}</p>
        <p class="card-text">$ ${vino.precio}</p>
        <button type="button" class="btn btn-success btn-agregar">Agregar al Carrito</button>
        
      </div>
    </div>
    </div>`;
  });
  document.getElementById("productos").innerHTML = contenido;
}

function agregarAlCarrito() {
  const itemsCarrito = itemsElegidosCarritoLS();
  const botones = document.querySelectorAll(".btn-agregar");

  botones.forEach((boton) => {
    boton.addEventListener("click", (e) => {
      let itemId = parseInt(e.target.closest(".container-tarjeta").id);
      let pos = itemsCarrito.findIndex((vino) => vino.id === itemId);
      if (pos > -1) {
        itemsCarrito[pos].cantidad += 1;
      } else {
        let item = array.find((vino) => vino.id === itemId);
        item.cantidad = 1;
        itemsCarrito.push(item);
      }
      Swal.fire({
        position: "top-center",
        icon: "success",
        title: "Producto Agregado!!",
        showConfirmButton: false,
        timer: 1000,
      });
      guardarStockCarritoLS(itemsCarrito);
      botonCarrito();
    });
  });
}

function botonCarrito() {
  let contenido = `<button type="button" class="btn">
    <img src="/image/cart.png" alt="cart" width="42"></img>
    <span class="badge bg-secondary">${ArticulosEnCarrito()}</span>
  </button>`;

  document.getElementById("btn-cart").innerHTML = contenido;
}

function ArticulosEnCarrito() {
  const itemsCarrito = itemsElegidosCarritoLS();

  return itemsCarrito.reduce((sumatoria, vino) => sumatoria + vino.cantidad, 0);
}

function descuento() {
  const itemsCarrito = itemsElegidosCarritoLS();

  let dto = itemsCarrito.reduce(
    (sumatoria, vino) => sumatoria + vino.cantidad,
    0
  );

  if (dto >= 4) {
    return itemsCarrito.reduce(
      (sumatoria, vino) => sumatoria + vino.cantidad * vino.precio * 0.85,
      0
    );
  }

  return itemsCarrito.reduce(
    (sumatoria, vino) => sumatoria + vino.cantidad * vino.precio,
    0
  );
}

function totalCompra() {
  const itemsCarrito = itemsElegidosCarritoLS();

  return itemsCarrito.reduce(
    (sumatoria, vino) => sumatoria + vino.cantidad * vino.precio,
    0
  );
}

jsonALocalStorage();
stock();
agregarAlCarrito();
botonCarrito();
