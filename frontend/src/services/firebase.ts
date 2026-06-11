import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { initializeFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBqSPJthVzTT585nq1ZGeQVuFfDFFjgKMo",
  authDomain: "gemini-backend-eliana-62ea3.firebaseapp.com",
  projectId: "gemini-backend-eliana-62ea3",
  storageBucket: "gemini-backend-eliana-62ea3.appspot.com",
  messagingSenderId: "802781961136",
  appId: "1:802781961136:web:9bfb1ff7218f42575b9475"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});