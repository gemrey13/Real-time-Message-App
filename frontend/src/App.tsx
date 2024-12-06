import MainLayout from "@/layout/MainLayout";
import Dashboard from "@/pages/Dashboard";
import { Signup } from "@/pages/Signup";
import { BrowserRouter, Routes, Route } from "react-router-dom";
export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MainLayout />}>
                    <Route index element={<Dashboard />} />
                </Route>

                <Route path="/sign-up" element={<Signup />} />
            </Routes>
        </BrowserRouter>
    );
}
