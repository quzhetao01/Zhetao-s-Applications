let bombsArray = [];
let safeTiles = 0;
for (let i = 0; i < 10; i++) {
    let bombRow = [];
    for (let j = 0; j < 10; j++) {
        let x = Math.floor(Math.random() * 6)
        if (x === 0) {
            bombRow.push(1);
        }
        else {
            bombRow.push(0);
            safeTiles++
        }
    }
    bombsArray.push(bombRow);
}
   

function checkBomb(event) {
    if (event.button === 0) {
        let row = Number(event.target.id[0]);
        let col = Number(event.target.id[1]);
        if (!event.currentTarget.innerHTML) {
            if (bombsArray[row][col] === 1) {
                explosion.play();
                event.currentTarget.innerHTML = "<img src='/minesweeper/exploded.png'>";
                event.currentTarget.classList.add('exploded');
                loseGame();
            }
            else {
                let number = getNumber(row, col);
                event.currentTarget.innerHTML = `<span>${number.toString()}</span>`;
                event.currentTarget.classList.add('clicked');
                event.currentTarget.removeEventListener('mousedown', checkBomb)
                if (number === 0) {
                    spreadZero(row, col);
                }
            }
        }
    }
    manageFlag(event);
}

function spreadZero(row, col) {
    for (let i = row - 1; i < row + 2; i++) {
        for (let j = col - 1; j < col + 2; j++) {
            if (i === row && j === col) {
                continue;
            }
            if (i < 0 || i > 9 || j < 0 || j > 9) {
                continue;
            }
            let button = document.getElementById(i.toString() + j.toString());
            if (button.innerHTML) {
                continue;
            }
            console.log(i, j);
            let foo = getNumber(i, j);
            button.innerHTML = `<span>${foo.toString()}</span>`;
            button.classList.add('clicked');
            button.removeEventListener('mousedown', checkBomb)
            if (foo === 0) {
                spreadZero(i, j);
            }
        }
    }
}


function manageFlag(event) {
    if (event.button === 2) {
        if (!event.currentTarget.innerHTML) {
            event.currentTarget.innerHTML = "<img src='/minesweeper/redFlag.png'>";
        }
        else {
            event.currentTarget.innerHTML = '';
        }

    }
}

function getNumber(row, col) {
    let number = 0;
    for (let i = row - 1; i < row + 2; i++) {
        for (let j = col - 1; j < col + 2; j++) {
            if (i === row && j === col) {
                continue;
            }
            if (i < 0 || i > 9 || j < 0 || j > 9) {
                continue;
            }
            if (bombsArray[i][j] === 1) {
                number++;
            }
        }

    }
    return number;
}

function loseGame() {
    for (let button of buttons) {
        button.removeEventListener('mousedown', checkBomb)
    }
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            if (bombsArray[i][j]) {
                document.getElementById(i.toString() + j.toString()).innerHTML = "<img src='/minesweeper/bomb.png'>";
            }
        }
    }
    
}

const buttons = document.querySelectorAll('.game-button');
let explosion = new Audio('/minesweeper/explosion.wav');

// Main Code
buttons.forEach((button) => button.addEventListener('contextmenu', (e) => e.preventDefault()));
buttons.forEach((button) => button.addEventListener('mousedown', checkBomb))
// buttons.forEach((button) => button.addEventListener('mousedown', addFlag))
console.log(bombsArray);
