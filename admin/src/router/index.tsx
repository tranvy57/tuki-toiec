import { createBrowserRouter, Navigate } from "react-router-dom";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { AuthLayout } from "@/layouts/AuthLayout";

// Pages
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import DashboardPage from "@/pages/dashboard/DashboardPage";
import ExamListPage from "@/pages/exams/list/ExamListPage";
import CreateExamPage from "@/pages/exams/create/CreateExamPage";
import CrawlExamPage from "@/pages/exams/crawl/CrawlExamPage";

export const router = createBrowserRouter([
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
    ],
  },
  {
    path: "/",
    element: <DashboardLayout />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> }, 
      { path: "dashboard", element: <DashboardPage /> },
      {
        path: "exams",
        children: [
          { path: "list", element: <ExamListPage /> },
          { path: "create", element: <CreateExamPage /> },
          { path: "crawl", element: <CrawlExamPage /> },
        ],
      },
    ],
  },
]);
