
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, doc, setDoc } = require('firebase/firestore');
const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config();

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
  measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function sync() {
  console.log('Loading articles...');
  let content = fs.readFileSync('src/data/sampleArticles.ts', 'utf8');
  
  // Strip TypeScript stuff
  content = content.replace(/import type {.*} from '.*';/g, '');
  content = content.replace(/export const (\w+): (\w+)(\[\])? =/g, 'var $1 =');
  content = content.replace(/export const (\w+) =/g, 'var $1 =');
  
  // Execute cleaned code
  eval(content);
  
  const articles = sampleArticles;
  const config = defaultSiteConfig;
  
  console.log(`Pousser ${articles.length} articles vers Firestore...`);
  
  for (const article of articles) {
    try {
      await setDoc(doc(db, 'articles', article.id), article);
    } catch (e) {
      console.error(`Erreur ${article.id}:`, e.message);
    }
  }
  
  console.log('Pousser configuration du site...');
  await setDoc(doc(db, 'config', 'site'), config);
  
  console.log('Fini !');
  process.exit(0);
}

sync().catch(e => { console.error(e); process.exit(1); });
