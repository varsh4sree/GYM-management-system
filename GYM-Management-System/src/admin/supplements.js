import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
  import {
    getFirestore,
    collection,
    addDoc,
    getDocs
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
  const msg = document.getElementById("msg");
  const supplementList = document.getElementById("supplementList");

  document.getElementById("addBtn").addEventListener("click", addSupplement);

  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      window.location.href = "admin-login.html";
      return;
    }
    loadSupplements();
  });

  async function addSupplement() {
    const name = document.getElementById("name").value.trim();
    const price = document.getElementById("price").value.trim();
    const desc = document.getElementById("desc").value.trim();

    msg.textContent = "";
    msg.className = "message";

    if (!name || !price || !desc) {
      msg.textContent = "Please fill all fields.";
      msg.classList.add("error");
      return;
    }

    try {
      await addDoc(collection(db, "supplements"), {
        name,
        price: parseFloat(price),
        description: desc,
        createdAt: new Date().toISOString()
      });

      msg.textContent = " Supplement added!";
      msg.classList.add("success");

      document.getElementById("name").value = "";
      document.getElementById("price").value = "";
      document.getElementById("desc").value = "";

      loadSupplements();
    } catch (err) {
      console.error(err);
      msg.textContent = " Failed to add.";
      msg.classList.add("error");
    }
  }

  async function loadSupplements() {
    supplementList.innerHTML = "<p>Loading supplements...</p>";
    const snap = await getDocs(collection(db, "supplements"));
    supplementList.innerHTML = "";
    snap.forEach(doc => {
      const s = doc.data();
      const div = document.createElement("div");
      div.className = "item";
      div.innerHTML = `
        <h4>${s.name}</h4>
        <p><strong>₹${s.price}</strong> — ${s.description}</p>
      `;
      supplementList.appendChild(div);
    });
  }
