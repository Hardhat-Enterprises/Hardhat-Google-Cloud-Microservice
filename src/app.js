const express = require('express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const {
    addDocument,
    getDocument,
    updateDocument,
    deleteDocument,
    getallDocument,
} = require('./firestore');

const app = express();
app.use(express.json());

// Swagger definition
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Firestore API',
            version: '1.0.0',
            description: 'API for interacting with Firestore',
        },
        servers: [
            {
                url: 'http://localhost:8080', // Update to your server URL
            },
        ],
    },
    apis: ['./src/app.js'], // File path to where Swagger annotations are defined
};

// Initialize swagger-jsdoc
const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

/**
 * @swagger
 * /{projectId}/{databaseId}/{collectionId}:
 *   post:
 *     summary: Add a document to a Firestore collection
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *         description: Firestore project ID
 *       - in: path
 *         name: databaseId
 *         required: true
 *         schema:
 *           type: string
 *         description: Firestore database ID
 *       - in: path
 *         name: collectionId
 *         required: true
 *         schema:
 *           type: string
 *         description: Firestore collection ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               field1:
 *                 type: string
 *               field2:
 *                 type: string
 *     responses:
 *       201:
 *         description: Document created successfully
 *       400:
 *         description: Invalid request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Invalid data format
 *       500:
 *         description: Internal server error
 */
app.post('/:projectId/:databaseId/:collectionId', async (req, res) => {
    try {
        const { projectId, databaseId, collectionId } = req.params;
        const data = req.body;
        if (!data) {
            return res.status(400).json({ error: 'Invalid data format' });
        }
        await addDocument(projectId, databaseId, collectionId, data);
        res.status(201).send('Document created successfully');
    } catch (error) {
        res.status(500).json({ error: 'Failed to create the document' });
    }
});

/**
 * @swagger
 * /{projectId}/{databaseId}/{collectionId}/{documentId}:
 *   get:
 *     summary: Get a document from Firestore
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *         description: Firestore project ID
 *       - in: path
 *         name: databaseId
 *         required: true
 *         schema:
 *           type: string
 *         description: Firestore database ID
 *       - in: path
 *         name: collectionId
 *         required: true
 *         schema:
 *           type: string
 *         description: Firestore collection ID
 *       - in: path
 *         name: documentId
 *         required: true
 *         schema:
 *           type: string
 *         description: Firestore document ID
 *     responses:
 *       200:
 *         description: Document retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 data:
 *                   type: object
 *       404:
 *         description: Document not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Document not found
 *       500:
 *         description: Internal server error
 */
app.get('/:projectId/:databaseId/:collectionId/:documentId', async (req, res) => {
    try {
        const { projectId, databaseId, collectionId, documentId } = req.params;

        console.log('Fetching document with params:', { projectId, databaseId, collectionId, documentId });

        const document = await getDocument(projectId, databaseId, collectionId, documentId);

        if (!document) {
            console.warn('Document not found:', { projectId, databaseId, collectionId, documentId });
            return res.status(404).json({ error: 'Document not found' });
        }

        console.log('Document fetched successfully:', document);
        res.status(200).json(document);
    } catch (error) {
        console.error('Error in route handler:', error.message, error.stack);
        res.status(500).json({ error: 'An unexpected error occurred' });
    }
});


/**
 * @swagger
 * /getall/{projectId}/{databaseId}/{collectionId}:
 *   get:
 *     summary: Get all documents from a Firestore collection
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *         description: Firestore project ID
 *       - in: path
 *         name: databaseId
 *         required: true
 *         schema:
 *           type: string
 *         description: Firestore database ID
 *       - in: path
 *         name: collectionId
 *         required: true
 *         schema:
 *           type: string
 *         description: Firestore collection ID
 *     responses:
 *       200:
 *         description: Documents retrieved successfully
 */
app.get('/getall/:projectId/:databaseId/:collectionId', async (req, res) => {
    try {
        const { projectId, databaseId, collectionId } = req.params;
        const documents = await getallDocument(projectId, databaseId, collectionId);
        res.status(200).json(documents);
    } catch (error) {
        console.error('Error fetching document:', error); // Logs the error
        res.status(500).json({ error: 'An unexpected error occurred' });
    }
});

/**
 * @swagger
 * /{projectId}/{databaseId}/{collectionId}/{documentId}:
 *   put:
 *     summary: Update a document in Firestore
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *         description: Firestore project ID
 *       - in: path
 *         name: databaseId
 *         required: true
 *         schema:
 *           type: string
 *         description: Firestore database ID
 *       - in: path
 *         name: collectionId
 *         required: true
 *         schema:
 *           type: string
 *         description: Firestore collection ID
 *       - in: path
 *         name: documentId
 *         required: true
 *         schema:
 *           type: string
 *         description: Firestore document ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Document updated successfully
 */
app.put('/:projectId/:databaseId/:collectionId/:documentId', async (req, res) => {
    try {
        const { projectId, databaseId, collectionId, documentId } = req.params;
        const data = req.body;
        await updateDocument(projectId, databaseId, collectionId, documentId, data);
        res.status(200).send('Document updated successfully');
    } catch (error) {
        res.status(500).json({ error: 'Failed to update the document' });
    }
});

/**
 * @swagger
 * /{projectId}/{databaseId}/{collectionId}/{documentId}:
 *   delete:
 *     summary: Delete a document from Firestore
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *         description: Firestore project ID
 *       - in: path
 *         name: databaseId
 *         required: true
 *         schema:
 *           type: string
 *         description: Firestore database ID
 *       - in: path
 *         name: collectionId
 *         required: true
 *         schema:
 *           type: string
 *         description: Firestore collection ID
 *       - in: path
 *         name: documentId
 *         required: true
 *         schema:
 *           type: string
 *         description: Firestore document ID
 *     responses:
 *       200:
 *         description: Document deleted successfully
 */
app.delete('/:projectId/:databaseId/:collectionId/:documentId', async (req, res) => {
    try {
        const { projectId, databaseId, collectionId, documentId } = req.params;
        await deleteDocument(projectId, databaseId, collectionId, documentId);
        res.status(200).send('Document deleted successfully');
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete the document' });
    }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
