import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { FileText } from "lucide-react";

interface Props {
  title: string;
  updatedAt: string;
  href: string;
}

export default function ResumeCard({ title, updatedAt, href }: Props) {
  return (
    <Link href={href}>
      <Card className="hover:shadow-md transition cursor-pointer">
        <CardContent className="p-6 flex flex-col items-center justify-center h-40">
          <FileText className="w-10 h-10 text-primary mb-2" />
          <h3 className="text-lg font-semibold text-center">{title}</h3>
        </CardContent>
        <CardFooter className="text-xs text-muted-foreground justify-center">
          Last updated: {updatedAt}
        </CardFooter>
      </Card>
    </Link>
  );
}
