import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";

// ---------------- Firebase Config ----------------
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
const auth = getAuth(app);

// Hide dashboard until user login is confirmed
document.body.style.visibility = "hidden";

let currentUserEmail = "";
onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "login.html"; // Redirect if not logged in
  } else {
    currentUserEmail = user.email;
    document.body.style.visibility = "visible"; // Show dashboard
    loadBooks("free"); // Load default tab
  }
});

// Logout functionality
const logoutBtn = document.getElementById("logout-btn");
logoutBtn.addEventListener("click", () => {
  auth.signOut().then(() => {
    window.location.href = "login.html";
  });
});

// Books container
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

        // Library tab only shows books belonging to this user
        if (categoryFilter === "library" && book.ownerEmail && book.ownerEmail !== currentUserEmail) {
          return;
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

        // Read / Preview button
        card.querySelector(".read-btn").addEventListener("click", (e) => {
          const contentURL = e.target.getAttribute("data-content");
          if (contentURL.endsWith(".pdf")) {
            window.open(contentURL, "_blank"); // Open PDF in new tab
          } else {
            showModal(contentURL); // Show HTML/text in modal
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
