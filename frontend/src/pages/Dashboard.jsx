import React, { useState, useEffect } from 'react';
import { Plus, Search, Loader } from 'lucide-react';
import api from '../services/api';
import NoteCard from '../components/NoteCard';
import NoteModal from '../components/NoteModal';

const Dashboard = () => {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentNote, setCurrentNote] = useState(null);

    const fetchNotes = async (search = '') => {
        setLoading(true);
        try {
            const res = await api.get(`/notes${search ? `?search=${encodeURIComponent(search)}` : ''}`);
            setNotes(res.data);
        } catch (err) {
            console.error('Failed to fetch notes:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Debounce search
        const delayDebounceFn = setTimeout(() => {
            fetchNotes(searchQuery);
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery]);

    const handleCreateOrUpdateNote = async (noteData, id = null) => {
        try {
            if (id) {
                await api.put(`/notes/${id}`, noteData);
            } else {
                await api.post('/notes', noteData);
            }
            setIsModalOpen(false);
            fetchNotes(searchQuery); // Refresh list
        } catch (err) {
            console.error('Failed to save note:', err);
            throw err;
        }
    };

    const handleDeleteNote = async (id) => {
        if (window.confirm('Are you sure you want to delete this note?')) {
            try {
                await api.delete(`/notes/${id}`);
                fetchNotes(searchQuery); // Refresh list
            } catch (err) {
                console.error('Failed to delete note:', err);
                alert(err.response?.data?.message || 'Failed to delete note');
            }
        }
    };

    const openNewNoteModal = () => {
        setCurrentNote(null);
        setIsModalOpen(true);
    };

    const openEditNoteModal = (note) => {
        setCurrentNote(note);
        setIsModalOpen(true);
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8">

            {/* Header & Controls */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-dark-surface p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-border">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-teal-500 bg-clip-text text-transparent">
                        Your Workspace
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Manage, search, and collaborate on your notes.</p>
                </div>

                <div className="flex flex-col sm:flex-row w-full md:w-auto gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search notes..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full sm:w-64 pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-dark-border bg-gray-50 dark:bg-dark-bg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition"
                        />
                    </div>
                    <button
                        onClick={openNewNoteModal}
                        className="flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-medium py-2.5 px-5 rounded-xl shadow-md shadow-primary-500/20 hover:shadow-lg hover:shadow-primary-500/30 transition-all"
                    >
                        <Plus className="w-5 h-5" />
                        <span>New Note</span>
                    </button>
                </div>
            </div>

            {/* Notes Grid */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                    <Loader className="w-10 h-10 animate-spin text-primary-500 mb-4" />
                    <p>Loading your notes...</p>
                </div>
            ) : notes.length === 0 ? (
                <div className="bg-white dark:bg-dark-surface rounded-2xl border border-gray-100 dark:border-dark-border p-12 text-center shadow-sm">
                    <div className="w-20 h-20 bg-primary-50 dark:bg-primary-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Search className="w-10 h-10 text-primary-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        {searchQuery ? 'No notes found' : 'No notes yet'}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto mb-6">
                        {searchQuery
                            ? `We couldn't find any notes matching "${searchQuery}". Try a different term.`
                            : 'Create your first note to get started with capturing your brilliant ideas.'}
                    </p>
                    {!searchQuery && (
                        <button
                            onClick={openNewNoteModal}
                            className="text-primary-600 font-medium hover:text-primary-700 bg-primary-50 hover:bg-primary-100 dark:bg-primary-900/30 dark:hover:bg-primary-900/50 px-6 py-2.5 rounded-lg transition"
                        >
                            Start typing
                        </button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {notes.map(note => (
                        <NoteCard
                            key={note._id}
                            note={note}
                            onEdit={openEditNoteModal}
                            onDelete={handleDeleteNote}
                        />
                    ))}
                </div>
            )}

            {/* Modal */}
            <NoteModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                note={currentNote}
                onSave={handleCreateOrUpdateNote}
            />

        </div>
    );
};

export default Dashboard;
