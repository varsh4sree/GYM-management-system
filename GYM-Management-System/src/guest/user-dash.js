import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
    import {
      getFirestore, collection, getDocs
    } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
    import {
      getAuth, onAuthStateChanged, signOut
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

    const userEmail = document.getElementById("userEmail");
    const infoList = document.getElementById("infoList");
    const suppList = document.getElementById("suppList");
    const searchBox = document.getElementById("searchBox");
    const logoutBtn = document.getElementById("logoutBtn");

    let allInfo = [];
    let allSupps = [];

    onAuthStateChanged(auth, (user) => {
      if (user) {
        userEmail.textContent = "Logged in as: " + user.email;
        logoutBtn.style.display = "inline-block";
      } else {
        userEmail.textContent = "Browsing as guest.";
        logoutBtn.style.display = "none";
      }
    });

    logoutBtn.addEventListener("click", async () => {
      await signOut(auth);
      window.location.href = "index.html";
    });

    async function loadData() {
      const infoSnap = await getDocs(collection(db, "publicRecords"));
      const suppSnap = await getDocs(collection(db, "publicSupplements"));

      allInfo = infoSnap.docs.map(doc => doc.data());
      allSupps = suppSnap.docs.map(doc => doc.data());

      render(allInfo, allSupps);
    }

    function highlight(text, keyword) {
      if (!keyword) return text;
      const regex = new RegExp(`(${keyword})`, "gi");
      return text.replace(regex, `<mark>$1</mark>`);
    }

    function render(infoData, suppData, keyword = "") {
      infoList.innerHTML = "";
      suppList.innerHTML = "";

      infoData.forEach(i => {
        const title = highlight(i.title, keyword);
        const detail = highlight(i.detail, keyword);
        infoList.innerHTML += `
          <div class="card">
            <h4>${title}</h4>
            <p>${detail}</p>
          </div>
        `;
      });

      suppData.forEach(s => {
        const name = highlight(s.name, keyword);
        const desc = highlight(s.description, keyword);
        suppList.innerHTML += `
          <div class="card">
            <h4>${name}</h4>
            <p>${desc}</p>
            <p><strong>Price:</strong> ₹${s.price}</p>
          </div>
        `;
      });
    }

    searchBox.addEventListener("input", () => {
      const keyword = searchBox.value.trim().toLowerCase();
      render(allInfo, allSupps, keyword);
    });

    loadData();
