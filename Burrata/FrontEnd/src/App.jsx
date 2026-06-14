import { BrowserRouter, Routes, Route, Navigate} from "react-router-dom"
import { ProtectedRoute, AuthorizedRoute } from "./routes/routes.jsx";
import Home from "@/pages/home/home"
import Login from "@/pages/login/login"
import Request from "@/pages/request/request.jsx";
import { ModalWindow } from "@/components/ModalWindow/ModalWindow.jsx";

function App() {

  return (
    <BrowserRouter>
      <ModalWindow>
        <Routes>
          <Route path="/login" element={
          <AuthorizedRoute>
            <Login />
          </AuthorizedRoute>} />

          <Route index element={<Navigate to="/admin/schedule/service" replace />} />

          <Route path="/admin/schedule/:department" element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>} />

          <Route path="/request" element={<Request/>} />
        </Routes>
      </ModalWindow>
    </BrowserRouter>
  );

}

export default App
