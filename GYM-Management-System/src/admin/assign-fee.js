import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
  import {
    getFirestore,
    collection,
    getDocs,
    doc,
    setDoc,
    updateDoc
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

    const memberSnap = await getDocs(collection(db, "members"));
    memberSelect.innerHTML = '<option value="">-- Select Member --</option>';

    memberSnap.forEach(doc => {
      const data = doc.data();
      const option = document.createElement("option");
      option.value = doc.id;
      option.textContent = `${data.name} (${data.email})`;
      memberSelect.appendChild(option);
    });
  });

  async function assignFee() {
    const memberId = memberSelect.value;
    const feePackage = document.getElementById("feePackage").value;

    msg.textContent = "";
    msg.className = "message";

    if (!memberId || !feePackage) {
      msg.textContent = "Please select both member and package.";
      msg.classList.add("error");
      return;
    }

    try {
      // Save package info separately
      await setDoc(doc(db, "feeAssignments", memberId), {
        memberId,
        packageType: feePackage,
        assignedAt: new Date().toISOString()
      });

      // Also update inside member profile
      await updateDoc(doc(db, "members", memberId), {
        packageType: feePackage
      });

      msg.textContent = "✅ Fee package assigned successfully!";
      msg.classList.add("success");

    } catch (err) {
      console.error(err);
      msg.textContent = "❌ Error assigning fee.";
      msg.classList.add("error");
    }
  }

  window.assignFee = assignFee;
