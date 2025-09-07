import * as XLSX from "xlsx";
import type {
  ExcelImportResult,
  ExamFormData,
  PartFormData,
  QuestionFormData,
  AnswerFormData,
} from "@/types";

export async function parseExcelFile(file: File): Promise<ExcelImportResult> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: "array" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Convert to JSON
    const jsonData = XLSX.utils.sheet_to_json(worksheet, {
      header: 1,
    }) as any[][];

    if (jsonData.length < 2) {
      return {
        success: false,
        error: "File Excel phải có ít nhất 2 dòng (header và dữ liệu)",
      };
    }

    const headers = jsonData[0] as string[];
    const rows = jsonData.slice(1);

    const requiredColumns = [
      "partNumber",
      "groupOrder",
      "directions",
      "questionNumberLabel",
      "questionContent",
      "answerA",
      "answerB",
      "answerC",
      "answerD",
      "isCorrectA",
      "isCorrectB",
      "isCorrectC",
      "isCorrectD",
    ];
    const missingColumns = requiredColumns.filter(
      (col) => !headers.includes(col)
    );

    if (missingColumns.length > 0) {
      return {
        success: false,
        error: `Thiếu các cột bắt buộc: ${missingColumns.join(", ")}`,
      };
    }

    const warnings: string[] = [];
    const partsMap = new Map<number, PartFormData>();

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      if (!row || row.length === 0) continue;

      const rowData: any = {};
      headers.forEach((header, index) => {
        rowData[header] = row[index];
      });


      if (!rowData["partNumber"] || !rowData["questionContent"]) {
        warnings.push(`Dòng ${i + 2}: Thiếu thông tin bắt buộc`);
        continue;
      }

      // Validate part number
      const partNumber = Number.parseInt(rowData["partNumber"]);
      if (isNaN(partNumber) || partNumber < 1 || partNumber > 7) {
        warnings.push(`Dòng ${i + 2}: Part Number phải từ 1-7`);
        continue;
      }

      const groupOrder = Number.parseInt(rowData["groupOrder"]) || 1;

      const questionNumber = Number.parseInt(rowData["questionNumberLabel"]);
      if (isNaN(questionNumber) || questionNumber < 1) {
        warnings.push(`Dòng ${i + 2}: Question Number phải là số dương`);
        continue;
      }

      const isCorrectA =
        rowData["isCorrectA"]?.toString().toUpperCase() === "TRUE";
      const isCorrectB =
        rowData["isCorrectB"]?.toString().toUpperCase() === "TRUE";
      const isCorrectC =
        rowData["isCorrectC"]?.toString().toUpperCase() === "TRUE";
      const isCorrectD =
        rowData["isCorrectD"]?.toString().toUpperCase() === "TRUE";

      if (![isCorrectA, isCorrectB, isCorrectC, isCorrectD].some(Boolean)) {
        warnings.push(`Dòng ${i + 2}: Phải có ít nhất một đáp án đúng`);
        continue;
      }


      // Get or create part
      if (!partsMap.has(partNumber)) {
        partsMap.set(partNumber, {
          partNumber,
          directions:
            rowData["directions"] || `Hướng dẫn cho Part ${partNumber}`,
          groups: [],
        });
      }
      const part = partsMap.get(partNumber)!;
      let group = part.groups.find((g) => g.orderIndex === groupOrder);
      if (!group) {
        group = {
          orderIndex: groupOrder,
          paragraphEn: rowData["groupParagraphEn"] || "",
          paragraphVn: rowData["groupParagraphVn"] || "",
          imageUrl: rowData["groupImageUrl"] || "",
          audioUrl: rowData["groupAudioUrl"] || "",
          questions: [],
        };
        part.groups.push(group);
      }

      const answers: AnswerFormData[] = [
        {
          content: rowData["answerA"] || "",
          isCorrect: isCorrectA,
          answerKey: "A",
        },
        {
          content: rowData["answerB"] || "",
          isCorrect: isCorrectB,
          answerKey: "B",
        },
        {
          content: rowData["answerC"] || "",
          isCorrect: isCorrectC,
          answerKey: "C",
        },
        {
          content: rowData["answerD"] || "",
          isCorrect: isCorrectD,
          answerKey: "D",
        },
      ];

      const question: QuestionFormData = {
        numberLabel: questionNumber,
        content: rowData["questionContent"] || "",
        explanation: rowData["questionExplanation"] || "",
        answers,
      };

      group.questions.push(question);
    }

    // Sort parts and groups
    const parts = Array.from(partsMap.values()).sort(
      (a, b) => a.partNumber - b.partNumber
    );
    parts.forEach((part) => {
      part.groups.sort((a, b) => a.orderIndex - b.orderIndex);
      part.groups.forEach((group) => {
        group.questions.sort((a, b) => a.numberLabel - b.numberLabel);
      });
    });

    if (parts.length === 0) {
      return {
        success: false,
        error: "Không tìm thấy câu hỏi hợp lệ nào trong file",
      };
    }

    const examData: ExamFormData = {
      title: "Đề thi từ Excel",
      audioUrl: "",
      parts,
    };

    return {
      success: true,
      data: examData,
      warnings: warnings.length > 0 ? warnings : undefined,
    };
  } catch (error) {
    return {
      success: false,
      error: `Lỗi đọc file: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    };
  }
}

export function generateSampleExcel(): void {
  const sampleData = [
    [
      "partNumber",
      "groupOrder",
      "directions",
      "groupParagraphEn",
      "groupParagraphVn",
      "groupImageUrl",
      "groupAudioUrl",
      "questionNumberLabel",
      "questionContent",
      "questionExplanation",
      "answerA",
      "isCorrectA",
      "answerB",
      "isCorrectB",
      "answerC",
      "isCorrectC",
      "answerD",
      "isCorrectD",
    ],
    [
      1,
      1,
      "Listen and Look at the picture and listen to four statements. Choose the statement that best describes the picture.",
      "Look at the picture and listen to four statements.",
      "Nhìn vào bức tranh và nghe bốn câu phát biểu.",
      "https://example.com/image1.jpg",
      "https://example.com/audio1.mp3",
      1,
      "What is the man doing?",
      "The man is reading a book in the library.",
      "Reading a book",
      "TRUE",
      "Writing a letter",
      "FALSE",
      "Eating lunch",
      "FALSE",
      "Sleeping",
      "FALSE",
    ],
    [
      2,
      1,
      "Listen and respond.",
      "",
      "",
      "",
      "https://example.com/audio2.mp3",
      2,
      "Where is the nearest bank?",
      "On Main Street, next to the post office.",
      "On Main Street",
      "TRUE",
      "Next week",
      "FALSE",
      "About 5 minutes",
      "FALSE",
      "On the left",
      "FALSE",
    ],
  ];

  // Create workbook and worksheet
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(sampleData);

  // Set column widths
  const colWidths = [
    { wch: 12 }, // partNumber
    { wch: 40 }, // directions
    { wch: 12 }, // groupOrder
    { wch: 30 }, // groupParagraphEn
    { wch: 30 }, // groupParagraphVn
    { wch: 25 }, // groupImageUrl
    { wch: 25 }, // groupAudioUrl
    { wch: 15 }, // questionNumber
    { wch: 50 }, // questionContent
    { wch: 40 }, // questionExplanation
    { wch: 25 }, // answerA
    { wch: 10 }, // isCorrectA
    { wch: 25 }, // answerB
    { wch: 10 }, // isCorrectB
    { wch: 25 }, // answerC
    { wch: 10 }, // isCorrectC
    { wch: 25 }, // answerD
    { wch: 10 }, // isCorrectD
  ];
  ws["!cols"] = colWidths;

  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(wb, ws, "TOEIC Questions");

  // Generate and download file
  XLSX.writeFile(wb, "toeic-excel-template.xlsx");
}
