// Import Firebase libraries
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";

// ---------------- Firebase Config ----------------
const firebaseConfig = {
  apiKey: "AIzaSyDLhqFt4rYXJgxbu5l4q50rx1FZkARyDYE",
  authDomain: "rejoice-institute-house.firebaseapp.com",
  projectId: "rejoice-institute-house",
  storageBucket: "rejoice-institute-house.firebasestorage.app",
  messagingSenderId: "154515308139",
  appId: "1:154515308139:web:72b2e940af48283c787b2e"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Get dashboard sections
const dashboardContent = document.getElementById("dashboard-content");
const freeTab = document.getElementById("free-books");
const purchasedTab = document.getElementById("purchased-books");
const exclusiveTab = document.getElementById("exclusive-books");
const libraryTab = document.getElementById("library-books");

// Hide dashboard until user verified
dashboardContent.style.display = "none";

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    // If not logged in, redirect to login page
    window.location.href = "login.html";
    return;
  }

  // Show dashboard after login
  dashboardContent.style.display = "block";

  const userEmail = user.email;
  const booksCol = collection(db, "Words_of_Insights"); // use your collection name

  const booksSnapshot = await getDocs(booksCol);
  booksSnapshot.forEach((doc) => {
    const book = doc.data();

    // Create a book card
    const card = document.createElement("div");
    card.className = "book-card";
    card.innerHTML = `
      <img src="${book.img}" class="book-cover" />
      <h3>${book.title}</h3>
      <p>${book.author}</p>
      <p>${book.description}</p>
      <p class="price">${book.price}</p>
      <button class="read-btn" onclick="window.open('${book.content}', '_blank')">Read</button>
    `;

    // Sort books by access
    if (book.access === "free") freeTab.appendChild(card);
    else if (book.access === "purchased" && book.ownerEmail === userEmail) purchasedTab.appendChild(card);
    else if (book.access === "exclusive" && book.ownerEmail === userEmail) exclusiveTab.appendChild(card);

    // Add all accessible books to library
    if (book.access === "free" || book.ownerEmail === userEmail)
      libraryTab.appendChild(card.cloneNode(true));
  });
});

// Handle logout
document.getElementById("logout-btn")?.addEventListener("click", () => {
  signOut(auth).then(() => {
    window.location.href = "login.html";
  });
});

