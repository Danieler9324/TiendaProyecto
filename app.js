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

const alternarFavoritos = document.getElementById("alternarFavoritos")
const panelFavoritos = document.getElementById("panelFavoritos")
const cerrarFavoritosBtn = document.getElementById("cerrarFavoritos")
const productosFavoritos = document.getElementById("objetosFavoritos")

const alternarHistorial = document.getElementById("alternarHistorial")
const panelHistorial = document.getElementById("panelHistorial")
const cerrarHistorialBtn = document.getElementById("cerrarHistorial")
const objetosHistorial = document.getElementById("objetosHistorial")

const alertaPersonalizada = document.getElementById("mensPerso")
const mensajeModalPagar = document.getElementById("mensajeModalPagar")

const hamburguesaBtn = document.querySelector(".menu-hamburguesa");
const menuHamburguesa = document.querySelector(".hamburguesa-opcion");

const nombre = localStorage.getItem("usuario")

document.getElementById("nombrePerfil").textContent = nombre;

let carrito = [];
let favoritos = [];
let historial = [];

function mostrarMensaje(m) {
    mensajeModalPagar.textContent = m;
    alertaPersonalizada.style.display = "block";
}

function cerrarMensaje() {
    alertaPersonalizada.style.display = "none";
}

function money(n) {
    return Number(n || 0).toLocaleString("es-MX", {
        style: "currency",
        currency: "MXN"
    });
}

function abrirCarrito() {
    panelCarrito.classList.add("open");
}

function cerrarCarrito() {
    panelCarrito.classList.remove("open");
}

