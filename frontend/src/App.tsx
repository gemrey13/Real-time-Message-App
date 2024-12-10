import ChatArea from "@/components/chat/ChatArea";
import ProtectedRoute from "@/components/ProtectedRoute";
import MainLayout from "@/layout/MainLayout";
import Dashboard from "@/pages/Dashboard";
import { SignIn } from "@/pages/Sign-In";
import { Signup } from "@/pages/Signup";
import { BrowserRouter, Routes, Route } from "react-router-dom";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<ProtectedRoute />}>
                    <Route path="/" element={<MainLayout />}>
                        <Route index element={<Dashboard />} />
                        <Route path="chat/:userID" element={<ChatArea />} />
                    </Route>
                </Route>

                <Route path="/sign-in" element={<SignIn />} />
                <Route path="/sign-up" element={<Signup />} />
            </Routes>
        </BrowserRouter>
    );
}
