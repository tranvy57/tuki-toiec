import { api } from "@/lib/axios";

const importTestFromExcel = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await api.post("/tests/import", formData);
    return response.data;
  } catch (error) {
    console.error("Error importing test from Excel:", error);
    throw error;
  }
};
