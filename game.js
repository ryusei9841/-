import { setupLockScreen } from "./lock.js";
import { displayBestScore } from "./score.js"; 
import { checkGameOver } from "./gameOver.js";
import { updateScore } from "./score.js";
import { getAnimalBodyFromImage } from "./animals.js";

// **ゲームを開始する関数**
function startGame() {
    console.log("🎮 ゲームが開始されました！");
    displayBestScore();
}

// **暗証番号を設定**
const correctPin = "8989"; // 🔒 **好きな暗証番号に変更**
setupLockScreen(correctPin, startGame);

// Matter.js のエイリアス
const { Engine, Render, World, Bodies, Events } = Matter;

// エンジンとワールドを作成
const engine = Engine.create();
const world = engine.world;

// **キャンバス設定（スマホ対応）**
const canvas = document.getElementById("gameCanvas");
const width = window.innerWidth * 0.9;
const height = window.innerHeight * 0.6;
canvas.width = width;
canvas.height = height;

// Matter.js のレンダー設定
const render = Render.create({
    canvas: canvas,
    engine: engine,
    options: {
        width: width,
        height: height,
        wireframes: false,
        background: "#f0f8ff"
    }
});

// **地面と壁を追加（スマホサイズに適応）**
const ground = Bodies.rectangle(width / 2, height - 20, width - 200, 20, { isStatic: true });
const leftWall = Bodies.rectangle(-10, height / 2, 20, height, { isStatic: true });
const rightWall = Bodies.rectangle(width + 10, height / 2, 20, height, { isStatic: true });
World.add(world, [ground, leftWall, rightWall]);

// **スマホのタッチ操作をサポート（ボタン）**
function addTouchSupport(buttonId, callback) {
    const button = document.getElementById(buttonId);
    button.addEventListener("touchstart", (e) => {
        e.preventDefault(); // ✅ **タッチ時のスクロール防止**
        callback();
    });
    button.addEventListener("click", callback);
}

// **ボタンで位置調整**
addTouchSupport("leftBtn", () => {
    if (!isFalling && currentAnimal) {
        Matter.Body.setPosition(currentAnimal, { x: currentAnimal.position.x - 10, y: currentAnimal.position.y });
    }
});

addTouchSupport("rightBtn", () => {
    if (!isFalling && currentAnimal) {
        Matter.Body.setPosition(currentAnimal, { x: currentAnimal.position.x + 10, y: currentAnimal.position.y });
    }
});

addTouchSupport("rotateBtn", () => {
    if (!isFalling && currentAnimal) {
        Matter.Body.rotate(currentAnimal, Math.PI / 4);
    }
});

addTouchSupport("dropBtn", () => {
    if (!isFalling && currentAnimal) {
        Matter.Body.setStatic(currentAnimal, false);
        isFalling = true;
    }
});

// **状態管理用の変数**
let isFalling = false;
let currentAnimal = null;
let timer = null;
let waitingForNewAnimal = false; // ✅ **新しい動物を生成するフラグ**

// **動物のリスト（ランダム選択用）**
const animalList = ["normal", "kuribo", "jugemu"]; // ✅ **画像ファイル名と一致させる**

async function createNextAnimal() {
    updateScore(world, height);
    isFalling = false;
    waitingForNewAnimal = false; // ✅ **新しい動物の生成フラグをリセット**

    let x = width / 2;
    let y = 100;

    // **ランダムに動物を選択**
    let randomAnimal = animalList[Math.floor(Math.random() * animalList.length)];
    console.log("🐾 生成する動物:", randomAnimal);

    let body = await getAnimalBodyFromImage(x, y, `images/${randomAnimal}.png`);

    if (!body) {
        console.error("❌ 動物の生成に失敗しました！");
        return;
    }

    Matter.Body.setStatic(body, true);
    currentAnimal = body;
    Matter.Body.setPosition(currentAnimal, { x: x, y: y });
    World.add(world, currentAnimal);

    console.log("✅ 新しい動物が生成されました！", currentAnimal);
}

// **ボタンで位置調整**
document.getElementById("leftBtn").addEventListener("click", () => {
    if (!isFalling && currentAnimal) {
        Matter.Body.setPosition(currentAnimal, { x: currentAnimal.position.x - 10, y: currentAnimal.position.y });
    }
});

document.getElementById("rightBtn").addEventListener("click", () => {
    if (!isFalling && currentAnimal) {
        Matter.Body.setPosition(currentAnimal, { x: currentAnimal.position.x + 10, y: currentAnimal.position.y });
    }
});

document.getElementById("rotateBtn").addEventListener("click", () => {
    if (!isFalling && currentAnimal) {
        Matter.Body.rotate(currentAnimal, Math.PI / 4);
    }
});

// **落とすボタン**
document.getElementById("dropBtn").addEventListener("click", () => {
    if (!isFalling && currentAnimal) {
        console.log("📢 落とすボタンが押されました！");
        Matter.Body.setStatic(currentAnimal, false);
        isFalling = true;
        waitingForNewAnimal = false; // ✅ **次の動物を生成できるようにする**
    }
});

// **動物が静止したら新しい動物を生成**
Events.on(engine, "afterUpdate", () => {
    if (isFalling && currentAnimal && !waitingForNewAnimal) { // ✅ **フラグで制御**
        const speed = Math.sqrt(
            Math.pow(currentAnimal.velocity.x, 2) + Math.pow(currentAnimal.velocity.y, 2)
        );

        console.log(`🐾 動物の速度: ${speed}`);

        if (speed < 0.5) { 
            console.log("✅ 動物が静止しました！3秒後に次の動物を生成します...");
            waitingForNewAnimal = true; // ✅ **次の動物の生成を予約**
            
            clearTimeout(timer);
            timer = setTimeout(() => {
                checkGameOver(world, height); 
                createNextAnimal();
                console.log("🎉 新しい動物を生成しました！");
            }, 3000);
        }
    }
});

// **リスタートボタン**
document.getElementById("restart").addEventListener("click", () => {
    World.clear(world);
    World.add(world, [ground, leftWall, rightWall]); // ✅ **壁も追加する**
    isFalling = false;
    clearTimeout(timer);

    createNextAnimal(); // ✅ **restart でも createNextAnimal() を使う**
});

// **ゲーム開始**
Engine.run(engine);
Render.run(render);

// **最初の動物を生成**
createNextAnimal();
