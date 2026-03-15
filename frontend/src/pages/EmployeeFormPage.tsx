import { useEffect, useState } from 'react'
import { useNavigate, useParams, useBlocker } from 'react-router-dom'
import { Button, Form, Input, Modal, Radio, Select, Spin, message } from 'antd'
import { useQueryClient } from '@tanstack/react-query'
import { useCreateEmployee, useUpdateEmployee } from '../api/employees'
import { useCafes } from '../api/cafes'
import type { Employee } from '../types'

interface FormValues {
  name: string
  email_address: string
  phone_number: string
  gender: 'Male' | 'Female'
  cafeId?: string
}

export default function EmployeeFormPage() {
  const { id } = useParams<{ id: string }>()
  const isEdit = !!id
  const navigate = useNavigate()
  const [form] = Form.useForm<FormValues>()
  const [isDirty, setIsDirty] = useState(false)
  const [messageApi, contextHolder] = message.useMessage()

  const qc = useQueryClient()
  const existing = isEdit
    ? qc.getQueryData<Employee[]>(['employees', ''])?.find((e) => e.id === id)
    : undefined

  const { data: cafes = [], isLoading: cafesLoading } = useCafes()
  const createMutation = useCreateEmployee()
  const updateMutation = useUpdateEmployee()
  const isSaving = createMutation.isPending || updateMutation.isPending

  useEffect(() => {
    if (existing) {
      form.setFieldsValue({
        name: existing.name,
        email_address: existing.email_address,
        phone_number: existing.phone_number,
        gender: existing.gender,
        cafeId: existing.cafeId ?? undefined,
      })
    }
  }, [existing, form])

  const blocker = useBlocker(() => isDirty && !isSaving)

  useEffect(() => {
    if (blocker.state === 'blocked') {
      Modal.confirm({
        title: 'Unsaved changes',
        content: 'You have unsaved changes. Are you sure you want to leave?',
        okText: 'Leave',
        okButtonProps: { danger: true },
        cancelText: 'Stay',
        onOk: () => blocker.proceed(),
        onCancel: () => blocker.reset(),
      })
    }
  }, [blocker])

  const handleSubmit = async (values: FormValues) => {
    const dto = {
      name: values.name,
      email_address: values.email_address,
      phone_number: values.phone_number,
      gender: values.gender,
      cafeId: values.cafeId ?? undefined,
    }

    if (isEdit) {
      await updateMutation.mutateAsync({ id: id!, dto })
      messageApi.success('Employee updated successfully.')
    } else {
      await createMutation.mutateAsync(dto)
      messageApi.success('Employee created successfully.')
    }

    setIsDirty(false)
    setTimeout(() => navigate('/employees'), 800)
  }

  if (isEdit && !existing && cafesLoading) {
    return (
      <div className="loading-state">
        <Spin size="large" />
      </div>
    )
  }

  return (
    <div className="page-container">
      {contextHolder}
      <div className="page-header">
        <div>
          <h1 className="page-title">{isEdit ? 'Edit Employee' : 'Add New Employee'}</h1>
          <p className="page-subtitle">
            {isEdit
              ? 'Update the details for this employee'
              : 'Fill in the details for your new employee'}
          </p>
        </div>
      </div>

      <div className="surface-card form-card">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          onValuesChange={() => setIsDirty(true)}
          requiredMark={false}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[
              { required: true, message: 'Name is required' },
              { min: 6, message: 'Name must be at least 6 characters' },
              { max: 10, message: 'Name must be at most 10 characters' },
            ]}
          >
            <Input placeholder="e.g. Jane Doe" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email_address"
            rules={[
              { required: true, message: 'Email is required' },
              { type: 'email', message: 'Please enter a valid email' },
            ]}
          >
            <Input placeholder="e.g. jane@example.com" />
          </Form.Item>

          <Form.Item
            label="Phone Number"
            name="phone_number"
            rules={[
              { required: true, message: 'Phone number is required' },
              {
                pattern: /^[89]\d{7}$/,
                message: 'Must start with 8 or 9 and be exactly 8 digits',
              },
            ]}
          >
            <Input placeholder="e.g. 91234567" maxLength={8} />
          </Form.Item>

          <Form.Item
            label="Gender"
            name="gender"
            rules={[{ required: true, message: 'Gender is required' }]}
          >
            <Radio.Group>
              <Radio value="Male">Male</Radio>
              <Radio value="Female">Female</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item label="Assigned Café" name="cafeId">
            <Select
              placeholder="Select a café (optional)"
              allowClear
              loading={cafesLoading}
              options={cafes.map((c) => ({ value: c.id, label: c.name }))}
            />
          </Form.Item>

          <div className="form-actions">
            <Button onClick={() => navigate('/employees')} disabled={isSaving}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" loading={isSaving}>
              {isEdit ? 'Save Changes' : 'Create Employee'}
            </Button>
          </div>
        </Form>
      </div>
    </div>
  )
}
