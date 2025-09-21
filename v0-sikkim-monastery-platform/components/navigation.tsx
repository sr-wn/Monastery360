"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Menu, Camera, MapPin, BookOpen, Calendar, Home, LayoutDashboard } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const navigationItems = [
  {
    name: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
    description: "Main dashboard with all features",
  },
  {
    name: "Virtual Tours",
    href: "/tours",
    icon: Camera,
    description: "Immersive 360° monastery experiences",
  },
  {
    name: "Interactive Map",
    href: "/map",
    icon: MapPin,
    description: "Explore monastery locations",
  },
  {
    name: "Digital Archives",
    href: "/archives",
    icon: BookOpen,
    description: "Browse historical artifacts",
  },
  {
    name: "Cultural Calendar",
    href: "/calendar",
    icon: Calendar,
    description: "Discover festivals and events",
  },
]

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-heading font-bold text-sm">M</span>
            </div>
            <span className="font-heading font-bold text-xl text-foreground">Monastery360</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-sm font-medium transition-all duration-200 hover:text-foreground px-3 py-2 rounded-md ${
                    isActive 
                      ? "text-foreground bg-primary/10 border border-primary/20" 
                      : "text-muted-foreground hover:bg-muted/50"
                  }`}
                >
                  {item.name}
                </Link>
              )
            })}
            <Button size="sm" className="bg-accent hover:bg-accent/90" asChild>
              <Link href="/tours">Explore Now</Link>
            </Button>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                  <Menu className="h-4 w-4" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-primary rounded-md flex items-center justify-center">
                      <span className="text-primary-foreground font-heading font-bold text-xs">M</span>
                    </div>
                    <span className="font-heading font-semibold text-lg">Monastery360</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    {navigationItems.map((item) => {
                      const isActive = pathname === item.href
                      const Icon = item.icon
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={() => setIsOpen(false)}
                          className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 hover:bg-muted ${
                            isActive 
                              ? "bg-primary/10 text-primary border border-primary/20 shadow-sm" 
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          <Icon className={`w-5 h-5 ${isActive ? "text-primary" : ""}`} />
                          <div className="flex-1">
                            <div className={`font-medium text-sm ${isActive ? "text-primary" : ""}`}>{item.name}</div>
                            <div className="text-xs text-muted-foreground">{item.description}</div>
                          </div>
                          {isActive && (
                            <Badge variant="secondary" className="bg-primary/20 text-primary text-xs font-medium">
                              Active
                            </Badge>
                          )}
                        </Link>
                      )
                    })}
                  </div>

                  <div className="pt-4 border-t border-border">
                    <Button className="w-full bg-accent hover:bg-accent/90" asChild onClick={() => setIsOpen(false)}>
                      <Link href="/tours">
                        <Camera className="w-4 h-4 mr-2" />
                        Start Virtual Tour
                      </Link>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navigation
