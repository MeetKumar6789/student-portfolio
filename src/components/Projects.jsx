import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Skills from './Skills';
import api from '../api';
import './Projects.css';

function Spinner() {
  return (
    <div className="projects-spinner" role="status" aria-live="polite">
      Loading tasks...
    </div>
  );
}

function ErrorMessage({ message, onRetry }) {
  return (
    <div className="projects-error" role="alert">
      <p>Unable to load tasks right now.</p>
      <p>{message}</p>
      {onRetry && (
        <button type="button" className="retry-button" onClick={onRetry}>
          Retry
        </button>
      )}
    </div>
  );
}

function Toast({ toast, onClose }) {
  if (!toast) return null;

  return (
    <div className={`toast-notification ${toast.type}`} role="status">
      <span>{toast.message}</span>
      <button
        type="button"
        onClick={onClose}
        style={{
          background: 'transparent',
          border: 'none',
          color: '#fff',
          fontWeight: 'bold',
          cursor: 'pointer',
          marginLeft: '0.5rem',
        }}
      >
        ✕
      </button>
    </div>
  );
}

function ConfirmModal({ isOpen, title, message, onConfirm, onCancel, isProcessing }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal-content">
        <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--text-primary)' }}>
          {title}
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{message}</p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
          <button
            type="button"
            onClick={onCancel}
            disabled={isProcessing}
            style={{
              padding: '0.6rem 1.2rem',
              borderRadius: '8px',
              border: '1px solid var(--border)',
              background: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isProcessing}
            style={{
              padding: '0.6rem 1.2rem',
              borderRadius: '8px',
              border: 'none',
              background: '#ef4444',
              color: '#fff',
              fontWeight: '600',
              cursor: isProcessing ? 'not-allowed' : 'pointer',
              opacity: isProcessing ? 0.7 : 1,
            }}
          >
            {isProcessing ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}

function Projects({ skills }) {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');

  // Form State
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newPriority, setNewPriority] = useState('medium');
  const [isCreating, setIsCreating] = useState(false);

  // Update & Delete States
  const [editingTask, setEditingTask] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [deletingTask, setDeletingTask] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toast state
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // GET /tasks
  const loadTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getTasks();
      setTasks(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError(err.message || 'Failed to load tasks from server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!api.getAuthToken()) {
      navigate('/login', { replace: true });
      return;
    }

    loadTasks();
    api.getCurrentUser()
      .then((res) => setCurrentUser(res.data))
      .catch((err) => setError(err.message || 'Unable to verify your session.'));
  }, [navigate]);

  const handleLogout = () => {
    api.clearAuthToken();
    navigate('/login', { replace: true });
  };

  // POST /tasks (Optimistic UI Update)
  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      showToast('Task title is required', 'error');
      return;
    }

    setIsCreating(true);

    const tempId = `temp-${Date.now()}`;
    const optimisticTask = {
      _id: tempId,
      title: newTitle.trim(),
      description: newDescription.trim(),
      priority: newPriority,
      completed: false,
      createdAt: new Date().toISOString(),
      isOptimistic: true,
    };

    // Optimistically insert local item
    setTasks((prev) => [optimisticTask, ...prev]);

    const taskPayload = {
      title: newTitle.trim(),
      description: newDescription.trim(),
      priority: newPriority,
      completed: false,
    };

    // Reset form fields
    setNewTitle('');
    setNewDescription('');
    setNewPriority('medium');

    try {
      const res = await api.createTask(taskPayload);
      if (res && res.success && res.data) {
        // Confirm write succeeded by replacing optimistic task with response data
        setTasks((prev) => prev.map((t) => (t._id === tempId ? res.data : t)));
        showToast('Task created successfully!', 'success');
      } else {
        throw new Error('Server returned invalid response');
      }
    } catch (err) {
      // Rollback optimistic task on failure
      setTasks((prev) => prev.filter((t) => t._id !== tempId));
      showToast(err.message || 'Failed to create task.', 'error');
    } finally {
      setIsCreating(false);
    }
  };

  // PUT /tasks/:id (Toggle complete or save edits)
  const handleToggleComplete = async (task) => {
    const updatedCompleted = !task.completed;

    try {
      const res = await api.updateTask(task._id, { completed: updatedCompleted });
      if (res && res.success && res.data) {
        setTasks((prev) => prev.map((t) => (t._id === task._id ? res.data : t)));
        showToast(
          `Task marked as ${updatedCompleted ? 'completed' : 'pending'}!`,
          'success'
        );
      }
    } catch (err) {
      showToast(err.message || 'Failed to update task status.', 'error');
    }
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingTask || !editingTask.title.trim()) {
      showToast('Title cannot be empty', 'error');
      return;
    }

    setIsUpdating(true);
    try {
      const res = await api.updateTask(editingTask._id, {
        title: editingTask.title.trim(),
        description: editingTask.description,
        priority: editingTask.priority,
      });

      if (res && res.success && res.data) {
        setTasks((prev) => prev.map((t) => (t._id === editingTask._id ? res.data : t)));
        showToast('Task updated successfully!', 'success');
        setEditingTask(null);
      }
    } catch (err) {
      showToast(err.message || 'Failed to update task.', 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  // DELETE /tasks/:id (With Confirmation Dialog)
  const handleConfirmDelete = async () => {
    if (!deletingTask) return;

    setIsDeleting(true);
    try {
      const res = await api.deleteTask(deletingTask._id);
      if (res && res.success) {
        setTasks((prev) => prev.filter((t) => t._id !== deletingTask._id));
        showToast('Task deleted successfully!', 'success');
      }
    } catch (err) {
      showToast(err.message || 'Failed to delete task.', 'error');
    } finally {
      setIsDeleting(false);
      setDeletingTask(null);
    }
  };

  const filteredTasks = tasks.filter(
    (t) =>
      t.title.toLowerCase().includes(query.toLowerCase()) ||
      (t.description && t.description.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div className="projects-page">
      <Skills skills={skills} />

      <section className="github-projects" aria-label="Task Manager Overview">
        <div className="section-label">
          <span className="label-dot"></span>
          Task Manager
        </div>
        <h2 className="section-heading">
          Full-Stack Task
          <span className="heading-accent"> Management</span>
        </h2>

        <div className="task-session-bar">
          <span>Signed in as <strong>{currentUser?.email || 'Loading account...'}</strong></span>
          <button type="button" onClick={handleLogout}>Sign out</button>
        </div>

        {/* Task Creation Form */}
        <form onSubmit={handleCreateTask} className="task-form-card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--text-primary)' }}>
            Create New Task
          </h3>
          <div className="task-form-grid">
            <div className="task-input-group">
              <label htmlFor="task-title">Title *</label>
              <input
                id="task-title"
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Enter task title"
                disabled={isCreating}
                required
              />
            </div>
            <div className="task-input-group">
              <label htmlFor="task-priority">Priority</label>
              <select
                id="task-priority"
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value)}
                disabled={isCreating}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
          <div className="task-input-group" style={{ marginTop: '0.8rem' }}>
            <label htmlFor="task-description">Description</label>
            <textarea
              id="task-description"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="Enter task details (optional)"
              disabled={isCreating}
            />
          </div>
          <button
            type="submit"
            className="retry-button"
            style={{ marginTop: '1rem' }}
            disabled={isCreating}
          >
            {isCreating ? 'Creating Task...' : 'Add Task'}
          </button>
        </form>

        {/* Task Search Filter */}
        <div className="repo-search-box">
          <label htmlFor="task-search">Search tasks</label>
          <input
            id="task-search"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter by title or description..."
          />
        </div>

        {/* Loading / Error / Content States */}
        {loading ? (
          <Spinner />
        ) : error ? (
          <ErrorMessage message={error} onRetry={loadTasks} />
        ) : filteredTasks.length === 0 ? (
          <p className="no-repos">No tasks found.</p>
        ) : (
          <div className="repo-list">
            {filteredTasks.map((task) => (
              <div
                key={task._id}
                className={`task-card ${task.isOptimistic ? 'optimistic' : ''}`}
              >
                {editingTask && editingTask._id === task._id ? (
                  /* Edit Form */
                  <form onSubmit={handleSaveEdit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div className="task-input-group">
                      <label htmlFor={`edit-title-${task._id}`}>Title</label>
                      <input
                        id={`edit-title-${task._id}`}
                        type="text"
                        value={editingTask.title}
                        onChange={(e) =>
                          setEditingTask({ ...editingTask, title: e.target.value })
                        }
                        disabled={isUpdating}
                        required
                      />
                    </div>
                    <div className="task-input-group">
                      <label htmlFor={`edit-desc-${task._id}`}>Description</label>
                      <textarea
                        id={`edit-desc-${task._id}`}
                        value={editingTask.description || ''}
                        onChange={(e) =>
                          setEditingTask({ ...editingTask, description: e.target.value })
                        }
                        disabled={isUpdating}
                      />
                    </div>
                    <div className="task-input-group">
                      <label htmlFor={`edit-priority-${task._id}`}>Priority</label>
                      <select
                        id={`edit-priority-${task._id}`}
                        value={editingTask.priority}
                        onChange={(e) =>
                          setEditingTask({ ...editingTask, priority: e.target.value })
                        }
                        disabled={isUpdating}
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                      <button
                        type="submit"
                        disabled={isUpdating}
                        style={{
                          padding: '0.5rem 1rem',
                          borderRadius: '8px',
                          border: 'none',
                          background: 'var(--accent)',
                          color: '#fff',
                          fontWeight: '600',
                          cursor: 'pointer',
                        }}
                      >
                        {isUpdating ? 'Saving...' : 'Save'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingTask(null)}
                        disabled={isUpdating}
                        style={{
                          padding: '0.5rem 1rem',
                          borderRadius: '8px',
                          border: '1px solid var(--border)',
                          background: 'var(--bg-secondary)',
                          color: 'var(--text-primary)',
                          fontWeight: '600',
                          cursor: 'pointer',
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  /* Display Task Card */
                  <>
                    <div className="task-card-header">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <input
                          type="checkbox"
                          checked={Boolean(task.completed)}
                          onChange={() => handleToggleComplete(task)}
                          disabled={task.isOptimistic}
                          style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                          title="Toggle Task Completion"
                        />
                        <span className={`task-title ${task.completed ? 'completed' : ''}`}>
                          {task.title}
                        </span>
                      </div>
                      <span className={`priority-badge ${task.priority || 'medium'}`}>
                        {task.priority || 'medium'}
                      </span>
                    </div>

                    {task.description && (
                      <p className="task-description">{task.description}</p>
                    )}

                    {task.isOptimistic && (
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', italic: 'true' }}>
                        Saving task...
                      </span>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
                      <button
                        type="button"
                        onClick={() => setEditingTask({ ...task })}
                        disabled={task.isOptimistic}
                        style={{
                          padding: '0.4rem 0.8rem',
                          borderRadius: '8px',
                          border: '1px solid var(--border)',
                          background: 'var(--bg-secondary)',
                          color: 'var(--text-primary)',
                          fontSize: '0.85rem',
                          fontWeight: '600',
                          cursor: task.isOptimistic ? 'not-allowed' : 'pointer',
                        }}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeletingTask(task)}
                        disabled={task.isOptimistic}
                        style={{
                          padding: '0.4rem 0.8rem',
                          borderRadius: '8px',
                          border: 'none',
                          background: 'rgba(239, 68, 68, 0.15)',
                          color: '#ef4444',
                          fontSize: '0.85rem',
                          fontWeight: '600',
                          cursor: task.isOptimistic ? 'not-allowed' : 'pointer',
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Confirmation Modal before Delete */}
      <ConfirmModal
        isOpen={Boolean(deletingTask)}
        title="Confirm Task Deletion"
        message={
          deletingTask
            ? `Are you sure you want to delete "${deletingTask.title}"? This action cannot be undone.`
            : ''
        }
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingTask(null)}
        isProcessing={isDeleting}
      />

      {/* Toast Notification Container */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}

export default Projects;
