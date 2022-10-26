'use strict';
const dlina = 3; // длина очереди ходов (очереди массивов old_x, old_y)

// массивы old_x и old_y хранят позиции фигуры: текущая(там где фигура),
//                                прошлые (зеленые), последняя (затереть)
//   нулевой индекс - то что затереть, текущая позиция с индексом dlina-1
const old_x = [];   // предыдущие значения x
const old_y = [];   // предыдущие значения y

let correct = [];   // массив возможных ходов для фигуры, формах XY
let newFig = true;  // выбрана новая фигура которой еще нет на доске
let choice = '';    // текущий выбор фигуры
let board = {};     // selectAll для всех клеток доски

// массив ссылок - ID фигур на соответствующие им функции
const figureIdMap = {
  'knight': knight,
  'bishop': bishop,
  'rook': rook,
  'queen': queen,
};

// позиция где был нажат курсор
let x = 0;
let y = 0;
// временные переменные для циклов и т.д.
let i = 0;
let k = 0;
let m = 0;
let out = ''; // для рисования доски

// очистка всех клеток шахматной доски кроме oldpos
function clear() {
  correct = [];
  board.forEach(element => {
    element.classList.remove(
      'move',
      'figure',
      'knight',
      'bishop',
      'rook',
      'queen',
    );
  });
}

// очистка всех клеток шахматной доски
function clearAll() {
  clear();
  board.forEach(element => {
    element.classList.remove('oldpos');
  });
}

// функция обрабатывающая нажатие любой шахматной клетки
// function onFieldClick() {
//     figureIdMap[choice]();
// }

// навели мышь на пункт меню
function onMenu() {
  if (this.id !== choice) {
    this.classList.add('on');
  }
}

// убрали мышь с пункта меню
function offMenu() {
  if (this.id !== choice) {
    this.classList.remove('on');
  }
}

// нажали на фигуру в меню (выбрали)
function downMenu() {
  clearAll();
  newFig = true;
  // убираем предыдущий выбор меню
  if (choice) {
    document.querySelector(`#${choice}`).classList.remove('on');
  }
  choice = this.id;
  document.querySelector(`#${choice}`).classList.add('on');
  // ставим обработчики в каждую шахматную клетку
  board.forEach(element => {
    element.onclick = figureIdMap[choice];
  });
}

// отображаем ход для фигуры по координатам х,y если он возможен
function move(x, y) {
  if (x >= 0 && x < 8 && y >= 0 && y < 8) {
    document.querySelector(`[data-x="${x}"][data-y="${y}"]`).classList.add('move'); return true;
  } else {
    return false;
  }
}

// обрабатываем очередь ходов, отображаем позицию с которой мы уходим и удаляем такую
//                                                                   предыдущую позицию
function oldPos() {
  // сохраняем нажатую клетку
  x = +this.dataset.x;
  y = +this.dataset.y;
  const xy = `${x}${y}`; // текущая позиция для определения корректности хода
  if (newFig) {
    // есть ли фигура на шахматной доске?
    newFig = false; // фигуры не было на доске
  } else {
    // фигура на доске была
    // если ход корректный то добавляем зеленым предыдущую позицию фигуры
    // если ход некорректный - выходим из функции и ничего не делаем
    if (correct.indexOf(xy) !== -1) {
      // корректный ход?
      i = old_x.length - 1;
      document
        .querySelector(`[data-x="${old_x[i]}"][data-y="${old_y[i]}"]`)
        .classList.add('oldpos');
    } else {
      return false; // ход не корректный
    }
  }
  clear();
  // сохраняем текущую позицию в очередь ходов
  old_x.push(x);
  old_y.push(y);
  // если очередь заполнилась то удаляем устаревшую позицию фигуры (убираем зеленое)
  if (old_x.length === dlina) {
    document
      .querySelector(`[data-x="${old_x.shift()}"][data-y="${old_y.shift()}"]`)
      .classList.remove('oldpos');
  }
  return true;
}

