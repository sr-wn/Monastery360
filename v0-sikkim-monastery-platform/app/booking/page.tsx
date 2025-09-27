"use client"

import { useMemo } from "react"
import { useSearchParams } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function BookingPage() {
  const params = useSearchParams()
  const eventTitle = params.get("title") || "Event"
  const monastery = params.get("monastery") || "Monastery"
  const date = params.get("date") || ""
  const backend = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080"
  const requireLogin = async () => {
    const me = await fetch(`${backend}/api/auth/me`, { credentials: 'include' }).then(r => r.json()).catch(() => null)
    if (!me || !me.authenticated) {
      window.location.href = `${backend}/oauth2/authorization/google`
    }
  }

  const defaultPayload = useMemo(() => ({
    name: "",
    email: "",
    phone: "",
    tickets: 1,
    language: "en",
  }), [])

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Book Tickets</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">You must be signed in to book.</div>
                <Button size="sm" onClick={requireLogin}>Sign in</Button>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-muted-foreground">Event</div>
                  <div className="font-medium">{eventTitle}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Monastery</div>
                  <div className="font-medium">{monastery}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Date</div>
                  <div className="font-medium">{date}</div>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm mb-1">Full Name</div>
                  <Input placeholder="Your name" defaultValue={defaultPayload.name} />
                </div>
                <div>
                  <div className="text-sm mb-1">Email</div>
                  <Input type="email" placeholder="you@example.com" defaultValue={defaultPayload.email} />
                </div>
                <div>
                  <div className="text-sm mb-1">Phone</div>
                  <Input type="tel" placeholder="+91XXXXXXXXXX" defaultValue={defaultPayload.phone} />
                </div>
                <div>
                  <div className="text-sm mb-1">Tickets</div>
                  <Select defaultValue={String(defaultPayload.tickets)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1,2,3,4,5].map(n => (
                        <SelectItem key={n} value={String(n)}>{n}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <div className="text-sm mb-1">Preferred Language</div>
                  <Select defaultValue={defaultPayload.language}>
                    <SelectTrigger>
                      <SelectValue placeholder="Language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="hi">Hindi</SelectItem>
                      <SelectItem value="ne">Nepali</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button className="flex-1">Proceed to Payment</Button>
                <Button variant="outline" className="flex-1" onClick={() => history.back()}>Cancel</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}


