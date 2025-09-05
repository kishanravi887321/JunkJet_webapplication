import Link from "next/link"
import { Recycle, Leaf, Globe, Heart } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-card border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary">
                <Recycle className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl text-primary">Junkjet</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Transforming waste into opportunity through our innovative three-phase sustainable management system.
            </p>
            <div className="flex items-center space-x-2 text-sm text-primary">
              <Leaf className="h-4 w-4" />
              <span className="font-medium">Building a greener tomorrow</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/phase1" className="text-muted-foreground hover:text-primary transition-colors">
                  Phase 1 - Households
                </Link>
              </li>
              <li>
                <Link href="/phase2" className="text-muted-foreground hover:text-primary transition-colors">
                  Phase 2 - Middle Buyers
                </Link>
              </li>
              <li>
                <Link href="/phase3" className="text-muted-foreground hover:text-primary transition-colors">
                  Phase 3 - Organizations
                </Link>
              </li>
              <li>
                <Link href="/chatbot" className="text-muted-foreground hover:text-primary transition-colors">
                  AI Assistant
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/help" className="text-muted-foreground hover:text-primary transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Impact Stats */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Our Impact</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Globe className="h-4 w-4 text-primary" />
                <span className="text-sm text-muted-foreground">50+ Cities Connected</span>
              </div>
              <div className="flex items-center space-x-2">
                <Recycle className="h-4 w-4 text-primary" />
                <span className="text-sm text-muted-foreground">1M+ Tons Recycled</span>
              </div>
              <div className="flex items-center space-x-2">
                <Heart className="h-4 w-4 text-primary" />
                <span className="text-sm text-muted-foreground">10K+ Happy Users</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-sm text-muted-foreground">
            © 2024 Junkjet. All rights reserved. Made with 💚 for a sustainable future.
          </p>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <span>Powered by sustainable technology</span>
            <Leaf className="h-4 w-4 text-primary" />
          </div>
        </div>
      </div>
    </footer>
  )
}
