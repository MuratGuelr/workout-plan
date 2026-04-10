// ============================================
// app.js - FitTrack Pro Ana Uygulama
// ============================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// ============================================
// 🔥 FIREBASE CONFIG
// ============================================
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// ============================================
// 📋 ANTRENMAN VERİSİ
// WORKOUT_DATA'ya asla doğrudan yazma - readonly kaynak
// ============================================
const WORKOUT_DATA = [
  {
    id: "day1",
    name: "1. Gün – Üst Vücut",
    shortName: "Üst Vücut",
    scheduledDays: [1, 3],
    xpReward: 80,
    exercises: [
      {
        id: "warmup-jump-1",
        name: "Jumping Jacks",
        sets: "2 x 30sn",
        category: "Isınma",
        gif: "/jump.gif",
      },
      {
        id: "shoulder-press",
        name: "Dumbbell Shoulder Press",
        sets: "3 x 10",
        category: "Ana Antrenman",
        gif: "/seated.gif",
      },
      {
        id: "bent-row",
        name: "Dumbbell Bent Over Row",
        sets: "3 x 10",
        category: "Ana Antrenman",
        gif: "/bent.webp",
      },
      {
        id: "incline-push",
        name: "Incline Push-Up",
        sets: "3 x 8-10",
        category: "Ana Antrenman",
        gif: "/incline.gif",
      },
      {
        id: "biceps-curl",
        name: "Dumbbell Biceps Curl",
        sets: "2 x 12",
        category: "Ana Antrenman",
        gif: "/dumbell-biceps.gif",
      },
      {
        id: "triceps-ext",
        name: "Overhead Triceps Extension",
        sets: "2 x 12",
        category: "Ana Antrenman",
        gif: "/overhead.gif",
      },
      {
        id: "plank-1",
        name: "Plank",
        sets: "2 x 30sn",
        category: "Ana Antrenman",
        gif: "/plank.gif",
      },
    ],
  },
  {
    id: "day2",
    name: "2. Gün – Alt Vücut",
    shortName: "Alt Vücut",
    scheduledDays: [2, 5],
    xpReward: 80,
    exercises: [
      {
        id: "warmup-jump-2",
        name: "Jumping Jacks",
        sets: "2 x 30sn",
        category: "Isınma",
        gif: "/jump.gif",
      },
      {
        id: "bw-squat",
        name: "Bodyweight Squat",
        sets: "3 x 12",
        category: "Ana Antrenman",
        gif: "/bodyweight.gif",
      },
      {
        id: "calf-raise",
        name: "Standing Dumbbell Calf Raise",
        sets: "3 x 15",
        category: "Ana Antrenman",
        gif: "/calf.gif",
      },
      {
        id: "goblet-squat",
        name: "Dumbbell Goblet Squat",
        sets: "3 x 10",
        category: "Ana Antrenman",
        gif: "/goblet.gif",
      },
      {
        id: "mekik",
        name: "Mekik",
        sets: "2 x 20",
        category: "Ana Antrenman",
        gif: "/mekik.gif",
      },
    ],
  },
  {
    id: "day3",
    name: "3. Gün – Üst Vücut B",
    shortName: "Üst Vücut B",
    scheduledDays: [6],
    xpReward: 80,
    exercises: [
      {
        id: "warmup-jump-3",
        name: "Jumping Jacks",
        sets: "2 x 30sn",
        category: "Isınma",
        gif: "/jump.gif",
      },
      {
        id: "shoulder-press-b",
        name: "Dumbbell Shoulder Press",
        sets: "3 x 10",
        category: "Ana Antrenman",
        gif: "/seated.gif",
      },
      {
        id: "bent-row-b",
        name: "Dumbbell Bent Over Row",
        sets: "3 x 10",
        category: "Ana Antrenman",
        gif: "/bent.webp",
      },
      {
        id: "incline-push-b",
        name: "Incline Push-Up",
        sets: "3 x 8-10",
        category: "Ana Antrenman",
        gif: "/incline.gif",
      },
      {
        id: "biceps-curl-b",
        name: "Dumbbell Biceps Curl",
        sets: "2 x 12",
        category: "Ana Antrenman",
        gif: "/dumbell-biceps.gif",
      },
      {
        id: "triceps-ext-b",
        name: "Overhead Triceps Extension",
        sets: "2 x 12",
        category: "Ana Antrenman",
        gif: "/overhead.gif",
      },
      {
        id: "plank-2",
        name: "Plank",
        sets: "2 x 30sn",
        category: "Ana Antrenman",
        gif: "/plank.gif",
      },
    ],
  },
];

