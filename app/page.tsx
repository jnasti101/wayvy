"use client"

import { useState, useEffect } from "react"
import { AuthModal } from "@/components/auth/auth-modal"
import { ListBoardForm } from "@/components/list-board-form"
import { UserListings } from "@/components/user-listings"
import { useAuth } from "@/hooks/use-auth"
import { supabase } from "@/lib/supabase"
import { Toaster } from "@/components/ui/toaster"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Phone, Mail, Star, Waves, Shield, Clock } from "lucide-react"
import Image from "next/image"

export default function SurfRentalApp() {
  const { user, loading: authLoading, signOut } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [userListings, setUserListings] = useState([])
  const [showListForm, setShowListForm] = useState(false)

  // Add user listings to the board catalog section
  useEffect(() => {
    fetchUserListings()
  }, [])

  const fetchUserListings = async () => {
    const { data } = await supabase
      .from("board_listings")
      .select("*")
      .eq("available", true)
      .order("created_at", { ascending: false })

    if (data) {
      setUserListings(data)
    }
  }
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Waves className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">Bay Surf Rentals</span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#boards" className="text-gray-700 hover:text-blue-600">
                Boards
              </a>
              <a href="#locations" className="text-gray-700 hover:text-blue-600">
                Locations
              </a>
              <a href="#pricing" className="text-gray-700 hover:text-blue-600">
                Pricing
              </a>
              <a href="#contact" className="text-gray-700 hover:text-blue-600">
                Contact
              </a>
            </nav>
            <div className="flex items-center gap-4">
              {user ? (
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600">Welcome, {user.email}</span>
                  <Button variant="outline" onClick={() => setShowListForm(!showListForm)}>
                    {showListForm ? "View Boards" : "List Your Board"}
                  </Button>
                  <Button variant="outline" onClick={signOut}>
                    Sign Out
                  </Button>
                </div>
              ) : (
                <Button onClick={() => setShowAuthModal(true)}>Sign In / List Board</Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Ride the Waves of the Bay Area</h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Premium surf board rentals at the best spots in Northern California
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                Browse Boards
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-blue-600"
              >
                View Locations
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Premium Quality</h3>
              <p className="text-gray-600">Top-brand boards maintained to the highest standards</p>
            </div>
            <div className="text-center">
              <MapPin className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Prime Locations</h3>
              <p className="text-gray-600">Convenient pickup at the best surf spots in the Bay Area</p>
            </div>
            <div className="text-center">
              <Clock className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Flexible Rentals</h3>
              <p className="text-gray-600">Hourly, daily, or weekly rentals to fit your schedule</p>
            </div>
          </div>
        </div>
      </section>

      {/* Board Catalog */}
      <section id="boards" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Board Collection</h2>
            <p className="text-lg text-gray-600">Choose from our selection of premium surf boards</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Longboard */}
            <Card className="overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                <Image
                  src="/placeholder.svg?height=200&width=300"
                  alt="Longboard"
                  width={300}
                  height={200}
                  className="object-cover"
                />
              </div>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Classic Longboard</CardTitle>
                    <CardDescription>9'6" - Perfect for beginners</CardDescription>
                  </div>
                  <Badge variant="secondary">Popular</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-2xl font-bold text-blue-600">$40/day</span>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm text-gray-600">4.8 (124 reviews)</span>
                  </div>
                </div>
                <Button className="w-full">Rent This Board</Button>
              </CardContent>
            </Card>

            {/* Shortboard */}
            <Card className="overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                <Image
                  src="/placeholder.svg?height=200&width=300"
                  alt="Shortboard"
                  width={300}
                  height={200}
                  className="object-cover"
                />
              </div>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Performance Shortboard</CardTitle>
                    <CardDescription>6'2" - For experienced surfers</CardDescription>
                  </div>
                  <Badge variant="outline">Pro</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-2xl font-bold text-blue-600">$35/day</span>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm text-gray-600">4.9 (89 reviews)</span>
                  </div>
                </div>
                <Button className="w-full">Rent This Board</Button>
              </CardContent>
            </Card>

            {/* Funboard */}
            <Card className="overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center">
                <Image
                  src="/placeholder.svg?height=200&width=300"
                  alt="Funboard"
                  width={300}
                  height={200}
                  className="object-cover"
                />
              </div>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Funboard</CardTitle>
                    <CardDescription>8'0" - Great for all levels</CardDescription>
                  </div>
                  <Badge variant="secondary">Versatile</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-2xl font-bold text-blue-600">$38/day</span>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm text-gray-600">4.7 (156 reviews)</span>
                  </div>
                </div>
                <Button className="w-full">Rent This Board</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* User Board Listings */}
      {userListings.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Community Boards</h2>
              <p className="text-lg text-gray-600">Boards listed by fellow surfers in the community</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {userListings.map((listing) => (
                <Card key={listing.id} className="overflow-hidden">
                  <div className="aspect-video bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
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
                        <CardTitle>{listing.title}</CardTitle>
                        <CardDescription>
                          {listing.brand} {listing.model} - {listing.length_feet}'{listing.length_inches}"
                        </CardDescription>
                      </div>
                      <Badge variant="outline">Community</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-2xl font-bold text-blue-600">${listing.price_per_day}/day</span>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{listing.location}</span>
                      </div>
                    </div>
                    <Button className="w-full">Contact Owner</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* List Board Form */}
      {showListForm && user && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <ListBoardForm />
          </div>
        </section>
      )}

      {/* User Dashboard */}
      {user && !showListForm && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <UserListings />
          </div>
        </section>
      )}

      {/* Booking Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Book Your Rental</h2>
            <p className="text-lg text-gray-600">Reserve your board for the perfect surf session</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Rental Details</CardTitle>
              <CardDescription>Fill out the form below to reserve your surf board</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" placeholder="Enter your full name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="Enter your email" />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" placeholder="(555) 123-4567" />
                </div>
                <div className="space-y-2">
                  <Label>Board Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a board" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="longboard">Classic Longboard - $40/day</SelectItem>
                      <SelectItem value="shortboard">Performance Shortboard - $35/day</SelectItem>
                      <SelectItem value="funboard">Funboard - $38/day</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Pickup Location</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select pickup location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pacifica">Pacifica - Linda Mar Beach</SelectItem>
                      <SelectItem value="half-moon-bay">Half Moon Bay</SelectItem>
                      <SelectItem value="santa-cruz">Santa Cruz - Steamer Lane</SelectItem>
                      <SelectItem value="ocean-beach">Ocean Beach, SF</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Rental Duration</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="4-hours">4 Hours - $25</SelectItem>
                      <SelectItem value="1-day">1 Day - $40</SelectItem>
                      <SelectItem value="3-days">3 Days - $105</SelectItem>
                      <SelectItem value="1-week">1 Week - $210</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Special Requests</Label>
                <Textarea
                  id="notes"
                  placeholder="Any special requests or notes about your rental..."
                  className="min-h-[100px]"
                />
              </div>

              <Button className="w-full" size="lg">
                Reserve Board - $40/day
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Locations */}
      <section id="locations" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Pickup Locations</h2>
            <p className="text-lg text-gray-600">Convenient locations at the Bay Area's best surf spots</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  Pacifica
                </CardTitle>
                <CardDescription>Linda Mar Beach</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-2">Perfect for beginners and longboarders</p>
                <p className="text-xs text-gray-500">Open: 7 AM - 7 PM</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  Half Moon Bay
                </CardTitle>
                <CardDescription>Mavericks Area</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-2">Consistent waves, great for all levels</p>
                <p className="text-xs text-gray-500">Open: 6 AM - 8 PM</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  Santa Cruz
                </CardTitle>
                <CardDescription>Steamer Lane</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-2">World-class surf spot</p>
                <p className="text-xs text-gray-500">Open: 6 AM - 8 PM</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  Ocean Beach
                </CardTitle>
                <CardDescription>San Francisco</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-2">Urban surf experience</p>
                <p className="text-xs text-gray-500">Open: 7 AM - 7 PM</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Rental Pricing</h2>
            <p className="text-lg text-gray-600">Flexible pricing options for every surfer</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader className="text-center">
                <CardTitle>Half Day</CardTitle>
                <CardDescription>4 Hours</CardDescription>
                <div className="text-3xl font-bold text-blue-600">$25</div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Board rental</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Wetsuit included</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Basic insurance</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-500 border-2">
              <CardHeader className="text-center">
                <Badge className="mb-2">Most Popular</Badge>
                <CardTitle>Full Day</CardTitle>
                <CardDescription>8 Hours</CardDescription>
                <div className="text-3xl font-bold text-blue-600">$40</div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Board rental</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Wetsuit included</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Full insurance</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Free wax & leash</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <CardTitle>Weekly</CardTitle>
                <CardDescription>7 Days</CardDescription>
                <div className="text-3xl font-bold text-blue-600">$210</div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Board rental</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Wetsuit included</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Premium insurance</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Free accessories</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Board swap option</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Get in Touch</h2>
            <p className="text-lg text-gray-600">Questions? We're here to help!</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>Reach out to us anytime</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-blue-600" />
                  <span>(415) 555-SURF</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-blue-600" />
                  <span>info@baysurfrentals.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <span>Multiple locations across the Bay Area</span>
                </div>
                <div className="pt-4">
                  <h4 className="font-semibold mb-2">Hours of Operation</h4>
                  <p className="text-sm text-gray-600">Monday - Sunday: 6 AM - 8 PM</p>
                  <p className="text-sm text-gray-600">Holiday hours may vary</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Send us a Message</CardTitle>
                <CardDescription>We'll get back to you within 24 hours</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="contact-name">Name</Label>
                  <Input id="contact-name" placeholder="Your name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-email">Email</Label>
                  <Input id="contact-email" type="email" placeholder="Your email" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" placeholder="How can we help you?" className="min-h-[120px]" />
                </div>
                <Button className="w-full">Send Message</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Waves className="h-6 w-6 text-blue-400" />
                <span className="text-lg font-bold">Bay Surf Rentals</span>
              </div>
              <p className="text-gray-400 text-sm">
                Your premier destination for surf board rentals in the Bay Area. Ride the waves with confidence.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#boards" className="hover:text-white">
                    Boards
                  </a>
                </li>
                <li>
                  <a href="#locations" className="hover:text-white">
                    Locations
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="hover:text-white">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#contact" className="hover:text-white">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Locations</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Pacifica</li>
                <li>Half Moon Bay</li>
                <li>Santa Cruz</li>
                <li>Ocean Beach</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Follow Us</h4>
              <p className="text-sm text-gray-400 mb-4">Stay updated with surf conditions and special offers</p>
              <div className="flex gap-4">
                <Button variant="outline" size="sm" className="text-gray-400 border-gray-600 hover:text-white">
                  Instagram
                </Button>
                <Button variant="outline" size="sm" className="text-gray-400 border-gray-600 hover:text-white">
                  Facebook
                </Button>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 Bay Surf Rentals. All rights reserved.</p>
          </div>
        </div>
      </footer>
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} onSuccess={() => fetchUserListings()} />
      <Toaster />
    </div>
  )
}
