const openBtn = document.querySelector(".add");
const overlay = document.querySelector(".overlay");
const modal = document.querySelector(".modal");
const closeBtn = document.querySelector(".modal-close");

openBtn.addEventListener("click", () => {
    overlay.classList.add("show");
    modal.classList.add("reveal");
    console.log("nu gaat de modal open");
});

closeBtn.addEventListener("click", () => {
    overlay.classList.remove("show");
    modal.classList.remove("reveal");
    console.log("nu gaat de modal dicht");
});