function knight() {
  if (oldPos.call(this)) {
    // выводим фигуру в "нажатую" клетку
    document
      .querySelector(`[data-x="${x}"][data-y="${y}"]`)
      .classList.add('figure', 'knight');
    // выводим возможные ходы для фигуры
    if (move(x - 2, y - 1)) correct.push(`${x - 2}${y - 1}`);
    if (move(x - 2, y + 1)) correct.push(`${x - 2}${y + 1}`);
    if (move(x - 1, y - 2)) correct.push(`${x - 1}${y - 2}`);
    if (move(x - 1, y + 2)) correct.push(`${x - 1}${y + 2}`);
    if (move(x + 1, y - 2)) correct.push(`${x + 1}${y - 2}`);
    if (move(x + 1, y + 2)) correct.push(`${x + 1}${y + 2}`);
    if (move(x + 2, y - 1)) correct.push(`${x + 2}${y - 1}`);
    if (move(x + 2, y + 1)) correct.push(`${x + 2}${y + 1}`);
  }
}

function bishop() {
  if (oldPos.call(this)) {
    // выводим фигуру в "нажатую" клетку
    document
      .querySelector(`[data-x="${x}"][data-y="${y}"]`)
      .classList.add('figure', 'bishop');
    // выводим возможные ходы для фигуры
    for (i = 1; i < 8; i++) {
      if (move(x - i, y - i)) correct.push(`${x - i}${y - i}`);
      if (move(x - i, y + i)) correct.push(`${x - i}${y + i}`);
      if (move(x + i, y - i)) correct.push(`${x + i}${y - i}`);
      if (move(x + i, y + i)) correct.push(`${x + i}${y + i}`);
    }
  }
}

function rook() {
  if (oldPos.call(this)) {
    // выводим фигуру в "нажатую" клетку
    document
      .querySelector(`[data-x="${x}"][data-y="${y}"]`)
      .classList.add('figure', 'rook');
    // выводим возможные ходы для фигуры
    for (i = 1; i < 8; i++) {
      if (move(x - i, y)) correct.push(`${x - i}${y}`);
      if (move(x + i, y)) correct.push(`${x + i}${y}`);
      if (move(x, y - i)) correct.push(`${x}${y - i}`);
      if (move(x, y + i)) correct.push(`${x}${y + i}`);
    }
  }
}

function queen() {
  if (oldPos.call(this)) {
    // выводим фигуру в "нажатую" клетку
    document
      .querySelector(`[data-x="${x}"][data-y="${y}"]`)
      .classList.add('figure', 'queen');
    // выводим возможные ходы для фигуры
    for (i = 1; i < 8; i++) {
      if (move(x - i, y - i)) correct.push(`${x - i}${y - i}`);
      if (move(x - i, y + i)) correct.push(`${x - i}${y + i}`);
      if (move(x + i, y - i)) correct.push(`${x + i}${y - i}`);
      if (move(x + i, y + i)) correct.push(`${x + i}${y + i}`);
      if (move(x - i, y)) correct.push(`${x - i}${y}`);
      if (move(x + i, y)) correct.push(`${x + i}${y}`);
      if (move(x, y - i)) correct.push(`${x}${y - i}`);
      if (move(x, y + i)) correct.push(`${x}${y + i}`);
    }
  }
}

// Здесь начинается исполняемый код
// --------------------------------

// рисуем доску
for (i = 0; i < 8; i++) {
  for (k = 0; k < 8; k++) {
    if (m % 2) {
      out += `<div class="chess-block bg-black" data-x="${k}" data-y="${i}"></div>`;
    } else {
      out += `<div class="chess-block" data-x="${k}" data-y="${i}"></div>`;
    }
    m++;
  }
  m++;
}
document.querySelector('#board').innerHTML = out;
board = document.querySelectorAll('.chess-block');

// ставим обработчики на меню
document.querySelectorAll('.button').forEach(element => {
  element.addEventListener('mouseover', onMenu);
  element.addEventListener('mouseout', offMenu);
  element.addEventListener('click', downMenu);
});
