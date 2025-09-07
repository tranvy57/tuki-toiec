import { Outlet } from 'react-router-dom';

export function AuthLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-coral-50 to-brand-coral-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-brand-coral-700 mb-2">
            TOEIC Admin
          </h1>
          <p className="text-warm-gray-600">
            Hệ thống quản lý đề thi TOEIC
          </p>
        </div>
        <Outlet />
      </div>
    </div>
  );
}
