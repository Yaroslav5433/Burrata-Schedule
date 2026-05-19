import { BrowserRouter, Routes, Route} from "react-router-dom"
import { ProtectedRoute, AuthorizedRoute } from "./routes/routes.jsx";
import Home from "./pages/home/home"
import Login from "./pages/login/login"
import Request from "./pages/form/request.jsx";


function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<AuthorizedRoute>
          <Login />
        </AuthorizedRoute>} />
        <Route path="/" element={
        <ProtectedRoute>
          <Home />
        </ProtectedRoute>}
        />
        <Route path="/request" element={<Request/>}></Route>
      </Routes>
    </BrowserRouter>
  );

}

export default App
