import React, { useState } from 'react';
import { Table, Badge, Button } from 'react-bootstrap';
import { FiEdit2, FiTrash2, FiPaperclip, FiCalendar, FiUser } from 'react-icons/fi';
import AttachmentsModal from './AttachmentsModal';

export default function TaskTable({ tasks = [], showActions = false, onEdit, onDelete }) {
  const [showAttachments, setShowAttachments] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  const getStatusBadge = (status) => {
    const variants = {
      'PENDING': 'warning',
      'IN_PROGRESS': 'info',
      'COMPLETED': 'success'
    };
    const labels = {
      'PENDING': 'Pending',
      'IN_PROGRESS': 'In Progress',
      'COMPLETED': 'Completed'
    };
    return <Badge bg={variants[status]} className="px-2 py-1">{labels[status]}</Badge>;
  };

  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">📋</div>
        <h5 className="text-muted">No tasks found</h5>
        <p className="text-muted small">Create a new task to get started</p>
      </div>
    );
  }

  return (
    <>
    <Table hover responsive className="align-middle">
      <thead>
        <tr>
          <th>Title</th>
          <th>Status</th>
          <th><FiUser className="me-1" />Assignee</th>
          <th><FiUser className="me-1" />Creator</th>
          <th><FiCalendar className="me-1" />Due Date</th>
          <th className="text-center"><FiPaperclip className="me-1" />Attachments</th>
          {showActions && <th>Actions</th>}
        </tr>
      </thead>
      <tbody>
        {tasks.map((t) => (
          <tr key={t.id}>
            <td className="fw-semibold">{t.title}</td>
            <td>{getStatusBadge(t.status)}</td>
            <td>{t.assignee_name || <span className="text-muted">Unassigned</span>}</td>
            <td>{t.creator_name || '—'}</td>
            <td>
              {t.due_date ? new Date(t.due_date).toLocaleDateString() : <span className="text-muted">—</span>}
            </td>
            <td className="text-center">
              {t.attachment_count > 0 ? (
                <div className="d-flex justify-content-center align-items-center gap-2">
                  <Badge bg="secondary" className="px-2">
                    <FiPaperclip size={14} className="me-1" />
                    {t.attachment_count}
                  </Badge>
                  <Button
                    size="sm"
                    variant="outline-secondary"
                    onClick={() => { setSelectedTaskId(t.id); setShowAttachments(true); }}
                  >
                    View
                  </Button>
                </div>
              ) : (
                <span className="text-muted">—</span>
              )}
            </td>
            {showActions && (
              <td>
                <div className="d-flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline-primary" 
                    onClick={() => onEdit && onEdit(t)}
                  >
                    <FiEdit2 size={14} />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline-danger" 
                    onClick={() => onDelete && onDelete(t.id)}
                  >
                    <FiTrash2 size={14} />
                  </Button>
                </div>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </Table>
    <AttachmentsModal
      show={showAttachments}
      onHide={() => setShowAttachments(false)}
      taskId={selectedTaskId}
    />
    </>
  );
}
