"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ConfirmSubmitModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function ConfirmSubmitModal({
  open,
  onClose,
  onConfirm,
}: ConfirmSubmitModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Bạn chắc chắn muốn nộp bài?</DialogTitle>
        </DialogHeader>
        <p className="text-gray-600">
          Sau khi nộp bài, bạn sẽ không thể quay lại chỉnh sửa.
        </p>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Nộp bài
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