// ============================================
// 🏆 BAŞARIMLAR
// ============================================
const ACHIEVEMENTS = [
  {
    id: "first_workout",
    name: "İlk Adım",
    desc: "İlk antrenmana başla",
    icon: "🚀",
    check: (s) => s.totalWorkouts >= 1,
  },
  {
    id: "three_streak",
    name: "Ateş Hattı",
    desc: "3 antrenman günü üst üste",
    icon: "🔥",
    check: (s) => s.currentStreak >= 3,
  },
  {
    id: "week_warrior",
    name: "Hafta Savaşçısı",
    desc: "7 antrenman günü üst üste",
    icon: "⚔️",
    check: (s) => s.currentStreak >= 7,
  },
  {
    id: "ten_workouts",
    name: "Düzenli Sporcu",
    desc: "10 antrenman tamamla",
    icon: "💪",
    check: (s) => s.totalWorkouts >= 10,
  },
  {
    id: "level5",
    name: "Acemi Değil",
    desc: "5. seviyeye ulaş",
    icon: "⭐",
    // BUG FIX: s.level yoktu, calcLevel kullan
    check: (s) => calcLevel(s.totalXP).level >= 5,
  },
  {
    id: "xp500",
    name: "XP Avcısı",
    desc: "500 XP kazan",
    icon: "⚡",
    check: (s) => s.totalXP >= 500,
  },
  {
    id: "month_warrior",
    name: "Ay Şampiyonu",
    desc: "30 antrenman günü üst üste",
    icon: "🏆",
    check: (s) => s.currentStreak >= 30,
  },
  {
    id: "xp1000",
    name: "Elite",
    desc: "1000 XP kazan",
    icon: "👑",
    check: (s) => s.totalXP >= 1000,
  },
];

// ============================================
// 📊 XP & LEVEL
// ============================================
function calcLevel(xp) {
  let level = 1;
  let required = 100;
  let accumulated = 0;
  while (xp >= accumulated + required) {
    accumulated += required;
    required = Math.floor(required * 1.5);
    level++;
  }
  const currentXP = xp - accumulated;
  const progress = Math.round((currentXP / required) * 100);
  return { level, currentXP, required, progress };
}

