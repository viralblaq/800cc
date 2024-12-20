// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA3bhwVl0Y2vlzH62whtsoxez67Bs_0jds",
    authDomain: "club-88233.firebaseapp.com",
    projectId: "club-88233",
    storageBucket: "club-88233.firebasestorage.app",
    messagingSenderId: "574470504551",
    appId: "1:574470504551:web:124d30d7d600ecaea554c2",
    measurementId: "G-4JSNJK4H87"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Function to fetch query parameter
function getQueryParam(param) {
    const params = new URLSearchParams(window.location.search);
    return params.get(param);
}
// Load package details
async function loadPackageDetails() {
    const packageId = getQueryParam('packageId');
    if (!packageId) {
        document.getElementById('package-title').textContent = 'Package not found';
        return;
    }

    try {
        const docRef = doc(db, "packages", packageId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const packageData = docSnap.data();
            document.getElementById('package-title').textContent = packageData.title;
            document.getElementById('package-description').textContent = packageData.description;
            document.getElementById('package-price').textContent = packageData.price;

            const methodsList = document.getElementById('methods-list');
            packageData.paymentMethods.forEach(method => {
                const li = document.createElement('li');
                // Extract the key and value from the object
    const [type, value] = Object.entries(method)[0]; // Get the first key-value pair
    li.textContent = `${type}: ${value}`;
                methodsList.appendChild(li);
            });
        } else {
            document.getElementById('package-title').textContent = 'Package not found';
        }
    } catch (error) {
        console.error("Error loading package details:", error);
        document.getElementById('package-title').textContent = 'Error loading package details';
    }
}

// Call the function if on package-detail.html
if (window.location.pathname.includes("package-detail.html")) {
    loadPackageDetails();
}

// Get the form element
const form = document.getElementById("credit-form");

form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Get form data
    const fullName = document.getElementById("full-name").value;
    const state = document.getElementById("state").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const creditScore = document.getElementById("credit-score").value;
    const creditBureaus = document.getElementById("credit-bureaus").value;
    const problem = document.getElementById("problem").value;

    // Log the values to ensure they're correct
    console.log("Form Data:", { fullName, state, email, phone, creditScore, creditBureaus, problem });

    // Save to Firestore
    addDoc(collection(db, "credit_assistance_requests"), {
        fullName,
        state,
        email,
        phone,
        creditScore,
        creditBureaus,
        problem,
        timestamp: serverTimestamp()
    })
    .then(() => {
        console.log("Form submitted successfully!");
        alert("Form submitted successfully!");
        form.reset();
    })
    .catch((error) => {
        console.error("Error submitting form:", error.message);
        alert("Error submitting form: " + error.message);
    });
});
