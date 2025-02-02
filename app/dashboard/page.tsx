"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
      } else {
        router.push("/login")
      }
    }
    getUser()
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/login")
  }

  if (!user) return null

  return (
      <div className="container mx-auto p-8">
        <Card className="shadow-lg p-6 bg-white rounded-xl">
          <CardHeader className="flex items-center gap-4">
            <Avatar className="h-14 w-14">
              <AvatarImage src={user.user_metadata.avatar_url || "/default-avatar.png"} />
              <AvatarFallback>{user.user_metadata.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl font-bold">Welcome, {user.user_metadata.name}!</CardTitle>
              <p className="text-gray-500">{user.email}</p>
            </div>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
              <Button onClick={() => router.push("/profile/edit")} className="w-full" variant="outline">
                Edit Profile
              </Button>
              <Button onClick={() => router.push("/projects")} className="w-full" variant="outline">
                View Projects
              </Button>
            </div>
          <br/>
            <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
              <Button onClick={() => router.push("/projects/new/individual")} className="w-full">
                Start Individual Project
              </Button>
              <Button onClick={() => router.push("/projects/new/group")} className="w-full">
                Start Group Project
              </Button>
            </div>
            <br/>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 items-center">
              <br/>
              <Button onClick={handleLogout} variant="destructive" className="w-full">
                Logout
              </Button>
              <br/>
            </div>
          </CardContent>
        </Card>
      </div>
  )
}
