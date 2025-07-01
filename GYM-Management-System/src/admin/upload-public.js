import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
    import {
      getFirestore, collection, addDoc
    } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
    import {
      getAuth, onAuthStateChanged
    } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
    import {
      getDoc, doc
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
    const db = getFirestore(app);
    const auth = getAuth(app);

    const uploadBtn = document.getElementById("uploadBtn");
    const status = document.getElementById("status");
    const emailInfo = document.getElementById("emailInfo");

    let currentUser;

    onAuthStateChanged(auth, async (user) => {
      if (!user) {
        status.textContent = "❌ Please login as admin to upload data.";
        uploadBtn.disabled = true;
        return;
      }

      currentUser = user;
      emailInfo.textContent = "Logged in as: " + user.email;

      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (!userDoc.exists || userDoc.data().role !== "admin") {
        status.textContent = "❌ You must be an admin to upload.";
        uploadBtn.disabled = true;
        return;
      }

      uploadBtn.addEventListener("click", uploadData);
    });

    async function uploadData() {
      try {
        status.textContent = "Uploading...";
        const records = [
          { title: "Gym Timings", detail: "Mon–Sat: 6AM–9PM. Sunday: Closed." },
          { title: "Trainers", detail: "Certified male/female trainers. Personal training available." },
          { title: "Facilities", detail: "Cardio, weights, yoga, lockers, shower." },
          { title: "Contact Info", detail: "Phone: 9876543210. Email: contact@getfitgym.in" },
          { title: "Packages", detail: "Monthly ₹1200 | Quarterly ₹3200 | Yearly ₹9500" },
          { title: "Rules", detail: "Carry ID, gym shoes, maintain hygiene, no loitering." }
        ];

        const supps = [
          { name: "Whey Protein", description: "Supports muscle recovery & growth", price: 2500 },
          { name: "Creatine", description: "Boosts strength & stamina", price: 1800 }
        ];

        for (const item of records) {
          await addDoc(collection(db, "publicRecords"), item);
        }
        for (const item of supps) {
          await addDoc(collection(db, "publicSupplements"), item);
        }

        status.textContent = "✅ Data uploaded successfully!";
        status.style.color = "green";
      } catch (err) {
        console.error(err);
        status.textContent = "❌ Upload failed: " + err.message;
        status.style.color = "red";
      }
    }
