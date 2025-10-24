// Helper that returns a mock implementation for `client/src/api/client`
export function createMockApi(vi, overrides = {}) {
  const defaultApi = {
    api: (path) => {
      if (path === '/users') return Promise.resolve({ data: [{ id: 1, name: 'Admin', role: 'ADMIN' }, { id: 2, name: 'Alice', role: 'USER' }] });
      if (path === '/tasks/1') return Promise.resolve({ attachments: [{ id: 'a1', filename: 'file1.txt', size_bytes: 1024 }] });
      return Promise.resolve({});
    },
    createTask: () => Promise.resolve({ id: 123 }),
  };

  // Use Vitest's vi.fn to create proper spies so assertions like
  // expect(fn).toHaveBeenCalled() work correctly.
  return {
    api: overrides.api ? overrides.api : vi.fn(defaultApi.api),
    createTask: overrides.createTask ? overrides.createTask : vi.fn(defaultApi.createTask),
  };
}
