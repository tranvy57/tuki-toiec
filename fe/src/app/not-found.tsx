import { NotFoundError } from "@/components/ui/error";

export default function NotFound() {
    return (
        <NotFoundError
            title="Không tìm thấy trang"
            description="Trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển."
        />
    );
}