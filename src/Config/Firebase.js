import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import multer from 'multer';

// Konfigurasi Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAVAa1n3KFbokVqoxgbhm8qZKXAxChfoxA",
  authDomain: "inventaris-15fde.firebaseapp.com",
  projectId: "inventaris-15fde",
  storageBucket: "inventaris-15fde.appspot.com",
  messagingSenderId: "666060624790",
  appId: "1:666060624790:web:1176b5fff172d2881bc3b7",
  measurementId: "G-WNZWRN960Z"
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app); // Ekspor storage dari Firebase

// Konfigurasi Multer untuk menyimpan file di memori
const memoryStorage = multer.memoryStorage();
export const upload = multer({ storage: memoryStorage }); // Ekspor upload dari Multer
