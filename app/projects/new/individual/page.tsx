"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"

const claudeApiCall = async (categories: string[]) => {
  const response = await fetch("/api/claude", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ categories }),
  })

  if (!response.ok) {
    throw new Error("Failed to process categories")
  }

  return response.text()
}

export default function NewIndividualProject() {
  const [categories, setCategories] = useState<string[]>([])
  const [newCategory, setNewCategory] = useState("")
  const [results, setResults] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const addCategory = () => {
    if (newCategory && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory])
      setNewCategory("")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    try {
      const results = await claudeApiCall(categories)
      setResults(results)
    } catch (error) {
      setError("Failed to process categories. Please try again.")
    }
  }

  const saveProject = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      setError("User not authenticated")
      return
    }

    const { data, error } = await supabase
        .from("projects")
        .insert({
          user_id: user.id,
          type: "individual",
          categories: categories,
          results_html: results,
        })
        .select()

    if (error) {
      setError(error.message)
    } else if (data && data.length > 0) {
      router.push(`/projects/${data[0].id}`)
    } else {
      setError("Failed to save project. Please try again.")
    }
  }

  return (
      <div className="container mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle>Create Individual Project</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                    type="text"
                    placeholder="Add a category"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                />
                <Button type="button" onClick={addCategory} className="mt-2">
                  Add Category
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                    <Badge key={category}>{category}</Badge>
                ))}
              </div>
              <Button type="submit" className="w-full">
                Get Match Ratings
              </Button>
            </form>
            {error && (
                <Alert variant="destructive" className="mt-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
            {results && (
                <div
                    className="mt-4 space-y-4 border p-4 rounded"
                    dangerouslySetInnerHTML={{ __html: results }}
                />
            )}
            {results && (
                <Button onClick={saveProject} className="w-full mt-4">
                  Save Project
                </Button>
            )}
          </CardContent>
        </Card>
      </div>
  )
}
