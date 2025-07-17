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
  next.setDate(current.getDate() + 1); // หรือ +3 ถ้าอยากให้เป็นงวดถัดไปทุก 3 วัน
  next.setHours(20, 0, 0, 0); // เวลา 20:00
  return next.toLocaleString("th-TH", {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
}

document.getElementById("drawBtn").addEventListener("click", async () => {
  const prize2 = document.getElementById("prize2");
  const prize3 = document.getElementById("prize3");
  const prize4 = document.getElementById("prize4");

  // === Theme Toggle ===
const toggleBtn = document.getElementById("themeToggle");

// ตรวจสอบค่าที่เก็บไว้ใน localStorage
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark-mode");
  toggleBtn.textContent = "☀️";
}

// ปุ่มสลับโหมด
toggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  const isDark = document.body.classList.contains("dark-mode");
  toggleBtn.textContent = isDark ? "☀️" : "🌙";
  localStorage.setItem("theme", isDark ? "dark" : "light");
});

  // ล็อกปุ่ม
  const button = document.getElementById("drawBtn");
  button.disabled = true;
  button.textContent = "กำลังหมุน...";

  // หมุนทีละตัว
  const p2 = await spinNumber(prize2, 2);
  const p3 = await spinNumber(prize3, 3);
  const p4 = await spinNumber(prize4, 4);

  // เพิ่มลงในประวัติ
  const historyList = document.getElementById("historyList");
  const now = new Date().toLocaleString("th-TH");
  const item = document.createElement("li");
  item.textContent = `[${now}] 2 ตัว: ${p2}, 3 ตัว: ${p3}, 4 ตัว: ${p4}`;
  historyList.prepend(item);

  // แสดงงวดถัดไป
  document.getElementById("nextRound").textContent = "งวดถัดไป: " + getNextRoundDate();

  // ปลดล็อกปุ่ม
  button.disabled = false;
  button.textContent = "ออกรางวัล";
});

// เริ่มต้นแสดงงวดถัดไป
document.getElementById("nextRound").textContent = "งวดถัดไป: " + getNextRoundDate();
