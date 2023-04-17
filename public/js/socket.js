var socket = io();
console.log("hier komt de socket logica");

const messages = document.querySelector('ul');
const form = document.querySelector('form');
const input = document.querySelector('input');


form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (input.value) {
        socket.emit('chat message', input.value);
        input.value = '';
    }
});

socket.on('chat message', (msg) => {
    console.log('message: ' + msg);
    const li = document.createElement('li');
    li.textContent = msg;
    messages.appendChild(li);
});