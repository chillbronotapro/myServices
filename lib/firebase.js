import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
/*   "type": "service_account",
  "project_id": "awesomproject-c3506",
  "private_key_id": "1945c3a4f65cb358abdb789801d941751b44db77",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDIDIhx8SKFNXY9\n8uwCMtE/5TfFZ5s44h4gnyMMTB3hfNBNTTFQ8tFBkuTbceneIAoKhrHIFb5y32N4\n5z3FMFCFwd7p9wEyWMelTKFShr4iOM8Pt7WkoG/hrrJZeUQW1UGX1F9Ycloy5gvv\np2uSIyMEEbpsWa6j/gX0BkworjWTjg2TxPKOXHUBvLFHbDHSZbOzQWh1/G0jxboz\nz0oJAFDpV4tb/Oua/2/u9mK0nCAX2SkHbMQZYGx6o8j+6P7/+fEb8TK571W+tJpP\n/Wv8lQ6vTQwZOrxkCtmIgMAh7YkuSXsBDaJK4784HwMGYEaVN4EMpRB8eWRgzV5J\n5pfo7+G/AgMBAAECggEALbnPplu7zD8AHADeuVHsSnKWYOThsgrdYA9/71umqNfi\ntQij8SDPe/Gbph1Pm5ovMWDAWj++HHu7PPN+RwhYH3rE/S2cdGmemMX/SeHKq//Y\nNHuFZW/WovtPgOwbCC0OpSnB8XGR9Hho2gqmp+yoIFH9Dq8hIBL8QV7/IX1Qeb1i\n4z8I5ahwbORLAhKTMCaOhuaQUYEOR/3zgw5CYUNsSU69zvusU3BxEwwfD2lGVQBC\nufBu0OtiB/3iNUYZxoehkp7b8DWZo9RciksuwNkw7IgBLhkiCtoN23l/VT/KQ0b5\nDOPFAWH9jh2rbHXveYcOOvMF6chKeLAGfsfG2JjBoQKBgQDyQLXDrOk+ZYAxRcUA\nJ77WYKFH/Cp6eMLOMIqJN2BN44GbwXyqy31OYJXqhY4K+ZlqQHI56aWb1I4VxBM/\ngeIi3Ya1TP+9xeKwbfryQe2J/BKN87MRIYBVZpu0DqIIsBviTte4C4R4mYWq8xA5\nwJlJU4twf7rqw/uHwlWINmfR9QKBgQDTZraoRbVHm9BcFAOpHAcRC3JFqU4oYRzW\nh/059QDqrMg2DQsZhR81Y379SNH3V/eQZKBLaS5bkAGzuQSoYHhTOskfLRA8sJmU\nmGSeks1+uTplKPoHeZFFfZLVRhmKa7NMesInInlWnQo+raQzHr42mFXVXGhFgdgS\nkXCQRaTwYwKBgA2005PqqJe7LnGbPPYxSX7foMBt6Ald48e+v1fcJjrB8Idbfy46\nrTBODq1iORMt5Bw64TudmJ0kfZWFroEdXCoU1pZTcPTPyW+qCVTDnij8diBJ9Yu2\nlYg/cffSDCDpteosA9CJ9kjMht+ROQ3Lc+DONUl8MJsv039u41/9lAoxAoGBAIEQ\nBVYIcNtOElAU3ANDnEDYtyQ2cAQQ/fUvwva+UJf1cqolHnCvKFWE8AOckKusZfUe\nqgpAJdA6w/9AZsqRUwSlMCK7dV1ICAuDWnLBd3n1heQ6tyMXIgzF1H4mtPMgO6/m\nhmA0GNY7PAT2J/gZvdFBAa4oI3TEB/GWH53FFyS3AoGAfdRKm/O1v+EqwSN6AahP\nntgmx45eml/Kcxx42QdjEVekeOaGhRq8yMiJRR0chJ5t3Vq8p8p0X9vAcUkAL98w\nvT7/r9d0K9AXVJt1dm1DF+gL/pPuyStpqSoSeIdhA6WUhbu52YcVXcS+B9eyyiRt\nSh+qbSAFri4IlSWTqFQlOds=\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-fbsvc@awesomproject-c3506.iam.gserviceaccount.com",
  "client_id": "114710570402069615437",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40awesomproject-c3506.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com" */
  apiKey: "AIzaSyDGCV1sSL_XqS757Oitpo0XoHGpvqVuIkM",
  authDomain: "myservices-7ab69.firebaseapp.com",
  projectId: "myservices-7ab69",
  storageBucket: "myservices-7ab69.firebasestorage.app",
  messagingSenderId: "360051974330",
  appId: "1:360051974330:web:3527cda3da8489d81f2283",
  measurementId: "G-413F82JPRV"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);