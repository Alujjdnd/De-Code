"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

export default function NavBar() {
    const [user, setUser] = useState<any>(null)
    const router = useRouter()

    useEffect(() => {
        const fetchUser = async () => {
            const { data } = await supabase.auth.getUser()
            setUser(data?.user || null)
        }
        fetchUser()
    }, [])

    const handleLogout = async () => {
        await supabase.auth.signOut()
        setUser(null)
        router.push("/login")
    }

    return (
        <header className="bg-black text-white p-4 shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-xl font-semibold">De-Code</h1>
                <nav>
                    <ul className="flex space-x-6">
                        <li><a href="/dashboard" className="hover:underline">Dashboard</a></li>
                        <li><a href="/projects" className="hover:underline">Projects</a></li>
                        {user ? (
                            <>
                                <li>
                                    <button onClick={handleLogout} className="hover:underline">
                                        Logout
                                    </button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li><a href="/login" className="hover:underline">Login</a></li>
                                <li><a href="/register" className="hover:underline">Register</a></li>
                            </>
                        )}
                    </ul>
                </nav>
            </div>
        </header>
    )
}
