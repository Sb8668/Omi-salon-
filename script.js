// 🔥 Firebase config (REPLACE THIS)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
firebase.auth().signInAnonymously();

// Elements
const timeSelect = document.getElementById("time");
const dateInput = document.getElementById("date");
const statusText = document.getElementById("status");

// Generate time slots
function loadSlots(date) {
  timeSelect.innerHTML = '<option value="">वेळ निवडा</option>';

  for (let h = 10; h < 21; h++) {
    ["00", "30"].forEach(m => {
      const time = `${String(h).padStart(2, "0")}:${m}`;
      const opt = document.createElement("option");
      opt.value = time;
      opt.innerText = time;
      timeSelect.appendChild(opt);
    });
  }
}

dateInput.addEventListener("change", () => {
  loadSlots(dateInput.value);
});

// Booking submit
document.getElementById("bookingForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const service = document.getElementById("service").value;
  const date = dateInput.value;
  const time = timeSelect.value;

  if (!date || !time) {
    statusText.innerText = "तारीख आणि वेळ निवडा";
    return;
  }

  const slotId = time.replace(":", "");
  const ref = db.collection(`bookings_${date}`).doc(slotId);

  const snap = await ref.get();
  if (snap.exists) {
    statusText.innerText = "हा स्लॉट आधीच बुक झाला आहे ❌";
    return;
  }

  await ref.set({
    name,
    phone,
    service,
    time,
    created: Date.now()
  });

  statusText.innerText = "बुकिंग यशस्वी झाली ✅";

  // WhatsApp redirect
  const msg = `नमस्कार OMI SALON,
नाव: ${name}
मोबाईल: ${phone}
तारीख: ${date}
वेळ: ${time}
सेवा: ${service}`;

  window.location.href =
    `https://wa.me/919145627957?text=${encodeURIComponent(msg)}`;
});
