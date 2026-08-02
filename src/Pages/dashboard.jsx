import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '@/supabaseClient'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Briefcase, Medal, Code2, ArrowUpRight, PlusCircle, Activity } from 'lucide-react'

// Custom Hook untuk Animasi Counting dengan optimasi
const useCountUp = (end, duration = 2000) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (end > 0) {
      let start = 0;
      const increment = Math.max(1, Math.ceil(end / 50));
      const timer = setInterval(() => {
        start += increment;

        if (start >= end) {
          clearInterval(timer);
          start = end;
        }

        setCount(start);
      }, duration / 50);

      return () => clearInterval(timer);
    }
  }, [end, duration]);

  return count;
};

const Dashboard = () => {
  const [projectCount, setProjectCount] = useState(0)
  const [certificateCount, setCertificateCount] = useState(0)
  const [skillCount, setSkillCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  const animatedProjectCount = useCountUp(projectCount, !isLoading ? 2000 : 0);
  const animatedCertificateCount = useCountUp(certificateCount, !isLoading ? 2000 : 0);
  const animatedSkillCount = useCountUp(skillCount, !isLoading ? 2000 : 0);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const fetchStats = async (table) => {
          const { count } = await supabase
            .from(table)
            .select('*', { count: 'exact', head: true })
          return count || 0
        }

        const [projectsCount, certificatesCount, skillsCount] = await Promise.all([
          fetchStats('projects'),
          fetchStats('certificates'),
          fetchStats('skills')
        ])

        setProjectCount(projectsCount)
        setCertificateCount(certificatesCount)
        setSkillCount(skillsCount)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const StatCardSkeleton = () => (
    <Card className="shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-between space-y-0 pb-2">
          <Skeleton className="h-4 w-[100px]" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
        <div className="mt-4 flex items-baseline gap-2">
          <Skeleton className="h-8 w-[60px]" />
        </div>
      </CardContent>
    </Card>
  )

  const stats = [
    {
      title: "Total Projects",
      value: animatedProjectCount,
      icon: Briefcase,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      link: "/manage-projects"
    },
    {
      title: "Skills Categories",
      value: animatedSkillCount,
      icon: Code2,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      link: "/manage-skills"
    },
    {
      title: "Certificates",
      value: animatedCertificateCount,
      icon: Medal,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      link: "/manage-certificates"
    }
  ]

  const quickActions = [
    { title: "Add New Project", desc: "Showcase your latest work", link: "/manage-projects", icon: Briefcase },
    { title: "Update Skills", desc: "Add new technologies you learned", link: "/manage-skills", icon: Code2 },
    { title: "Upload Certificate", desc: "Add your newest achievements", link: "/manage-certificates", icon: Medal }
  ]

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">

      {/* Header Section */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
        <p className="text-muted-foreground mt-1 text-sm sm:text-base">
          Here's what's happening in your portfolio today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        {isLoading ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card key={index} className="overflow-hidden border-border/40 bg-card/50 backdrop-blur shadow-sm hover:shadow-md transition-all group">
                <CardContent className="p-6 relative">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Icon className={`w-16 h-16 ${stat.color} translate-x-4 -translate-y-4 transform group-hover:scale-110 transition-transform`} />
                  </div>
                  <div className="flex items-center justify-between pb-2 relative z-10">
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <div className={`p-2 rounded-md ${stat.bgColor}`}>
                      <Icon className={`w-4 h-4 ${stat.color}`} />
                    </div>
                  </div>
                  <div className="mt-2 relative z-10 flex items-center justify-between">
                    <div className="text-4xl font-black tracking-tight">{stat.value}</div>
                    <Link to={stat.link} className="flex items-center text-xs text-muted-foreground hover:text-primary transition-colors">
                      View all <ArrowUpRight className="ml-1 w-3 h-3" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>

      {/* Quick Actions & Recent Activity Area */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">

        {/* Quick Actions */}
        <Card className="lg:col-span-4 border-border/40 shadow-sm bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-primary" />
              Quick Actions
            </CardTitle>
            <CardDescription>
              Shortcuts to manage your portfolio content.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            {quickActions.map((action, i) => {
              const ActionIcon = action.icon
              return (
                <Link key={i} to={action.link} className="group">
                  <div className="border border-border/40 p-4 rounded-xl hover:bg-secondary/50 transition-colors flex items-start gap-4 h-full">
                    <div className="bg-primary/10 p-2.5 rounded-lg text-primary mt-0.5 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <ActionIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">{action.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{action.desc}</p>
                    </div>
                  </div>
                </Link>
              )
            })}
          </CardContent>
        </Card>

        {/* System Status / Mini Info */}
        <Card className="lg:col-span-3 border-border/40 shadow-sm bg-gradient-to-br from-card to-secondary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Activity className="w-5 h-5 text-emerald-500" />
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-border/40 pb-4">
                <div className="flex flex-col">
                  <span className="text-sm font-medium">Database Connection</span>
                  <span className="text-xs text-muted-foreground">Supabase</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                  </span>
                  <span className="text-sm font-medium text-emerald-500">Online</span>
                </div>
              </div>

              <div className="flex flex-col gap-1 pt-2">
                <span className="text-sm font-medium">Performance Tips</span>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Keep your portfolio images compressed to under 500KB for faster load times. The built-in uploader automatically processes images for you.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>

    </div>
  )
}

export default Dashboard