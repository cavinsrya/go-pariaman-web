import type React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  title: string;
  description: string;
  icon?: React.ReactNode;
};

export default function InfoStepCard({ title, description, icon }: Props) {
  return (
    <Card className="rounded-2xl max-w-xs w-full mx-auto">
      <CardHeader className="flex flex-row items-center gap-3 pb-2">
        <div className="grid h-9 w-9 place-items-center rounded-md bg-gradient-to-r from-[#87D5F5] to-[#20C7D0]">
          {icon ?? <span className="text-xs">i</span>}
        </div>
        <CardTitle className="text-sm">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
