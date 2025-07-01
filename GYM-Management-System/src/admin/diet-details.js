import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
  import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    doc,
    getDoc
  } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

  import {
    getAuth,
    onAuthStateChanged
  } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

  const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const auth = getAuth(app);

  const memberSelect = document.getElementById("memberSelect");
  const msg = document.getElementById("msg");
  const dietList = document.getElementById("dietList");
  const assignBtn = document.getElementById("assignBtn");

  let memberMap = {}; // to store member ID → Name

  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      window.location.href = "admin-login.html";
      return;
    }

    const members = await getDocs(collection(db, "members"));
    memberSelect.innerHTML = '<option value="">-- Select Member --</option>';
    members.forEach(doc => {
      const data = doc.data();
      memberMap[doc.id] = data.name;
      const option = document.createElement("option");
      option.value = doc.id;
      option.textContent = `${data.name} (${data.email})`;
      memberSelect.appendChild(option);
    });

    loadDiets();
  });

  assignBtn.addEventListener("click", async () => {
    const memberId = memberSelect.value;
    const dietText = document.getElementById("dietPlan").value.trim();

    msg.textContent = "";
    msg.className = "message";

    if (!memberId || !dietText) {
      msg.textContent = "Please select a member and enter a diet plan.";
      msg.classList.add("error");
      return;
    }

    try {
      await addDoc(collection(db, "diets"), {
        memberId,
        plan: dietText,
        createdAt: new Date().toISOString()
      });

      msg.textContent = "✅ Diet assigned successfully!";
      msg.classList.add("success");
      document.getElementById("dietPlan").value = "";
      loadDiets();
    } catch (err) {
      console.error("Error assigning diet:", err);
      msg.textContent = "❌ Failed to assign diet: " + err.message;
      msg.classList.add("error");
    }
  });

  async function loadDiets() {
    dietList.innerHTML = "<p>Loading assigned diets...</p>";
    const snap = await getDocs(collection(db, "diets"));
    dietList.innerHTML = "";

    if (snap.empty) {
      dietList.innerHTML = "<p>No diets assigned yet.</p>";
      return;
    }

    snap.forEach(doc => {
      const data = doc.data();
      const div = document.createElement("div");
      div.className = "diet-card";
      const memberName = memberMap[data.memberId] || data.memberId;
      div.innerHTML = `
        <h4>${memberName}</h4>
        <p>${data.plan}</p>
      `;
      dietList.appendChild(div);
    });
  }
