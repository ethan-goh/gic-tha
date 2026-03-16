import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Input, Modal, message, Spin, Select } from 'antd'
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
  return (
    <div className="logo-cell">
      {value ? (
        <img src={value} alt="logo" className="logo-img" />
      ) : (
        <div className="logo-placeholder">
          <CoffeeOutlined />
        </div>
      )}
    </div>
  )
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
  const [nameFilter, setNameFilter] = useState('')
  const [locationFilter, setLocationFilter] = useState<string[]>([])
  const [messageApi, contextHolder] = message.useMessage()
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [debouncedName, setDebouncedName] = useState('')

  const { data: cafes = [], isLoading } = useCafes()
  const deleteMutation = useDeleteCafe()

  const locationOptions = [...new Set(cafes.map((c) => c.location))].map((loc) => ({
    label: loc,
    value: loc,
  }))

  const filtered = cafes.filter((c) => {
    const matchesName = debouncedName
      ? c.name.toLowerCase().includes(debouncedName.toLowerCase())
      : true
    const matchesLocation =
      locationFilter.length > 0 ? locationFilter.includes(c.location) : true
    return matchesName && matchesLocation
  })

  const handleNameChange = (value: string) => {
    setNameFilter(value)
    if (searchTimeout.current) clearTimeout(searchTimeout.current)
    searchTimeout.current = setTimeout(() => setDebouncedName(value), 400)
  }

  const handleEdit = (id: string) => navigate(`/cafes/${id}/edit`)

  const handleDelete = (id: string, name: string) => {
    Modal.confirm({
      title: 'Delete Cafe',
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
          Add New Cafe
        </Button>
      </div>

      <div className="table-toolbar">
        <div className="toolbar-left">
          <Input
            placeholder="Search by name"
            prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
            value={nameFilter}
            onChange={(e) => handleNameChange(e.target.value)}
            allowClear
            style={{ width: 240 }}
          />
          <Select
            mode="multiple"
            placeholder="Filter by location"
            value={locationFilter}
            onChange={setLocationFilter}
            options={locationOptions}
            allowClear
            style={{ minWidth: 200 }}
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
