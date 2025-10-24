import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Your Firebase config
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

const booksList = document.getElementById("books-list");

async function loadBooks() {
  try {
    const querySnapshot = await getDocs(collection(db, "books"));
    if (querySnapshot.empty) {
      booksList.innerHTML = "<p>No books found yet. Please check back soon.</p>";
      return;
    }

    querySnapshot.forEach((doc) => {
      const book = doc.data();
      const bookCard = document.createElement("div");
      bookCard.classList.add("book-card");

      bookCard.innerHTML = `
        <img src="${book.coverURL}" alt="${book.title}">
        <h3>${book.title}</h3>
        <p>${book.description}</p>
        <p class="price">Price: ${book.price}</p>
        <button class="btn-read">Read</button>
      `;
      booksList.appendChild(bookCard);
    });
  } catch (error) {
    console.error("Error loading books:", error);
    booksList.innerHTML = "<p>Failed to load books. Please try again later.</p>";
  }
}

loadBooks();
