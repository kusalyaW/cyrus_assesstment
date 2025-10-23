import React, { useEffect, useState } from 'react';
import { Modal, Button, Table, Badge, Spinner, Alert } from 'react-bootstrap';
import { FiPaperclip, FiDownload } from 'react-icons/fi';
import { api } from '../api/client';

export default function AttachmentsModal({ show, onHide, taskId }) {
  const [loading, setLoading] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [error, setError] = useState('');

  const API = import.meta.env.VITE_API_BASE || 'http://localhost:3000/api';
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';

  useEffect(() => {
    let isMounted = true;
    async function fetchAttachments() {
      if (!show || !taskId) return;
      setLoading(true);
      setError('');
      try {
        const task = await api(`/tasks/${taskId}`);
        if (!isMounted) return;
        setAttachments(task.attachments || []);
      } catch (e) {
        if (!isMounted) return;
        console.error(e);
        setError('Failed to load attachments');
        setAttachments([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchAttachments();
    return () => { isMounted = false; };
  }, [show, taskId]);

  return (
    <Modal show={show} onHide={onHide} centered size="md">
      <Modal.Header closeButton>
        <Modal.Title>
          <FiPaperclip className="me-2" /> Attachments
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <div className="d-flex justify-content-center py-4">
            <Spinner animation="border" />
          </div>
        ) : error ? (
          <Alert variant="danger" className="mb-0">{error}</Alert>
        ) : attachments.length === 0 ? (
          <div className="text-center text-muted py-2">No attachments</div>
        ) : (
          <Table hover responsive className="align-middle mb-0">
            <thead>
              <tr>
                <th>Name</th>
                <th className="text-end">Size</th>
                <th className="text-end">Action</th>
              </tr>
            </thead>
            <tbody>
              {attachments.map(att => (
                <tr key={att.id}>
                  <td>
                    <Badge bg="secondary" className="me-2"><FiPaperclip className="me-1" />{att.id}</Badge>
                    {att.filename || 'file'}
                  </td>
                  <td className="text-end">{att.size_bytes ? (att.size_bytes / 1024).toFixed(1) + ' KB' : '—'}</td>
                  <td className="text-end">
                    <Button
                      as="a"
                      href={`${API}/tasks/attachments/${att.id}/download?token=${token}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      size="sm"
                      variant="outline-primary"
                    >
                      <FiDownload className="me-1" /> Download
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}
