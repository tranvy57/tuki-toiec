import { Outlet } from "react-router-dom";

export function SimpleDashboardLayout() {
    console.log("SimpleDashboardLayout rendering...");

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-sm border-b px-4 py-3">
                <h1 className="text-lg font-semibold">Tuki TOEIC Admin Dashboard</h1>
            </header>
            <main className="p-4">
                <Outlet />
            </main>
        </div>
    );
}