// dashboard.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

// Your Firebase config (paste your own details from Firebase)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
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

