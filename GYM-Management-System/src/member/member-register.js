import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
    import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
    import {
      getFirestore,
      doc,
      setDoc
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

    document.getElementById("registerBtn").addEventListener("click", async () => {
      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value.trim();

      msg.textContent = "";
      msg.className = "message";

      if (!name || !email || !password) {
        msg.textContent = "Please fill in all fields.";
        msg.classList.add("error");
        return;
      }

      try {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        const uid = cred.user.uid;

        await setDoc(doc(db, "users", uid), {
          email,
          role: "pending"
        });

        await setDoc(doc(db, "members", uid), {
          name,
          email,
          phone: "",
          packageType: "",
          joinDate: "",
          approved: false
        });

        msg.textContent = " Registered! Wait for admin approval.";
        msg.classList.add("success");

        document.getElementById("name").value = "";
        document.getElementById("email").value = "";
        document.getElementById("password").value = "";
      } catch (err) {
        if (err.code === "auth/email-already-in-use") {
          msg.textContent = "Email is already registered. Please login.";
        } else if (err.code === "auth/weak-password") {
          msg.textContent = "Password must be at least 6 characters.";
        } else {
          msg.textContent = "Error: " + err.message;
        }
        msg.classList.add("error");
      }
    });
