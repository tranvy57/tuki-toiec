import { RouterProvider } from "react-router-dom";
import { router } from "./router"; // import router.ts bạn đã định nghĩa

export default function App() {
  return <RouterProvider router={router} />;
}