function carritoRenderizar() {
    productosCarrito.innerHTML = "";
    let subtotal = 0;

    carrito.forEach((it) => {
        const linea = it.price * it.can;
        subtotal += linea;

        const image = document.createElement("img");
        image.src = it.img;
        image.className = "cart-thumb";

        const row = document.createElement("div");
        row.className = "cart-item";

        const left = document.createElement("div");
        const title = document.createElement("p");
        title.className = "item-title";
        title.textContent = it.name;

        const unit = document.createElement("small");
        unit.textContent = money(it.price) + " c/u";

        left.appendChild(image);
        left.appendChild(title);
        left.appendChild(unit);

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

function agregarCarrito(item) {
    const found = carrito.find(p => p.id === item.id);

    if (found) {
        found.can++;
    } else {
        carrito.push({
            id: item.id,
            name: item.name,
            price: item.price,
            can: 1,
            img: item.img
        });
    }

    carritoRenderizar();
}

function removerCarrito(id) {
    carrito = carrito.filter(p => p.id !== id);
    carritoRenderizar();
}

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

function aplicaFiltro(filter) {
    const cartas = productos.querySelectorAll("article");

    cartas.forEach(card => {
        const cat = card.dataset.category;
        card.style.display = (filter === "todo" || filter === cat) ? "" : "none";
    });
}

function aplicarBusqueda(q) {
    const query = q.trim().toLowerCase();

    const cartas = productos.querySelectorAll("article");

    cartas.forEach(card => {
        const titulo = card.querySelector("h3").textContent.toLowerCase();
        card.style.display = titulo.includes(query) ? "" : "none";
    });
}

function abrirFavoritos() {
    panelFavoritos.classList.add("open")
}

function cerrarFavoritos() {
    panelFavoritos.classList.remove("open") 
}

function favoritosRender() {
    productosFavoritos.innerHTML = "";

    favoritos.forEach(ob => {
        const row = document.createElement("div");
        row.className = "item-favorito";

        const image = document.createElement("img");
        image.src = ob.img;
        image.className = "cart-thumb";

        const title = document.createElement("p");
        title.textContent = ob.name;

        const rm = document.createElement("button");
        rm.textContent = "Quitar";
        rm.dataset.id = ob.id;
        rm.className = "remove-btn";

        row.appendChild(image);
        row.appendChild(title);
        row.appendChild(rm);

        productosFavoritos.appendChild(row);
    });
}

function agregarFavorito(item) {
    const existe = favoritos.find(f => f.id === item.id);

    if (!existe) {
        favoritos.push(item);
    }

    favoritosRender();
}

function removerFavorito(id) {
    favoritos = favoritos.filter(f => f.id !== id);
    favoritosRender();
}

function abrirHistorial() {
    panelHistorial.classList.add("open")
}

function cerrarHistorial() {
    panelHistorial.classList.remove("open")
}

function historialRender() {
    objetosHistorial.innerHTML=""

    historial.forEach((compra,index) => {
        const div = document.createElement("div")
        div.className = "item-historial"

        let html = `
            <h4>Compra #${index + 1} – ${compra.fecha}</h4>
            <p><strong>Total:</strong> ${money(compra.total)}</p>
            <ul>
        `;

        compra.productos.forEach(p => {
            html += `<li>${p.can} x ${p.name} (${money(p.price)} c/u)</li>`;
        });

        html += "</ul>";

        div.innerHTML = html;
        objetosHistorial.appendChild(div);
    })
}

function guardarCompra(lista, total) {
    const fecha = new Date().toLocaleDateString("es-MX")

    historial.push ({fecha,total,productos: lista.map(it => ({
        id: it.id,
        name: it.name,
        price: it.price,
        can: it.can
        }))
    })
    historialRender()
}

alternarCarrito.addEventListener("click", () => {
    if (panelCarrito.classList.contains("open")) cerrarCarrito();
    else abrirCarrito();
});

productos.addEventListener("click", (e) => {
    const btnCarrito = e.target.closest(".agregar");
    if (btnCarrito) {
        const card = btnCarrito.closest("article");
        const id = card.dataset.id;
        const name = card.dataset.name;
        const price = Number(card.dataset.price);
        const img = card.querySelector("img").src;

        agregarCarrito({ id, name, price, img });
        abrirCarrito();
        return;
    }

    const btnFav = e.target.closest(".favorito");
    if (btnFav) {

        const card = btnFav.closest("article");
        const id = card.dataset.id;
        const name = card.dataset.name;
        const price = Number(card.dataset.price);
        const img = card.querySelector("img").src;

        if (btnFav.textContent === "⭐") {
            btnFav.textContent = "❤️";
            agregarFavorito({ id, name, img });
        } else {
            btnFav.textContent = "⭐";
            removerFavorito(id);
        }

        abrirFavoritos();
    }
});


botones.forEach(btn => {
    btn.addEventListener("click", () => {
        aplicaFiltro(btn.dataset.filter);
    });
});

buscar.addEventListener("input", () => {
    aplicarBusqueda(buscar.value);
});

productosCarrito.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;

    const id = btn.dataset.id;
    const action = btn.dataset.action;

    if (action === "inc") cambiarCantidad(id, +1);
    else if (action === "dec") cambiarCantidad(id, -1);
    else if (action === "remove") removerCarrito(id);
});

pagar.addEventListener("click", () => {
    if (!carrito.length) return mostrarMensaje("Tu carrito está vacío");

    const total = carrito.reduce((sum, it) => sum + it.price * it.can, 0);

    guardarCompra(carrito, total);
    mostrarMensaje("Gracias por tu compra!\nTotal: " + money(total));

    carrito = [];
    carritoRenderizar();
    cerrarCarrito();
});

alternarFavoritos.addEventListener("click", () => {
    if (panelFavoritos.classList.contains("open")) cerrarFavoritos();
    else abrirFavoritos();
});

productosFavoritos.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;

    const id = btn.dataset.id;
    removerFavorito(id);

    const card = productos.querySelector(`article[data-id="${id}"]`);
    
    if (card) {
        const btnFav = card.querySelector(".favorito");
        if (btnFav) btnFav.textContent = "⭐";
    }
});

alternarHistorial.addEventListener("click", () => {
    if (panelHistorial.classList.contains("open")) cerrarHistorial();
    else abrirHistorial();
});

hamburguesaBtn.addEventListener("click", (e) => {
    e.stopPropagation(); 
    menuHamburguesa.classList.toggle("show");
});

document.addEventListener("click", () => {
    menuHamburguesa.classList.remove("show");
});

cerrarCarritoBtn.addEventListener("click", cerrarCarrito);
cerrarFavoritosBtn.addEventListener("click", cerrarFavoritos);
cerrarHistorialBtn.addEventListener("click", cerrarHistorial);