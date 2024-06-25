import { Routes, Route } from 'react-router-dom';
import Navbar from './components/NavBar.js';
import SignUp from './pages/authentication/SignUp.js';
import SignIn from './pages/authentication/SignIn.js';
import ProductList from './components/ProductList.js';
import AdminDashboard from './pages/AdminDashboard.js';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute.js';


function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path='/' element={<SignIn />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/shop' element={<ProtectedRoute element={ProductList} />} />
        <Route path='/admin' element={<AdminRoute element={AdminDashboard} />} />
      </Routes>
    </div>
  );
}


export default App;
