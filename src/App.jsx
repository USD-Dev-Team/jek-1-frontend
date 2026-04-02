import { Route, Routes } from 'react-router'
import './App.css'
import RequireAuth from './auth/RequireAuth'
import { Toaster } from 'react-hot-toast'
import ErrorPage from './pages/ErrorPage'
import SuperAdminLayout from './layouts/SuperAdminLayout'
import superAdminRoutes from './routes/superAdminRoutes'
import Login from './pages/Login/Login'
import Register from './pages/Register/Register'

function App() {
  return (
    <>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route element={<RequireAuth role="SUPER_ADMIN" />} >{/* */}
          <Route  path='/' element={<SuperAdminLayout />}>
            {superAdminRoutes.map((r) => {
              return (
                <Route key={r.name} path={r.path} element={r.element} />
              )
            })}
          </Route>
        </Route>
        
        
        <Route path='*' element={<ErrorPage />} />
      </Routes>
      <Toaster
        position='top-center'
        toastOptions={{
          duration: 3000,
        }}
      />
    </>
  )
}

export default App
