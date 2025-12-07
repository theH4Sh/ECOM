import './App.css'
import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route, Navigate } from 'react-router-dom'
import RootLayout from './layout/RootLayout'
import Home from './pages/Home.jsx'
import { Toaster } from 'react-hot-toast'
import Login from './pages/Login.jsx'
import SignUp from './pages/SignUp.jsx'
import Product from './pages/Product.jsx'
import OrderHistory from './pages/OrderHistory.jsx'
import { useSelector } from 'react-redux'

function App() {

  const auth = useSelector((state) => state.auth);

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<RootLayout />}>
        <Route index element={<Home />} />
        <Route path="login" element={ !auth.isAuthenticated ? <Login /> : <Navigate to='/' />} />
        <Route path="signup" element={ !auth.isAuthenticated ? <SignUp /> : <Navigate to='/' />} />
        <Route path="product/:id" element={<Product />} />
        <Route path="orders" element={ auth.isAuthenticated ? <OrderHistory /> : <Navigate to='/' />} />
      </Route>
    )
  )

  return (
    <>
      <Toaster />
      <RouterProvider router={router} />
    </>
  )
}

export default App
