export default function Loading({
    variant = "spinner",
}: Readonly<{
    variant?: "spinner" | "dots" | "bar";
}>) {
    function getLoaderComponent() {
        switch (variant) {
            case "spinner":
                return <Spinner />;
            case "dots":
                return <DotsLoader />;
            case "bar":
                return <BarLoader />;
            default:
                return <Spinner />;
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-[200px] gap-4">
            {getLoaderComponent()}
            <p className="text-gray-600 font-medium">Loading...</p>
        </div>
    );
}

function Spinner() {
    return (
        <div className="relative">
            <div className="w-12 h-12 rounded-full border-4 border-gray-200"></div>
            <div className="absolute top-0 left-0 w-12 h-12 rounded-full border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
        </div>
    );
}

function DotsLoader() {
    return (
        <div className="flex gap-2">
            {[...Array(3)].map((_, i) => (
                <div
                    key={i}
                    className="w-3 h-3 rounded-full bg-blue-500 animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                />
            ))}
        </div>
    );
}

function BarLoader() {
    return (
        <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full animate-progress"></div>
        </div>
    );
}
