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
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import CategoryPage from './pages/CategoryPage.jsx'
import ShippingReturns from './pages/ShippingReturns.jsx'
import FAQ from './pages/FAQ.jsx'
import Contact from './pages/Contact.jsx'
import ForgotPassword from './pages/ForgotPassword.jsx'
import ResetPassword from './pages/ResetPassword.jsx'
import ProductSearch from './pages/ProductSearch.jsx'

const stripePromise = loadStripe("pk_test_51SaNoG4Mhn1DfYnI8vdzApVMWHWKg7nIOJktVaxW8Hb3YppKv9XSxnVA0VHdsjpnsFklcUoDEG46TgsYCoL6x50t00bOKtzXjS");

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
          <Route path="/category/:category" element={<CategoryPage />} />
          <Route path="shipping" element={<ShippingReturns />} />
          <Route path="faq" element={<FAQ />} />
          <Route path="contact" element={<Contact />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          {/* 🔍 SEARCH PAGE */}
          <Route path="/search" element={<ProductSearch />} />
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
    <Elements stripe={stripePromise}>
      <Toaster />
      <RouterProvider router={router} />
    </Elements>
  )
}

export default App
