// Oyun değişkenleri
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('startButton');
const scoreText = document.getElementById('scoreText');

let gameLoop;
let score = 0;
let gameSpeed = 5;
let isGameRunning = false;

// Oyuncu arabası
const player = {
    x: canvas.width / 2 - 25,
    y: canvas.height - 100,
    width: 50,
    height: 80,
    speed: 5,
    color: '#E50000' // Toyota kırmızısı
};

// Engeller dizisi
let obstacles = [];

// Tuş kontrollerini takip etme
const keys = {
    ArrowLeft: false,
    ArrowRight: false
};

// Oyunu başlatma
function startGame() {
    if (isGameRunning) return;
    
    isGameRunning = true;
    score = 0;
    scoreText.textContent = score;
    obstacles = [];
    startButton.textContent = 'Yeniden Başlat';
    
    gameLoop = setInterval(update, 1000 / 60); // 60 FPS
}

// Oyunu güncelleme
function update() {
    // Canvas'ı temizle
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Yol çizgileri
    drawRoad();
    
    // Oyuncu hareketini güncelle
    if (keys.ArrowLeft && player.x > 0) {
        player.x -= player.speed;
    }
    if (keys.ArrowRight && player.x < canvas.width - player.width) {
        player.x += player.speed;
    }
    
    // Oyuncuyu çiz
    drawPlayer();
    
    // Engelleri yönet
    manageObstacles();
    
    // Çarpışma kontrolü
    checkCollisions();
    
    // Skoru güncelle
    score++;
    scoreText.textContent = score;
    
    // Oyun hızını artır
    if (score % 500 === 0) {
        gameSpeed += 0.5;
    }
}

// Yol çizgilerini çiz
function drawRoad() {
    // Yol şeritleri
    ctx.fillStyle = '#fff';
    for (let i = 0; i < canvas.height; i += 80) {
        ctx.fillRect(canvas.width / 2 - 2, i, 4, 40);
    }
}

// Oyuncuyu çiz
function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
    
    // Farlar
    ctx.fillStyle = '#ffff00';
    ctx.fillRect(player.x + 5, player.y, 10, 5);
    ctx.fillRect(player.x + player.width - 15, player.y, 10, 5);
}

// Engelleri yönet
function manageObstacles() {
    // Yeni engel ekleme
    if (Math.random() < 0.02) {
        const obstacle = {
            x: Math.random() * (canvas.width - 40),
            y: -50,
            width: 40,
            height: 60,
            color: '#333'
        };
        obstacles.push(obstacle);
    }
    
    // Engelleri güncelle ve çiz
    for (let i = obstacles.length - 1; i >= 0; i--) {
        const obs = obstacles[i];
        obs.y += gameSpeed;
        
        // Engeli çiz
        ctx.fillStyle = obs.color;
        ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
        
        // Ekrandan çıkan engelleri sil
        if (obs.y > canvas.height) {
            obstacles.splice(i, 1);
        }
    }
}

// Çarpışma kontrolü
function checkCollisions() {
    for (const obstacle of obstacles) {
        if (player.x < obstacle.x + obstacle.width &&
            player.x + player.width > obstacle.x &&
            player.y < obstacle.y + obstacle.height &&
            player.y + player.height > obstacle.y) {
            gameOver();
            return;
        }
    }
}

// Oyun sonu
function gameOver() {
    isGameRunning = false;
    clearInterval(gameLoop);
    startButton.textContent = 'Tekrar Oyna';
    
    // Game Over yazısı
    ctx.fillStyle = '#000';
    ctx.font = '48px Arial';
    ctx.fillText('Oyun Bitti!', canvas.width/2 - 100, canvas.height/2);
    ctx.font = '24px Arial';
    ctx.fillText('Skor: ' + score, canvas.width/2 - 50, canvas.height/2 + 40);
}

// Tuş olayları
document.addEventListener('keydown', (e) => {
    if (keys.hasOwnProperty(e.key)) {
        keys[e.key] = true;
    }
});

document.addEventListener('keyup', (e) => {
    if (keys.hasOwnProperty(e.key)) {
        keys[e.key] = false;
    }
});

// Başlat butonuna tıklama
startButton.addEventListener('click', startGame);
