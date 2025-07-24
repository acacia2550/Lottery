function getRandomNumber(length) {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += Math.floor(Math.random() * 10);
  }
  return result;
}

function spinNumber(element, length, duration = 1500) {
  return new Promise((resolve) => {
    let interval;
    const start = Date.now();

    interval = setInterval(() => {
      element.textContent = getRandomNumber(length);
      if (Date.now() - start > duration) {
        clearInterval(interval);
        const final = getRandomNumber(length);
        element.textContent = final;
        resolve(final);
      }
    }, 50);
  });
}

function getNextRoundDate(current = new Date()) {
  const next = new Date(current);
  next.setDate(current.getDate() + 1); // หรือ +3 สำหรับทุก 3 วัน
  next.setHours(20, 0, 0, 0);
  return next.toLocaleString("th-TH", {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
}

// === Buy Numbers Logic ===
const buyData = {
  "2": [],
  "3": [],
  "4": []
};

document.getElementById("buyBtn").addEventListener("click", () => {
  const input2 = document.getElementById("buy2").value.trim();
  const input3 = document.getElementById("buy3").value.trim();
  const input4 = document.getElementById("buy4").value.trim();

  if (input2.match(/^\d{2}$/)) buyData["2"].push(input2);
  if (input3.match(/^\d{3}$/)) buyData["3"].push(input3);
  if (input4.match(/^\d{4}$/)) buyData["4"].push(input4);

  // เคลียร์ฟอร์ม
  document.getElementById("buy2").value = '';
  document.getElementById("buy3").value = '';
  document.getElementById("buy4").value = '';

  updateBuyList();
});

function updateBuyList() {
  const ul = document.querySelector("#buyList ul");
  ul.innerHTML = "";
  for (let len of ["2", "3", "4"]) {
    buyData[len].forEach(num => {
      const li = document.createElement("li");
      li.textContent = `ซื้อ ${len} ตัว: ${num}`;
      ul.appendChild(li);
    });
  }
}

document.getElementById("drawBtn").addEventListener("click", async () => {
  const prize2 = document.getElementById("prize2");
  const prize3 = document.getElementById("prize3");
  const prize4 = document.getElementById("prize4");

  const button = document.getElementById("drawBtn");
  button.disabled = true;
  button.textContent = "กำลังหมุน...";

  const p2 = await spinNumber(prize2, 2);
  const p3 = await spinNumber(prize3, 3);
  const p4 = await spinNumber(prize4, 4);

  const now = new Date().toLocaleString("th-TH");

  // ตรวจว่าถูกหรือไม่
  const won2 = buyData["2"].includes(p2);
  const won3 = buyData["3"].includes(p3);
  const won4 = buyData["4"].includes(p4);

  const resultText = `[${now}] ➤ 2 ตัว: ${p2} ${won2 ? "✅ ถูก!" : ""}
                       | 3 ตัว: ${p3} ${won3 ? "✅ ถูก!" : ""}
                       | 4 ตัว: ${p4} ${won4 ? "✅ ถูก!" : ""}`;

  const historyList = document.getElementById("historyList");
  const item = document.createElement("li");
  item.textContent = resultText;
  historyList.prepend(item);

  document.getElementById("nextRound").textContent = "งวดถัดไป: " + getNextRoundDate();

  button.disabled = false;
  button.textContent = "ออกรางวัล";
});

// เริ่มต้น
document.getElementById("nextRound").textContent = "งวดถัดไป: " + getNextRoundDate();
