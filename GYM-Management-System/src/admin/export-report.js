import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
  import {
    getFirestore,
    collection,
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
  const tbody = document.querySelector("#memberTable tbody");

  let members = [];

  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      window.location.href = "admin-login.html";
      return;
    }

    const snap = await getDocs(collection(db, "members"));
    tbody.innerHTML = "";

    snap.forEach(doc => {
      const m = doc.data();
      members.push(m);

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${m.name || "N/A"}</td>
        <td>${m.email || "N/A"}</td>
        <td>${m.phone || "N/A"}</td>
        <td>${m.packageType || "-"}</td>
        <td>${m.joinDate || "-"}</td>
        <td>${m.status || "Unknown"}</td>
      `;
      tbody.appendChild(tr);
    });
  });

  function downloadCSV() {
    if (members.length === 0) return alert("No data to export.");

    let csv = "Name,Email,Phone,Package,Join Date,Status\n";

    members.forEach(m => {
      csv += `"${m.name || ''}","${m.email || ''}","${m.phone || ''}","${m.packageType || ''}","${m.joinDate || ''}","${m.status || ''}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "members-report.csv";
    link.click();
  }
