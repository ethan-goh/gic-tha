import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Input, Modal, message, Spin } from 'antd'
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  CoffeeOutlined,
} from '@ant-design/icons'
import { AgGridReact } from 'ag-grid-react'
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community'
import type { ColDef, ICellRendererParams } from 'ag-grid-community'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-quartz.css'
import { useCafes, useDeleteCafe } from '../api/cafes'
import type { Cafe } from '../types'
import './CafesPage.css'

ModuleRegistry.registerModules([AllCommunityModule])

function LogoCell({ value }: ICellRendererParams<Cafe, string | null>) {
  if (!value) {
    return (
      <div className="logo-placeholder">
        <CoffeeOutlined />
      </div>
    )
  }
  return <img src={value} alt="logo" className="logo-img" />
}

function ActionsCell({
  data,
  onEdit,
  onDelete,
}: ICellRendererParams<Cafe> & {
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

export default function CafesPage() {
  const navigate = useNavigate()
  const [locationFilter, setLocationFilter] = useState('')
  const [messageApi, contextHolder] = message.useMessage()
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [debouncedLocation, setDebouncedLocation] = useState('')

  const { data: cafes = [], isLoading } = useCafes(debouncedLocation || undefined)
  const deleteMutation = useDeleteCafe()

  const handleLocationChange = (value: string) => {
    setLocationFilter(value)
    if (searchTimeout.current) clearTimeout(searchTimeout.current)
    searchTimeout.current = setTimeout(() => setDebouncedLocation(value), 400)
  }

  const handleEdit = (id: string) => navigate(`/cafes/${id}/edit`)

  const handleDelete = (id: string, name: string) => {
    Modal.confirm({
      title: 'Delete Café',
      content: `Are you sure you want to delete "${name}"? This will also remove all employees under this café.`,
      okText: 'Delete',
      okButtonProps: { danger: true },
      cancelText: 'Cancel',
      onOk: async () => {
        await deleteMutation.mutateAsync(id)
        messageApi.success(`"${name}" has been deleted.`)
      },
    })
  }

  const colDefs: ColDef<Cafe>[] = [
    {
      field: 'logo',
      headerName: 'Logo',
      width: 80,
      cellRenderer: LogoCell,
      sortable: false,
      filter: false,
    },
    { field: 'name', headerName: 'Name', flex: 1, minWidth: 120 },
    { field: 'description', headerName: 'Description', flex: 2, minWidth: 180 },
    {
      field: 'employees',
      headerName: 'Employees',
      width: 120,
      cellRenderer: ({ data, value }: ICellRendererParams<Cafe, number>) => (
        <button
          className="employee-count-link"
          onClick={() => data && navigate(`/employees?cafe=${data.id}`)}
        >
          {value}
        </button>
      ),
    },
    { field: 'location', headerName: 'Location', flex: 1, minWidth: 120 },
    {
      headerName: 'Actions',
      width: 180,
      sortable: false,
      filter: false,
      cellRenderer: (params: ICellRendererParams<Cafe>) => (
        <ActionsCell {...params} onEdit={handleEdit} onDelete={handleDelete} />
      ),
    },
  ]

  return (
    <div className="page-container">
      {contextHolder}
      <div className="page-header">
        <div>
          <h1 className="page-title">Cafes</h1>
          <p className="page-subtitle">Manage your café locations</p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate('/cafes/new')}
        >
          Add New Café
        </Button>
      </div>

      <div className="table-toolbar">
        <div className="toolbar-left">
          <Input
            placeholder="Filter by location"
            prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
            value={locationFilter}
            onChange={(e) => handleLocationChange(e.target.value)}
            allowClear
            style={{ width: 240 }}
          />
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
              rowData={cafes}
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
