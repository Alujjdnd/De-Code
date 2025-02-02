"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Sparkles, Users, Rocket } from "lucide-react"

export default function Home() {
    const router = useRouter()

    return (
        <div className="flex flex-col items-center justify-center min-h-[90vh] bg-gray-50">
            {/* Hero Section */}
            <section className="text-center py-20 px-6">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to De-Code</h1>
                <p className="text-lg text-gray-600 mb-6">Find teammates, collaborate on projects, and build something amazing.</p>
                <div className="flex space-x-4 justify-center">
                    <Button size="lg" onClick={() => router.push("/register")}>
                        Get Started
                    </Button>
                    <Button variant="outline" size="lg" onClick={() => router.push("/login")}>
                        Login
                    </Button>
                </div>
            </section>

            {/* Features Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl px-6">
                <Card className="shadow-md">
                    <CardHeader className="flex flex-col items-center">
                        <Sparkles className="h-10 w-10 text-blue-500" />
                        <CardTitle className="text-xl">Match with Teammates</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center text-gray-600">
                        Connect with like-minded people and form project teams easily.
                    </CardContent>
                </Card>

                <Card className="shadow-md">
                    <CardHeader className="flex flex-col items-center">
                        <Users className="h-10 w-10 text-green-500" />
                        <CardTitle className="text-xl">Collaborate Seamlessly</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center text-gray-600">
                        Work together and get the best ideas.
                    </CardContent>
                </Card>

                <Card className="shadow-md">
                    <CardHeader className="flex flex-col items-center">
                        <Rocket className="h-10 w-10 text-red-500" />
                        <CardTitle className="text-xl">Launch Your Projects</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center text-gray-600">
                        Manage individual or group projects with ease.
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
