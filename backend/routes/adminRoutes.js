const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// In a real app, you would add an admin authentication middleware here.
// router.use(adminAuth); 

router.get('/ping', (req, res) => res.json({ message: 'Admin API is alive' }));
router.get('/stats', adminController.getStats);
router.get('/users', adminController.getAllUsers);
router.get('/users/:id/details', adminController.getUserDetails);
router.put('/users/:id', adminController.updateUser);
router.get('/offers', adminController.getAllOffers);
router.post('/offers', adminController.createOffer);
router.delete('/offers/:id', adminController.deleteOffer);

// CMS Routes
router.get('/content', adminController.getStaticContent);
router.put('/content', adminController.updateStaticContent);
router.get('/content/:key', adminController.getPublicContent);

module.exports = router;
