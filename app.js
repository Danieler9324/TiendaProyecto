// ELEMENTOS DEL DOM
const productos = document.getElementById("productos");
const buscar = document.getElementById("buscar");
const botones = document.querySelectorAll(".botones button");

const alternarCarrito = document.getElementById("alternarCarrito");
const panelCarrito = document.getElementById("panelCarrito");
const cerrarCarritoBtn = document.getElementById("cerrarCarrito");

const productosCarrito = document.getElementById("objetosCarrito");
const contadorCarrito = document.getElementById("cuentaCarrito");
const subtotalCarrito = document.getElementById("subtotal");
const pagar = document.getElementById("pagarBtn");

let carrito = [];

// Formato de dinero
function money(n) {
    return Number(n || 0).toLocaleString("es-MX", {
        style: "currency",
        currency: "MXN"
    });
}

// Abrir carrito
function abrirCarrito() {
    panelCarrito.classList.add("open");
}

// Cerrar carrito
function cerrarCarrito() {
    panelCarrito.classList.remove("open");
}

// Render del carrito
function carritoRenderizar() {
    productosCarrito.innerHTML = "";
    let subtotal = 0;

    carrito.forEach((it) => {
        const linea = it.price * it.can;
        subtotal += linea;

        const row = document.createElement("div");
        row.className = "cart-item";

        // izquierda
        const left = document.createElement("div");
        const title = document.createElement("p");
        title.className = "item-title";
        title.textContent = it.name;

        const unit = document.createElement("small");
        unit.textContent = money(it.price) + " c/u";

        left.appendChild(title);
        left.appendChild(unit);

        // derecha
        const right = document.createElement("div");
        right.className = "item-controls";

        const dec = document.createElement("button");
        dec.className = "qty-btn";
        dec.dataset.action = "dec";
        dec.dataset.id = it.id;
        dec.textContent = "-";

        const qty = document.createElement("span");
        qty.className = "qty";
        qty.textContent = it.can;

        const inc = document.createElement("button");
        inc.className = "qty-btn";
        inc.dataset.action = "inc";
        inc.dataset.id = it.id;
        inc.textContent = "+";

        const rm = document.createElement("button");
        rm.className = "remove-btn";
        rm.dataset.action = "remove";
        rm.dataset.id = it.id;
        rm.textContent = "Quitar";

        right.appendChild(dec);
        right.appendChild(qty);
        right.appendChild(inc);
        right.appendChild(rm);

        row.appendChild(left);
        row.appendChild(right);

        productosCarrito.appendChild(row);
    });

    const totalObje = carrito.reduce((acc, ob) => acc + ob.can, 0);

    contadorCarrito.textContent = totalObje;
    subtotalCarrito.textContent = money(subtotal);
}

// Agregar producto
function agregarCarrito(item) {
    const found = carrito.find(p => p.id === item.id);

    if (found) {
        found.can++;
    } else {
        carrito.push({
            id: item.id,
            name: item.name,
            price: item.price,
            can: 1
        });
    }

    carritoRenderizar();
}

// Quitar producto
function removerCarrito(id) {
    carrito = carrito.filter(p => p.id !== id);
    carritoRenderizar();
}

// Cambiar cantidad
function cambiarCantidad(id, delta) {
    const ob = carrito.find(p => p.id === id);
    if (!ob) return;

    ob.can += delta;

    if (ob.can <= 0) {
        removerCarrito(id);
    } else {
        carritoRenderizar();
    }
}

// Filtro de categoría
function aplicaFiltro(filter) {
    const cartas = productos.querySelectorAll("article");

    cartas.forEach(card => {
        const cat = card.dataset.category;
        card.style.display = (filter === "todo" || filter === cat) ? "" : "none";
    });
}

// Buscar producto
function aplicarBusqueda(q) {
    const query = q.trim().toLowerCase();

    const cartas = productos.querySelectorAll("article");

    cartas.forEach(card => {
        const titulo = card.querySelector("h3").textContent.toLowerCase();
        card.style.display = titulo.includes(query) ? "" : "none";
    });
}

// EVENTOS
alternarCarrito.addEventListener("click", () => {
    if (panelCarrito.classList.contains("open")) cerrarCarrito();
    else abrirCarrito();
});

cerrarCarritoBtn.addEventListener("click", cerrarCarrito);

// Evento agregar al carrito
productos.addEventListener("click", (e) => {
    const btn = e.target.closest(".agregar");
    if (!btn) return;

    const card = btn.closest("article");
    const id = card.dataset.id;
    const name = card.dataset.name;
    const price = Number(card.dataset.price);

    agregarCarrito({ id, name, price });
    abrirCarrito();
});

// Botones de categorías
botones.forEach(btn => {
    btn.addEventListener("click", () => {
        aplicaFiltro(btn.dataset.filter);
    });
});

// Búsqueda
buscar.addEventListener("input", () => {
    aplicarBusqueda(buscar.value);
});

// Eventos dentro del carrito
productosCarrito.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;

    const id = btn.dataset.id;
    const action = btn.dataset.action;

    if (action === "inc") cambiarCantidad(id, +1);
    else if (action === "dec") cambiarCantidad(id, -1);
    else if (action === "remove") removerCarrito(id);
});

// Pagar
pagar.addEventListener("click", () => {
    if (!carrito.length) return alert("Tu carrito está vacío");

    const total = carrito.reduce((sum, it) => sum + it.price * it.can, 0);

    alert("Gracias por tu compra!\nTotal: " + money(total));

    carrito = [];
    carritoRenderizar();
    cerrarCarrito();
});
