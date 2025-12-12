import './App.css'
import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route, Navigate } from 'react-router-dom'
import RootLayout from './layout/RootLayout'
import Home from './pages/Home.jsx'
import { Toaster } from 'react-hot-toast'
import { useSelector } from 'react-redux'
import Login from './pages/Login.jsx'
import SignUp from './pages/SignUp.jsx'
import Product from './pages/Product.jsx'
import OrderHistory from './pages/OrderHistory.jsx'
import Checkout from './pages/Checkout.jsx'
import AdminLayout from './layout/AdminLayout.jsx'
import AdminDashboard from './pages/admin/AdminDashboard.jsx'
import AdminProducts from './pages/admin/AdminProducts.jsx'
import AdminOrders from './pages/admin/AdminOrders.jsx'

function App() {

  const auth = useSelector((state) => state.auth);

  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path="login" element={ !auth.isAuthenticated ? <Login /> : <Navigate to='/' />} />
          <Route path="signup" element={ !auth.isAuthenticated ? <SignUp /> : <Navigate to='/' />} />
          <Route path="product/:id" element={<Product />} />
          <Route path="orders" element={ auth.isAuthenticated ? <OrderHistory /> : <Navigate to='/' />} />
          <Route path="checkout" element={ auth.isAuthenticated ? <Checkout /> : <Navigate to='/' />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={ auth.isAuthenticated && auth.role === 'admin' ? <AdminDashboard /> : <Navigate to='/' />} />
          <Route path="products" element={ auth.isAuthenticated && auth.role === 'admin' ? <AdminProducts /> : <Navigate to='/' />} />
          <Route path="orders" element={ auth.isAuthenticated && auth.role === 'admin' ? <AdminOrders /> : <Navigate to='/' />} />
        </Route>
      </>
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
