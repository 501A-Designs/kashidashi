// import { initializeApp } from "firebase/app"
// import { getAuth, signOut } from "firebase/auth";
// import { getFirestore } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics";

import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDFrs-lWIcbb0IMCYBKafhDZAtnTtsZscc",
  authDomain: "kashidashi-site.firebaseapp.com",
  projectId: "kashidashi-site",
  storageBucket: "kashidashi-site.appspot.com",
  messagingSenderId: "792195128264",
  appId: "1:792195128264:web:5d001f7798f66787a27efd",
  measurementId: "G-DTK8V9QP9E"
};

const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export {app};

// let analytics,db,auth;

// if (firebaseConfig?.projectId) {
//   const app = initializeApp(firebaseConfig);
//   if (app.name && typeof window !== 'undefined') {
//     analytics = getAnalytics(app);
//   }
//   auth = getAuth(app);
//   db = getFirestore();
// }

// let root;
// if (typeof document !== 'undefined') {
//   root = document.documentElement;
// }

// export {analytics, db,auth,root};