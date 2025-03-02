import { getCurrentScore ,updateBestScore} from "./score.js";

let gameOver = false; // **ゲームオーバー状態を管理**

export function checkGameOver(world, height) {
    if (gameOver) return; // **すでにゲームオーバーなら処理しない**

    for (let body of world.bodies) {
       
        // **動物が画面の下に落ちたらゲームオーバー**
        if (body.position.y > height) {
            gameOver = true;
            showGameOverScreen(world, height, "ゲームオーバー！動物が落ちました！");
            return;
        }
    }
}

export function showGameOverScreen(world, gameHeight, message) {
    // **score.js からスコアを取得**
    let scoreInMeters = getCurrentScore(world, gameHeight); // ✅ **正しいスコア取得関数を使用**
    let { isNewRecord, bestScore } = updateBestScore(scoreInMeters);
    // **新記録ならメッセージを追加**
    let recordMessage = isNewRecord ? `<p style="color: gold;">🎉 新記録！ 🎉</p>` : "";


    // **ゲームオーバー画面の作成**
    const gameOverDiv = document.createElement("div");
    gameOverDiv.id = "gameOverScreen";
    gameOverDiv.innerHTML = `
        <h2>${message}</h2>
        <p>最終スコア: <strong>${scoreInMeters}m</strong></p>
        <p>🏆 最高スコア: <strong>${bestScore}m</strong></p>
        ${recordMessage}
        <button id="restartBtn">リスタート</button>
    `;
    gameOverDiv.style.position = "fixed";
    gameOverDiv.style.top = "50%";
    gameOverDiv.style.left = "50%";
    gameOverDiv.style.transform = "translate(-50%, -50%)";
    gameOverDiv.style.padding = "20px";
    gameOverDiv.style.background = "rgba(0, 0, 0, 0.8)";
    gameOverDiv.style.color = "white";
    gameOverDiv.style.fontSize = "20px";
    gameOverDiv.style.borderRadius = "10px";
    gameOverDiv.style.textAlign = "center";
    gameOverDiv.style.zIndex = "1000";
    document.body.appendChild(gameOverDiv);

    // **リスタートボタンの処理**
    document.getElementById("restartBtn").addEventListener("click", () => {
        restartGame(world);
    });
}

// **ゲームをリスタート**
// ✅ **リスタート時は最高スコアを保持**
export function restartGame(world) {
    document.getElementById("gameOverScreen").remove();
    Matter.World.clear(world, true, true);
    location.reload(); // **ページリロード（最高スコアは localStorage に保存される）**
}