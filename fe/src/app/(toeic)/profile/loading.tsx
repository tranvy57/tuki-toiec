import { PageLoading } from "@/components/ui/loading";

export default function ProfileLoading() {
    return (
        <PageLoading
            title="Đang tải thông tin cá nhân..."
            description="Chúng tôi đang chuẩn bị thông tin và tiến độ học tập của bạn"
        />
    );
}