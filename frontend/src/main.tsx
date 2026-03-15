import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ConfigProvider } from 'antd'
import App from './App'
import CafesPage from './pages/CafesPage'
import CafeFormPage from './pages/CafeFormPage'
import EmployeesPage from './pages/EmployeesPage'
import EmployeeFormPage from './pages/EmployeeFormPage'
import './styles/global.css'

const queryClient = new QueryClient()

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Navigate to="/cafes" replace /> },
      { path: 'cafes', element: <CafesPage /> },
      { path: 'cafes/new', element: <CafeFormPage /> },
      { path: 'cafes/:id/edit', element: <CafeFormPage /> },
      { path: 'employees', element: <EmployeesPage /> },
      { path: 'employees/new', element: <EmployeeFormPage /> },
      { path: 'employees/:id/edit', element: <EmployeeFormPage /> },
    ],
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#2563eb',
            colorBgBase: '#ffffff',
            colorTextBase: '#0f172a',
            borderRadius: 8,
            fontSize: 14,
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          },
          components: {
            Button: { controlHeight: 38 },
            Input: { controlHeight: 38 },
            Select: { controlHeight: 38 },
          },
        }}
      >
        <RouterProvider router={router} />
      </ConfigProvider>
    </QueryClientProvider>
  </StrictMode>,
)
