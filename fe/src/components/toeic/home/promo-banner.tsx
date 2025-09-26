import { Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface PromoBannerProps {
  title: string;
  description: string;
}

export function PromoBanner({ title, description }: PromoBannerProps) {
  return (
    <Card className="bg-gradient-to-r from-[#ff776f] to-[#ff9b94] text-white">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">{title}</h2>
            <p className="text-white/90">{description}</p>
          </div>
          <div className="hidden md:block">
            <Award className="h-16 w-16 text-white/80" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
