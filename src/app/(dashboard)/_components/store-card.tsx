import type React from "react";
import { Card } from "@/components/ui/card";

interface StoreCardProps {
  title: string;
  count: number;
  icon: React.ReactNode;
  bgColor: string;
  iconColor: string;
  borderColor: string;
}

export default function StoreCard({
  title,
  count,
  icon,
  bgColor,
  iconColor,
  borderColor,
}: StoreCardProps) {
  return (
    <Card
      className={`${bgColor} border-2 ${borderColor} p-6 flex items-center gap-4`}
    >
      <div className={`${iconColor} text-3xl`}>{icon}</div>
      <div>
        <p className="text-sm text-gray-600">{title}</p>
        <p className="text-2xl font-bold">{count}</p>
      </div>
    </Card>
  );
}
