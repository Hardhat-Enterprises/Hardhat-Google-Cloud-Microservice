const { Firestore } = require('@google-cloud/firestore');

const firestore = new Firestore({
    projectId: 'sit-24t3-187893372-046ed36', // Replace with your project ID
    databaseId: 'smishing-database', // Replace with your custom database ID
});

// Test connection
async function testFirestoreConnection() {
    try {
        const collections = await firestore.listCollections();
        if (collections.length === 0) {
            console.log('Connected to Firestore (smishing-database)! No collections found.');
        } else {
            console.log('Connected to Firestore (smishing-database)! Collections:');
            collections.forEach(col => console.log(`- ${col.id}`));
        }
    } catch (error) {
        console.error('Error connecting to Firestore:', error.message);
    }
}

testFirestoreConnection();
