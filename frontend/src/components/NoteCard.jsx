import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Users, Edit2, Trash2 } from 'lucide-react';

const NoteCard = ({ note, onEdit, onDelete }) => {
    const { user } = useAuth();
    const isOwner = note.owner._id === user._id || note.owner === user._id;

    return (
        <div className="bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border rounded-xl p-5 hover:shadow-lg transition-all duration-200 flex flex-col h-full group">
            <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white line-clamp-1">{note.title}</h3>
                <div className="flex gap-2 opacity-100  transition-opacity">
                    <button
                        onClick={() => onEdit(note)}
                        className="p-1.5 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition"
                        title="Edit Note"
                    >
                        <Edit2 className="w-4 h-4" />
                    </button>
                    {isOwner && (
                        <button
                            onClick={() => onDelete(note._id)}
                            className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition"
                            title="Delete Note"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>

            <p className="text-gray-600 dark:text-gray-300 text-sm flex-grow line-clamp-4 whitespace-pre-wrap mb-4">
                {note.content}
            </p>

            <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-dark-border text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1.5 font-medium">
                    {isOwner ? (
                        <span className="bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400 px-2 py-1 rounded-md">Owner</span>
                    ) : (
                        <span className="bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400 px-2 py-1 rounded-md">Collaborator</span>
                    )}
                </div>

                {note.collaborators?.length > 0 && (
                    <div className="flex items-center gap-1 text-green-300" title={`${note.collaborators.length} collaborators`}>
                        <Users className="w-3.5 h-3.5" />
                        <span>{note.collaborators.length}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NoteCard;
