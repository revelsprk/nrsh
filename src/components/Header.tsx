import Link from "next/link";
import Button from "./ui/Button";

export default function Header() {
    return (
        <div className="border-b bg-white px-8 flex items-center py-4 h-16">
            <Link href="/"><h1 className="font-semibold text-2xl select-none">CBOX</h1></Link>
            <div className="ml-auto">
                <Button size="sm">ログイン</Button>
            </div>
        </div>
    )
}