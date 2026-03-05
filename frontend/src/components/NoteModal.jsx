import React, { useState, useEffect } from "react";
import { X, Search, UserPlus, Users, Trash2 } from "lucide-react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
const NoteModal = ({ isOpen, onClose, note, onSave }) => {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [collabEmail, setCollabEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [collaborators, setCollaborators] = useState([]);
  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setCollaborators(note.collaborators || []);
    } else {
      setTitle("");
      setContent("");
      setCollaborators([]);
    }
    setError("");
    setSuccess("");
    setCollabEmail("");
  }, [note, isOpen]);
  if (!isOpen) return null;
  const isOwner =
    !note ||
    (note.owner && (note.owner._id === user._id || note.owner === user._id));
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!title.trim() || !content.trim()) {
      setError("Title and content are required");
      return;
    }
    try {
      await onSave({ title, content }, note?._id);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save note");
    }
  };
  const addCollaborator = async (e) => {
    e.preventDefault();
    if (!collabEmail.trim()) return;
    try {
      setError("");
      setSuccess("");
      const res = await api.post(`/notes/${note._id}/collaborators`, {
        email: collabEmail,
      });
      setSuccess("Collaborator added successfully");
      setCollaborators([...collaborators, res.data.collaborator]);
      setCollabEmail("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add collaborator");
    }
  };
  const removeCollaborator = async (collabId) => {
  try {
    setError("");
    setSuccess("");

    await api.delete(`/notes/${note._id}/collaborators/${collabId}`);

    setCollaborators(collaborators.filter((c) => c._id !== collabId));
    setSuccess("Collaborator removed successfully");
  } catch (err) {
    setError(err.response?.data?.message || "Failed to remove collaborator");
  }
};
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-dark-surface rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-dark-border">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {note ? "Edit Note" : "Create New Note"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-bg rounded-full transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="flex-grow overflow-y-auto p-6 flex flex-col md:flex-row gap-6">
          <form
            id="note-form"
            onSubmit={handleSubmit}
            className="flex-grow space-y-4"
          >
            {error && (
              <div className="text-red-500 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            <div>
              <input
                type="text"
                placeholder="Note Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-xl font-semibold px-4 py-3 rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
              />
            </div>
            <div className="flex-grow min-h-[300px]">
              <textarea
                placeholder="Write your note content here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full h-full min-h-[300px] p-4 rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-bg text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition resize-y font-mono text-sm leading-relaxed"
              />
            </div>
          </form>
          {note && isOwner && (
            <div className="w-full md:w-72 border-t md:border-t-0 md:border-l border-gray-100 dark:border-dark-border md:pl-6 pt-6 md:pt-0">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-primary-500" />
                Collaborators
              </h3>
              <form onSubmit={addCollaborator} className="mb-4 flex gap-2">
                <input
                  type="email"
                  placeholder="User email"
                  value={collabEmail}
                  onChange={(e) => setCollabEmail(e.target.value)}
                  className="flex-grow px-3 py-2 rounded-lg border border-gray-200 dark:border-dark-border bg-gray-50 dark:bg-dark-bg text-sm outline-none focus:ring-2 focus:ring-primary-500"
                />
                <button
                  type="submit"
                  className="bg-primary-100 text-primary-600 hover:bg-primary-200 dark:bg-primary-900/30 dark:hover:bg-primary-900/50 p-2 rounded-lg transition"
                  title="Add Collaborator"
                >
                  <UserPlus className="w-4 h-4" />
                </button>
              </form>
              {success && (
                <div className="text-green-600 bg-green-50 dark:bg-green-900/20 p-2 rounded-lg text-xs mb-3">
                  {success}
                </div>
              )}
              <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
                {collaborators.length === 0 ? (
                  <p className="text-sm text-gray-500 italic">
                    No collaborators yet.
                  </p>
                ) : (
                  collaborators.map((c) => (
                    <div
                      key={c._id}
                      className="text-sm px-3 py-2 bg-gray-50 dark:bg-dark-bg rounded-lg flex items-center gap-2 border border-gray-100 dark:border-dark-border"
                    >
                      <div className="w-6 h-6 rounded-full bg-primary-500 text-white flex items-center justify-center font-bold text-xs uppercase">
                        {c.username ? c.username.charAt(0) : "?"}
                      </div>
                      <span className="truncate flex-grow" title={c.email}>
                        {c.email}
                      </span>
                      <button
                        onClick={() => removeCollaborator(c._id)}
                        className="text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 p-1 rounded"
                        title="Remove collaborator"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
        <div className="p-6 border-t border-gray-100 dark:border-dark-border bg-gray-50 dark:bg-dark-bg/50 flex justify-end gap-3 rounded-b-2xl">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg text-gray-600 dark:text-gray-300 font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="note-form"
            className="px-6 py-2.5 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-medium shadow-sm transition"
          >
            {note ? "Save Changes" : "Create Note"}
          </button>
        </div>
      </div>
    </div>
  );
};
export default NoteModal;