// ============================================
// 🗓️ GÜN YARDIMCILARI
// ============================================
function getTodayStr() {
  // toISOString UTC döner - locale bazlı yapalım
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function getTodayDayIndex() {
  return new Date().getDay();
}

function getDateStr(date) {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function getYesterdayStr() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return getDateStr(d);
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Günaydın ☀️";
  if (h < 18) return "İyi Günler 🌤️";
  return "İyi Akşamlar 🌙";
}

// Programa göre bu günden sonraki en yakın antrenman gününü bul
// Streak için: kullanıcının programında art arda antrenman günleri arası
// rest day'ler hesaba katılmalı
function getScheduledDaysBefore(targetDateStr, userSchedule) {
  // userSchedule'daki tüm scheduledDay index'lerini topla
  const allScheduledDayIndices = new Set();
  Object.values(userSchedule || {}).forEach((days) => {
    days.forEach((d) => allScheduledDayIndices.add(d));
  });
  return allScheduledDayIndices;
}

// İki tarih arasındaki antrenman günü sayısını hesapla (streak için)
function getWorkoutDaysBetween(fromStr, toStr, userSchedule) {
  const allScheduledDays = new Set();
  Object.values(userSchedule || {}).forEach((days) => {
    days.forEach((d) => allScheduledDays.add(d));
  });

  const from = new Date(fromStr + "T00:00:00");
  const to = new Date(toStr + "T00:00:00");
  let count = 0;
  const cur = new Date(from);
  cur.setDate(cur.getDate() + 1); // from'dan sonraki gün

  while (cur < to) {
    if (allScheduledDays.has(cur.getDay())) count++;
    cur.setDate(cur.getDate() + 1);
  }
  return count;
}

// ============================================
// 🏗️ ANA APP
// ============================================
const App = (() => {
  let db = null;
  let userId = null;

  // Default state - Firebase'den merge edilecek
  const DEFAULT_STATE = {
    totalXP: 0,
    currentStreak: 0,
    bestStreak: 0,
    totalWorkouts: 0,
    lastWorkoutDate: null,
    completedDates: [],
    achievements: [],
    // BUG FIX: todayProgress artık { date: "2025-01-15", progress: { "day1": [...] } }
    todayProgressDate: null,
    todayProgress: {},
    userSchedule: null,
    globalSetOverride: null,
    displayName: "",
    photoURL: "",
  };

  let userState = { ...DEFAULT_STATE };

  // Runtime state (Firebase'e kaydedilmez)
  let currentWorkoutId = null;
  let currentExerciseIndex = 0;
  let workoutStartTime = null;
  let activeTimer = null;
  let modalCallback = null;

  // ============================================================
  // BUGÜN'E AİT PROGRESS'İ DÖNDÜR (tarih kontrolü ile)
  // ============================================================
  function getTodayProgress() {
    const today = getTodayStr();
    // Eğer kayıtlı progress başka güne aitse sıfırla
    if (userState.todayProgressDate !== today) {
      return {};
    }
    return userState.todayProgress || {};
  }

  function setTodayProgress(newProgress) {
    userState.todayProgressDate = getTodayStr();
    userState.todayProgress = newProgress;
  }

  // ============================================================
  // SCHEDULE'A GÖRE BUGÜNÜN ANTRENMANINI BUL
  // ============================================================
  function getTodayWorkout() {
    const day = getTodayDayIndex();
    const schedule = userState.userSchedule || {};
    const workoutId = Object.keys(schedule).find((id) =>
      schedule[id].includes(day)
    );
    if (workoutId) {
      return WORKOUT_DATA.find((w) => w.id === workoutId) || null;
    }
    return null;
  }

  // Set sayısını override ile birleştir (WORKOUT_DATA'yı mutate etmeden)
  function getEffectiveSets(originalSets) {
    const override = userState.globalSetOverride;
    if (!override) return originalSets;
    // "3 x 10" → "2 x 10" (sadece set sayısını değiştir)
    if (originalSets.includes("x")) {
      const parts = originalSets.split("x");
      return `${override} x ${parts[1].trim()}`;
    }
    // "2 x 30sn" gibi
    if (originalSets.includes("x")) {
      const parts = originalSets.split("x");
      return `${override} x ${parts[1].trim()}`;
    }
    return originalSets;
  }

  // ============================================================
  // INIT
  // ============================================================
  async function init() {
    document.getElementById("greeting-text").textContent = getGreeting();

    const firebaseApp = initializeApp(firebaseConfig);
    db = getFirestore(firebaseApp);
    const auth = getAuth(firebaseApp);
    const googleProvider = new GoogleAuthProvider();

    onAuthStateChanged(auth, async (user) => {
      if (user) {
        userId = user.uid;
        document.getElementById("login-screen").classList.add("hidden");
        document.querySelector(".app-wrapper").style.display = "block";
        await loadUserData(user);

        if (!userState.userSchedule) {
          renderScheduleSetup();
        } else {
          render();
        }
        hideLoading();
      } else {
        hideLoading();
        document.getElementById("login-screen").classList.remove("hidden");
        document.querySelector(".app-wrapper").style.display = "none";
      }
    });

    document
      .getElementById("google-login-btn")
      .addEventListener("click", async () => {
        try {
          await signInWithPopup(auth, googleProvider);
        } catch (error) {
          console.error("Login Error:", error);
          showToast("Giriş başarısız oldu.", "error");
        }
      });
  }

  // ============================================================
  // VERİ YÜKLEME & KAYDETME
  // ============================================================
  async function loadUserData(user) {
    try {
      const ref = doc(db, "users", userId);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        // Mevcut default state üzerine merge et
        userState = { ...DEFAULT_STATE, ...snap.data() };
        checkStreakIntegrity();
      } else {
        userState.displayName = user.displayName || "Sporcu";
        userState.photoURL = user.photoURL || "";
        await saveUserData();
      }

      const nameEl = document.querySelector(".username");
      if (nameEl) {
        const firstName = user.displayName
          ? user.displayName.split(" ")[0]
          : "Sporcu";
        nameEl.textContent = `${firstName} 👋`;
      }
    } catch (e) {
      console.error("Veri yükleme hatası:", e);
      showToast("Veriler yüklenemedi, offline moddasın.", "warning");
    }
  }

  async function saveUserData() {
    if (!userId) return;
    try {
      await setDoc(doc(db, "users", userId), userState, { merge: true });
    } catch (e) {
      console.error("Kaydetme hatası:", e);
    }
  }

  // ============================================================
  // STREAK KONTROLÜ
  // BUG FIX: Rest day'ler streak'i kırmasın
  // ============================================================
  function checkStreakIntegrity() {
    const today = getTodayStr();
    const last = userState.lastWorkoutDate;
    if (!last || last === today) return;

    const schedule = userState.userSchedule || {};

    // Son antrenman ile bugün arasında kaç antrenman günü var?
    // Eğer 0 ise (arası sadece rest day'ler) streak bozulmaz
    const missedWorkoutDays = getWorkoutDaysBetween(last, today, schedule);

    if (missedWorkoutDays > 0) {
      // Araya girilmesi gereken antrenman günleri atlandı - streak sıfırla
      userState.currentStreak = 0;
    }
    // missedWorkoutDays === 0 ise sadece rest day'ler geçmiş, streak korunur
  }

  // ============================================================
  // SCHEDULE SETUP
  // ============================================================
  function renderScheduleSetup() {
    document.querySelector(".app-wrapper").style.display = "none";

    // Zaten varsa kaldır
    const existing = document.getElementById("schedule-setup");
    if (existing) existing.remove();

    const setupDiv = document.createElement("div");
    setupDiv.id = "schedule-setup";
    setupDiv.className = "setup-screen";

    setupDiv.innerHTML = `
      <div class="setup-box">
        <h2>🗓️ Programını Ayarla</h2>
        <p>Hangi günler hangi antrenmanı yapacağını seç. Bir güne birden fazla antrenman atama.</p>
        <div class="setup-list">
          ${WORKOUT_DATA.map(
            (w) => `
            <div class="setup-item" data-id="${w.id}">
              <div class="setup-item-name">${w.name}</div>
              <div class="day-picker">
                ${[
                  { n: "Pzt", v: 1 },
                  { n: "Sal", v: 2 },
                  { n: "Çar", v: 3 },
                  { n: "Per", v: 4 },
                  { n: "Cum", v: 5 },
                  { n: "Cmt", v: 6 },
                  { n: "Paz", v: 0 },
                ]
                  .map(
                    (d) => `
                  <button class="day-btn" data-day="${d.v}" 
                    onclick="this.classList.toggle('selected')">${d.n}</button>
                `
                  )
                  .join("")}
              </div>
            </div>
          `
          ).join("")}
        </div>
        <button class="primary-btn" onclick="App.saveSchedule()">Programı Kaydet ✓</button>
      </div>
    `;

    document.body.appendChild(setupDiv);
  }

  async function saveSchedule() {
    const items = document.querySelectorAll(".setup-item");
    const schedule = {};

    items.forEach((item) => {
      const id = item.dataset.id;
      const selected = Array.from(
        item.querySelectorAll(".day-btn.selected")
      ).map((btn) => parseInt(btn.dataset.day));
      schedule[id] = selected;
    });

    // Validasyon: en az 1 gün seçilmeli
    const totalDays = Object.values(schedule).flat().length;
    if (totalDays === 0) {
      showToast("En az bir gün seçmen lazım! 📅", "error");
      return;
    }

    userState.userSchedule = schedule;
    await saveUserData();

    document.getElementById("schedule-setup").remove();
    document.querySelector(".app-wrapper").style.display = "block";
    render();
    showToast("Program kaydedildi! 💪", "success");
  }

  // ============================================================
  // TIMER
  // ============================================================
  function startExerciseSession(exId, type) {
    const workout = getTodayWorkout();
    if (!workout) return;
    const exercise = workout.exercises.find((e) => e.id === exId);
    if (!exercise) return;

    if (type === "rep") {
      const effectiveSets = getEffectiveSets(exercise.sets);
      const defaultRep = effectiveSets.match(/\d+/)
        ? effectiveSets.match(/\d+/)[0]
        : "10";

      openInputModal(
        "Hedef Tekrar",
        `"${exercise.name}" için set sayısını girin`,
        defaultRep,
        async (val) => {
          const numVal = parseInt(val);
          if (isNaN(numVal) || numVal < 1) {
            showToast("Geçerli bir sayı gir!", "error");
            return;
          }
          userState.globalSetOverride = String(numVal);
          await saveUserData();
          render();
          showToast(`Tüm hareketler ${numVal} set olarak güncellendi ⚡`, "success");
        }
      );
      return;
    }

    // Timer modu
    const effectiveSets = getEffectiveSets(exercise.sets);
    let seconds = 30;
    const match = effectiveSets.match(/(\d+)\s*sn/);
    if (match) seconds = parseInt(match[1]);

    openTimerModal(exercise, seconds);
  }

  function openTimerModal(exercise, seconds) {
    const modal = document.getElementById("timer-modal");
    const gif = document.getElementById("timer-gif");
    const name = document.getElementById("timer-ex-name");
    const sets = document.getElementById("timer-ex-sets");
    const count = document.getElementById("timer-countdown");
    const progress = document.getElementById("timer-progress");

    name.textContent = exercise.name;
    sets.textContent = getEffectiveSets(exercise.sets);
    gif.src = exercise.gif;
    count.textContent = seconds;

    // BUG FIX: r=45, viewBox 0 0 100 100 → circumference = 2*PI*45 = 282.74
    const circumference = 2 * Math.PI * 45;
    progress.style.strokeDasharray = circumference;
    progress.style.strokeDashoffset = 0;

    modal.classList.remove("hidden");
    runCountdown(seconds, circumference);
  }

  function runCountdown(total, circumference) {
    if (activeTimer) clearInterval(activeTimer);

    let current = total;
    const count = document.getElementById("timer-countdown");
    const progress = document.getElementById("timer-progress");

    activeTimer = setInterval(() => {
      current--;
      count.textContent = current;

      // Offset: 0 = tam dolu, circumference = boş
      const offset = circumference * (1 - current / total);
      progress.style.strokeDashoffset = offset;

      if (current <= 0) {
        stopTimer();
        showToast("⏱️ Süre bitti! Harika iş! 🔥", "success");
      }
    }, 1000);
  }

  function stopTimer() {
    if (activeTimer) clearInterval(activeTimer);
    activeTimer = null;
    document.getElementById("timer-modal").classList.add("hidden");
  }

  // ============================================================
  // INPUT MODAL
  // ============================================================
  function openInputModal(title, sub, defaultValue, callback) {
    const modal = document.getElementById("input-modal");
    document.getElementById("input-modal-title").textContent = title;
    document.getElementById("input-modal-sub").textContent = sub;
    const input = document.getElementById("modal-input-field");
    input.value = defaultValue;
    modalCallback = callback;

    modal.classList.remove("hidden");
    setTimeout(() => {
      input.focus();
      input.select();
    }, 100);

    document.getElementById("modal-submit-btn").onclick = () => {
      if (input.value.trim() && modalCallback) {
        modalCallback(input.value.trim());
        closeInputModal();
      }
    };

    // Enter ile submit
    input.onkeydown = (e) => {
      if (e.key === "Enter") {
        document.getElementById("modal-submit-btn").click();
      }
    };
  }

  function closeInputModal() {
    document.getElementById("input-modal").classList.add("hidden");
    modalCallback = null;
  }

  // ============================================================
  // GLOBAL SETTINGS
  // ============================================================
  function openGlobalSettings() {
    openInputModal(
      "Set Sayısı Ayarla",
      "Tüm hareketlerin set sayısını değiştir (örn: 2)",
      userState.globalSetOverride || "3",
      async (val) => {
        const numVal = parseInt(val);
        if (isNaN(numVal) || numVal < 1 || numVal > 10) {
          showToast("1 ile 10 arasında bir sayı gir!", "error");
          return;
        }
        userState.globalSetOverride = String(numVal);
        await saveUserData();
        render();
        showToast(`Tüm hareketler ${numVal} set! ⚡`, "success");
      }
    );
  }

  // ============================================================
  // RENDER
  // ============================================================
  function render() {
    renderHeader();
    renderTodayPage();
    // Stats sayfası sadece aktifse render et
    const statsPage = document.getElementById("page-stats");
    if (statsPage && statsPage.classList.contains("active")) {
      renderStatsPage();
    }
  }

  function renderHeader() {
    document.getElementById("header-xp").textContent = userState.totalXP;
    document.getElementById("header-streak").textContent =
      userState.currentStreak;
  }

  function renderTodayPage() {
    renderTodayBanner();
    renderStreakWarning();
    renderWorkoutQueue();
    renderAllDays();
  }

  // --- Today Banner ---
  function renderTodayBanner() {
    const wrap = document.getElementById("today-banner-wrap");
    const todayWorkout = getTodayWorkout();

    if (!todayWorkout) {
      wrap.innerHTML = `
        <div class="rest-day-banner">
          <div class="rest-day-emoji">🧘</div>
          <div class="rest-day-title">Dinlenme Günü</div>
          <div class="rest-day-sub">Bugün dinlen, kasların büyüsün.<br/>Yarın sert geri dön! 💪</div>
        </div>`;
      return;
    }

    const todayProgress = getTodayProgress();
    const doneCount = (todayProgress[todayWorkout.id] || []).length;
    const total = todayWorkout.exercises.length;

    wrap.innerHTML = `
      <div class="today-banner">
        <div class="today-banner-header">
          <div class="today-label">📅 BUGÜNÜN ANTRENMANI</div>
          <button class="global-settings-btn" onclick="App.openGlobalSettings()" title="Set Ayarları">
            <span class="material-symbols-outlined">settings</span>
          </button>
        </div>
        <div class="today-day-name">${todayWorkout.name}</div>
        <div class="today-progress-wrap">
          <div class="segmented-progress">
            ${todayWorkout.exercises
              .map(
                (_, i) => `
              <div class="progress-segment ${i < doneCount ? "active" : ""}"></div>
            `
              )
              .join("")}
          </div>
          <div class="today-progress-text">${doneCount} / ${total} hareket tamamlandı</div>
        </div>
      </div>`;
  }

  // --- Streak Warning ---
  function renderStreakWarning() {
    const wrap = document.getElementById("streak-warning-wrap");
    wrap.innerHTML = "";

    if (userState.currentStreak === 0) return;

    const today = getTodayStr();
    const last = userState.lastWorkoutDate;

    if (last === today) return; // Bugün yapıldı, uyarı gerekmez

    const yesterday = getYesterdayStr();
    if (last === yesterday) {
      wrap.innerHTML = `
        <div class="streak-warning">
          <div class="streak-warning-icon">⚠️</div>
          <div class="streak-warning-text">
            <strong>Streakini kaybetme!</strong>
            <span>${userState.currentStreak} günlük serini korumak için bugün antrenman yap.</span>
          </div>
        </div>`;
    }
  }

  // --- Workout Queue ---
  function renderWorkoutQueue() {
    const wrap = document.getElementById("workout-queue");
    const label = document.getElementById("queue-label");
    const todayWorkout = getTodayWorkout();

    if (!todayWorkout) {
      wrap.innerHTML = "";
      label.style.display = "none";
      return;
    }

    const today = getTodayStr();
    const todayProgress = getTodayProgress();
    const allDone = todayWorkout.exercises.every((ex) =>
      (todayProgress[todayWorkout.id] || []).includes(ex.id)
    );

    if (userState.lastWorkoutDate === today && allDone) {
      label.style.display = "block";
      label.textContent = "BUGÜNKÜ ANTRENMAN ✅";
      wrap.innerHTML = renderCompleteCard(todayWorkout);
      return;
    }

    label.style.display = "block";
    label.textContent = "ŞİMDİ YAPIYORUZ";
    currentWorkoutId = todayWorkout.id;
    currentExerciseIndex = getFirstUndoneIndex(todayWorkout);

    renderQueue(todayWorkout);
  }

  function renderQueue(workout) {
    const wrap = document.getElementById("workout-queue");
    const exercises = workout.exercises;
    const idx = currentExerciseIndex;

    if (idx >= exercises.length) {
      wrap.innerHTML = renderCompleteCard(workout);
      return;
    }

    const current = exercises[idx];
    const next = exercises[idx + 1] || null;
    const prev = idx > 0 ? exercises[idx - 1] : null;

    const effectiveCurrentSets = getEffectiveSets(current.sets);

    let html = "";

    if (prev) {
      html += `
        <button class="undo-btn" onclick="App.undoExercise('${workout.id}', '${prev.id}')">
          <span class="material-symbols-outlined">undo</span>
          Geri Al (${prev.name})
        </button>`;
    }

    html += `
      <div class="current-exercise-card">
        <div class="current-exercise-label">⚡ ŞU ANKİ HAREKET</div>
        <div class="current-exercise-body">
          <img src="${current.gif}" alt="${current.name}" 
               class="current-exercise-gif" 
               onerror="this.style.background='#1a1a24';this.style.display='flex'" />
          <div class="current-exercise-info">
            <div class="current-exercise-name">${current.name}</div>
            <div class="current-exercise-sets">${effectiveCurrentSets}</div>
            <div class="current-exercise-category">${current.category}</div>
          </div>
        </div>
        <div class="exercise-actions">
          <button class="action-btn timer-btn" onclick="App.startSession('${current.id}', 'sec')">
            <span class="material-symbols-outlined">timer</span> Timer
          </button>
          <button class="action-btn rep-btn" onclick="App.startSession('${current.id}', 'rep')">
            <span class="material-symbols-outlined">reorder</span> Set Ayarla
          </button>
        </div>
        <button class="done-btn" onclick="App.markExerciseDone('${workout.id}', '${current.id}')">
          <span class="material-symbols-outlined" style="font-size:20px;font-variation-settings:'FILL' 1">check_circle</span>
          Tamamladım!
        </button>
      </div>`;

    if (next) {
      const effectiveNextSets = getEffectiveSets(next.sets);
      html += `
        <div class="next-exercise-card">
          <div>
            <div class="next-label">Sıradaki</div>
            <div class="next-exercise-name">${next.name}</div>
            <div class="next-exercise-sets">${effectiveNextSets}</div>
          </div>
          <img src="${next.gif}" alt="${next.name}" class="next-exercise-gif" />
        </div>`;
    }

    wrap.innerHTML = html;
  }

  function renderCompleteCard(workout) {
    const elapsed = workoutStartTime
      ? Math.round((Date.now() - workoutStartTime) / 60000)
      : 0;

    return `
      <div class="workout-complete-card">
        <div class="complete-emoji">🎉</div>
        <div class="complete-title">Harika İş!</div>
        <div class="complete-sub">Bugünün antrenmanını tamamladın.</div>
        <div class="complete-stats">
          <div class="complete-stat">
            <div class="complete-stat-value">${workout.exercises.length}</div>
            <div class="complete-stat-label">Hareket</div>
          </div>
          ${
            elapsed > 0
              ? `<div class="complete-stat">
              <div class="complete-stat-value">${elapsed}</div>
              <div class="complete-stat-label">Dakika</div>
            </div>`
              : ""
          }
          <div class="complete-stat">
            <div class="complete-stat-value">+${workout.xpReward}</div>
            <div class="complete-stat-label">XP</div>
          </div>
        </div>
        <div class="xp-gained-badge">⚡ +${workout.xpReward} XP Kazandın!</div>
      </div>`;
  }

  // --- Tüm Günler ---
  function renderAllDays() {
    const container = document.getElementById("all-days");
    const todayWorkout = getTodayWorkout();
    const schedule = userState.userSchedule || {};
    const todayProgress = getTodayProgress();

    container.innerHTML = WORKOUT_DATA.map((workout) => {
      const userDays = schedule[workout.id] || [];
      if (userDays.length === 0) return ""; // Programa eklenmemiş

      const isToday = todayWorkout && todayWorkout.id === workout.id;
      const doneCount = (todayProgress[workout.id] || []).length;
      const total = workout.exercises.length;
      const isDone = isToday && doneCount === total;
      const dayNames = getDayNamesStr(userDays);

      return `
        <div class="day-card ${isToday ? "is-today" : ""}" id="daycard-${workout.id}">
          <div class="day-card-header" onclick="App.toggleDayCard('${workout.id}')">
            <div class="day-card-left">
              <div class="day-number-badge ${isToday ? "today" : ""}">
                ${isToday ? "📍" : workout.exercises.length}
              </div>
              <div>
                <div class="day-card-name">${workout.name}</div>
                <div class="day-card-sub">${dayNames} • ${total} hareket</div>
              </div>
            </div>
            <div class="day-card-right">
              ${
                isToday
                  ? `<span class="day-done-badge ${isDone ? "done" : "pending"}">
                    ${isDone ? "✅ Tamam" : `${doneCount}/${total}`}
                   </span>`
                  : ""
              }
              <span class="material-symbols-outlined day-chevron">expand_more</span>
            </div>
          </div>
          <div class="day-exercises" id="dayex-${workout.id}">
            <div class="day-exercises-inner">
              ${workout.exercises
                .map((ex) => {
                  const done = isToday
                    ? (todayProgress[workout.id] || []).includes(ex.id)
                    : false;
                  const effectiveSets = getEffectiveSets(ex.sets);
                  return `
                  <div class="exercise-list-item">
                    <img src="${ex.gif}" alt="${ex.name}" class="exercise-list-gif" />
                    <div style="flex:1">
                      <div class="exercise-list-name" 
                           style="${done ? "text-decoration:line-through;opacity:0.5" : ""}">
                        ${ex.name}
                      </div>
                      <div class="exercise-list-sets">${effectiveSets} • ${ex.category}</div>
                    </div>
                    <span class="material-symbols-outlined exercise-list-check ${done ? "done" : ""}"
                      style="font-variation-settings:'FILL' ${done ? 1 : 0}">
                      ${done ? "check_circle" : "radio_button_unchecked"}
                    </span>
                  </div>`;
                })
                .join("")}
            </div>
          </div>
        </div>`;
    }).join("");
  }

  // --- Stats ---
  function renderStatsPage() {
    const lvl = calcLevel(userState.totalXP);
    document.getElementById("stats-level").textContent = `Lv. ${lvl.level}`;
    document.getElementById("stats-level-bar").style.width = `${lvl.progress}%`;
    document.getElementById(
      "stats-level-sub"
    ).textContent = `${lvl.currentXP} / ${lvl.required} XP`;

    document.getElementById("stat-xp").textContent = userState.totalXP;
    document.getElementById("stat-streak").textContent =
      userState.currentStreak;
    document.getElementById("stat-workouts").textContent =
      userState.totalWorkouts;
    document.getElementById("stat-best-streak").textContent =
      userState.bestStreak;

    renderAchievements();
  }

  function renderAchievements() {
    const grid = document.getElementById("achievements-grid");
    grid.innerHTML = ACHIEVEMENTS.map((ach) => {
      const unlocked = userState.achievements.includes(ach.id);
      return `
        <div class="achievement-card ${unlocked ? "unlocked" : ""}">
          <span class="achievement-icon">${ach.icon}</span>
          <div class="achievement-name">${ach.name}</div>
          <div class="achievement-desc">${ach.desc}</div>
        </div>`;
    }).join("");
  }

  // ============================================================
  // HAREKET TAMAMLAMA
  // ============================================================
  async function markExerciseDone(workoutId, exerciseId) {
    const workout = WORKOUT_DATA.find((w) => w.id === workoutId);
    if (!workout) return;

    if (!workoutStartTime) workoutStartTime = Date.now();

    // Bugünün progress'ini al (tarih kontrolü dahil)
    const todayProgress = getTodayProgress();

    if (!todayProgress[workoutId]) {
      todayProgress[workoutId] = [];
    }

    // Zaten tamamlandıysa bir daha ekleme
    if (todayProgress[workoutId].includes(exerciseId)) return;

    todayProgress[workoutId].push(exerciseId);
    setTodayProgress(todayProgress);

    showToast("✅ Hareket tamamlandı!", "success");

    currentExerciseIndex = getFirstUndoneIndex(workout);

    const allDone = workout.exercises.every((ex) =>
      todayProgress[workoutId].includes(ex.id)
    );

    if (allDone) {
      await handleWorkoutComplete(workout);
    } else {
      renderQueue(workout);
      renderTodayBanner();
      renderAllDays();
      // Async kayıt (UI'ı bloklamadan)
      saveUserData();
    }
  }

  // BUG FIX: Undo ayrı fonksiyon - sadece son hareketi geri al
  async function undoExercise(workoutId, exerciseId) {
    const workout = WORKOUT_DATA.find((w) => w.id === workoutId);
    if (!workout) return;

    const todayProgress = getTodayProgress();
    if (!todayProgress[workoutId]) return;

    const index = todayProgress[workoutId].indexOf(exerciseId);
    if (index === -1) return;

    todayProgress[workoutId].splice(index, 1);
    setTodayProgress(todayProgress);

    currentExerciseIndex = getFirstUndoneIndex(workout);

    showToast("↩️ Geri alındı", "warning");
    renderQueue(workout);
    renderTodayBanner();
    renderAllDays();
    saveUserData();
  }

  async function handleWorkoutComplete(workout) {
    const today = getTodayStr();

    // Aynı gün tekrar tetiklenmesin
    if (userState.lastWorkoutDate === today) {
      renderWorkoutQueue();
      render();
      return;
    }

    const yesterday = getYesterdayStr();
    const prevDate = userState.lastWorkoutDate;
    const schedule = userState.userSchedule || {};

    // Streak güncelle (rest day'e duyarsız)
    if (!prevDate) {
      userState.currentStreak = 1;
    } else {
      // Son antrenmandan bu yana kaç antrenman günü atlandı?
      const missed = getWorkoutDaysBetween(prevDate, today, schedule);
      if (missed === 0) {
        // Sadece rest day'ler geçmiş - streak devam
        userState.currentStreak += 1;
      } else if (prevDate === yesterday || missed === 0) {
        userState.currentStreak += 1;
      } else {
        // Antrenman günü atlandı
        userState.currentStreak = 1;
      }
    }

    if (userState.currentStreak > userState.bestStreak) {
      userState.bestStreak = userState.currentStreak;
    }

    const oldXP = userState.totalXP;
    const oldLevel = calcLevel(oldXP).level;

    userState.totalXP += workout.xpReward;
    userState.totalWorkouts += 1;
    userState.lastWorkoutDate = today;

    if (!userState.completedDates.includes(today)) {
      userState.completedDates.push(today);
    }

    const newLevel = calcLevel(userState.totalXP).level;
    const newAchievements = checkAchievements();

    await saveUserData();
    render();

    if (newLevel > oldLevel) {
      setTimeout(() => showLevelUpModal(newLevel), 600);
    } else {
      showToast(
        `🎉 Antrenman tamam! +${workout.xpReward} XP! 🔥 ${userState.currentStreak} gün streak!`,
        "xp"
      );
    }

    newAchievements.forEach((ach, i) => {
      setTimeout(() => {
        showToast(`🏆 "${ach.name}" başarımı açıldı!`, "warning");
      }, 1500 + i * 900);
    });

    launchConfetti();
  }

  function checkAchievements() {
    const newlyUnlocked = [];
    ACHIEVEMENTS.forEach((ach) => {
      if (
        !userState.achievements.includes(ach.id) &&
        ach.check(userState)
      ) {
        userState.achievements.push(ach.id);
        newlyUnlocked.push(ach);
      }
    });
    return newlyUnlocked;
  }

  // ============================================================
  // YARDIMCILER
  // ============================================================
  function getFirstUndoneIndex(workout) {
    const todayProgress = getTodayProgress();
    const done = todayProgress[workout.id] || [];
    const idx = workout.exercises.findIndex((ex) => !done.includes(ex.id));
    return idx === -1 ? workout.exercises.length : idx;
  }

  function getDayNamesStr(dayIndices) {
    const names = ["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"];
    return dayIndices.map((d) => names[d]).join(" & ");
  }

  // ============================================================
  // NAVIGASYON
  // ============================================================
  function navigate(page, btn) {
    document
      .querySelectorAll(".page")
      .forEach((p) => p.classList.remove("active"));
    document
      .querySelectorAll(".nav-btn")
      .forEach((b) => b.classList.remove("active"));
    document.getElementById(`page-${page}`).classList.add("active");
    btn.classList.add("active");

    if (page === "stats") renderStatsPage();
  }

  function toggleDayCard(workoutId) {
    const card = document.getElementById(`daycard-${workoutId}`);
    if (card) card.classList.toggle("expanded");
  }

  // ============================================================
  // TOAST
  // ============================================================
  function showToast(msg, type = "success") {
    const container = document.getElementById("toast-container");
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.textContent = msg;
    container.appendChild(toast);
    setTimeout(() => {
      if (toast.parentNode) toast.remove();
    }, 3100);
  }

  // ============================================================
  // LEVEL UP MODAL
  // ============================================================
  function showLevelUpModal(level) {
    const msgs = {
      2: "Harika başlangıç!",
      3: "Momentum kazanıyorsun!",
      5: "Artık acemi değilsin!",
      10: "Efsane oluyorsun!",
    };
    document.getElementById(
      "levelup-title"
    ).textContent = `⬆️ Seviye ${level}!`;
    document.getElementById("levelup-sub").textContent =
      msgs[level] || `${level}. seviyeye ulaştın. Devam et!`;
    document.getElementById("levelup-modal").classList.remove("hidden");
    launchConfetti(60);
  }

  function closeModal() {
    document.getElementById("levelup-modal").classList.add("hidden");
  }

  // ============================================================
  // LOADING
  // ============================================================
  function hideLoading() {
    const screen = document.getElementById("loading-screen");
    if (!screen) return;
    screen.classList.add("hidden");
    setTimeout(() => {
      if (screen.parentNode) screen.remove();
    }, 500);
  }

  // ============================================================
  // CONFETTİ
  // ============================================================
  function launchConfetti(count = 40) {
    const colors = ["#00f5d4", "#ff007f", "#ffd700", "#a855f7", "#10b981"];
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        const piece = document.createElement("div");
        piece.className = "confetti-piece";
        const duration = 1.5 + Math.random() * 2;
        piece.style.cssText = `
          left: ${Math.random() * 100}vw;
          background: ${colors[Math.floor(Math.random() * colors.length)]};
          animation-duration: ${duration}s;
          animation-delay: ${Math.random() * 0.3}s;
          transform: rotate(${Math.random() * 360}deg);
          width: ${6 + Math.random() * 8}px;
          height: ${6 + Math.random() * 8}px;
          border-radius: ${Math.random() > 0.5 ? "50%" : "2px"};
        `;
        document.body.appendChild(piece);
        setTimeout(() => {
          if (piece.parentNode) piece.remove();
        }, duration * 1000 + 500);
      }, i * 25);
    }
  }

  // Public API
  return {
    init,
    navigate,
    toggleDayCard,
    markExerciseDone,
    undoExercise,
    closeModal,
    startSession: startExerciseSession,
    saveSchedule,
    stopTimer,
    closeInputModal,
    openGlobalSettings,
  };
})();

window.App = App;
App.init();