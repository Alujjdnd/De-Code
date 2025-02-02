"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"

import skillsData from "@/app/resc/skills.json" assert { type: "json" };
import interestsData from "@/app/resc/interests.json" assert { type: "json" };

const SKILLS = skillsData.SKILLS;
const INTERESTS = interestsData.INTERESTS;

export default function EditProfile() {
  const [user, setUser] = useState<any>(null)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState("")
  const [skills, setSkills] = useState<string[]>([])
  const [interests, setInterests] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        setName(user.user_metadata.name || "");
        setEmail(user.email || "");

        // Fetch user profile from the profiles table
        const { data: profile, error } = await supabase
            .from("profiles")
            .select("status, skills, interests")
            .eq("id", user.id)
            .single();

        if (profile) {
          setStatus(profile.status || "");
          setSkills(profile.skills || []);
          setInterests(profile.interests || []);
        }
      } else {
        router.push("/login");
      }
    }
    getUser();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const { error: authError } = await supabase.auth.updateUser({
      email,
      data: { name, status }
    });

    if (authError) {
      setError(authError.message);
      return;
    }

    const { data: existingProfile, error: fetchError } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", user.id)
        .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      setError(fetchError.message);
      return;
    }

    if (existingProfile) {
      const { error: profileError } = await supabase
          .from("profiles")
          .update({ name, email, status, skills, interests, updated_at: new Date() })
          .eq("id", user.id);
      if (profileError) {
        setError(profileError.message);
        return;
      }
    } else {
      const { error: insertError } = await supabase
          .from("profiles")
          .insert([{ id: user.id, name, email, status, skills, interests, updated_at: new Date() }]);
      if (insertError) {
        setError(insertError.message);
        return;
      }
    }

    router.push("/dashboard");
  }

  const toggleSkill = (skill: string) => {
    setSkills((prev) => (prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]));
  }

  const toggleInterest = (interest: string) => {
    setInterests((prev) => (prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]));
  }

  if (!user) return null;

  return (
      <div className="container mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle>Edit Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div>
                <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div>
                <h3 className="mb-2">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {SKILLS.map((skill) => (
                      <Badge
                          key={skill}
                          variant={skills.includes(skill) ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => toggleSkill(skill)}
                      >
                        {skill}
                      </Badge>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="mb-2">Interests</h3>
                <div className="flex flex-wrap gap-2">
                  {INTERESTS.map((interest) => (
                      <Badge
                          key={interest}
                          variant={interests.includes(interest) ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => toggleInterest(interest)}
                      >
                        {interest}
                      </Badge>
                  ))}
                </div>
              </div>
              <Button type="submit" className="w-full">
                Save Profile
              </Button>
            </form>
            {error && (
                <Alert variant="destructive" className="mt-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
          </CardContent>
        </Card>
      </div>
  );
}
