import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom'
import { supabase } from '@/supabaseClient'
import { useTheme } from '@/contexts/ThemeContext'
import ThemeToggle from '@/components/ThemeToggle'

import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import {
    LayoutDashboard,
    Briefcase,
    Medal,
    Code2,
    LogOut,
    Menu,
    User,
    Settings,
    Grid
} from 'lucide-react'

const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Projects', path: '/manage-projects', icon: Briefcase },
    { name: 'Skills', path: '/manage-skills', icon: Code2 },
    { name: 'Certificates', path: '/manage-certificates', icon: Medal },
    { name: 'Settings', path: '/manage-settings', icon: Settings },
]

export default function DashboardLayout() {
    const location = useLocation()
    const navigate = useNavigate()
    const { isDarkMode, setIsDarkMode } = useTheme()
    const [userEmail, setUserEmail] = useState('')
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                setUserEmail(user.email)
            } else {
                const storedEmail = localStorage.getItem('user_email')
                if (storedEmail) setUserEmail(storedEmail)
            }
        }
        checkAuth()
    }, [])

    const handleLogout = async () => {
        try {
            await supabase.auth.signOut()
            localStorage.removeItem('supabase_token')
            localStorage.removeItem('user_email')
            navigate('/login')
        } catch (error) {
            console.error('Logout error:', error)
        }
    }

    const getInitials = (email) => {
        return email ? email.substring(0, 2).toUpperCase() : 'AD'
    }

    const SidebarContent = ({ isMobile = false }) => (
        <div className="flex flex-col h-full bg-card text-card-foreground border-r border-border/40">
            {/* Brand / Logo Area */}
            <div className="h-16 flex items-center px-6 border-b border-border/40 relative">
                <Link to="/dashboard" className="flex items-center gap-3 group" onClick={() => isMobile && setIsMobileMenuOpen(false)}>
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <Grid className="w-5 h-5" />
                    </div>
                    <span className="text-xl font-bold tracking-tight">Portfolio Admin</span>
                </Link>
            </div>

            {/* Navigation Links */}
            <div className="flex-1 py-6 px-4 space-y-1.5 overflow-y-auto">
                <p className="px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                    Management
                </p>
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path
                    const Icon = item.icon
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => isMobile && setIsMobileMenuOpen(false)}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive
                                    ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
                                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                                }`}
                        >
                            <Icon className={`w-5 h-5 ${isActive ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
                            {item.name}
                        </Link>
                    )
                })}
            </div>

            {/* Bottom Area (Theme Toggle) */}
            <div className="p-4 border-t border-border/40">
                <div className="flex items-center justify-between px-2 py-2 rounded-lg bg-secondary/50 border border-border/20">
                    <span className="text-sm font-medium text-muted-foreground">Theme</span>
                    <ThemeToggle isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
                </div>
            </div>
        </div>
    )

    return (
        <div className="min-h-screen bg-background flex text-foreground font-sans">

            {/* Desktop Sidebar */}
            <aside className="hidden md:flex w-72 flex-col fixed inset-y-0 z-50">
                <SidebarContent />
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col md:pl-72 min-h-screen">

                {/* Top Navbar */}
                <header className="h-16 flex items-center justify-between px-4 sm:px-8 border-b border-border/40 bg-card/80 backdrop-blur-md sticky top-0 z-40">

                    {/* Mobile Menu Trigger & Brand */}
                    <div className="flex items-center gap-4 md:hidden">
                        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="-ml-2">
                                    <Menu className="w-5 h-5" />
                                    <span className="sr-only">Toggle Sidebar</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="p-0 w-72">
                                <SidebarContent isMobile={true} />
                            </SheetContent>
                        </Sheet>
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                            <Grid className="w-5 h-5" />
                        </div>
                    </div>

                    <div className="flex-1" />

                    {/* User Profile Dropdown */}
                    <div className="flex items-center gap-4">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                                    <Avatar className="h-10 w-10 border-2 border-primary/20 hover:border-primary/50 transition-colors">
                                        <AvatarFallback className="bg-primary/10 text-primary font-bold">
                                            {getInitials(userEmail)}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end" forceMount>
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none">Admin</p>
                                        <p className="text-xs leading-none text-muted-foreground mt-1 truncate">
                                            {userEmail}
                                        </p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="cursor-pointer" asChild>
                                    <Link to="/">
                                        <User className="mr-2 h-4 w-4" />
                                        <span>View Public Portfolio</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive focus:bg-destructive focus:text-destructive-foreground cursor-pointer" onClick={handleLogout}>
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Log out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-4 sm:p-8 animation-fade-in">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}
