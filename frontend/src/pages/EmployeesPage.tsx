import { useState, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Button, Input, Modal, message, Spin } from 'antd'
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons'
import { AgGridReact } from 'ag-grid-react'
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community'
import type { ColDef, ICellRendererParams } from 'ag-grid-community'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-quartz.css'
import { useEmployees, useDeleteEmployee } from '../api/employees'
import type { Employee } from '../types'
import './EmployeesPage.css'

ModuleRegistry.registerModules([AllCommunityModule])

function ActionsCell({
  data,
  onEdit,
  onDelete,
}: ICellRendererParams<Employee> & {
  onEdit: (id: string) => void
  onDelete: (id: string, name: string) => void
}) {
  if (!data) return null
  return (
    <div className="actions-cell">
      <Button
        size="small"
        icon={<EditOutlined />}
        onClick={() => onEdit(data.id)}
      >
        Edit
      </Button>
      <Button
        size="small"
        danger
        icon={<DeleteOutlined />}
        onClick={() => onDelete(data.id, data.name)}
      >
        Delete
      </Button>
    </div>
  )
}

export default function EmployeesPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const initialCafe = searchParams.get('cafe') ?? ''

  const [nameFilter, setNameFilter] = useState('')
  const [messageApi, contextHolder] = message.useMessage()
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [debouncedName, setDebouncedName] = useState('')

  const { data: employees = [], isLoading } = useEmployees(initialCafe || undefined)
  const deleteMutation = useDeleteEmployee()

  const handleNameChange = (value: string) => {
    setNameFilter(value)
    if (searchTimeout.current) clearTimeout(searchTimeout.current)
    searchTimeout.current = setTimeout(() => setDebouncedName(value), 400)
  }

  const filtered = debouncedName
    ? employees.filter((e) =>
        e.name.toLowerCase().includes(debouncedName.toLowerCase()),
      )
    : employees

  const handleEdit = (id: string) => navigate(`/employees/${id}/edit`)

  const handleDelete = (id: string, name: string) => {
    Modal.confirm({
      title: 'Delete Employee',
      content: `Are you sure you want to delete "${name}"?`,
      okText: 'Delete',
      okButtonProps: { danger: true },
      cancelText: 'Cancel',
      onOk: async () => {
        await deleteMutation.mutateAsync(id)
        messageApi.success(`"${name}" has been deleted.`)
      },
    })
  }

  const colDefs: ColDef<Employee>[] = [
    { field: 'id', headerName: 'Employee ID', width: 140 },
    { field: 'name', headerName: 'Name', flex: 1, minWidth: 140 },
    { field: 'email_address', headerName: 'Email', flex: 1, minWidth: 180 },
    { field: 'phone_number', headerName: 'Phone', width: 130 },
    { field: 'gender', headerName: 'Gender', width: 100 },
    { field: 'cafe', headerName: 'Café', flex: 1, minWidth: 140 },
    {
      field: 'days_worked',
      headerName: 'Days Worked',
      width: 130,
      cellRenderer: ({ value }: ICellRendererParams<Employee, number>) => (
        <span className="days-worked-badge">{value ?? 0}</span>
      ),
    },
    {
      headerName: 'Actions',
      width: 180,
      sortable: false,
      filter: false,
      cellRenderer: (params: ICellRendererParams<Employee>) => (
        <ActionsCell {...params} onEdit={handleEdit} onDelete={handleDelete} />
      ),
    },
  ]

  return (
    <div className="page-container">
      {contextHolder}
      <div className="page-header">
        <div>
          <h1 className="page-title">Employees</h1>
          <p className="page-subtitle">
            {initialCafe ? 'Showing employees for selected café' : 'Manage your employees'}
          </p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate('/employees/new')}
        >
          Add New Employee
        </Button>
      </div>

      <div className="table-toolbar">
        <div className="toolbar-left">
          <Input
            placeholder="Filter by name"
            prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
            value={nameFilter}
            onChange={(e) => handleNameChange(e.target.value)}
            allowClear
            style={{ width: 240 }}
          />
          {initialCafe && (
            <Button onClick={() => navigate('/employees')}>
              Clear café filter
            </Button>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="loading-state">
          <Spin size="large" />
        </div>
      ) : (
        <div className="grid-shell">
          <div className="ag-theme-quartz" style={{ width: '100%' }}>
            <AgGridReact
              theme="legacy"
              rowData={filtered}
              columnDefs={colDefs}
              domLayout="autoHeight"
              rowHeight={56}
              headerHeight={44}
            />
          </div>
        </div>
      )}
    </div>
  )
}
