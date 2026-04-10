const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, writeBatch, doc } = require('firebase/firestore');
const fs = require('fs');
const path = require('path');

// Read from JSON file instead of TS parsing
const articles = JSON.parse(fs.readFileSync(path.join(__dirname, 'articles.json'), 'utf8'));

console.log(`Found ${articles.length} articles to sync.`);

// Read .env file to get VITE_FIREBASE_* variables
const envContent = fs.readFileSync(path.join(__dirname, '../.env'), 'utf8');
const getEnv = (key) => {
    const match = envContent.match(new RegExp(`${key}\\s*=\\s*(.*)`));
    return match ? match[1].trim() : undefined;
};

const firebaseConfig = {
  apiKey: getEnv('VITE_FIREBASE_API_KEY'),
  authDomain: getEnv('VITE_FIREBASE_AUTH_DOMAIN'),
  projectId: getEnv('VITE_FIREBASE_PROJECT_ID'),
  storageBucket: getEnv('VITE_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: getEnv('VITE_FIREBASE_MESSAGING_SENDER_ID'),
  appId: getEnv('VITE_FIREBASE_APP_ID')
};

console.log('Using Firebase project:', firebaseConfig.projectId);

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function sync() {
    const articlesCol = collection(db, 'articles');
    
    console.log('Cleaning existing articles with auto- or demo- prefix...');
    const snapshot = await getDocs(articlesCol);
    
    const docsToDelete = [];
    snapshot.forEach(docSnap => {
        if (docSnap.id.startsWith('auto-') || docSnap.id.startsWith('demo-')) {
            docsToDelete.push(docSnap.ref);
        }
    });

    for (let i = 0; i < docsToDelete.length; i += 400) {
        const batch = writeBatch(db);
        const chunk = docsToDelete.slice(i, i + 400);
        chunk.forEach(ref => batch.delete(ref));
        await batch.commit();
        console.log(`Deleted ${Math.min(i + 400, docsToDelete.length)} articles...`);
    }

    console.log(`Finished cleaning. Total deleted: ${docsToDelete.length}`);

    // Adding new articles
    console.log('Pushing new articles...');
    for (let i = 0; i < articles.length; i += 400) {
        const batch = writeBatch(db);
        const chunk = articles.slice(i, i + 400);
        chunk.forEach(article => {
            const articleRef = doc(articlesCol, article.id);
            batch.set(articleRef, article);
        });
        await batch.commit();
        console.log(`Pushed items ${i} to ${Math.min(i + 400, articles.length)}`);
    }

    console.log('Sync complete!');
    process.exit(0);
}

sync().catch(err => {
    console.error('Sync failed:', err);
    process.exit(1);
});
