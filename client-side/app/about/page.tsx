import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Recycle, Users, Building2, Leaf, Target, Heart } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About Junkjet</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Revolutionizing waste management through our innovative three-phase system, connecting households, middle
            buyers, and organizations for a sustainable future.
          </p>
        </div>

        {/* Mission Section */}
        <Card className="mb-12 border-emerald-200">
          <CardHeader className="text-center bg-gradient-to-r from-emerald-50 to-green-50">
            <CardTitle className="text-2xl text-emerald-800 flex items-center justify-center gap-2">
              <Target className="h-6 w-6" />
              Our Mission
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-lg text-gray-700 text-center max-w-4xl mx-auto leading-relaxed">
              To create a circular economy where waste becomes a valuable resource, reducing environmental impact while
              generating economic opportunities for communities worldwide.
            </p>
          </CardContent>
        </Card>

        {/* Three-Phase System */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">How Junkjet Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-emerald-200 hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-emerald-600" />
                </div>
                <CardTitle className="text-emerald-800">Phase 1: Households</CardTitle>
                <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">
                  Waste Contributors
                </Badge>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-600">
                  <li>• Register household location</li>
                  <li>• List recyclable waste items</li>
                  <li>• Upload photos and descriptions</li>
                  <li>• Connect with nearby buyers</li>
                  <li>• Track environmental impact</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-green-200 hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Recycle className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-green-800">Phase 2: Middle Buyers</CardTitle>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Waste Processors
                </Badge>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-600">
                  <li>• Source waste from households</li>
                  <li>• Process and sort materials</li>
                  <li>• Manage inventory efficiently</li>
                  <li>• Sell to organizations</li>
                  <li>• Track processing metrics</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-blue-200 hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building2 className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-blue-800">Phase 3: Organizations</CardTitle>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  Bulk Purchasers
                </Badge>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-600">
                  <li>• Purchase processed materials</li>
                  <li>• Access detailed analytics</li>
                  <li>• Track sustainability metrics</li>
                  <li>• Generate impact reports</li>
                  <li>• Meet ESG goals</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Impact Stats */}
        <Card className="mb-12 bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-emerald-800 flex items-center justify-center gap-2">
              <Leaf className="h-6 w-6" />
              Our Environmental Impact
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-emerald-700">50K+</div>
                <div className="text-sm text-gray-600">Tons Recycled</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-700">25K+</div>
                <div className="text-sm text-gray-600">Active Users</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-700">15K+</div>
                <div className="text-sm text-gray-600">CO₂ Tons Saved</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-amber-700">500+</div>
                <div className="text-sm text-gray-600">Partner Organizations</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Values Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Card className="border-emerald-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-emerald-800">
                <Heart className="h-5 w-5" />
                Our Values
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900">Sustainability First</h3>
                <p className="text-gray-600 text-sm">
                  Every decision we make prioritizes environmental impact and long-term sustainability.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Community Driven</h3>
                <p className="text-gray-600 text-sm">
                  We believe in empowering communities to take ownership of their environmental impact.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Innovation</h3>
                <p className="text-gray-600 text-sm">
                  We continuously innovate to make waste management more efficient and accessible.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-800">
                <Target className="h-5 w-5" />
                Future Goals
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900">Global Expansion</h3>
                <p className="text-gray-600 text-sm">Expand our platform to serve communities worldwide by 2025.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">AI Integration</h3>
                <p className="text-gray-600 text-sm">
                  Implement advanced AI for better waste sorting and matching algorithms.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Carbon Neutral</h3>
                <p className="text-gray-600 text-sm">Achieve carbon neutrality across our entire platform by 2026.</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact Section */}
        <Card className="text-center border-emerald-200">
          <CardHeader>
            <CardTitle className="text-2xl text-emerald-800">Join Our Mission</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Ready to make a difference? Join thousands of users who are already contributing to a more sustainable
              future through Junkjet.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/auth/register"
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Get Started Today
              </a>
              <a
                href="/chatbot"
                className="border border-emerald-600 text-emerald-600 hover:bg-emerald-50 px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Ask Our AI Assistant
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
