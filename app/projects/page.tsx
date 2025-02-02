"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function Projects() {
  const [projects, setProjects] = useState<any[]>([])
  const router = useRouter()

  useEffect(() => {
    const fetchProjects = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        router.push("/login")
        return
      }

      const { data, error } = await supabase.from("projects").select("*").eq("user_id", user.id)

      if (error) {
        console.error("Error fetching projects:", error)
      } else {
        setProjects(data || [])
      }
    }

    fetchProjects()
  }, [router])

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Your Projects</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Card
            key={project.id}
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => router.push(`/projects/${project.id}`)}
          >
            <CardHeader>
              <CardTitle>{project.type.charAt(0).toUpperCase() + project.type.slice(1)} Project</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-2">
                <strong>Categories:</strong>
                <div className="flex flex-wrap gap-1 mt-1">
                  {project.categories.map((category: string) => (
                    <Badge key={category} variant="secondary">
                      {category}
                    </Badge>
                  ))}
                </div>
              </div>
              {project.type === "group" && (
                <div className="mb-2">
                  <strong>Group Members:</strong>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {project.group_members.map((member: string) => (
                      <Badge key={member}>{member}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-4 flex gap-4">
        <Button onClick={() => router.push("/projects/new/individual")}>New Individual Project</Button>
        <Button onClick={() => router.push("/projects/new/group")}>New Group Project</Button>
      </div>
    </div>
  )
}

