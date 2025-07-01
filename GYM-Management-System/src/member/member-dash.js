import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
    import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
    import {
      getFirestore,
      doc,
      getDoc,
      collection,
      query,
      where,
      getDocs
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

    const nameSpan = document.getElementById("memberName");
    const emailSpan = document.getElementById("memberEmail");
    const packageSpan = document.getElementById("memberPackage");
    const billList = document.getElementById("billList");
    const notifList = document.getElementById("notifList");

    onAuthStateChanged(auth, async (user) => {
      if (!user) {
        window.location.href = "member-login.html";
        return;
      }

      const uid = user.uid;

      // Check role
      const userDoc = await getDoc(doc(db, "users", uid));
      if (!userDoc.exists() || userDoc.data().role !== "member") {
        alert("Access denied. Not approved member.");
        await signOut(auth);
        window.location.href = "member-login.html";
        return;
      }

      // Check approval
      const memberDoc = await getDoc(doc(db, "members", uid));
      if (!memberDoc.exists() || memberDoc.data().approved !== true) {
        alert("You are not approved yet.");
        await signOut(auth);
        window.location.href = "member-login.html";
        return;
      }

      const member = memberDoc.data();
      nameSpan.textContent = member.name || "Member";
      emailSpan.textContent = member.email;
      packageSpan.textContent = member.packageType || "N/A";

      // ✅ Load bills from /bills
      const billQuery = query(
        collection(db, "bills"),
        where("memberId", "in", [uid, "all"])
      );
      const billSnap = await getDocs(billQuery);
      billList.innerHTML = "";
      if (billSnap.empty) {
        billList.innerHTML = "<li>No bills found.</li>";
      } else {
        billSnap.forEach(doc => {
          const b = doc.data();
          billList.innerHTML += `
            <li>
              <span class="label">Amount:</span> ₹${b.amount} |
              <span class="label">Due:</span> ${b.dueDate || 'N/A'} |
              <span class="label">Status:</span> ${b.status}
            </li>`;
        });
      }

      // ✅ Load notifications from /notifications
      const notifQuery = query(
        collection(db, "notifications"),
        where("memberId", "in", [uid, "all"])
      );
      const notifSnap = await getDocs(notifQuery);
      notifList.innerHTML = "";
      if (notifSnap.empty) {
        notifList.innerHTML = "<li>No notifications.</li>";
      } else {
        notifSnap.forEach(doc => {
          const n = doc.data();
          notifList.innerHTML += `
            <li>
              <span class="label">Title:</span> ${n.title} |
              <span class="label">Message:</span> ${n.message}
            </li>`;
        });
      }
    });

    document.getElementById("logoutBtn").addEventListener("click", async () => {
      await signOut(auth);
      window.location.href = "member-login.html";
    });
