import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Dev_Next01</CardTitle>
          <CardDescription>Version 0.2 — Sprint #002</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            Database connected — ready for business features
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
