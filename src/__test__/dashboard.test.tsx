/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent, cleanup } from '@testing-library/react';

import DashboardPage from '../app/(main)/page';

// Mock components to isolate testing of the page logic and integration
vi.mock('../components/base/app-data-table', () => ({
  default: ({ data, onPageChange, onLimitChange, onSortChange }: any) => (
    <div data-testid="app-data-table">
      Data Table Mock
      <button onClick={() => onPageChange(2)}>Next Page</button>
      <button onClick={() => onLimitChange(20)}>Change Limit</button>
      <button onClick={() => onSortChange(['name:asc'])}>Sort Name</button>
      <span>Total: {data.length}</span>
    </div>
  ),
}));

vi.mock('../app/(main)/_modules/components/employee-bulk-import-dialog', () => ({
  EmployeeBulkImportDialog: ({ open, onOpenChange }: any) => (
    open ? (
      <div data-testid="bulk-import-dialog">
        Bulk Import Dialog
        <button onClick={() => onOpenChange(false)}>Close</button>
      </div>
    ) : null
  ),
}));

// Mock useEmployee hook
const setPaginationMock = vi.fn();
const setSortMock = vi.fn();
const setOpenBulkImportMock = vi.fn();
const setOpenEmployeeMock = vi.fn();

const useEmployeeMock = {
  tableColumns: [],
  employees: {
    data: [{ id: 1, name: 'John Doe' }],
    pagination: { total: 10, currentPage: 1, limit: 10 },
  },
  employeeLoading: false,
  pagination: { page: 1, limit: 10 },
  setSearch: vi.fn(),
  setPagination: setPaginationMock,
  setSort: setSortMock,
  openEmployee: false,
  setOpenEmployee: setOpenEmployeeMock,
  searchEmployee: '',
  selectedEmployeeId: undefined,
  setSelectedEmployeeId: vi.fn(),
  openDelete: false,
  setOpenDelete: vi.fn(),
  onDeleteConfirm: vi.fn(),
  isDeleting: false,
  openBulkImport: false,
  setOpenBulkImport: setOpenBulkImportMock,
};

vi.mock('../app/(main)/_modules/hooks/use-employee', () => ({
  default: () => useEmployeeMock,
}));

// Mock UI components used directly in page
vi.mock('@/components/ui/input', () => ({
  Input: (props: any) => <input data-testid="search-input" {...props} />,
}));

vi.mock('@/components/ui/button', () => ({
  Button: (props: any) => <button {...props} />,
}));

vi.mock('@/components/base/app-dialog', () => ({
  default: ({ children }: any) => <div>{children}</div>,
}));

vi.mock('../app/(main)/_modules/components/employee-form', () => ({
  default: () => <div>Employee Form Mock</div>,
}));

vi.mock('@/components/ui/alert-dialog', () => ({
  AlertDialog: ({ children, open }: any) => open ? <div>{children}</div> : null,
  AlertDialogContent: ({ children }: any) => <div>{children}</div>,
  AlertDialogHeader: ({ children }: any) => <div>{children}</div>,
  AlertDialogTitle: ({ children }: any) => <div>{children}</div>,
  AlertDialogDescription: ({ children }: any) => <div>{children}</div>,
  AlertDialogFooter: ({ children }: any) => <div>{children}</div>,
  AlertDialogCancel: ({ children }: any) => <button>{children}</button>,
  AlertDialogAction: ({ children }: any) => <button>{children}</button>,
}));

vi.mock('@/components/base/app-padding-layout', () => ({
  default: ({ children }: any) => <div>{children}</div>,
}));

describe('DashboardPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useEmployeeMock.openBulkImport = false;
  });

  afterEach(() => {
    cleanup();
    document.body.innerHTML = '';
  });

  it('renders dashboard with table', () => {
    render(<DashboardPage />);
    expect(screen.getByText('Employee Management')).toBeTruthy();
    expect(screen.getByTestId('app-data-table')).toBeTruthy();
    expect(screen.getByText('Total: 1')).toBeTruthy();
  });

  it('opens bulk import dialog when button is clicked', () => {
    render(<DashboardPage />);

    // With strict cleanup, getByText should work
    const importBtn = screen.getByText('Import Employee');
    fireEvent.click(importBtn);

    expect(setOpenBulkImportMock).toHaveBeenCalledWith(true);
  });

  it('renders bulk import dialog when open', () => {
    useEmployeeMock.openBulkImport = true;
    render(<DashboardPage />);

    expect(screen.getByTestId('bulk-import-dialog')).toBeTruthy();
  });

  it('handles table pagination', () => {
    render(<DashboardPage />);

    const nextBtn = screen.getByText('Next Page');
    fireEvent.click(nextBtn);

    expect(setPaginationMock).toHaveBeenCalledWith(expect.objectContaining({ page: 2 }));
  });
});
