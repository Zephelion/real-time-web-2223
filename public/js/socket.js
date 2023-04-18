var socket = io();
let typing = false;
let typingTimeout;

const messages = document.querySelector('ul');
const form = document.querySelector('form');
const input = document.querySelector('input');
const divTyping = document.querySelector('.typing');

console.log(divTyping);


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

input.addEventListener('keydown', () => {
    if(!typingTimeout) {
        // typing = true;
        socket.emit('typing');
    }
    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
        typingTimeout = null;
        socket.emit('stop typing');
    }, 500);
});

socket.on('typing', () => {
    console.log('User is typing...');
    divTyping.classList.add('visible');
});

// input.addEventListener('keyup', () => {
//     if(typing) {
//         typing = false;
//         socket.emit('stop typing');
//     }
// });

socket.on('stop typing', () => {
    console.log('User stopped typing...');
    divTyping.classList.remove('visible');
});