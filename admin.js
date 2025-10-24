// admin.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

// ====== Your Firebase Config (replace with yours) ======
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
const storage = getStorage(app);

// ====== Handle Book Upload ======
const form = document.getElementById("bookForm");
const successMsg = document.getElementById("success");
const errorMsg = document.getElementById("error");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = document.getElementById("title").value.trim();
  const author = document.getElementById("author").value.trim();
  const description = document.getElementById("description").value.trim();
  const price = parseFloat(document.getElementById("price").value);
  const access = document.getElementById("access").value;
  const bookLink = document.getElementById("bookLink").value.trim();
  const file = document.getElementById("bookCover").files[0];

  try {
    // Upload image to Firebase Storage
    const storageRef = ref(storage, `book_covers/${file.name}`);
    await uploadBytes(storageRef, file);
    const imageUrl = await getDownloadURL(storageRef);

    // Save book details to Firestore
    await addDoc(collection(db, "books"), {
      title,
      author,
      description,
      price,
      access,
      imageUrl,
      bookLink,
      uploadedAt: new Date()
    });

    successMsg.style.display = "block";
    errorMsg.style.display = "none";
    form.reset();
  } catch (err) {
    console.error("Error uploading:", err);
    successMsg.style.display = "none";
    errorMsg.style.display = "block";
  }
});
