"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import { X } from "lucide-react"

export function ListBoardForm() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [features, setFeatures] = useState<string[]>([])
  const [newFeature, setNewFeature] = useState("")

  const addFeature = () => {
    if (newFeature.trim() && !features.includes(newFeature.trim())) {
      setFeatures([...features, newFeature.trim()])
      setNewFeature("")
    }
  }

  const removeFeature = (feature: string) => {
    setFeatures(features.filter((f) => f !== feature))
  }

  const handleSubmit = async (formData: FormData) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be signed in to list a board",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    const boardData = {
      user_id: user.id,
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      board_type: formData.get("boardType") as string,
      length_feet: Number.parseInt(formData.get("lengthFeet") as string),
      length_inches: Number.parseInt(formData.get("lengthInches") as string) || 0,
      brand: formData.get("brand") as string,
      model: formData.get("model") as string,
      condition: formData.get("condition") as string,
      price_per_day: Number.parseFloat(formData.get("pricePerDay") as string),
      price_per_hour: Number.parseFloat(formData.get("pricePerHour") as string) || null,
      location: formData.get("location") as string,
      features: features,
      available: true,
    }

    const { error } = await supabase.from("board_listings").insert([boardData])

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } else {
      toast({
        title: "Success",
        description: "Your board has been listed successfully!",
      })
      // Reset form
      const form = document.getElementById("list-board-form") as HTMLFormElement
      form?.reset()
      setFeatures([])
    }

    setLoading(false)
  }

  if (!user) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-gray-600">Please sign in to list your board</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>List Your Board</CardTitle>
        <CardDescription>Share your board with the surfing community</CardDescription>
      </CardHeader>
      <CardContent>
        <form id="list-board-form" action={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title">Board Title</Label>
              <Input id="title" name="title" placeholder="e.g., Classic Longboard - Perfect for Beginners" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="boardType">Board Type</Label>
              <Select name="boardType" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select board type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="longboard">Longboard</SelectItem>
                  <SelectItem value="shortboard">Shortboard</SelectItem>
                  <SelectItem value="funboard">Funboard</SelectItem>
                  <SelectItem value="sup">SUP (Stand Up Paddle)</SelectItem>
                  <SelectItem value="fish">Fish</SelectItem>
                  <SelectItem value="gun">Gun</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Describe your board, its condition, and what makes it special..."
              className="min-h-[100px]"
            />
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="lengthFeet">Length (feet)</Label>
              <Input id="lengthFeet" name="lengthFeet" type="number" min="5" max="12" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lengthInches">Length (inches)</Label>
              <Input id="lengthInches" name="lengthInches" type="number" min="0" max="11" defaultValue="0" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="condition">Condition</Label>
              <Select name="condition" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="excellent">Excellent</SelectItem>
                  <SelectItem value="good">Good</SelectItem>
                  <SelectItem value="fair">Fair</SelectItem>
                  <SelectItem value="poor">Poor</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="brand">Brand</Label>
              <Input id="brand" name="brand" placeholder="e.g., Wavestorm, Catch Surf, etc." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="model">Model</Label>
              <Input id="model" name="model" placeholder="e.g., Log, Plank, etc." />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="pricePerDay">Price per Day ($)</Label>
              <Input id="pricePerDay" name="pricePerDay" type="number" step="0.01" min="10" max="200" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pricePerHour">Price per Hour ($) - Optional</Label>
              <Input id="pricePerHour" name="pricePerHour" type="number" step="0.01" min="5" max="50" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Pickup Location</Label>
            <Select name="location" required>
              <SelectTrigger>
                <SelectValue placeholder="Select pickup location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pacifica">Pacifica - Linda Mar Beach</SelectItem>
                <SelectItem value="half-moon-bay">Half Moon Bay</SelectItem>
                <SelectItem value="santa-cruz">Santa Cruz - Steamer Lane</SelectItem>
                <SelectItem value="ocean-beach">Ocean Beach, SF</SelectItem>
                <SelectItem value="capitola">Capitola</SelectItem>
                <SelectItem value="monterey">Monterey</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <Label>Board Features</Label>
            <div className="flex gap-2">
              <Input
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                placeholder="Add a feature (e.g., includes leash, wax included)"
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())}
              />
              <Button type="button" onClick={addFeature} variant="outline">
                Add
              </Button>
            </div>
            {features.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {features.map((feature, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {feature}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => removeFeature(feature)} />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading ? "Listing Board..." : "List My Board"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
