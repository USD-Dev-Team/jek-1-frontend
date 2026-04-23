import { Route, Routes } from 'react-router-dom'
import './App.css'

import { Toaster } from 'react-hot-toast'
import ErrorPage from './pages/ErrorPage'

import './i18n'
import Login from './pages/Login/Login'
import JekLayout from './layouts/JekLayout'
import Register from './pages/Refister/Register'
import { Navigate } from "react-router-dom";
import jekRoute from './routes/jekRoute'
import GvLayout from './layouts/GvLayout'
import gvRoute from './routes/gvRoutes'
import InLayout from './layouts/InLayout'
import inRoute from './routes/inRoute'
import RequireAuth from './auth/RequireAuth'
import Problem from './pages/JEK/Murojat/Problem'

function App() {
  return (
    <>
      <Routes>
        <Route path='/register' element={<Register /> } />



       <Route path="/" element={<Navigate to="/login" />} />
       <Route path='/login' element={<Login />} />
        <Route element={<RequireAuth role="JEK" />} >
          <Route path='/jek' element={<JekLayout />} >
            {jekRoute.map((r) => {
              return (
                <Route key={r.name} path={r.path} element={r.element} />
              )
            })}
          </Route>
        </Route>
        <Route element={<RequireAuth role="GOVERNMENT" />}>
          <Route path='/hokim' element={<GvLayout />} >
            {gvRoute.map((r) => {
              return (
                <Route key={r.name} path={r.path} element={r.element} />
              )
            })}
          </Route>
        </Route>
        <Route element={<RequireAuth role="INSPECTION" />}>
          <Route path='/inseksiya' element={<InLayout />} >
            {inRoute.map((r) => {
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
