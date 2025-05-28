"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/hooks/use-auth"
import { MapPin, Trash2 } from "lucide-react"
import Image from "next/image"

interface BoardListing {
  id: string
  title: string
  description: string
  board_type: string
  length_feet: number
  length_inches: number
  brand: string
  model: string
  condition: string
  price_per_day: number
  price_per_hour: number | null
  location: string
  available: boolean
  features: string[]
  created_at: string
}

export function UserListings() {
  const { user } = useAuth()
  const [listings, setListings] = useState<BoardListing[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchUserListings()
    }
  }, [user])

  const fetchUserListings = async () => {
    if (!user) return

    const { data, error } = await supabase
      .from("board_listings")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (!error && data) {
      setListings(data)
    }
    setLoading(false)
  }

  const toggleAvailability = async (listingId: string, currentStatus: boolean) => {
    const { error } = await supabase.from("board_listings").update({ available: !currentStatus }).eq("id", listingId)

    if (!error) {
      setListings(
        listings.map((listing) => (listing.id === listingId ? { ...listing, available: !currentStatus } : listing)),
      )
    }
  }

  const deleteListing = async (listingId: string) => {
    const { error } = await supabase.from("board_listings").delete().eq("id", listingId)

    if (!error) {
      setListings(listings.filter((listing) => listing.id !== listingId))
    }
  }

  const formatBoardLength = (feet: number, inches: number) => {
    return inches > 0 ? `${feet}'${inches}"` : `${feet}'0"`
  }

  const getLocationName = (location: string) => {
    const locations: Record<string, string> = {
      pacifica: "Pacifica - Linda Mar Beach",
      "half-moon-bay": "Half Moon Bay",
      "santa-cruz": "Santa Cruz - Steamer Lane",
      "ocean-beach": "Ocean Beach, SF",
      capitola: "Capitola",
      monterey: "Monterey",
    }
    return locations[location] || location
  }

  if (!user) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-gray-600">Please sign in to view your listings</p>
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-gray-600">Loading your listings...</p>
        </CardContent>
      </Card>
    )
  }

  if (listings.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-gray-600">You haven't listed any boards yet</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold">Your Board Listings</h3>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {listings.map((listing) => (
          <Card key={listing.id} className="overflow-hidden">
            <div className="aspect-video bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
              <Image
                src="/placeholder.svg?height=200&width=300"
                alt={listing.title}
                width={300}
                height={200}
                className="object-cover"
              />
            </div>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{listing.title}</CardTitle>
                  <CardDescription>
                    {listing.brand} {listing.model} - {formatBoardLength(listing.length_feet, listing.length_inches)}
                  </CardDescription>
                </div>
                <Badge variant={listing.available ? "default" : "secondary"}>
                  {listing.available ? "Available" : "Unavailable"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4" />
                {getLocationName(listing.location)}
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <span className="text-2xl font-bold text-blue-600">${listing.price_per_day}/day</span>
                  {listing.price_per_hour && (
                    <div className="text-sm text-gray-600">${listing.price_per_hour}/hour</div>
                  )}
                </div>
                <Badge variant="outline" className="capitalize">
                  {listing.condition}
                </Badge>
              </div>

              {listing.features && listing.features.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {listing.features.slice(0, 2).map((feature, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                  {listing.features.length > 2 && (
                    <Badge variant="secondary" className="text-xs">
                      +{listing.features.length - 2} more
                    </Badge>
                  )}
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleAvailability(listing.id, listing.available)}
                  className="flex-1"
                >
                  {listing.available ? "Mark Unavailable" : "Mark Available"}
                </Button>
                <Button variant="outline" size="sm" onClick={() => deleteListing(listing.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
