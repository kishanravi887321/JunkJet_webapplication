export interface Route {
  path: string
  name: string
  icon?: string
}

export const routes: Route[] = [
  { path: "/", name: "Home", icon: "Home" },
  { path: "/transactions", name: "Transactions", icon: "Package" },
  { path: "/phase1", name: "Phase 1", icon: "Users" },
  { path: "/phase2", name: "Phase 2", icon: "Building" },
  { path: "/phase3", name: "Phase 3", icon: "BarChart3" },
  { path: "/profile", name: "Profile", icon: "User" },
  { path: "/about", name: "About", icon: "Info" },
]

export async function getRoutes(): Promise<Route[]> {
  return routes
}
