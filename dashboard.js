// dashboard.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

// 🔹 Firebase config - replace with YOUR actual Firebase project details
const firebaseConfig = {
  apiKey: "AIzaSyDLhqFt4rYXJgxbu5l4q50rx1FZkARyDYE",
  authDomain: "rejoice-institute-house.firebaseapp.com",
  projectId: "rejoice-institute-house",
  storageBucket: "rejoice-institute-house.firebasestorage.app",
  messagingSenderId: "154515308139",
  appId: "1:154515308139:web:72b2e940af48283c787b2e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Reference to books container
const booksContainer = document.getElementById("books-container");

// Function to load books from Firestore
async function loadBooks(categoryFilter = null) {
  try {
    const querySnapshot = await getDocs(collection(db, "books"));
    booksContainer.innerHTML = "";

    querySnapshot.forEach((doc) => {
      const book = doc.data();

      // Filter based on tab
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

  } catch (error) {
    console.error("Error fetching books:", error);
    booksContainer.innerHTML = "<p>Unable to load books. Please try again later.</p>";
  }
}

// 🔹 Tab buttons
const tabs = document.querySelectorAll(".tab-btn");
tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");
    const tabName = tab.getAttribute("data-tab");

    if (tabName === "free") loadBooks("free");
    else if (tabName === "purchased") loadBooks("purchased");
    else if (tabName === "exclusive") loadBooks("exclusive");
    else if (tabName === "library") loadBooks(); // All books
  });
});

// 🔹 Load default tab
loadBooks("free");

