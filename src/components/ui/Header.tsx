import { Heart, User } from "lucide-react";
import { Button } from "./Button";
import Link from "next/link";

export default function Header() {
    return (
        <header className="bg-white shadow-sm py-4 px-4">
            <div className="max-w-5xl mx-auto w-full flex justify-between items-center">
                <Link href="/" className="cursor-pointer">
                    <div className="flex items-center gap-2">
                        <Heart className="h-6 w-6 text-rose-500" />
                        <h1 className="text-xl font-bold text-gray-800">HelpHood</h1>
                    </div>
                </Link>
                <div className="flex items-center gap-4">
                    <Link href="/profile">
                        <Button variant="ghost" size="icon">
                            <User className="h-5 w-5" />
                        </Button>
                    </Link>
                </div>
            </div>
        </header>
    );
}