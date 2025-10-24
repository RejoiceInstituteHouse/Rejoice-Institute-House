// dashboard.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

// Your Firebase config (paste your own details from Firebase)
const firebaseConfig = {
  apiKey: "AIzaSyDLhqFt4rYXJgxbu5l4q50rx1FZkARyDYE",
  authDomain: "rejoice-institute-house.firebaseapp.com",
  projectId: "rejoice-institute-house",
  storageBucket: "rejoice-institute-house.firebasestorage.app",
  messagingSenderId: "154515308139",
  appId: "1:154515308139:web:72b2e940af48283c787b2e"
};

// Initialize Firebase and Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Reference to where books will be displayed
const booksContainer = document.getElementById("books-container");

// Fetch books from Firestore
async function loadBooks() {
  const querySnapshot = await getDocs(collection(db, "books"));
  booksContainer.innerHTML = ""; // Clear before adding

  querySnapshot.forEach((doc) => {
    const book = doc.data();

    // Create book card
    const card = document.createElement("div");
    card.classList.add("book-card");
    card.innerHTML = `
      <img src="${book.img}" alt="${book.title}" class="book-cover">
      <h3>${book.title}</h3>
      <p><strong>by ${book.author}</strong></p>
      <p>${book.description}</p>
      <p class="price">${book.price}</p>
    `;
    booksContainer.appendChild(card);
  });
}

loadBooks();
<script type="module" src="dashboard.js"></script>
async function loadBooks(categoryFilter = null) {
  const querySnapshot = await getDocs(collection(db, "books"));
  booksContainer.innerHTML = "";

  querySnapshot.forEach((doc) => {
    const book = doc.data();

    if (!categoryFilter || book.access === categoryFilter) {
      const card = document.createElement("div");
      card.classList.add("book-card");
      card.innerHTML = `
        <img src="${book.img}" alt="${book.title}" class="book-cover">
        <h3>${book.title}</h3>
        <p><strong>by ${book.author}</strong></p>
        <p>${book.description}</p>
        <p class="price">${book.price}</p>
      `;
      booksContainer.appendChild(card);
    }
  });
}

// Tab functionality
const tabs = document.querySelectorAll(".tab-btn");

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");
    const tabName = tab.getAttribute("data-tab");

    if (tabName === "free") loadBooks("free");
    else if (tabName === "purchased") loadBooks("purchased");
    else if (tabName === "exclusive") loadBooks("exclusive");
    else if (tabName === "library") loadBooks();
  });
});

// Default load
loadBooks("free");

