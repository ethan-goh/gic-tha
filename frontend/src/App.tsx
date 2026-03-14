import { Routes, Route, Navigate } from 'react-router-dom'
import NavBar from './components/NavBar'
import CafesPage from './pages/CafesPage'

function EmployeesPage() {
  return <div className="page-container"><h1 className="page-title">Employees</h1></div>
}

function CafeFormPage() {
  return <div className="page-container"><h1 className="page-title">Add / Edit Cafe</h1></div>
}

function EmployeeFormPage() {
  return <div className="page-container"><h1 className="page-title">Add / Edit Employee</h1></div>
}

export default function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<Navigate to="/cafes" replace />} />
        <Route path="/cafes" element={<CafesPage />} />
        <Route path="/cafes/new" element={<CafeFormPage />} />
        <Route path="/cafes/:id/edit" element={<CafeFormPage />} />
        <Route path="/employees" element={<EmployeesPage />} />
        <Route path="/employees/new" element={<EmployeeFormPage />} />
        <Route path="/employees/:id/edit" element={<EmployeeFormPage />} />
      </Routes>
    </>
  )
}
