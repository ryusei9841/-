export function updateScore(world, height) {
    let maxHeight = height; // **初期値は地面の高さ**

    // **すべての動物の中で最も高い位置を探す**
    for (let body of world.bodies) {
        if (!body.isStatic) { // **固定されていないオブジェクトのみ対象**
            if (body.position.y < maxHeight) {
                maxHeight = body.position.y;
            }
        }
    }

    // **地面との差分を計算し、スコア（m単位）に変換**
    let scoreInMeters = ((height - maxHeight) / 100).toFixed(1); // **100px = 1m**
    document.getElementById("score").innerText = `高さ: ${scoreInMeters}m`;
}

export function getCurrentScore(world, gameHeight) {
    let maxHeight = gameHeight;

    // **エンジンのワールドから動物を取得**
    world.bodies.forEach(body => {
        if (!body.isStatic && body.position.y < maxHeight) {
            maxHeight = body.position.y;
        }
    });

    return ((gameHeight - maxHeight) / 100).toFixed(1); // **100px = 1m**
}

// **ベストスコアを保存 & 取得**
export function updateBestScore(newScore) {
    let bestScore = localStorage.getItem("bestScore");

    if (bestScore === null || parseFloat(newScore) > parseFloat(bestScore)) {
        localStorage.setItem("bestScore", newScore);
        return { isNewRecord: true, bestScore: newScore };
    }

    return { isNewRecord: false, bestScore: bestScore };
}

// **ベストスコアを表示**
export function displayBestScore() {
    let bestScore = localStorage.getItem("bestScore") || "0.0";
    document.getElementById("bestScore").innerText = `🏆 最高スコア: ${bestScore}m`;
}