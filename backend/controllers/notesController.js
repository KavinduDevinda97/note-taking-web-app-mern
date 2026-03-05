const Note = require('../models/Note');
const User = require('../models/User');

// @desc    Get all notes for a user (owned and collaborated)
// @route   GET /api/notes
// @access  Private
exports.getNotes = async (req, res) => {
    try {
        const { search } = req.query;

        let query = {
            $or: [{ owner: req.user._id }, { collaborators: req.user._id }],
        };

        if (search) {
            query.$or = [
                ...query.$or,
                { title: { $regex: search, $options: 'i' } },
                { content: { $regex: search, $options: 'i' } }
            ];
            // To ensure it searches within user's accessible notes AND matches the term we need to wrap the user conditions in $and
            query = {
                $and: [
                    { $or: [{ owner: req.user._id }, { collaborators: req.user._id }] },
                    {
                        $or: [
                            { title: { $regex: search, $options: 'i' } },
                            { content: { $regex: search, $options: 'i' } }
                        ]
                    }
                ]
            };
        }

        const notes = await Note.find(query)
            .populate('owner', 'username email')
            .populate('collaborators', 'username email')
            .sort({ updatedAt: -1 });

        res.json(notes);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// @desc    Get single note
// @route   GET /api/notes/:id
// @access  Private
exports.getNoteById = async (req, res) => {
    try {
        const note = await Note.findById(req.params.id)
            .populate('owner', 'username email')
            .populate('collaborators', 'username email');

        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }

        // Check authorization
        if (
            note.owner._id.toString() !== req.user._id.toString() &&
            !note.collaborators.some(collab => collab._id.toString() === req.user._id.toString())
        ) {
            return res.status(403).json({ message: 'Not authorized to access this note' });
        }

        res.json(note);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// @desc    Create new note
// @route   POST /api/notes
// @access  Private
exports.createNote = async (req, res) => {
    try {
        const { title, content } = req.body;

        const note = await Note.create({
            title,
            content,
            owner: req.user._id,
        });

        const populatedNote = await Note.findById(note._id).populate('owner', 'username email');
        res.status(201).json(populatedNote);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// @desc    Update note
// @route   PUT /api/notes/:id
// @access  Private
exports.updateNote = async (req, res) => {
    try {
        const { title, content } = req.body;
        let note = await Note.findById(req.params.id);

        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }

        // Check authorization
        const isOwner = note.owner.toString() === req.user._id.toString();
        const isCollaborator = note.collaborators.some(collab => collab.toString() === req.user._id.toString());

        if (!isOwner && !isCollaborator) {
            return res.status(403).json({ message: 'Not authorized to update this note' });
        }

        note.title = title || note.title;
        note.content = content || note.content;
        const updatedNote = await note.save();

        res.json(updatedNote);
    } catch (err) {
        console.error('Update Error:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// @desc    Delete note
// @route   DELETE /api/notes/:id
// @access  Private
exports.deleteNote = async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);

        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }

        // Only owner can delete
        if (note.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this note' });
        }

        await note.deleteOne();
        res.json({ message: 'Note removed' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// @desc    Add collaborator
// @route   POST /api/notes/:id/collaborators
// @access  Private
exports.addCollaborator = async (req, res) => {
    try {
        const { email } = req.body;
        const note = await Note.findById(req.params.id);

        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }

        // Only owner can add collaborators
        if (note.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to add collaborators' });
        }

        const collaborator = await User.findOne({ email });
        if (!collaborator) {
            return res.status(404).json({ message: 'User not found with this email' });
        }

        if (note.owner.toString() === collaborator._id.toString()) {
            return res.status(400).json({ message: 'Owner cannot be a collaborator' });
        }

        if (note.collaborators.includes(collaborator._id)) {
            return res.status(400).json({ message: 'User is already a collaborator' });
        }

        note.collaborators.push(collaborator._id);
        await note.save();

        res.json({ message: 'Collaborator added successfully', collaborator: { _id: collaborator._id, username: collaborator.username, email: collaborator.email } });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};
// @desc    Remove collaborator
// @route   DELETE /api/notes/:id/collaborators/:collabId
// @access  Private
exports.removeCollaborator = async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);

        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }

        // Only owner can remove collaborators
        if (note.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to remove collaborators' });
        }

        const collaboratorId = req.params.collabId;

        if (!note.collaborators.includes(collaboratorId)) {
            return res.status(404).json({ message: 'Collaborator not found' });
        }

        note.collaborators = note.collaborators.filter(
            (collab) => collab.toString() !== collaboratorId
        );

        await note.save();

        res.json({ message: 'Collaborator removed successfully' });

    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};