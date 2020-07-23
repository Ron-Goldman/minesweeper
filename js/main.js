'use strict';

var BOMB_img = '<img src="img/bomb.jpg" />'
var FLAG_img = '<img src="img/flag.jpg" />'

var gBoard = createBoard(5, 5);
var gCell = {
    location: { i: null, j: null },
    minesAroundCount: 4,
    isShown: true,
    isMine: false,
    isMarked: true
}
var gCellsArray = [];
var gBombs = 0;


function init() {
    var gBoard = createBoard(5, 5);
    getRandomBomb(gBoard, 3)
    getMinesAround(gBoard)
    renderBoard(gBoard);


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
            var cellClass = '';
            if (cell.isMine === true) cellClass += ' img'; 
            if (cell.isShown) cellClass += ' selected'; 
            
            strHTML += `\t<td class="cell ${i}-${j}" onclick="cellClicked(this,${i},${j})" onmousedown="cellMarked(this,${i},${j})">\n`;
            if (board[i][j].isShown === false) 
            if (board[i][j].isMine === true) {

                gBombs++
            }
            if (board[i][j].minesAroundCount === 0) strHTML += ' ';
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

function cellClicked(elCell,i,j){
    var cell = gBoard[i][j];
    cell.isShown = true;

    if (cell.isMine === true) {
        elCell.innerHTML += BOMB_img; 
        alert('GAME-OVER')
        gameOver()
        return;
    }
     elCell.innerText = cell.minesAroundCount
      
}

function cellMarked(elCell,i,j){
    var cell = gBoard[i][j];
    console.log(elCell.type);
}