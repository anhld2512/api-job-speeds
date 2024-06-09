const express = require('express');
const {
  createApplication,
  getApplications,
  getApplicationById,
  updateApplication,
  deleteApplication,
  filterApplications // Import the filter function
} = require('../controllers/applyController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Route to create a new job application
// Endpoint: POST /api/applications
router.post('/', createApplication);

// Route to get all job applications
// Endpoint: GET /api/applications
router.get('/', getApplications);

// Route to get a specific job application by ID
// Authenticated route
// Endpoint: GET /api/applications/:id
router.get('/:id', authMiddleware, getApplicationById);

// Route to update a specific job application by ID
// Authenticated route
// Endpoint: PUT /api/applications/:id
router.put('/:id', authMiddleware, updateApplication);

// Route to delete a specific job application by ID
// Authenticated route
// Endpoint: DELETE /api/applications/:id
router.delete('/:id', authMiddleware, deleteApplication);

// Route to filter job applications
// Endpoint: GET /api/applications/filter
router.get('/filter', filterApplications);

module.exports = router;
