const socket = io();

socket.on('init', (text)=>{
    const p1 = document.createElement('p');
    p1.innerText = "Me: " + socket.id;
    document.body.appendChild(p1);
    const p2 = document.createElement('p');
    p2.innerText = text;
    document.body.appendChild(p2);
});

const playersEle = document.querySelector("#players");
socket.on('newPlayer', (players)=>{
    playersEle.replaceChildren();
    Object.entries(players).forEach(([id, val]) => {
        console.log(id);
        const li = document.createElement('li');
        li.innerText = players[id].pseudo;
        playersEle.appendChild(li);
    });
});

const textInput = document.querySelector("#textInput");
textInput.addEventListener("keydown", (ev)=>{
    const val = textInput.value;
    console.log(ev.key);
    if(ev.key == 'Enter'){
        if(val != ""){
        // socket.emit('input', val); // fun ne pas suppr
            ev.preventDefault();
            console.log("in");
            socket.emit('message', val);
            textInput.value = null;
        }
    }
});

const chat = document.querySelector('#chat');
socket.on('newMessage', (values)=>{
    const wrapper = document.createElement('div');
    wrapper.classList.add("messageWrapper")
    const p = document.createElement('p');
    p.innerHTML = `<b>${values.sender}</b> ${values.text}`;
    wrapper.appendChild(p);
    const p2 = document.createElement('p');
    p2.innerText = new Date().toLocaleTimeString();
    wrapper.appendChild(p2);
    chat.appendChild(wrapper)
});

const pseudoChooserWrapper = document.querySelector("#pseudo-selection");
const pseudoInput = document.querySelector("#pseudoInput");
pseudoInput.addEventListener("keydown", (ev)=>{
    if(ev.key == 'Enter'){
        socket.emit('pseudoChoose', pseudoInput.value);
        pseudoInput.value = "";
        pseudoChooserWrapper.style.display = 'none';
    }
});