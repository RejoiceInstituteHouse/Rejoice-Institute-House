import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";

// 🔹 Firebase config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Protect dashboard: only logged-in users
let currentUserEmail = "";
onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "login.html";
  } else {
    currentUserEmail = user.email;
    loadBooks("free"); // Load default tab after user is logged in
  }
});

// Reference to books container
const booksContainer = document.getElementById("books-container");

// Load books from Firestore
async function loadBooks(categoryFilter = null) {
  try {
    const querySnapshot = await getDocs(collection(db, "books"));
    booksContainer.innerHTML = "";

    querySnapshot.forEach((doc) => {
      const book = doc.data();

      // Filter by tab
      if (!categoryFilter || book.access === categoryFilter) {

        // Optional: Filter for My Library to only show books purchased or owned
        if (categoryFilter === "library" && book.ownerEmail && book.ownerEmail !== currentUserEmail) {
          return; // Skip books not belonging to this user
        }

        const card = document.createElement("div");
        card.classList.add("book-card");
        card.innerHTML = `
          <img src="${book.img}" alt="${book.title}" class="book-cover">
          <h3>${book.title}</h3>
          <p><strong>by ${book.author}</strong></p>
          <p>${book.description}</p>
          <p class="price">${book.price}</p>
          <button class="read-btn">Read / Preview</button>
        `;
        booksContainer.appendChild(card);
      }
    });

  } catch (error) {
    console.error("Error fetching books:", error);
    booksContainer.innerHTML = "<p>Unable to load books. Please try again later.</p>";
  }
}

// Tabs
const tabs = document.querySelectorAll(".tab-btn");
tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");
    const tabName = tab.getAttribute("data-tab");

    if (tabName === "free") loadBooks("free");
    else if (tabName === "purchased") loadBooks("purchased");
    else if (tabName === "exclusive") loadBooks("exclusive");
    else if (tabName === "library") loadBooks("library");
  });
});
