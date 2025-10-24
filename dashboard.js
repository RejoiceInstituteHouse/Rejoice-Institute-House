// Hide dashboard content until login is confirmed
document.body.style.visibility = "hidden";

onAuthStateChanged(auth, (user) => {
  if (!user) {
    // Not logged in → send to login page
    window.location.href = "login.html";
  } else {
    currentUserEmail = user.email;
    document.body.style.visibility = "visible"; // show dashboard
    loadBooks("free"); // load default books tab
  }
});

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
          <button class="read-btn" data-content="${book.content}">Read / Preview</button>
        `;

        booksContainer.appendChild(card);

        // Add event listener for the Read/Preview button
        card.querySelector(".read-btn").addEventListener("click", (e) => {
          const contentURL = e.target.getAttribute("data-content");
          if (contentURL.endsWith(".pdf")) {
            window.open(contentURL, "_blank"); // Opens PDF in a new tab
          } else {
            showModal(contentURL); // Show HTML/text content in modal
          }
        });
      }
    });

  } catch (error) {
    console.error("Error fetching books:", error);
    booksContainer.innerHTML = "<p>Unable to load books. Please try again later.</p>";
  }
}

// Tabs functionality
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

// Modal functionality
function showModal(url) {
  const modal = document.getElementById("modal");
  const iframe = document.getElementById("book-frame");
  const closeBtn = document.querySelector(".close-btn");

  iframe.src = url;
  modal.style.display = "block";

  closeBtn.onclick = () => {
    modal.style.display = "none";
    iframe.src = "";
  }

  window.onclick = (e) => {
    if (e.target == modal) {
      modal.style.display = "none";
      iframe.src = "";
    }
  }
}
const logoutBtn = document.getElementById("logout-btn");

logoutBtn.addEventListener("click", () => {
  auth.signOut().then(() => {
    window.location.href = "login.html"; // send back to login page
  });
});
