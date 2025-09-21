import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-muted/30 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-heading font-bold text-sm">M</span>
              </div>
              <span className="font-heading font-bold text-xl">Monastery360</span>
            </div>
            <p className="text-sm text-muted-foreground text-pretty">
              Preserving and sharing Sikkim's sacred monastery heritage through digital innovation.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Explore</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/tours" className="hover:text-foreground transition-colors">
                  Virtual Tours
                </Link>
              </li>
              <li>
                <Link href="/map" className="hover:text-foreground transition-colors">
                  Interactive Map
                </Link>
              </li>
              <li>
                <Link href="/archives" className="hover:text-foreground transition-colors">
                  Digital Archives
                </Link>
              </li>
              <li>
                <Link href="/calendar" className="hover:text-foreground transition-colors">
                  Cultural Calendar
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="#" className="hover:text-foreground transition-colors">
                  Travel Guide
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-foreground transition-colors">
                  Cultural Insights
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-foreground transition-colors">
                  Photography Tips
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-foreground transition-colors">
                  Meditation Guide
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Connect</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="#" className="hover:text-foreground transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-foreground transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-foreground transition-colors">
                  Support
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-foreground transition-colors">
                  Newsletter
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 Monastery360. Preserving sacred heritage through digital innovation.</p>
        </div>
      </div>
    </footer>
  )
}
