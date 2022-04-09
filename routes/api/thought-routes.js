const router = require('express').Router();

const {
    addThought,
    getAllThoughts,
    getThoughtById,
    updateThought,
    deleteThought,
    addReaction,
    deleteReaction
} = require('../../controllers/thought-controller');

router.route('/').get(getAllThoughts);

router.route('/:id')
    .get(getThoughtById)
    .put(updateThought);

router.route('/:userId/:thoughtId')
    .delete(deleteThought);

router.route('/:userId').post(addThought);

router.route('/:id/reactions')
    .put(addReaction);

router.route('/:thoughtId/reactions/:reactionId')
    .delete(deleteReaction);


module.exports = router;