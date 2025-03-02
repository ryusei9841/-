export function setupLockScreen(correctPin, callback) {
    // 🔒 **すでに認証済みならロック画面をスキップ**
    if (sessionStorage.getItem("isAuthenticated") === "true") {
        document.getElementById("lockScreen").style.display = "none";
        document.getElementById("gameContainer").style.display = "block";
        callback();
        return;
    }

    document.getElementById("unlockBtn").addEventListener("click", () => {
        const enteredPin = document.getElementById("pinInput").value;
        if (enteredPin === correctPin) {
            sessionStorage.setItem("isAuthenticated", "true"); // ✅ **認証状態を保存**
            document.getElementById("lockScreen").style.display = "none";
            document.getElementById("gameContainer").style.display = "block";
            callback();
        } else {
            document.getElementById("errorMsg").style.display = "block"; // ❌ **エラーメッセージ表示**
        }
    });
}
