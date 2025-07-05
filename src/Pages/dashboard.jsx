import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'

const Dashboard = () => {
  const navigate = useNavigate()
  const [userProfile, setUserProfile] = useState(null)
  const [projectCount, setProjectCount] = useState(0)
  const [certificateCount, setCertificateCount] = useState(0)
  const [skillCount, setSkillCount] = useState(0)

  useEffect(() => {
    // Cek apakah sudah login
    const token = localStorage.getItem('supabase_token')
    if (!token) {
      navigate('/login')
      return
    }

    const fetchUserProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUserProfile(user)
      }
    }

    const fetchCounts = async () => {
      // Ambil jumlah proyek
      const { count: projectsCount } = await supabase
        .from('projects')
        .select('*', { count: 'exact' })

      // Ambil jumlah sertifikat
      const { count: certificatesCount } = await supabase
        .from('certificates')
        .select('*', { count: 'exact' })

      // Ambil jumlah skills
      const { count: skillsCount } = await supabase
        .from('skills')
        .select('*', { count: 'exact' })

      setProjectCount(projectsCount || 0)
      setCertificateCount(certificatesCount || 0)
      setSkillCount(skillsCount || 0)
    }

    fetchUserProfile()
    fetchCounts()
  }, [navigate])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    // Hapus token dari localStorage
    localStorage.removeItem('supabase_token')
    localStorage.removeItem('user_email')
    navigate('/login')
  }

  const dashboardItems = [
    {
      title: 'Manage Projects',
      description: 'Add, edit, or remove projects',
      to: '/manage-projects',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      )
    },
    {
      title: 'Manage Certificates',
      description: 'Update your certifications',
      to: '/manage-certificates',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      )
    },
    {
      title: 'Manage Skills',
      description: 'Edit your skill categories',
      to: '/manage-skills',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      )
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <div className="container mx-auto px-4 py-8">
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

        <div className="mt-12 bg-gray-800 border border-gray-700 rounded-2xl p-6">
          <h3 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-green-500">
            Quick Stats
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-gray-700 rounded-lg p-4">
              <h4 className="text-gray-400">Total Projects</h4>
              <p className="text-3xl font-bold text-white">{projectCount}</p>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <h4 className="text-gray-400">Certificates</h4>
              <p className="text-3xl font-bold text-white">{certificateCount}</p>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <h4 className="text-gray-400">Skills</h4>
              <p className="text-3xl font-bold text-white">{skillCount}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard