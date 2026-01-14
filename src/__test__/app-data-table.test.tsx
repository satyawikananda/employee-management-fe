/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent, cleanup } from '@testing-library/react';

import AppDataTable from '../components/base/app-data-table';
import { ColumnDef } from '@tanstack/react-table';

vi.mock('@/components/ui/dropdown-menu', () => ({
  DropdownMenu: ({ children }: any) => <div>{children}</div>,
  DropdownMenuTrigger: ({ children }: any) => <div>{children}</div>,
  DropdownMenuContent: ({ children }: any) => <div>{children}</div>,
  DropdownMenuItem: ({ children, onClick }: any) => (
    <button onClick={onClick}>{children}</button>
  ),
}));

vi.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, className }: any) => (
    <button onClick={onClick} className={className}>{children}</button>
  ),
}));

// Dummy Data Types
type Payment = {
  id: string;
  amount: number;
  status: string;
  email: string;
};

const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: 'status',
    header: 'Status',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
  },
];

const data: Payment[] = [
  {
    id: '728ed52f',
    amount: 100,
    status: 'pending',
    email: 'm@example.com',
  },
  {
    id: '489e1d42',
    amount: 125,
    status: 'processing',
    email: 'example@gmail.com',
  },
];

describe('AppDataTable', () => {
  afterEach(() => {
    cleanup();
    document.body.innerHTML = '';
  });

  it('renders data correctly', () => {
    render(<AppDataTable columns={columns} data={data} />);

    // Check for cell content
    expect(screen.getAllByText('m@example.com').length).toBeGreaterThan(0);
    expect(screen.getAllByText('example@gmail.com').length).toBeGreaterThan(0);
    expect(screen.getAllByText('pending').length).toBeGreaterThan(0);
  });

  it('renders empty state correctly', () => {
    render(<AppDataTable columns={columns} data={[]} />);

    expect(screen.getByText('No results.')).toBeTruthy();
  });

  it('renders loading state correctly', () => {
    render(<AppDataTable columns={columns} data={data} loading={true} />);

    expect(screen.queryByText('m@example.com')).toBeNull();
  });

  it('handles pagination', () => {
    const onPageChange = vi.fn();
    const onLimitChange = vi.fn();

    render(
      <AppDataTable
        columns={columns}
        data={data}
        page={1}
        limit={10}
        total={20}
        onPageChange={onPageChange}
        onLimitChange={onLimitChange}
      />
    );

    const message = screen.getByText(/Page 1 of 2/i);
    expect(message).toBeTruthy();

    const nextBtn = screen.getByRole('button', { name: /Go to next page/i }) as HTMLButtonElement;
    expect(nextBtn.disabled).toBe(false);

    fireEvent.click(nextBtn);
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it('handles sorting interactions', async () => {
    const onSortChange = vi.fn();
    render(<AppDataTable columns={columns} data={data} onSortChange={onSortChange} />);

    const ascOptions = screen.getAllByText('Asc');
    fireEvent.click(ascOptions[0]);

    expect(onSortChange).toHaveBeenCalled();
  });
});
