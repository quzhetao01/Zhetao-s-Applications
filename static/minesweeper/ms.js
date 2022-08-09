let bombsArray = [];
for (let i = 0; i < 10; i++) {
    let bombRow = [];
    for (let j = 0; j < 10; j++) {
        let x = Math.floor(Math.random() * 5)
        if (x === 0) {
            bombRow.push(1);
        }
        else {
            bombRow.push(0);
        }
    }
    bombsArray.push(bombRow);
}
   

function checkBomb(event) {
    if (event.button === 0) {
        let row = event.target.id[0];
        let col = event.target.id[1];

        if (bombsArray[row][col] === 1) {
            alert('lose');
        }
    }
}

const buttons = document.querySelectorAll('.game-button');

// Main Code
buttons.forEach((button) => button.addEventListener('contextmenu', (e) => e.preventDefault()));
buttons.forEach((button) => button.addEventListener('mousedown', checkBomb))

// console.log(buttons);