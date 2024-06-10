const express = require('express');
const {
    createJob,
    getAllJobs,
    getJobById,
    updateJobById,
    deleteJobById,
    filterJobs,
    getDistinctValues
} = require('../controllers/jobController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();
router.post('/', authMiddleware, createJob);
router.get('/', getAllJobs);
router.post('/filter', filterJobs);
router.get('/distinct', getDistinctValues);
router.get('/:id', getJobById);
router.put('/:id', authMiddleware, updateJobById);
router.delete('/:id', authMiddleware, deleteJobById);
module.exports = router;