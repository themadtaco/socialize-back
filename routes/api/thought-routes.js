const router = require('express').Router();

const {
    addThought,
    getAllThoughts,
    getThoughtById
} = require('../../controllers/thought-controller');

router.route('/').get(getAllThoughts);

router.route('/:id').get(getThoughtById);

router.route('/:userId').post(addThought);

module.exports = router;