import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { useTheme } from '../contexts/ThemeContext'

// Custom Hook untuk Animasi Counting dengan optimasi
const useCountUp = (end, duration = 2000) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Hanya jalankan animasi jika end lebih dari 0
    if (end > 0) {
      let start = 0;
      const increment = Math.max(1, Math.ceil(end / 50)); // Pastikan increment minimal 1
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
  const navigate = useNavigate()
  const { isDarkMode, setIsDarkMode } = useTheme()
  const [userProfile, setUserProfile] = useState(null)
  const [projectCount, setProjectCount] = useState(0)
  const [certificateCount, setCertificateCount] = useState(0)
  const [skillCount, setSkillCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  // Gunakan custom hook untuk animasi counting
  const animatedProjectCount = useCountUp(projectCount, !isLoading ? 2000 : 0);
  const animatedCertificateCount = useCountUp(certificateCount, !isLoading ? 2000 : 0);
  const animatedSkillCount = useCountUp(skillCount, !isLoading ? 2000 : 0);

  useEffect(() => {
    // Cek autentikasi dan redirect jika tidak login
    const checkAuth = async () => {
      const token = localStorage.getItem('supabase_token')
      if (!token) {
        navigate('/login')
        return
      }

      try {
        // Ambil profil user
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          setUserProfile(user)
        }

        // Ambil statistik
        const fetchStats = async (table) => {
          const { count } = await supabase
            .from(table)
            .select('*', { count: 'exact' })
          return count || 0
        }

        // Jalankan semua fetch secara bersamaan
        const [projectsCount, certificatesCount, skillsCount] = await Promise.all([
          fetchStats('projects'),
          fetchStats('certificates'),
          fetchStats('skills')
        ])

        // Update state
        setProjectCount(projectsCount)
        setCertificateCount(certificatesCount)
        setSkillCount(skillsCount)
      } catch (error) {
        console.error('Error fetching data:', error)
        // Optional: Handle error (misalnya logout atau tampilkan pesan)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [navigate])

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

  // Loading Skeleton untuk Quick Stats
  const StatsSkeleton = () => (
    <div className="mt-12 bg-gray-800 border border-gray-700 rounded-2xl p-6 animate-pulse">
      <div className="h-8 bg-gray-700 rounded w-1/2 mb-4"></div>
      <div className="grid md:grid-cols-3 gap-4">
        {[1, 2, 3].map((item) => (
          <div key={item} className="bg-gray-700 rounded-lg p-4">
            <div className="h-4 bg-gray-600 rounded w-1/2 mb-2"></div>
            <div className="h-8 bg-gray-600 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    </div>
  )

  // Loading Skeleton untuk Dashboard Items
  const DashboardItemsSkeleton = () => (
    <div className="grid md:grid-cols-3 gap-8 animate-pulse">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="bg-gray-800 border border-gray-700 rounded-2xl p-6 flex flex-col items-start"
        >
          <div className="mb-4 bg-gray-700 rounded-full h-12 w-12"></div>
          <div className="h-8 bg-gray-700 rounded w-3/4 mb-2"></div>
          <div className="h-5 bg-gray-700 rounded w-full"></div>
        </div>
      ))}
    </div>
  )

  const dashboardItems = [
    {
      title: 'Manage Projects',
      description: 'Add, edit, or remove projects',
      to: '/manage-projects',
      icon: (
        <div className="bg-purple-500/20 p-3 rounded-full">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
        </div>
      )
    },
    {
      title: 'Manage Certificates',
      description: 'Update your certifications',
      to: '/manage-certificates',
      icon: (
        <div className="bg-green-500/20 p-3 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
        </div>
      )
    },
    {
      title: 'Manage Skills',
      description: 'Edit your skill categories',
      to: '/manage-skills',
      icon: (
        <div className="bg-blue-500/20 p-3 rounded-full">
         <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
        </div>
      )
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-indigo-500">
              Admin Dashboard
            </h1>
            {userProfile && (
              <p className="text-gray-400 mt-2">
                Welcome, {userProfile.email}
              </p>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-3 rounded-lg hover:scale-105 transition-transform flex items-center space-x-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 1.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L14.586 11H7a1 1 0 110-2h7.586l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            <span>Logout</span>
          </button>
        </div>

        {/* Dashboard Items */}
        {isLoading ? (
          <DashboardItemsSkeleton />
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {dashboardItems.map((item, index) => (
              <Link
                key={index}
                to={item.to}
                className="bg-gray-800 border border-gray-700 rounded-2xl p-6 hover:bg-gray-700 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex flex-col items-start"
              >
                <div className="mb-4">{item.icon}</div>
                <h2 className="text-2xl font-bold mb-2 text-white">{item.title}</h2>
                <p className="text-gray-400">{item.description}</p>
              </Link>
            ))}
          </div>
        )}

        {/* Quick Stats */}
        {isLoading ? (
          <StatsSkeleton />
        ) : (
          <div className="mt-12 bg-gray-800 border border-gray-700 rounded-2xl p-6">
            <h3 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-green-500">
              Quick Stats
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-gray-700 rounded-lg p-4 transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
                <h4 className="text-gray-400">Total Projects</h4>
                <p className="text-3xl font-bold text-white transition-colors duration-500 hover:text-blue-400">
                  {animatedProjectCount}
                </p>
              </div>
              <div className="bg-gray-700 rounded-lg p-4 transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
                <h4 className="text-gray-400">Certificates</h4>
                <p className="text-3xl font-bold text-white transition-colors duration-500 hover:text-green-400">
                  {animatedCertificateCount}
                </p>
              </div>
              <div className="bg-gray-700 rounded-lg p-4 transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
                <h4 className="text-gray-400">Skills</h4>
                <p className="text-3xl font-bold text-white transition-colors duration-500 hover:text-purple-400">
                  {animatedSkillCount}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard