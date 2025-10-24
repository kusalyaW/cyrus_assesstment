import React from 'react';
import { vi, expect, describe, test, afterEach } from 'vitest';
import { render, screen, waitFor, cleanup, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';


globalThis.expect = expect;
await import('@testing-library/jest-dom');


import { createMockApi } from '../test/mockApi';
vi.mock('../api/client', () => createMockApi(vi));

import TaskForm from '../components/TaskForm';
import UserListPage from '../pages/UserListPage';
import TaskTable from '../components/TaskTable';
import AttachmentsModal from '../components/AttachmentsModal';
import { BrowserRouter } from 'react-router-dom';

describe('App UI tests', () => {
  
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
    vi.resetModules();
  });

  test('TaskForm shows only non-admin users in assignee dropdown', async () => {
    render(
      <BrowserRouter>
        <TaskForm />
      </BrowserRouter>
    );

  await waitFor(() => expect(screen.getByRole('option', { name: /Alice/i })).toBeInTheDocument());

    // The default "Me (default)" option and Alice should be present
    expect(screen.getByRole('option', { name: /Me \(default\)/i })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /Alice/i })).toBeInTheDocument();

    // Admin option should not be present
    const adminOption = screen.queryByRole('option', { name: /Admin/i });
    expect(adminOption).not.toBeInTheDocument();
  });

  test('TaskForm submit calls createTask with form values', async () => {
    const { createTask } = await import('../api/client');

    const user = userEvent.setup();
    const { container } = render(
      <BrowserRouter>
        <TaskForm />
      </BrowserRouter>
    );

    // Scope queries to this render's container to avoid matching other
    // components that may be present in the global document.
    const titleInput = within(container).getByPlaceholderText(/Task title/i);
    await user.type(titleInput, 'Test Task');

    const submitBtn = within(container).getByRole('button', { name: /Add Task/i });
    await user.click(submitBtn);

    await waitFor(() => expect(createTask).toHaveBeenCalled());
    expect(createTask.mock.calls[0][0]).toMatchObject({ title: 'Test Task' });
  });

  test('UserListPage renders users and role badges', async () => {
    render(
      <BrowserRouter>
        <UserListPage />
      </BrowserRouter>
    );

    // Wait for users to load
    await waitFor(() => expect(screen.getByText(/Users/i)).toBeInTheDocument());

  // Expect ADMIN and Alice rows (at least one occurrence each)
  expect(screen.getAllByText('Admin').length).toBeGreaterThanOrEqual(1);
  expect(screen.getAllByText('Alice').length).toBeGreaterThanOrEqual(1);

  // Role badge text should be present (ADMIN or USER)
  expect(screen.getAllByText(/ADMIN|USER/).length).toBeGreaterThanOrEqual(1);
  });

  test('TaskTable shows View button for tasks with attachments', () => {
    const tasks = [
      { id: 1, title: 'T1', status: 'PENDING', assignee_name: '', creator_name: '', due_date: null, attachment_count: 2 },
      { id: 2, title: 'T2', status: 'COMPLETED', assignee_name: '', creator_name: '', due_date: null, attachment_count: 0 },
    ];

    render(<TaskTable tasks={tasks} showActions={false} />);

    // There should be a "View" button next to attachment badge for the first task
    expect(screen.getAllByText(/View/i).length).toBeGreaterThanOrEqual(1);
  });

  test('AttachmentsModal fetches and displays attachments', async () => {
    render(<AttachmentsModal show={true} onHide={() => {}} taskId={1} />);

    // Wait for attachment to be displayed
    await waitFor(() => expect(screen.getByText(/file1.txt/i)).toBeInTheDocument());

  // Download button should exist (rendered as an anchor with role "button")
  expect(screen.getByRole('button', { name: /Download/i })).toBeInTheDocument();
  });
});
