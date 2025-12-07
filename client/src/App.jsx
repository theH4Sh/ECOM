import './App.css'
import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route } from 'react-router-dom'
import RootLayout from './layout/RootLayout'
import Home from './pages/Home.jsx'
import { Toaster } from 'react-hot-toast'
import Login from './pages/Login.jsx'
import SignUp from './pages/SignUp.jsx'
import Product from './pages/Product.jsx'
import OrderHistory from './pages/OrderHistory.jsx'

function App() {

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<RootLayout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<SignUp />} />
        <Route path="product/:id" element={<Product />} />
        <Route path="orders" element={<OrderHistory />} />
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
