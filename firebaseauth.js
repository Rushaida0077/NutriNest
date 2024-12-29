import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import {
  getFirestore,
  setDoc,
  doc,
} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAIgG93k1LgVgIJASEvhbo6v7-x6C23KFc",
  authDomain: "nutrinest-489fa.firebaseapp.com",
  projectId: "nutrinest-489fa",
  storageBucket: "nutrinest-489fa.firebasestorage.app",
  messagingSenderId: "301011677376",
  appId: "1:301011677376:web:3c14caf2404eeadc2e3d25",
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);

function showMessage(massage, divId) {
  var massageDiv = document.getElementById(divId);
  massageDiv.style.display = "block";
  massageDiv.innerHTML = massage;
  massageDiv.style.opacity = 1;
  setTimeout(function () {
    massageDiv.style.opacity = 0;
  }, 5000);
}

const signUp = document.getElementById("submitSignUp");
signUp.addEventListener("click", (event) => {
  event.preventDefault();
  const email = document.getElementById("rEmail").value;
  const passwoord = document.getElementById("rPassword").value;
  const name = document.getElementById("Name").value;

  const auth = getAuth();
  const db = getFirestore();

  createUserWithEmailAndPassword(auth, email, passwoord)
    .then((userCredential) => {
      const user = userCredential.user;
      const userData = {
        email: email,
        name: name,
      };
      showMessage("Account created Successfully", "signUpMessage");
      const docRef = doc(db, "users", user.uid);
      setDoc(docRef, userData)
        .then(() => {
          window.location.href = "index.html";
        })
        .catch((error) => {
          consoleerror("error writing document", error);
        });
    })
    .catch((error) => {
      const errorCode = error.code;
      if (errorCode == "auth/email-already-in-use") {
        showMessage("Email Address Already Exists !!!", "signUpMessage");
      } else {
        showMessage("Unable to create User", "signUpMessage");
      }
    });
});

const signIn = document.getElementById("submitSignIn");
signIn.addEventListener("click", (event) => {
  event.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const auth = getAuth();

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      showMessage("login is successful", "signInMessage");
      const user = userCredential.user;
      localStorage.setItem("loggedInUserId", user.uid);
      window.location.href = "recipes.html";
    })
    .catch((error) => {
      const errorCode = error.code;
      if (errorCode === "auth/invalid-credential") {
        showMessage("Incorrect Email or Password", "signInMessage");
      } else {
        showMessage("Account does not Exist", "signInMessage");
      }
    });
});

const auth = getAuth();
const provider = new GoogleAuthProvider();
const db = getFirestore();

// Sign In with Google
const googleSignInButton = document.getElementById("googleSignIn");
googleSignInButton.addEventListener("click", (event) => {
  event.preventDefault();

  signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;
      showMessage("Sign in successful!", "signInMessage");
      localStorage.setItem("loggedInUserId", user.uid);
      window.location.href = "recipes.html";
    })
    .catch((error) => {
      console.error("Google Sign-In Error:", error);
      showMessage("Failed to sign in with Google", "signInMessage");
    });
});

// Sign Up with Google
const googleSignUpButton = document.getElementById("googleSignUp");
googleSignUpButton.addEventListener("click", (event) => {
  event.preventDefault();

  signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;
      const userData = {
        email: user.email,
        name: user.displayName,
        photoURL: user.photoURL,
      };

      const docRef = doc(db, "users", user.uid);
      setDoc(docRef, userData, { merge: true })
        .then(() => {
          showMessage(
            "Account successfully created with Google!",
            "signUpMessage"
          );
          localStorage.setItem("loggedInUserId", user.uid);
          window.location.href = "recipes.html";
        })
        .catch((error) => {
          console.error("Error saving user data:", error);
          showMessage("Failed to save user data to database", "signUpMessage");
        });
    })
    .catch((error) => {
      console.error("Google Sign-Up Error:", error);
      showMessage("Failed to sign up with Google", "signUpMessage");
    });
});
