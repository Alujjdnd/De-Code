"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function Project({ params }: { params: { id: string } }) {
  const [project, setProject] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchProject = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        router.push("/login")
        return
      }

      const { data, error } = await supabase.from("projects").select("*").eq("id", params.id).single()

      if (error) {
        console.error("Error fetching project:", error)
        router.push("/projects")
      } else if (data) {
        setProject(data)
      }
    }

    fetchProject()
  }, [params.id, router])

  if (!project) return null

  return (
      <div className="container mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle>{project.type.charAt(0).toUpperCase() + project.type.slice(1)} Project</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-bold">Categories:</h3>
              <div className="flex flex-wrap gap-2">
                {project.categories.map((category: string) => (
                    <Badge key={category} variant="secondary">
                      {category}
                    </Badge>
                ))}
              </div>
            </div>
            {project.type === "group" && (
                <div>
                  <h3 className="font-bold">Group Members:</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.group_members.map((member: string) => (
                        <Badge key={member}>{member}</Badge>
                    ))}
                  </div>
                </div>
            )}
            {project.results_html && (
                <div>
                  <h3 className="font-bold">Project Results:</h3>
                  <div
                      className="mt-4 space-y-4 border p-4 rounded"
                      dangerouslySetInnerHTML={{ __html: project.results_html }}
                  />
                </div>
            )}
          </CardContent>
        </Card>
      </div>
  )
}
