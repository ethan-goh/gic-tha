import { useEffect, useState } from 'react'
import { useNavigate, useParams, useBlocker } from 'react-router-dom'
import { Button, Form, Input, Modal, Spin, message } from 'antd'
import { useCafe, useCreateCafe, useUpdateCafe } from '../api/cafes'
import './CafeFormPage.css'

interface FormValues {
  name: string
  description: string
  logo?: string
  location: string
}

export default function CafeFormPage() {
  const { id } = useParams<{ id: string }>()
  const isEdit = !!id
  const navigate = useNavigate()
  const [form] = Form.useForm<FormValues>()
  const [isDirty, setIsDirty] = useState(false)
  const [messageApi, contextHolder] = message.useMessage()

  const { data: existing, isLoading } = useCafe(id ?? '')
  const createMutation = useCreateCafe()
  const updateMutation = useUpdateCafe()

  const isSaving = createMutation.isPending || updateMutation.isPending

  // Prefill form when editing
  useEffect(() => {
    if (existing) {
      form.setFieldsValue({
        name: existing.name,
        description: existing.description,
        logo: existing.logo ?? '',
        location: existing.location,
      })
    }
  }, [existing, form])

  // Warn on unsaved changes
  const blocker = useBlocker(isDirty && !isSaving)

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
      description: values.description,
      logo: values.logo || undefined,
      location: values.location,
    }

    if (isEdit) {
      await updateMutation.mutateAsync({ id: id!, dto })
      messageApi.success('Café updated successfully.')
    } else {
      await createMutation.mutateAsync(dto)
      messageApi.success('Café created successfully.')
    }

    setIsDirty(false)
    setTimeout(() => navigate('/cafes'), 800)
  }

  if (isEdit && isLoading) {
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
          <h1 className="page-title">{isEdit ? 'Edit Café' : 'Add New Café'}</h1>
          <p className="page-subtitle">
            {isEdit ? 'Update the details for this café' : 'Fill in the details for your new café'}
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
            <Input placeholder="e.g. The Grind" />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[
              { required: true, message: 'Description is required' },
              { max: 256, message: 'Description must be at most 256 characters' },
            ]}
          >
            <Input.TextArea
              placeholder="A short description of the café"
              rows={3}
              showCount
              maxLength={256}
            />
          </Form.Item>

          <Form.Item
            label="Logo URL"
            name="logo"
            rules={[{ type: 'url', message: 'Please enter a valid URL' }]}
          >
            <Input placeholder="https://example.com/logo.png (optional)" />
          </Form.Item>

          <Form.Item
            label="Location"
            name="location"
            rules={[{ required: true, message: 'Location is required' }]}
          >
            <Input placeholder="e.g. Raffles Place" />
          </Form.Item>

          <div className="form-actions">
            <Button onClick={() => navigate('/cafes')} disabled={isSaving}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" loading={isSaving}>
              {isEdit ? 'Save Changes' : 'Create Café'}
            </Button>
          </div>
        </Form>
      </div>
    </div>
  )
}
