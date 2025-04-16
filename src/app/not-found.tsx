import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function NotFound() {
    return (
        <main className="min-h-screen flex flex-col items-center justify-center bg-secondary text-gray-800 p-4">
            <Card className="max-w-md w-full bg-muted p-8 rounded-lg shadow-md text-center">
                <CardTitle className="text-3xl font-bold text-red-500 mb-4">
                    404 - Not Found
                </CardTitle>
                <CardDescription className="text-lg mb-6">
                    Could not find the requested resource
                </CardDescription>
                <Link
                    href="/"
                    className="inline-block px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200"
                >
                    Return Home
                </Link>
            </Card>
        </main>
    );
}
