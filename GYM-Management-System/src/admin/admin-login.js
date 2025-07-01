const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};

    firebase.initializeApp(firebaseConfig);
    const auth = firebase.auth();
    const db = firebase.firestore();

    document.getElementById("loginBtn").addEventListener("click", function () {
        const email = document.getElementById("email").value;
        const pass = document.getElementById("password").value;
        const msg = document.getElementById("errorMsg");
        msg.innerText = "";

        auth.signInWithEmailAndPassword(email, pass)
            .then(userCred => {
                const uid = userCred.user.uid;

                db.collection("users").doc(uid).get().then(docSnap => {
                    if (docSnap.exists) {
                        if (docSnap.data().role === "admin") {
                            window.location.href = "admin-dash.html";
                        } else {
                            auth.signOut();
                            msg.innerText = "You are not an admin.";
                        }
                    } else {
                        msg.innerText = "No role found. Contact admin.";
                    }
                });
            })
            .catch(err => {
                msg.innerText = err.message;
            });
    });
