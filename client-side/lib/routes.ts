import { promises as fs } from "fs"
import path from "path"

export interface Route {
  path: string
  name: string
  icon?: string
}

export async function getRoutes(): Promise<Route[]> {
  try {
    const routesPath = path.join(process.cwd(), "routes.txt")
    const content = await fs.readFile(routesPath, "utf-8")
    const paths = content.split("\n").filter((line) => line.trim() && !line.startsWith("#"))

    return paths.map((path) => ({
      path: path.trim(),
      name: getRouteName(path.trim()),
      icon: getRouteIcon(path.trim()),
    }))
  } catch (error) {
    // Fallback routes if file doesn't exist
    return [
      { path: "/", name: "Home", icon: "Home" },
      { path: "/chatbot", name: "Chatbot", icon: "MessageCircle" },
      { path: "/phase1", name: "Phase 1", icon: "Users" },
      { path: "/phase2", name: "Phase 2", icon: "Building" },
      { path: "/phase3", name: "Phase 3", icon: "BarChart3" },
      { path: "/profile", name: "Profile", icon: "User" },
      { path: "/about", name: "About", icon: "Info" },
    ]
  }
}

function getRouteName(path: string): string {
  if (path === "/") return "Home"
  if (path.startsWith("/auth/"))
    return path.split("/")[2]?.charAt(0).toUpperCase() + path.split("/")[2]?.slice(1) || "Auth"

  const name = path.replace("/", "").replace(/^\w/, (c) => c.toUpperCase())
  if (name.startsWith("Phase")) {
    return name.replace(/(\d)/, " $1")
  }
  return name
}

function getRouteIcon(path: string): string {
  const iconMap: Record<string, string> = {
    "/": "Home",
    "/chatbot": "MessageCircle",
    "/phase1": "Users",
    "/phase2": "Building",
    "/phase3": "BarChart3",
    "/profile": "User",
    "/about": "Info",
    "/auth/login": "LogIn",
    "/auth/register": "UserPlus",
  }
  return iconMap[path] || "Circle"
}
