import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
    import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
    import {
      getFirestore,
      doc,
      getDoc
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
    const msg = document.getElementById("message");

    document.getElementById("loginBtn").addEventListener("click", async () => {
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value.trim();
      msg.textContent = "";
      msg.className = "message";

      if (!email || !password) {
        msg.textContent = "Please fill in all fields.";
        msg.classList.add("error");
        return;
      }

      try {
        const cred = await signInWithEmailAndPassword(auth, email, password);
        const uid = cred.user.uid;

        const userDoc = await getDoc(doc(db, "users", uid));
        if (!userDoc.exists()) {
          msg.textContent = "User role not found. Contact admin.";
          msg.classList.add("error");
          return;
        }

        const role = userDoc.data().role;
        if (role !== "member") {
          msg.textContent = "Your account is not approved yet. Please wait for admin.";
          msg.classList.add("error");
          return;
        }

        const memberDoc = await getDoc(doc(db, "members", uid));
        if (!memberDoc.exists() || memberDoc.data().approved !== true) {
          msg.textContent = "You are not approved yet. Contact admin.";
          msg.classList.add("error");
          return;
        }

        // All good, redirect
        window.location.href = "member-dash.html";
      } catch (err) {
        console.error(err);
        msg.textContent = "Login failed: " + err.message;
        msg.classList.add("error");
      }
    });
