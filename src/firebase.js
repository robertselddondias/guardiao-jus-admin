import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

// Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBnybGURhbIQsFt4QmpPhpC0pTxslXyt7o",
    authDomain: "guardiao-jus.firebaseapp.com",
    projectId: "guardiao-jus",
    storageBucket: "guardiao-jus.firebasestorage.app",
    messagingSenderId: "953138134771",
    appId: "1:953138134771:web:c7f73cc8d1b38a93f30186",
    measurementId: "G-73L55K3ZK5"
};


// Inicializar Firebase
const app = initializeApp(firebaseConfig);

const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
