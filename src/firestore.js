const {Firestore} = require('@google-cloud/firestore');

function initFirestore(projectId,databaseId) {
  return new Firestore(
    {
        projectId: projectId,
        databaseId: databaseId
    }
  );
}

async function addDocument(projectId,databaseId,collectionId,data) {
  const firestore = initFirestore(projectId,databaseId);
  const document = await firestore.collection(collectionId).add(data);
}
async function getallDocument(projectId,databaseId,collectionId) {
    const firestore = initFirestore(projectId,databaseId);
    const document = await firestore.collection(collectionId).get();
    return document;
    }
async function getDocument(projectId,databaseId,collectionId,documentId) {
  const firestore = initFirestore(projectId,databaseId);
  const document = await firestore.collection(collectionId).doc(documentId).get();
  return document.data();
}

async function updateDocument(projectId,databaseId,collectionId,documentId,data) {
  const firestore = initFirestore(projectId,databaseId);
  await firestore.collection(collectionId).doc(documentId).update(data);
}
async function deleteDocument(projectId,databaseId,collectionId,documentId) {
  const firestore = initFirestore(projectId,databaseId);
  await firestore.collection(collectionId).doc(documentId).delete();
}
module.exports = {addDocument, getDocument, updateDocument, deleteDocument,getallDocument};