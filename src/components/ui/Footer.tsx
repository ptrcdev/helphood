import Link from "next/link";
import { Heart } from "lucide-react";

const Footer = () => {
    return (
        <footer className = "bg-gray-800 text-white py-8 px-4" >
            <div className="max-w-5xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="flex items-center gap-2 mb-4 md:mb-0">
                        <Heart className="h-6 w-6 text-rose-400" />
                        <span className="text-xl font-bold">HelpHood</span>
                    </div>
                    <div className="flex gap-6">
                        <Link href="/about" className="hover:underline">
                            About
                        </Link>
                        <Link href="/contact" className="hover:underline">
                            Contact
                        </Link>
                        <Link href="/privacy" className="hover:underline">
                            Privacy
                        </Link>
                        <Link href="/terms" className="hover:underline">
                            Terms
                        </Link>
                    </div>
                </div>
                <div className="text-center md:text-left mt-6 text-gray-400 text-sm">
                    &copy; {new Date().getFullYear()} HelpHood. All rights reserved.
                </div>
            </div>
    </footer >
    );
}

export default Footer;