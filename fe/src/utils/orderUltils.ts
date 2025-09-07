import { showError } from "@/libs/toast";

export const calculateDeliveryCost = (
  orderItems: { paintingId: string; quantity: number }[],
  paintingMap: Record<string, { size: string; quantity: number }>,
  prefecture: string
): number => {
  let allAre2020 = true;
  let count2020 = 0;

  let maxLength = 0;
  let maxWidth = 0;
  let totalThickness = 0;

  let totalItems = 0;
  let artSuppliesCount = 0;
  let nonArtSuppliesCount = 0;

  for (const item of orderItems) {
    const painting = paintingMap[item.paintingId];
    if (!painting) {
      showError(`Không tìm thấy paintingId: ${item.paintingId}`);
    }

    if (item.quantity <= 0 || item.quantity > painting.quantity) {
      showError(`Số lượng không hợp lệ cho tranh ID: ${item.paintingId}`);
    }

    totalItems += item.quantity;

    if (painting.size === "SIZE_ART_SUPPLIES") {
      artSuppliesCount += item.quantity;
      continue; // không cộng kích thước hay gì cả
    }

    nonArtSuppliesCount += item.quantity;

    const sizeInfo = getSize(painting.size);

    if (painting.size !== "SIZE_20x20") {
      allAre2020 = false;
    } else {
      count2020 += item.quantity;
    }

    maxLength = Math.max(maxLength, sizeInfo.length);
    maxWidth = Math.max(maxWidth, sizeInfo.width);
    totalThickness += sizeInfo.thickness * item.quantity;
  }

  let shipping = 0;

  // ✅ Trường hợp chỉ có art supplies → ship 430
  if (nonArtSuppliesCount === 0 && artSuppliesCount > 0) {
    shipping = 430;
  } else {
    // ✅ Tính ship như bình thường nếu có tranh
    if (allAre2020) {
      if (count2020 === 1) {
        shipping = 430;
      } else if (count2020 <= 3) {
        shipping = 600;
      } else {
        const totalSize = maxLength + maxWidth + totalThickness;
        if (totalSize <= 60) shipping = 840;
        else if (totalSize <= 80) shipping = 1200;
        else if (totalSize <= 100) shipping = 1500;
        else return 1500;
      }
    } else {
      const totalSize = maxLength + maxWidth + totalThickness;
      if (totalSize <= 60) shipping = 840;
      else if (totalSize <= 80) shipping = 1200;
      else if (totalSize <= 100) shipping = 1500;
      else return 1500;
    }
  }

  // ✅ Nếu địa chỉ ở vùng xa → cộng thêm 400
  const remotePrefectures = ["沖縄", "北海道", "長崎", "大分"];
  if (remotePrefectures.some((keyword) => prefecture.includes(keyword))) {
    shipping += 400;
  }

  return shipping;
};

const getSize = (
  size: string
): { length: number; width: number; thickness: number } => {
  switch (size) {
    case "SIZE_20x20":
      return { length: 20, width: 20, thickness: 2 };
    case "SIZE_30x40":
      return { length: 40, width: 30, thickness: 2 };
    case "SIZE_40x50":
      return { length: 50, width: 40, thickness: 3 };
    case "SIZE_ART_SUPPLIES":
      return { length: 0, width: 0, thickness: 0 };
    default:
      throw new Error(`Kích thước không hỗ trợ: ${size}`);
  }
};

export const checkCouponValid = (
  couponCode: string,
  orderItems: { paintingId: string; quantity: number }[],
  paintingMap: Record<string, { size: string; quantity: number; price: number }>
): boolean => {
  let totalPrice = 0;
  let has30x40 = false;
  let has40x50 = false;
  let total20x20 = 0;

  for (const item of orderItems) {
    const painting = paintingMap[item.paintingId];
    if (!painting) continue;

    totalPrice += painting.price * item.quantity;

    if (painting.size === "SIZE_30x40" && item.quantity >= 1) {
      has30x40 = true;
    }

    if (painting.size === "SIZE_40x50" && item.quantity >= 1) {
      has40x50 = true;
    }

    if (painting.size === "SIZE_20x20") {
      total20x20 += item.quantity;
    }
  }

  // Kiểm tra từng loại mã giảm giá
  if (couponCode === "CPR300") {
    return has30x40;
  }

  if (couponCode === "CPR500") {
    return has40x50;
  }

  if (couponCode === "CPRFREESHIP") {
    return total20x20 >= 10 || totalPrice >= 9000;
  }

  // Nếu chưa định nghĩa điều kiện, coi như không hợp lệ
  return false;
};
