import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
    import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
    import {
      getFirestore,
      collection,
      getDoc,
      getDocs,
      updateDoc,
      doc,
      query,
      where
    } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

    const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};

    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getFirestore(app);

    const membersDiv = document.getElementById("members");

    onAuthStateChanged(auth, async (user) => {
      if (!user) {
        window.location.href = "admin-login.html";
        return;
      }

      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (!userDoc.exists() || userDoc.data().role !== "admin") {
        alert("Access denied.");
        window.location.href = "index.html";
        return;
      }

      loadPendingMembers();
    });

    async function loadPendingMembers() {
      const q = query(collection(db, "users"), where("role", "==", "pending"));
      const snap = await getDocs(q);

      if (snap.empty) {
        membersDiv.innerHTML = "<p>No pending members.</p>";
        return;
      }

      snap.forEach(async (userDoc) => {
        const uid = userDoc.id;
        const userData = userDoc.data();

        const memberDoc = await getDoc(doc(db, "members", uid));
        const member = memberDoc.exists() ? memberDoc.data() : {};

        const card = document.createElement("div");
        card.className = "member-card";
        card.innerHTML = `
          <h3>${member.name || "No Name"}</h3>
          <p><strong>Email:</strong> ${userData.email}</p>
          <p><strong>Phone:</strong> ${member.phone || "N/A"}</p>
          <p><strong>Package:</strong> ${member.packageType || "N/A"}</p>
          <button onclick="approve('${uid}', this)">Approve</button>
        `;
        membersDiv.appendChild(card);
      });
    }

    window.approve = async (uid, btn) => {
      btn.disabled = true;
      btn.textContent = "Approving...";

      try {
        await updateDoc(doc(db, "users", uid), { role: "member" });
        await updateDoc(doc(db, "members", uid), { approved: true });
        btn.textContent = " Approved";
        btn.style.backgroundColor = "#28a745";
      } catch (err) {
        console.error("Approval error:", err);
        btn.textContent = " Error";
        btn.disabled = false;
      }
    };
