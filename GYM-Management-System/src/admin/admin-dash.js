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

  function logout() {
    auth.signOut().then(() => {
      window.location.href = "admin-login.html";
    });
  }

  auth.onAuthStateChanged((user) => {
    if (!user) {
      window.location.href = "admin-login.html";
    }
  });
