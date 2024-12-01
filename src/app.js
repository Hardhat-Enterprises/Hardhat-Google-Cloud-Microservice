const express = require('express');
const {addDocument, getDocument, updateDocument, deleteDocument} = require('./firestore');

const app = express();
app.use(express.json());

app.post('/:projectId/:databaseId/:collectionId', async (req, res) => {
    const {projectId, databaseId, collectionId} = req.params;
    const data = req.body;
    await addDocument(projectId,databaseId,collectionId,data);
    res.send('Document added');
    });
app.get('/:projectId/:databaseId/:collectionId/:documentId', async (req, res) => {
    const {projectId, databaseId, collectionId, documentId} = req.params;
    const document = await getDocument(projectId,databaseId,collectionId,documentId);
    res.send(document);
    });
app.get('/getall/:projectId/:databaseId/:collectionId', async (req, res) => {
    const {projectId, databaseId, collectionId} = req.params;
    const document = await getallDocument(projectId,databaseId,collectionId);
    res.send(document);
    }
);
app.put('/:projectId/:databaseId/:collectionId/:documentId', async (req, res) => {
    const {projectId, databaseId, collectionId, documentId} = req.params;
    const data = req.body;
    await updateDocument(projectId,databaseId,collectionId,documentId,data);
    res.send('Document updated');
    }
);
app.delete('/:projectId/:databaseId/:collectionId/:documentId', async (req, res) => {
    const {projectId, databaseId, collectionId, documentId} = req.params;
    await deleteDocument(projectId,databaseId,collectionId,documentId);
    res.send('Document deleted');
    }
);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    }
);
