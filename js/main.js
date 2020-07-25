'use strict';

var BOMB_img = '<img class="bomb-img" src="img/bomb.jpg" />'
var FLAG_img = '<img src="img/flag.jpg" />'


var ROWS = 5;
var COLS = 5;
var gBombs = 3;
var gLevel = 1;
var gScore = 0;

var gBoard = createBoard(ROWS, COLS);
var gCell = {
    location: { i: null, j: null },
    minesAroundCount: 4,
    isShown: true,
    isMine: false,
    isMarked: true
}
var gCellsArray = [];
var gCellCount = 0;

var gGame = {
    isOn: true,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}


function init(ROWS, COLS, gBombs) {
    var elLost = document.querySelector('.modal h1')
    elLost.hidden = true;
    gScore = 0;
    renderModal()
    gGame.isOn = true;
    var gBoard = createBoard(ROWS, COLS);
    getRandomBomb(gBoard, gBombs)
    getMinesAround(gBoard)
    renderBoard(gBoard);

    //if (cellClicked(elCell,i,j)) gGame.isOn =true;
}



function createBoard(ROWS, COLS) {
    var board = []
    for (var i = 0; i < ROWS; i++) {
        var row = []
        for (var j = 0; j < COLS; j++) {
            var cell = {
                location: { i: i, j: j },
                minesAroundCount: 4,
                isShown: false,
                isMine: false,
                isMarked: false
            }
            row.push(cell)

        }
        board.push(row)
    }
    gCellCount = (ROWS * COLS) - gBombs
    return board;

}


//console.log(gBoard);
function renderBoard(board) {
    //var board = gBoard;
    var strHTML = '';
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>\n';

        for (var j = 0; j < board[0].length; j++) {

            var cell = board[i][j];


            strHTML += `\t<td class="box-game cell ${i}-${j}" onclick="cellClicked(this,${i},${j})" onmousedown="cellMarked(this,${i},${j})">\n`;
            // if (board[i][j].isShown === false)

            //if (board[i][j].minesAroundCount === 0) strHTML += ' ';
            //else if (board[i][j].isMine === false) strHTML += `${board[i][j].minesAroundCount}`
        }
        strHTML += '\t</td>\n';
    }
    strHTML += '</tr>\n';
    gCellsArray = copyMat(board)

    console.log('strHTML is:');
    console.log(strHTML);
    var elBoard = document.querySelector('.box-game');
    elBoard.innerHTML = strHTML;

    gBoard = board;
}


function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
}

//
function getRandomBomb(board, numOfBombs) {
    var randomBomb = [];
    for (var i = 0; i < numOfBombs; i++) {
        var num1 = getRandomIntInclusive(0, board.length - 1)
        var num2 = getRandomIntInclusive(0, board.length - 1)
        randomBomb.push(board[num1][num2].location)
        board[num1][num2].isMine = true;

    }

    console.log('the locations of the bombs: ', randomBomb);
    return randomBomb;
}


function countNeighbors(cellI, cellJ, board) {
    var neighborsSum = 0;
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue;
            if (j < 0 || j >= board[i].length) continue;
            if (board[i][j].isMine === true) {
                neighborsSum++;

            }
        }
    }
    return neighborsSum;
}

function getMinesAround(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            board[i][j].minesAroundCount = countNeighbors(i, j, board)
        }
    }
}


function cellClicked(elCell, i, j) {

    if (gGame.isOn === true) {
        var cell = gBoard[i][j];

        //console.log(cell.isShown);
        if (cell.isShown === true) return;


        if (cell.isMine === true) {
            elCell.innerHTML = BOMB_img;
            //revealBombs(elCell)
            elCell.classList.toggle('selected')

            gameOver(i, j)
            return;

        }


        else elCell.innerText = cell.minesAroundCount
        cell.isShown = true;
        elCell.classList.add('selected-cell')
        gScore++
        console.log('score is : ', gScore);
        renderModal()
        gCellCount -
            console.log(gCellCount);
        gameOver(i, j)
    }
}

function cellMarked(elCell, i, j) {

    if (gGame.isOn === true) {
        var cell = gBoard[i][j];
        if (cell.isShown === true || cell.isMarked === true) return;
        if (cell.isMine === true) {
            cell.isMine === false;

        }
        elCell.innerHTML += FLAG_img;
        cell.isMarked = true;
        gCellCount--


    }
}

function gameOver(i, j) {
    var cell = gBoard[i][j];
    console.log(gBombs);
    if (cell.isMine === true) {
        gGame.isOn = false;
        var elLost = document.querySelector('.modal h1')
        elLost.style.backgroundColor = "rgb(231, 67, 67)";
        elLost.innerText = 'YOU LOST!'
        elLost.hidden = false;
        return true;
        //init()
    }
    if (gCellCount === 0) {
        var elLost = document.querySelector('.modal h1')
        elLost.setAttribute()
        elLost.innerText = 'YOU WON!'
        elLost.hidden = false;
    }
}

for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard[i].length; j++) {

        gBoard[i][j].isShown = true;
        console.log(gBoard[i][j].isShown);

    }
}




function revealBombs() {

    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            if (gBoard[i][j].isMine === true) {
                var elCell = document.querySelector(`box-game cell ${i}-${j}`)
                elCell.innerHTML += BOMB_img;
            }
        }
    }
}

function renderModal() {
    var elModal = document.querySelector('.modal');
    elModal.querySelector('h2 span').innerText = `${gScore}`;
    elModal.querySelector('h3 span').innerText = 'fwef'
}

var totalSeconds = 0;
var totalMinutes = 0;
setInterval(setTime, 1000);

function setTime() {

    if ( totalSeconds <60){
        ++totalSeconds;
        console.log(totalSeconds);
        totalSeconds = 0;
    }

    if (totalSeconds === 59){ 
    ++totalMinutes
    console.log(totalMinutes);
}

return (console.log (totalMinutes , ':' , totalSeconds))

}

