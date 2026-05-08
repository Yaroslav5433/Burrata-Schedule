import { BrowserRouter, Routes, Route} from "react-router-dom"
import Login from "./pages/login/login"
import { ProtectedRoute, AuthorizationRoute } from "./routes/protectedRoute.jsx";
import Home from "./pages/home/home"

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<AuthorizationRoute>
          <Login />
        </AuthorizationRoute>} />
        <Route path="/" element={
        <ProtectedRoute>
          <Home />
        </ProtectedRoute>}
        />
      </Routes>
    </BrowserRouter>
  );

}

export default App
