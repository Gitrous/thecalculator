import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { useLocale } from "@/lib/locale";

export default function NotFound() {
  const locale = useLocale();
  const isEn = locale === "en";

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <h1 className="text-2xl font-bold text-gray-900">
              {isEn ? "404 Page Not Found" : "404 Página no encontrada"}
            </h1>
          </div>

          <p className="mt-4 text-sm text-gray-600">
            {isEn
              ? "The page you are looking for does not exist."
              : "La página que buscas no existe."}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
