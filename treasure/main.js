//Получение случайных значений
function getRandomNumber(size) {
	return Math.floor(Math.random() * size);
}

//Вычесление расстояния от клика до клада
function getDistance (event, target) {
	var diffX = event.offsetX - target.x;
	var diffY = event.offsetY - target.y;
	return Math.sqrt((diffX * diffX) + (diffY * diffY))
}

//Сообщение о близости к цели
function getDistanceHint (distance) {
	if(distance < 10) {
		return 'Обожжешься!';
	} else if (distance < 15) {
		return "Очень-очень горячо";
	} else if (distance < 20) {
		return "Очень горячо";
	} else if (distance < 40) {
		return "Горячо";
	} else if (distance < 60) {
		return "Жарко";
	} else if (distance < 80) {
		return "Тепло";
	} else if (distance < 160) {
		return "Холодно";
	} else if (distance < 240) {
		return "Очень холодно";
	} else if (distance < 320) {
		return "Очень-очень холодно";
	} else {
		return "Замерзнешь!";
	}
}
//Создание переменных
var width = 500;
var height = 500;
var clicks = 0;
var attempts = 25;

//Координаты клада
var target = {
	x: getRandomNumber(width),
	y: getRandomNumber(height)
};

//Обрабочтчик кликов
$('.map').click(function (event) {
	clicks++;
	if(clicks > attempts) {
		alert('КОНЕЦ ИГРЫ!')
		return;
	}
	//Вычесление расстояние от места клика до клада
	var distance = getDistance(event, target);
	// Подсказка о расстоянии
	var distanceHint = getDistanceHint(distance);
	$('.distance').text(distanceHint);
	$('.attempts').text('Осталось ' + (attempts - clicks) + ' попыток.')
	//Проверка на выигрыш
	if (distance < 8) {
		alert("Клад найден! Сделано кликов: " + clicks);
	}
})