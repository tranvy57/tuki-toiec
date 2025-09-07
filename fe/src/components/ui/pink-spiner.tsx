import Spinner from "@/assets/svgs/spinner";
import Image from "next/image";

export default function PinkSpinner() {
  return (
    <div className="fixed top-1/4 left-1/2">
      <div className="w-fit h-fit animate-spin stroke-red-400">
        <Spinner className="size-12" />
      </div>
    </div>
  );
}
