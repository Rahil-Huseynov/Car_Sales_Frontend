import { Navbar } from "@/components/navbar"
import NavbarProfile from "@/components/navbarProfile"

export default function ProfileLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
                    <aside className="xl:col-span-1">
                        <NavbarProfile />
                    </aside>
                    <main className="xl:col-span-4 bg-white rounded-lg shadow-md p-6">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    )
}
