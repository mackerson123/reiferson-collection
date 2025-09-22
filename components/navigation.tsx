"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronDown, Menu, X } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const collections = [
  {
    id: "charles-conlon",
    title: "Charles M. Conlon",
    subtitle: "Master of Baseball Photography",
  },
  {
    id: "color-line",
    title: "The Color Line and Jackie Robinson",
    subtitle: "Breaking Barriers Through the Lens",
  },
  {
    id: "negro-leagues",
    title: "The Negro Leagues",
    subtitle: "Celebrating Excellence and Resilience",
  },
  {
    id: "baseball-art",
    title: "American Icon: The Baseball as Art and Invention",
    subtitle: "The Evolution of America's Pastime",
  },
]

interface NavigationProps {
  currentPath?: string
}

export default function Navigation({ currentPath = "/" }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const isActive = (path: string) => {
    if (path === "/" && currentPath === "/") return true
    if (path !== "/" && currentPath?.startsWith(path)) return true
    return false
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <div className="w-full px-8 md:px-16 lg:px-24 py-4 relative">
        <div className="flex items-center justify-between w-full">
          {/* Left: Site Title */}
          <div>
            <a
              href="/"
              className="text-3xl md:text-4xl font-sans font-bold text-black hover:text-gray-700 transition-colors"
            >
              The Reiferson Collection
            </a>
          </div>

          {/* Right: Navigation Items - positioned to align with explore button */}
          <div className="hidden md:flex items-center gap-8 absolute right-8 md:right-16 lg:right-24">
            <a
              href="/"
              className={`text-sm font-sans transition-colors ${
                isActive("/") ? "text-black font-medium" : "text-black hover:text-gray-600"
              }`}
            >
              Home
            </a>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className={`flex items-center gap-1 px-0 hover:bg-transparent text-sm font-sans ${
                    currentPath?.startsWith("/collections")
                      ? "text-black font-medium"
                      : "text-black hover:text-gray-600"
                  }`}
                >
                  Collections
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 bg-white border-gray-200">
                {collections.map((collection) => (
                  <DropdownMenuItem key={collection.id} asChild>
                    <a
                      href={`/collections/${collection.id}`}
                      className="flex flex-col items-start gap-1 p-4 cursor-pointer hover:bg-gray-50"
                    >
                      <span className="font-medium text-black font-sans">{collection.title}</span>
                      <span className="text-sm text-gray-600 font-sans">{collection.subtitle}</span>
                    </a>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <a
              href="/about"
              className={`text-sm font-sans transition-colors ${
                isActive("/about") ? "text-black font-medium" : "text-black hover:text-gray-600"
              }`}
            >
              About
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex justify-end">
            <Button
              variant="ghost"
              size="icon"
              className="text-black hover:bg-gray-100"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200 pt-4">
            <div className="flex flex-col gap-4">
              <a
                href="/"
                className={`text-base font-sans transition-colors ${
                  isActive("/") ? "text-black font-medium" : "text-black hover:text-gray-600"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </a>

              {/* Mobile Collections */}
              <div className="space-y-2">
                <span className="text-base font-medium text-black font-sans">Collections</span>
                <div className="pl-4 space-y-3">
                  {collections.map((collection) => (
                    <a
                      key={collection.id}
                      href={`/collections/${collection.id}`}
                      className="block text-black hover:text-gray-600 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <div className="flex flex-col gap-1">
                        <span className="font-medium font-sans">{collection.title}</span>
                        <span className="text-sm text-gray-600 font-sans">{collection.subtitle}</span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              <a
                href="/about"
                className={`text-base font-sans transition-colors ${
                  isActive("/about") ? "text-black font-medium" : "text-black hover:text-gray-600"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
