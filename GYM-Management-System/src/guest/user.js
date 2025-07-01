import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
  import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword
  } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
  import {
    getFirestore,
    doc,
    setDoc,
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

  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const authBtn = document.getElementById("authBtn");
  const toggleLink = document.getElementById("toggleLink");
  const formTitle = document.getElementById("formTitle");
  const toggleText = document.getElementById("toggleText");
  const message = document.getElementById("message");

  let isLogin = false;

  toggleLink.addEventListener("click", () => {
    isLogin = !isLogin;
    formTitle.textContent = isLogin ? "Guest Login" : "Guest Sign Up";
    authBtn.textContent = isLogin ? "Login" : "Sign Up";
    toggleText.textContent = isLogin ? "Don't have an account?" : "Already have an account?";
    toggleLink.textContent = isLogin ? "Sign Up" : "Login";
    message.textContent = "";
  });

  authBtn.addEventListener("click", async () => {
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    message.textContent = "";
    message.className = "message";

    if (!email || !password) {
      message.textContent = "Please fill all fields.";
      message.classList.add("error");
      return;
    }

    try {
      if (isLogin) {
        const userCred = await signInWithEmailAndPassword(auth, email, password);
        const uid = userCred.user.uid;

        const userDoc = await getDoc(doc(db, "users", uid));
        if (!userDoc.exists() || userDoc.data().role !== "user") {
          throw new Error("Access denied: not a guest user.");
        }

        message.textContent = " Logged in successfully!";
        message.classList.add("success");
         window.location.href = "user-dash.html";
      } else {
        const userCred = await createUserWithEmailAndPassword(auth, email, password);
        const uid = userCred.user.uid;

        await setDoc(doc(db, "users", uid), {
          email,
          role: "user"
        });

        message.textContent = " Account created! You can now log in.";
        message.classList.add("success");
      }

    } catch (err) {
      message.textContent = "Error: " + err.message;
      message.classList.add("error");
    }
  });
