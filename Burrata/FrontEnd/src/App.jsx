import { BrowserRouter, Routes, Route} from "react-router-dom"
import Login from "./pages/login/login"
import ProtectedRoute from "./app/router";

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
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
