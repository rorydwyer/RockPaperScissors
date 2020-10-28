const sock = io();
var messageBody = document.getElementById('events');

// Function to append messages to the chat
const writeEvent = (text) => {
    const el = document.querySelector('#message');
    el.innerHTML = text;
}

// const writeEvent = (text) => {
//     // <ul> element
//     const parent = document.querySelector('#events');

//     // <li> element
//     const el = document.createElement('li');
//     el.innerHTML = text;

//     parent.appendChild(el);
//     messageBody.scrollTop = messageBody.scrollHeight - messageBody.clientHeight;
// }

const setElement = (el, text) => {
    document.querySelector(el).innerHTML = text;
}

const addPoint = (score, idx) => {
    
    const el = document.querySelector('#player' + idx + ' > .score');
    el.innerHTML = score;
}

const updateStreak = (player, score) => {
    const el = document.querySelector('#player' + player + ' > .streak > .streak-score');
    el.innerHTML = score;
}

// When user enters name
const onReadySubmitted = (e) => {
    e.preventDefault();

    const input = document.querySelector('#player-name');
    const playerName = input.value;
    input.value = '';

    var el = document.querySelector('.ready-wrapper');
    el.classList.add('player-ready');
    setTimeout(() => {
        document.querySelector('.ready-wrapper').classList.add('d-none');
        sock.emit('playerReady', playerName);
    }, 800)
}

// Post message in chat when form is submitted
const onChatSubmitted = (e) => {
    e.preventDefault();

    const input = document.querySelector('#chat');
    const text = input.value;
    input.value = '';

    sock.emit('message', text);
};

// Run turn function when user clicks on rock, paper or scissors
const addButtonListeners = () => {
    ['rock', 'paper', 'scissors'].forEach((id) => {
        const button = document.getElementById(id);
        button.addEventListener('click', () => {
            clickBtn(button);
            sock.emit('turn', id);
        })
    });
}

const clickBtn = (btn) => {
    let rps = ['rock', 'paper', 'scissors'];

    if (!btn.classList.contains('active')) {
        const idx = rps.indexOf(btn.id);
            rps.splice(idx, 1);
            rps.forEach((id) => {
                document.getElementById(id).classList.remove('active');
            });
            btn.classList.add('active');
    }
}

const nextRound = () => {
    document.querySelector('.next-round-listener').classList.remove('underline');
    document.querySelector('#next-round').classList.remove('la-redo-alt');
    document.querySelector('#announcement').innerHTML = "";
    document.querySelector('.player-btns').classList.remove('player-loading');
    document.querySelector('.shoot-btns').classList.remove('choice-active');

    let el1 = document.querySelector('#p1-choice > i');
    let el2 = document.querySelector('#p2-choice > i');

    const prefix = "la-hand-";
    const classes1 = el1.className.split(" ").filter(c => !c.startsWith(prefix));
    const classes2 = el2.className.split(" ").filter(c => !c.startsWith(prefix));
    el1.className = classes1.join(" ").trim();
    el2.className = classes2.join(" ").trim();

    

    let rps = ['rock', 'paper', 'scissors'];
    rps.forEach((id) => {
        document.getElementById(id).classList.remove('active');
    });

    writeEvent("Select your move");
}

// writeEvent('Welcome to Rock, Paper, Scissors!');
sock.on('message', writeEvent);
sock.on('setEl', setElement);
sock.on('addPoint', addPoint);
sock.on('updateStreak', updateStreak);

sock.on('winMessage', (text, p1, p2) => {

    document.querySelector('#p1-choice > i').classList.add('la-hand-' + p1);
    document.querySelector('#p2-choice > i').classList.add('la-hand-' + p2);
    
    document.querySelector('.player-btns').classList.add('player-loading');
    document.querySelector('.shoot-btns').classList.add('choice-active');


    setTimeout(() => {
        document.querySelector('#announcement').innerHTML = text;
        document.querySelector('#message').innerHTML = "Next Round";
        document.querySelector('#next-round').classList.add('la-redo-alt');
        document.querySelector('.next-round-listener').classList.add('underline');
        document.querySelector('.next-round-listener').addEventListener('click', nextRound);
    }, 1000);
});

sock.on('gameStarts', () => {
    document.querySelector('.game-wrapper').classList.remove('player-loading');
    writeEvent("Select your move.");
})

// document.querySelector('#chat-form').addEventListener('submit', onChatSubmitted);
document.querySelector('#ready-form').addEventListener('submit', onReadySubmitted);

addButtonListeners();