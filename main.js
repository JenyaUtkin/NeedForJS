// Переменные

const score = document.querySelector('.score'),
    start = document.querySelector('.start'),
    gameArea = document.querySelector('.gameArea'),
    localStorage = document.querySelector('.local-storage'),
    car = document.createElement('div');

const audio = document.createElement('embed');

const keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowRight: false,
    ArrowLeft: false
};

const setting = {
    start: false,
    score: 0,
    speed: 3,
    traffic: 3,
    localStorage: 0
};

// Функции

function getQuantityElements(heightElement) {
    return document.documentElement.clientHeight / heightElement + 1;
}
function startGame() {
    start.classList.add('hide');
    gameArea.innerHTML = '';

    for (let i = 0; i < getQuantityElements(100); i++) {
        const line = document.createElement('div');
        line.classList.add('line');
        line.style.top = (i * 100) + 'px';
        line.y = i * 100;
        gameArea.append(line);
    }

    for (let i = 0; i < getQuantityElements(100 * setting.traffic); i++) {
        const enemy = document.createElement('div');
        enemy.classList.add('enemy');
        enemy.y = -100 * setting.traffic * (i + 1);
        enemy.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
        enemy.style.top = enemy.y + 'px';
        enemy.style.background = `transparent url(image/enemy${getRandomInt(3)}.png) center / cover no-repeat`;
        gameArea.append(enemy);
    }

    setting.score = 0;
    setting.start = true;
    gameArea.append(car);
    car.style.bottom = '10px';
    car.style.left = gameArea.offsetWidth / 2 - car.offsetWidth / 2;
    car.style.top = 'auto';
    document.body.append(audio);
    setting.x = car.offsetLeft; // css left
    setting.y = car.offsetTop;
    requestAnimationFrame(playGame);
}
function playGame() {
    if (setting.start) {
        setting.score++; // счет растет
        setting.speed += 0.0005; // скорость растет
        score.textContent = 'SCORE: ' + setting.score;
        moveRoad();
        moveEnemy();
        if (keys.ArrowLeft && setting.x > 0) {
            setting.x -= setting.speed;
        }
        if (keys.ArrowRight && setting.x < (gameArea.offsetWidth - car.offsetWidth)) {
            setting.x += setting.speed;
        }
        if (keys.ArrowUp && setting.y > 0) {
            setting.y -= setting.speed;
        }
        if (keys.ArrowDown && setting.y < (gameArea.offsetHeight - car.offsetHeight)) {
            setting.y += setting.speed;
        }

        car.style.left = setting.x + 'px';
        car.style.top = setting.y + 'px';

        requestAnimationFrame(playGame);
    }  
}
function startRun(event) {
    event.preventDefault();
    keys[event.key] = true;
}
function stopRun(event) {
    keys[event.key] = false;
}
function moveRoad() {
    let lines = document.querySelectorAll('.line');
    lines.forEach(function(item) { // метод перебора
        item.y += setting.speed; 
        item.style.top = item.y + 'px';

        if (item.y >= document.documentElement.clientHeight) {
            item.y = -100;
        }

    });
}
function moveEnemy() {  
    let enemy = document.querySelectorAll('.enemy');
    enemy.forEach(function(item) {
        let carRect = car.getBoundingClientRect();
        let enemyRect = item.getBoundingClientRect();

        if (carRect.top <= enemyRect.bottom && 
            carRect.right >= enemyRect.left && 
            carRect.left <= enemyRect.right && 
            carRect.bottom >= enemyRect.top) {
                setting.start = false;
                audio.remove();
                start.classList.remove('hide');
                if (setting.score > setting.localStorage) {
                    setting.localStorage = setting.score;
                }
                localStorage.textContent = 'Лучший счёт: ' + setting.localStorage;
                start.style.top = localStorage.offsetHeight + score.offsetHeight;
                score.style.top = localStorage.offsetHeight;
                
        }

        item.y += setting.speed / 2;
        item.style.top = item.y + 'px';
        if (item.y >= document.documentElement.clientHeight) {
            item.y = -100 * setting.traffic;
            item.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
        }
    });
}
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
} // возвращает рандомные целые числа от 1 до max (нужна для enemy)

// Обработчики событий

car.classList.add('car');

audio.src = 'audio.mp3';
audio.style.cssText = `position: absolute; top: -1000px;`;

start.addEventListener('click', startGame); // современнее on.click, можно обрабатывать сразу несколько событий, даже однотипных
document.addEventListener('keydown', startRun);
document.addEventListener('keyup', stopRun);