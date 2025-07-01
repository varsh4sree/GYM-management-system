import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
    import {
      getAuth,
      onAuthStateChanged
    } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
    import {
      getFirestore,
      doc,
      setDoc,
      collection,
      addDoc
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

    onAuthStateChanged(auth, (user) => {
      if (!user) {
        window.location.href = "admin-login.html";
      }
    });

    const addBtn = document.getElementById("addBtn");
    const msg = document.getElementById("message");

    addBtn.addEventListener("click", async () => {
      const name = document.getElementById("mName").value.trim();
      const phone = document.getElementById("mPhone").value.trim();
      const email = document.getElementById("mEmail").value.trim();
      const joinDate = document.getElementById("mJoin").value;
      const packageType = document.getElementById("mPackage").value;

      if (!name || !phone || !email || !joinDate || !packageType) {
        msg.textContent = "Please fill in all fields.";
        msg.style.color = "red";
        return;
      }

      try {
        // Add to /members
        const memberRef = await addDoc(collection(db, "members"), {
          name,
          phone,
          email,
          joinDate,
          packageType,
          approved: true
        });

        // Add to /users
        await setDoc(doc(db, "users", memberRef.id), {
          email,
          role: "member"
        });

        msg.textContent = "✅ Member added successfully!";
        msg.style.color = "green";

        // Reset fields
        document.getElementById("mName").value = "";
        document.getElementById("mPhone").value = "";
        document.getElementById("mEmail").value = "";
        document.getElementById("mJoin").value = "";
        document.getElementById("mPackage").value = "";

      } catch (err) {
        console.error("Error adding member:", err);
        msg.textContent = "Error adding member.";
        msg.style.color = "red";
      }
    });
