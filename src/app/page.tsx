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
          <CardDescription>Version 0.1 — Sprint #001</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            Environment setup complete — ready for Sprint #002
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
