const { Thought, User } = require('../models');

const thoughtController = {
    getAllThoughts(req, res){
        Thought.find({})
            .then(dbThoughtData => res.json(dbThoughtData))
            .catch(err => {
                console.log(err);
                res.status(500).json(err);
            });
    },

    getThoughtById({params}, res) {
        Thought.findOne({ _id: params.id })
            .populate({
                path: 'reactions',
                select: '-__v'
            })
            .select('-__v')
            .then(dbThoughtData => {
                if(!dbThoughtData) {
                    res.status(404).json({ message: 'No thought found with this id!'});
                    return;
                }
                res.json(dbThoughtData);
            })
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
    },

    // add thought
    addThought({ params, body }, res) {
        console.log(body);
        Thought.create(body)
            .then(({ _id }) => {
                return User.findOneAndUpdate(
                    { _id: params.userId },
                    { $push: { thoughts: _id } },
                    { new: true, runValidators: true }
                );
            })
            .then(dbUserData => {
                if(!dbUserData) {
                    res.status(404).json({ message: 'No user found with this id!'});
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => res.json(err));
    },

    // update thought by Id
    updateThought({ params, body }, res) {
        Thought.findByIdAndUpdate(
            { _id: params.id }, 
            body,
            { new: true, runValidators: true}
            )
            .then(dbThoughtData => {
                if(!dbThoughtData) {
                    res.status(404).json({ message: 'No thought found with this id'});
                    return;
                }
                res.json(dbThoughtData);
            })
            .catch(err => res.status(400).json(err));
    },

    // delete thought by id
    deleteThought({ params }, res) {
        Thought.findOneAndDelete({_id: params.thoughtId})
            .then(dbThoughtData => {
                if(!dbThoughtData) {
                    return res.status(404).json({ message: 'No thought found with this id'});
                }
                return User.findOneAndUpdate(
                    { _id: params.userId },
                    { $pull: { thoughts: params.thoughtId } },
                    { new: true}
                );
            })
            .then(dbThoughtData => {
                if (!dbThoughtData) {
                    res.status(404).json({ message: 'No user found with this id!'});
                    return;
                }
                res.json(dbThoughtData);
            })
            .catch(err => res.json(err));
    },

    // create a reaction
    addReaction({params, body}, res) {
        Thought.findOneAndUpdate(
            {_id: params.id},
            {$push: {reactions: body} },
            {new: true, runValidators: true }
        )
            .then(dbThoughtData => {
                if(!dbThoughtData) {
                    res.status(404).json({ message: 'No thought found with this id!'});
                    return;
                }
                res.json(dbThoughtData);
            })
            .catch(err => res.json(err));
    },

    // delete reaction
    deleteReaction({ params }, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            {$pull: { reactions: { reactionId: params.reactionId } } },
            { new: true }
        )
            .then(dbThoughtData => res.json(dbThoughtData))
            .catch(err => res.json(err));
    }
};

module.exports = thoughtController;