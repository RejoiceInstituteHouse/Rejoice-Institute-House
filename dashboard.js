import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Tabs
const tabs = document.querySelectorAll(".tab-btn");
tabs.forEach(btn => {
  btn.addEventListener("click", () => {
    tabs.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    document.querySelectorAll(".books-grid").forEach(grid => grid.style.display = "none");
    document.getElementById(btn.dataset.tab).style.display = "grid";
  });
});

// Logout
const logoutBtn = document.getElementById("logout-btn");
logoutBtn.addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "login.html";
});

// Load dashboard
onAuthStateChanged(auth, async user => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  document.getElementById("user-name").innerText = user.displayName || user.email;

  // Load books
  const freeGrid = document.getElementById("free");
  const purchasedGrid = document.getElementById("purchased");
  const exclusiveGrid = document.getElementById("exclusive");

  const booksSnapshot = await getDocs(collection(db, "books"));

  booksSnapshot.forEach(doc => {
    const book = doc.data();
    const cardHTML = `
      <div class="book-card">
        <img src="${book.coverURL}" alt="${book.title}">
        <h3>${book.title}</h3>
        <p>${book.description}</p>
        <p class="price">${book.price === 0 ? 'Free' : 'Price: ' + book.price}</p>
        <button class="btn-read">Read</button>
      </div>
    `;

    if (book.type === "free") freeGrid.innerHTML += cardHTML;
    else if (book.type === "purchased" && book.userUID === user.uid) purchasedGrid.innerHTML += cardHTML;
    else if (book.type === "exclusive" && book.userUID === user.uid) exclusiveGrid.innerHTML += cardHTML;
  });
});

