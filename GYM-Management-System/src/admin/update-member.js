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

  const table = document.querySelector("#membersTable");
  const tbody = table.querySelector("tbody");
  const loading = document.getElementById("loading");
  const msg = document.getElementById("msg");

  auth.onAuthStateChanged(user => {
    if (!user) {
      window.location.href = "admin-login.html";
    } else {
      loadMembers();
    }
  });

  function loadMembers() {
    db.collection("members").get().then(snapshot => {
      loading.style.display = "none";
      table.style.display = "table";
      tbody.innerHTML = "";

      snapshot.forEach(doc => {
        const data = doc.data();
        const tr = document.createElement("tr");

        tr.innerHTML = `
          <td><input type="text" value="${data.name}" disabled></td>
          <td><input type="email" value="${data.email}" disabled></td>
          <td><input type="text" value="${data.phone}" disabled></td>
          <td><input type="date" value="${data.joinDate}" disabled></td>
          <td><input type="text" value="${data.packageType || ''}" disabled></td>
          <td class="actions">
            <button class="btn edit-btn" onclick="enableEdit(this, '${doc.id}')">Edit</button>
            <button class="btn delete-btn" onclick="deleteMember('${doc.id}')">Delete</button>
          </td>
        `;

        tbody.appendChild(tr);
      });
    });
  }

  function enableEdit(btn, uid) {
    const row = btn.closest("tr");
    const inputs = row.querySelectorAll("input");
    inputs.forEach(input => input.disabled = false);
    btn.textContent = "Save";
    btn.className = "btn save-btn";
    btn.onclick = () => saveMember(uid, inputs, btn);
  }

  function saveMember(uid, inputs, btn) {
    const [name, email, phone, joinDate, packageType] = inputs;

    db.collection("members").doc(uid).update({
      name: name.value,
      email: email.value,
      phone: phone.value,
      joinDate: joinDate.value,
      packageType: packageType.value
    }).then(() => {
      inputs.forEach(input => input.disabled = true);
      btn.textContent = "Edit";
      btn.className = "btn edit-btn";
      btn.onclick = () => enableEdit(btn, uid);
      msg.textContent = "Member updated successfully!";
      msg.style.color = "green";
    }).catch(err => {
      msg.textContent = "Error: " + err.message;
      msg.style.color = "red";
    });
  }

  function deleteMember(uid) {
    if (confirm("Are you sure you want to delete this member?")) {
      db.collection("members").doc(uid).delete()
        .then(() => db.collection("users").doc(uid).delete())
        .then(() => {
          msg.textContent = "Member deleted.";
          msg.style.color = "green";
          loadMembers();
        }).catch(err => {
          msg.textContent = "Error: " + err.message;
          msg.style.color = "red";
        });
    }
  }
