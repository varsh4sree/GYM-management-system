import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
  import {
    getFirestore,
    collection,
    getDocs,
    addDoc
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

  const msgBox = document.getElementById("msgInput");
  const status = document.getElementById("status");
  const recipientSelect = document.getElementById("recipient");

  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      window.location.href = "admin-login.html";
      return;
    }

    const snap = await getDocs(collection(db, "members"));
    recipientSelect.innerHTML = `
      <option value="">-- Select Member --</option>
      <option value="all">All Members</option>
    `;
    snap.forEach(doc => {
      const d = doc.data();
      const opt = document.createElement("option");
      opt.value = doc.id;
      opt.textContent = `${d.name} (${d.email})`;
      recipientSelect.appendChild(opt);
    });
  });

  async function send() {
    const recipient = recipientSelect.value;
    const message = msgBox.value.trim();

    status.textContent = "";
    status.className = "msg";

    if (!recipient || !message) {
      status.textContent = "Please select a recipient and enter a message.";
      status.classList.add("error");
      return;
    }

    const data = {
      title: "Monthly Notification",
      message: message,
      type: "monthly",
      createdAt: new Date().toISOString()
    };

    try {
      if (recipient === "all") {
        // Option 1: Send one shared notification
        await addDoc(collection(db, "notifications"), {
          ...data,
          memberId: "all"
        });
        status.textContent = " Sent to all members!";
      } else {
        // Option 2: Send to one user
        await addDoc(collection(db, "notifications"), {
          ...data,
          memberId: recipient
        });
        status.textContent = " Sent to selected member!";
      }

      status.classList.add("success");
      msgBox.value = "";
      recipientSelect.value = "";
    } catch (e) {
      console.error(e);
      status.textContent = " Error sending notification.";
      status.classList.add("error");
    }
  }

  window.send = send;
