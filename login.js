const user = document.getElementById("username");
const pass = document.getElementById("password");

document.querySelector("form").addEventListener("submit", (e) => {
    e.preventDefault();

    if (user.value.trim() === "" || pass.value.trim() === "") {
        alert("Completa todos los campos");
        return;
    }
    localStorage.setItem("usuario", user.value);
    window.location.href = "index.html";
});