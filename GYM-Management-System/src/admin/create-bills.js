import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
  import {
    getFirestore,
    collection,
    getDocs,
    addDoc,
    Timestamp
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

  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      window.location.href = "admin-login.html";
      return;
    }

    const membersSnap = await getDocs(collection(db, "members"));

    memberSelect.innerHTML = `
      <option value="">-- Select Member --</option>
      <option value="all">All Members</option>
    `;

    membersSnap.forEach(doc => {
      const data = doc.data();
      const option = document.createElement("option");
      option.value = doc.id;
      option.textContent = `${data.name} (${data.email})`;
      memberSelect.appendChild(option);
    });
  });

  async function createBill() {
    const memberId = memberSelect.value;
    const amount = parseFloat(document.getElementById("amount").value);
    const dueDate = document.getElementById("dueDate").value;
    const status = document.getElementById("status").value;

    msg.textContent = "";
    msg.className = "message";

    if (!memberId || !amount || !dueDate) {
      msg.textContent = "Please fill in all required fields.";
      msg.classList.add("error");
      return;
    }

    try {
      await addDoc(collection(db, "bills"), {
        memberId,
        amount,
        dueDate,
        status,
        createdAt: Timestamp.now()
      });

      msg.textContent = "Bill created successfully!";
      msg.classList.add("success");

      document.getElementById("amount").value = "";
      document.getElementById("dueDate").value = "";
      document.getElementById("status").value = "Unpaid";
      memberSelect.value = "";
    } catch (err) {
      console.error("Error:", err);
      msg.textContent = "Error creating bill.";
      msg.classList.add("error");
    }
  }

  window.createBill = createBill;
