// Настройка холста
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

// Получение ширины и высоты элемента canvas
var width = canvas.width;
var height = canvas.height;

// Вычисление ширины и высоты в ячейках
var blockSize = 10;
var widthInBlocks = width / blockSize;
var heightInBlocks = height / blockSize;

// Устанавливаем счет 0
var score = 0;

// Цвета
var colors = [
	"Yellow",
	"Green",
	"Black"
]

// Изображение рамки
var drawBorder = function () {
	ctx.fillStyle = "Gray";
	ctx.fillRect(0, 0, width, blockSize);
	ctx.fillRect(0, height - blockSize, width, blockSize);
	ctx.fillRect(0, 0, blockSize, height);
	ctx.fillRect(width - blockSize, 0, blockSize, height);
};

// Вывод счета
var drawScore = function () {
	ctx.font = "20px Courier";
	ctx.fillStyle = "Black";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Счет: " + score, blockSize, blockSize);
};

// Конец игры
var gameOver = function () {
	play = false;
	ctx.font = "60px Courier";
	ctx.fillStyle = "Black";
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.fillText("Конец игры", width / 2, height / 2);
};

// Изображение круга
var circle = function (x, y, radius, fillCircle) {
	ctx.beginPath();
	ctx.arc(x, y, radius, 0, Math.PI * 2, false);
	if (fillCircle) {
		ctx.fill();
	} else {
		ctx.stroke();
	}
};

// Конструктор Block
var Block = function (col, row) {
	this.col = col;
	this.row = row;
};

// Изображение квадрата в позиции ячейки
Block.prototype.drawSquare = function (color) {
	var x = this.col * blockSize;
	var y = this.row * blockSize;
	ctx.fillStyle = color;
	ctx.fillRect(x, y, blockSize, blockSize);
};

// Изображение круга в позиции ячейки
Block.prototype.drawCircle = function (color) {
	var centerX = this.col * blockSize + blockSize / 2;
	var centerY = this.row * blockSize + blockSize / 2;
	ctx.fillStyle = color;
	circle(centerX, centerY, blockSize / 2, true);
};

// Проверка на сповпадение позиций
Block.prototype.equal = function (otherBlock) {
	return this.col === otherBlock.col && this.row === otherBlock.row;
};

// Конструктор Snake
var Snake = function () {
	this.segments = [
		new Block(7, 5),
		new Block(6, 5),
		new Block(5, 5)
	];
	this.direction = "right";
	this.nextDirection = "right";
};

// Изображение каждого сегмента тела змейки
Snake.prototype.draw = function () {
	for (var i = 1; i < this.segments.length; i++) {
		this.segments[0].drawSquare(colors[0]);
		if (i % 2) {
			this.segments[i].drawSquare(colors[2]);
		} else {
			this.segments[i].drawSquare(colors[1]);
		}	
	}
};

// Создание нового сегмента в начале змеи для передвижения
Snake.prototype.move = function () {
	var head = this.segments[0];
	var newHead;
	this.direction = this.nextDirection;
	if (this.direction === "right") {
		newHead = new Block(head.col + 1, head.row);
	} else if (this.direction === "down") {
		newHead = new Block(head.col, head.row + 1);
	} else if (this.direction === "left") {
		newHead = new Block(head.col - 1, head.row);
	} else if (this.direction === "up") {
		newHead = new Block(head.col, head.row - 1);
	}
	if (this.checkCollision(newHead)) {
		gameOver();
		return;
	}
	this.segments.unshift(newHead);
	if (newHead.equal(apple.position)) {
		score++;
		animationTime -= 5;
		apple.move(this.segments);
	} else {
		this.segments.pop();
	}
};

// Проверка на столкновение
Snake.prototype.checkCollision = function (head) {
	var leftCollision = (head.col === 0);
	var topCollision = (head.row === 0);
	var rightCollision = (head.col === widthInBlocks - 1);
	var bottomCollision = (head.row === heightInBlocks - 1);
	var wallCollision = leftCollision || topCollision || rightCollision || bottomCollision;
	var selfCollision = false;
	for (var i = 0; i < this.segments.length; i++) {
		if (head.equal(this.segments[i])) {
			selfCollision = true;
		}
	}
	return wallCollision || selfCollision;
};

// Новое направление на основе нажатой клавиши
Snake.prototype.setDirection = function (newDirection) {
	if (this.direction === "up" && newDirection === "down") {
		return;
	} else if (this.direction === "right" && newDirection === "left") {
		return;
	} else if (this.direction === "down" && newDirection === "up") {
		return;
	} else if (this.direction === "left" && newDirection === "right") {
		return;
	}
	this.nextDirection = newDirection;
};

// Конструктор Apple
var Apple = function () {
	this.position = new Block(10, 10);
};

// Изображение яблока
Apple.prototype.draw = function () {
	this.position.drawCircle("LimeGreen");
};

// Перемещение яблока
Apple.prototype.move = function (occupiedBlocks) {
	var randomCol = Math.floor(Math.random() * (widthInBlocks - 2)) + 1;
	var randomRow = Math.floor(Math.random() * (heightInBlocks - 2)) + 1;
	this.position = new Block(randomCol, randomRow);

//Проверка совпадения позиции яблока и тела змейки
	var index = occupiedBlocks.length - 1;
	while ( index >= 0 ) {
		if (this.position.equal(occupiedBlocks[index])) {
			this.move(occupiedBlocks); // Вызываем метод move повторно
			return;
		}
		index--;
	}
};

// Создание объекта-змейки и объекта-яблока
var snake = new Snake();
var apple = new Apple();

var animationTime = 100;
var play = true;

// Запуск анимации
var gameLoop = function () {
	ctx.clearRect(0, 0, width, height);
	drawScore();
	snake.move();
	snake.draw();
	apple.draw();
	drawBorder();

	if (play) {
		setTimeout(gameLoop, animationTime);
	}
	
};

// Преобразование клавиш в направления
var directions = {
	37: "left",
	38: "up",
	39: "right",
	40: "down"
};

// Обработчик события
$("body").keydown(function (event) {
	var newDirection = directions[event.keyCode];
	if (newDirection !== undefined) {
		snake.setDirection(newDirection);
	}
});

gameLoop();