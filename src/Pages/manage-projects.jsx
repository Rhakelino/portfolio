import React, { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import { v4 as uuidv4 } from 'uuid'
import ThemeToggle from '../components/ThemeToggle'
import { useTheme } from '../contexts/ThemeContext'

// Modal Komponen
const EditProjectModal = ({
  project,
  isOpen,
  onClose,
  onUpdate,
  uploading,
  imagePreview,
  handleImageUpload
}) => {
  const [editedProject, setEditedProject] = useState({
    title: '',
    description: '',
    technologies: '',
    image: '',
    githubLink: '',
    liveLink: ''
  })

  useEffect(() => {
    if (project) {
      setEditedProject({
        title: project.title,
        description: project.description,
        technologies: project.technologies.join(', '),
        image: project.image,
        githubLink: project.github_link,
        liveLink: project.live_link
      })
    }
  }, [project])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-card border border-border rounded-2xl p-8 w-full max-w-2xl">
        <h2 className="text-3xl font-bold mb-6 text-foreground">Edit Proyek</h2>

        <form onSubmit={(e) => onUpdate(e, editedProject)} className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            {/* Image Upload Section */}
            <div className="md:col-span-1">
              <div className="bg-gray-700 rounded-lg p-4 flex flex-col items-center">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-600 rounded-lg mb-4 flex items-center justify-center">
                    No image selected
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="editImageUpload"
                />
                <label
                  htmlFor="editImageUpload"
                  className="w-full bg-primary text-primary-foreground py-2 rounded-lg text-center cursor-pointer hover:bg-primary/90 transition-colors"
                >
                  {imagePreview ? 'Change Image' : 'Upload Image'}
                </label>
              </div>
            </div>

            {/* Project Details */}
            <div className="md:col-span-2 grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Project Title"
                value={editedProject.title}
                onChange={(e) => setEditedProject({ ...editedProject, title: e.target.value })}
                className="bg-input text-foreground p-3 rounded-lg col-span-2 border border-border focus:ring-2 focus:ring-ring"
                required
              />
              <input
                type="text"
                placeholder="Technologies (comma-separated)"
                value={editedProject.technologies}
                onChange={(e) => setEditedProject({ ...editedProject, technologies: e.target.value })}
                className="bg-input text-foreground p-3 rounded-lg border border-border focus:ring-2 focus:ring-ring"
                required
              />
              <input
                type="text"
                placeholder="GitHub Link"
                value={editedProject.githubLink}
                onChange={(e) => setEditedProject({ ...editedProject, githubLink: e.target.value })}
                className="bg-input text-foreground p-3 rounded-lg border border-border focus:ring-2 focus:ring-ring"
              />
              <input
                type="text"
                placeholder="Live Link"
                value={editedProject.liveLink}
                onChange={(e) => setEditedProject({ ...editedProject, liveLink: e.target.value })}
                className="bg-gray-700 text-white p-3 rounded-lg"
              />
              <textarea
                placeholder="Project Description"
                value={editedProject.description}
                onChange={(e) => setEditedProject({ ...editedProject, description: e.target.value })}
                className="bg-gray-700 text-white p-3 rounded-lg col-span-2"
                required
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-500"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={uploading}
              className={`bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-4 py-2 rounded-lg ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {uploading ? 'Memperbarui...' : 'Perbarui Proyek'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const ProjectSkeleton = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-8">
      <div className="container mx-auto">
        {/* Skeleton for Add Project Form */}
        <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 mb-8 animate-pulse">
          <div className="grid md:grid-cols-3 gap-4">
            {/* Image Upload Skeleton */}
            <div className="md:col-span-1">
              <div className="bg-gray-700 rounded-lg p-4 flex flex-col items-center">
                <div className="w-full h-48 bg-gray-600 rounded-lg mb-4"></div>
                <div className="w-full h-10 bg-gray-600 rounded-lg"></div>
              </div>
            </div>

            {/* Project Details Skeleton */}
            <div className="md:col-span-2 grid grid-cols-2 gap-4">
              <div className="col-span-2 h-12 bg-gray-700 rounded-lg"></div>
              <div className="h-12 bg-gray-700 rounded-lg"></div>
              <div className="h-12 bg-gray-700 rounded-lg"></div>
              <div className="h-12 bg-gray-700 rounded-lg"></div>
              <div className="col-span-2 h-24 bg-gray-700 rounded-lg"></div>
            </div>
          </div>

          <div className="mt-4 w-full h-12 bg-gray-700 rounded-lg"></div>
        </div>

        {/* Projects List Skeleton */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((item) => (
            <div 
              key={item} 
              className="bg-gray-800 border border-gray-700 rounded-2xl overflow-hidden animate-pulse"
            >
              <div className="w-full h-48 bg-gray-700"></div>
              <div className="p-6">
                <div className="h-8 bg-gray-700 mb-2 w-3/4"></div>
                <div className="h-4 bg-gray-700 mb-4 w-full"></div>
                <div className="flex flex-wrap gap-2 mb-4">
                  <div className="h-6 bg-gray-700 w-20 rounded-md"></div>
                  <div className="h-6 bg-gray-700 w-20 rounded-md"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}


// Komponen Utama ManageProjects
const ManageProjects = () => {
  const { isDarkMode, setIsDarkMode } = useTheme()
  const [projects, setProjects] = useState([])
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [notification, setNotification] = useState(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    technologies: '',
    image: '',
    githubLink: '',
    liveLink: ''
  })

const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProjectsWithDelay = async () => {
      setIsLoading(true)
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) {
          console.error('Error fetching projects:', error)
        } else {
          setProjects(data || [])
        }
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProjectsWithDelay()
  }, [])

  if (isLoading) {
    return <ProjectSkeleton />
  }

  const fetchProjects = async () => {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching projects:', error)
      setNotification('Gagal mengambil daftar proyek')
    } else {
      setProjects(data || [])
    }
  }

  // Handle Image Upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Preview image
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)

      // Set file for upload
      setImageFile(file)
    }
  }

  // Upload Image to Supabase Storage
  const uploadImage = async (file) => {
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}.${fileExt}`
      const filePath = fileName

      const { data, error: uploadError } = await supabase.storage
        .from('project-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        })

      if (uploadError) {
        console.error('Gagal upload gambar:', uploadError)
        setNotification(`Gagal upload gambar: ${uploadError.message}`)
        return null
      }

      const { data: { publicUrl } } = supabase.storage
        .from('project-images')
        .getPublicUrl(filePath)

      return publicUrl
    } catch (error) {
      console.error('Error uploading image:', error)
      setNotification('Terjadi kesalahan saat upload gambar')
      return null
    }
  }

  // Reset Form
  const resetForm = () => {
    setNewProject({
      title: '',
      description: '',
      technologies: '',
      image: '',
      githubLink: '',
      liveLink: ''
    })
    setImageFile(null)
    setImagePreview(null)
  }

  // Handle Add Project
  const handleAddProject = async (e) => {
    e.preventDefault()
    setUploading(true)

    try {
      // Upload image first
      let imageUrl = null
      if (imageFile) {
        imageUrl = await uploadImage(imageFile)
        if (!imageUrl) {
          setNotification('Gagal mengupload gambar')
          setUploading(false)
          return
        }
      }

      // Convert technologies string to array
      const technologiesArray = newProject.technologies
        .split(',')
        .map(tech => tech.trim())

      const { data, error } = await supabase
        .from('projects')
        .insert([{
          title: newProject.title,
          description: newProject.description,
          technologies: technologiesArray,
          image: imageUrl || newProject.image,
          github_link: newProject.githubLink,
          live_link: newProject.liveLink
        }])
        .select()

      if (error) {
        throw error
      }

      // Reset form and show notification
      setNotification('Proyek berhasil ditambahkan!')
      resetForm()

      // Refresh projects
      fetchProjects()
    } catch (error) {
      console.error('Error adding project:', error)
      setNotification('Gagal menambahkan proyek')
    } finally {
      setUploading(false)
      // Clear notification after 3 seconds
      setTimeout(() => setNotification(null), 3000)
    }
  }

  // Handle Edit Project
  const handleEditProject = (project) => {
    setEditingProject(project)
    setImagePreview(project.image)
    setIsEditModalOpen(true)
  }

  // Handle Update Project
  const handleUpdateProject = async (e, updatedProject) => {
    e.preventDefault()
    setUploading(true)

    try {
      // Upload new image if exists
      let imageUrl = updatedProject.image
      if (imageFile) {
        imageUrl = await uploadImage(imageFile)
        if (!imageUrl) {
          setNotification('Gagal mengupload gambar')
          setUploading(false)
          return
        }
      }

      // Convert technologies string to array
      const technologiesArray = updatedProject.technologies
        .split(',')
        .map(tech => tech.trim())

      const { data, error } = await supabase
        .from('projects')
        .update({
          title: updatedProject.title,
          description: updatedProject.description,
          technologies: technologiesArray,
          image: imageUrl,
          github_link: updatedProject.githubLink,
          live_link: updatedProject.liveLink
        })
        .eq('id', editingProject.id)
        .select()

      if (error) {
        throw error
      }

      // Reset form and show notification
      setNotification('Proyek berhasil diperbarui!')
      resetForm()
      setIsEditModalOpen(false)

      // Refresh projects
      fetchProjects()
    } catch (error) {
      console.error('Error updating project:', error)
      setNotification('Gagal memperbarui proyek')
    } finally {
      setUploading(false)
      // Clear notification after 3 seconds
      setTimeout(() => setNotification(null), 3000)
    }
  }

  // Handle Delete Project
  const handleDeleteProject = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus proyek ini?')) {
      try {
        // Cari item yang akan dihapus untuk mendapatkan URL gambar
        const { data: projectItem, error: fetchError } = await supabase
          .from('projects')
          .select('image')
          .eq('id', id)
          .single()

        if (fetchError) {
          console.error('Gagal mengambil data proyek:', fetchError.message)
          setNotification('Gagal mengambil data proyek.')
          return
        }

        // Ekstrak nama file dari URL gambar
        if (projectItem?.image) {
          const fileName = projectItem.image.split('/').pop()

          if (fileName) {
            // Hapus file dari storage
            const { error: storageError } = await supabase.storage
              .from('project-images')
              .remove([fileName])

            if (storageError) {
              console.error('Gagal menghapus file dari storage:', storageError.message)
              setNotification('Gagal menghapus file dari storage.')
              return
            }
          }
        }

        // Hapus data dari database
        const { error: deleteError } = await supabase
          .from('projects')
          .delete()
          .eq('id', id)

        if (deleteError) {
          console.error('Gagal menghapus proyek:', deleteError.message)
          setNotification('Gagal menghapus proyek.')
          return
        }

        // Refresh daftar proyek
        fetchProjects()

        // Tampilkan notifikasi
        setNotification('Proyek berhasil dihapus!')
      } catch (error) {
        console.error('Error saat menghapus proyek:', error)
        setNotification('Terjadi kesalahan saat menghapus proyek.')
      } finally {
        // Sembunyikan notifikasi setelah 3 detik
        setTimeout(() => setNotification(null), 3000)
      }
    }
  }
  const NotificationModal = ({ message, onClose }) => {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm">
        <div
          className="
          bg-gradient-to-r from-purple-500 to-indigo-600 
          text-white 
          px-10 py-6 
          rounded-xl 
          shadow-2xl 
          flex 
          items-center 
          space-x-4
          animate-bounce
        "
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="text-lg font-semibold">{message}</span>
          <button
            onClick={onClose}
            className="ml-4 hover:bg-white/20 rounded-full p-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    )
  }

  const closeNotification = () => {
    setNotification(null)
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-8">
      <div className="container mx-auto">
        {/* Notification */}
        {notification && (
          <NotificationModal
            message={notification}
            onClose={closeNotification}
          />
        )}

        <h1 className="text-4xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-indigo-500">
          Tambah Proyek
        </h1>

        <form
          onSubmit={handleAddProject}
          className="bg-gray-800 border border-gray-700 rounded-2xl p-6 mb-8"
        >
          <div className="grid md:grid-cols-3 gap-4">
            {/* Image Upload Section */}
            <div className="md:col-span-1">
              <div className="bg-gray-700 rounded-lg p-4 flex flex-col items-center">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-600 rounded-lg mb-4 flex items-center justify-center">
                    No image selected
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="imageUpload"
                />
                <label
                  htmlFor="imageUpload"
                  className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white py-2 rounded-lg text-center cursor-pointer hover:scale-105 transition-transform"
                >
                  {imagePreview ? 'Change Image' : 'Upload Image'}
                </label>
              </div>
            </div>

            {/* Project Details */}
            <div className="md:col-span-2 grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Project Title"
                value={newProject.title}
                onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                className="bg-gray-700 text-white p-3 rounded-lg col-span-2"
                required
              />
              <input
                type="text"
                placeholder="Technologies (comma-separated)"
                value={newProject.technologies}
                onChange={(e) => setNewProject({ ...newProject, technologies: e.target.value })}
                className="bg-gray-700 text-white p-3 rounded-lg"
                required
              />
              <input
                type="text"
                placeholder="GitHub Link"
                value={newProject.githubLink}
                onChange={(e) => setNewProject({ ...newProject, githubLink: e.target.value })}
                className="bg-gray-700 text-white p-3 rounded-lg"
              />
              <input
                type="text"
                placeholder="Live Link"
                value={newProject.liveLink}
                onChange={(e) => setNewProject({ ...newProject, liveLink: e.target.value })}
                className="bg-gray-700 text-white p-3 rounded-lg"
              />
              <textarea
                placeholder="Project Description"
                value={newProject.description}
                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                className="bg-gray-700 text-white p-3 rounded-lg col-span-2"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={uploading}
            className={`mt-4 w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white p-3 rounded-lg  transition-transform ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {uploading ? 'Uploading...' : 'Add Project'}
          </button>
        </form>

        {/* Projects List */}
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8 text-center">My Projects</h1>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-gray-800 border border-gray-700 rounded-2xl overflow-hidden relative"
              >
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 right-4 flex space-x-2">
                  <button
                    onClick={() => handleEditProject(project)}
                    className="bg-yellow-500 text-white p-2 rounded-full hover:bg-yellow-600 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.379-8.379-2.828-2.828z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDeleteProject(project.id)}
                    className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-2">{project.title}</h2>
                  <p className="text-gray-400 mb-4">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map((tech, index) => (
                      <span
                        key={index}
                        className="bg-gray-700 px-2 py-1 rounded-md text-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Edit Project Modal */}
        <EditProjectModal
          project={editingProject}
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false)
            resetForm()
          }}
          onUpdate={handleUpdateProject}
          uploading={uploading}
          imagePreview={imagePreview}
          handleImageUpload={handleImageUpload}
        />
      </div>
    </div>
  )
}

export default ManageProjects

