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
import ExamDetailPage from "@/pages/exams/detail/ExamDetailPage";
import QuestionsPage from "@/pages/questions/QuestionsPageFixed";
import VocabularyPage from "@/pages/vocabularies/VocabularyPage";
import TestsPage from "@/pages/tests/TestsPage";
import TestDetailPage from "@/pages/tests/TestDetailPage";
import CreateTestPage from "@/pages/tests/CreateTestPage";
import OrdersPage from "@/pages/orders/OrdersPage";
import CoursesPage from "@/pages/courses/CoursesPage";
import PhasesPage from "@/pages/phases/PhasesPage";
import LessonsPage from "@/pages/lessons/LessonsPage";
import LessonContentsPage from "@/pages/lesson-contents/LessonContentsPage";

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
          { path: ":id", element: <ExamDetailPage /> },
        ],
      },
      { path: "questions", element: <QuestionsPage /> },
      {
        path: "tests",
        children: [
          { index: true, element: <TestsPage /> },
          { path: "create", element: <CreateTestPage /> },
          { path: ":id", element: <TestDetailPage /> },
        ],
      },
      { path: "orders", element: <OrdersPage /> },
      { path: "vocabularies", element: <VocabularyPage /> },
      { path: "courses", element: <CoursesPage /> },
      { path: "phases", element: <PhasesPage /> },
      { path: "lessons", element: <LessonsPage /> },
      { path: "lesson-contents", element: <LessonContentsPage /> },
      {
        path: "lessons/:lessonId/contents",
        element: <LessonContentsPage />
      },
    ],
  },
]);
