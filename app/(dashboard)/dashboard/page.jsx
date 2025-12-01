"use client";

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  PlusSquare, 
  Eye, 
  Heart, 
  MessageSquare, 
  Users as UsersIcon,
  ArrowUp,
  ArrowDown,
  Loader2
} from "lucide-react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"

function StatCard({ title, value, change, icon: Icon, className = '' }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </div>
        <div className={`text-xs ${change >= 0 ? 'text-green-500' : 'text-red-500'} flex items-center`}>
          {change >= 0 ? (
            <ArrowUp className="h-3 w-3 mr-1" />
          ) : (
            <ArrowDown className="h-3 w-3 mr-1" />
          )}
          {Math.abs(change)}% from last month
        </div>
      </CardContent>
    </Card>
  )
}

export default function DashBoard() {
  const stats = useQuery(api.dashboard.getDashboardStats)

  if (stats === undefined) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Welcome back! Here's what's happening with your account.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button className="gap-2">
            <PlusSquare className="h-4 w-4" />
            <span>Create New</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Views"
          value={stats.views.total}
          change={stats.views.change}
          icon={Eye}
          className="h-full"
        />
        <StatCard
          title="Total Likes"
          value={stats.likes.total}
          change={stats.likes.change}
          icon={Heart}
          className="h-full"
        />
        <StatCard
          title="Total Comments"
          value={stats.comments.total}
          change={stats.comments.change}
          icon={MessageSquare}
          className="h-full"
        />
        <StatCard
          title="Total Followers"
          value={stats.followers.total}
          change={stats.followers.change}
          icon={UsersIcon}
          className="h-full"
        />
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        {/* Recent Activity Card */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                You've had 0 posts in the last 7 days.
              </p>
              <div className="flex items-center justify-center p-8 rounded-lg border border-dashed min-h-[120px]">
                <p className="text-sm text-muted-foreground">No recent activity to display</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions Card */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <p className="text-sm text-muted-foreground">Get started with these actions</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start gap-2 py-4 h-auto">
                <PlusSquare className="h-4 w-4" />
                Create New Post
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2 py-4 h-auto">
                <UsersIcon className="h-4 w-4" />
                Find People to Follow
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2 py-4 h-auto">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z" />
                  <path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
                  <path d="M12 2v2" />
                  <path d="M12 22v-2" />
                  <path d="m17 20.7 1-1" />
                  <path d="m6 3 1 1" />
                  <path d="m3 7 1-1" />
                  <path d="m20 7 1 1" />
                  <path d="m4 17 1 1" />
                  <path d="m17 3-1 1" />
                  <path d="m20 17-1 1" />
                </svg>
                Account Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}