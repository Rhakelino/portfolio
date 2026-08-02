import React, { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import { v4 as uuidv4 } from 'uuid'
import { handleImageCompression, projectImageOptions } from '../utils/imageCompression'
import { toast } from "sonner"

// shadcn UI components
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Skeleton } from "@/components/ui/skeleton"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Pencil, Trash2, ImagePlus, Loader2, RefreshCw } from "lucide-react"

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
    liveLink: '',
    order: ''
  })

  useEffect(() => {
    if (project) {
      setEditedProject({
        title: project.title,
        description: project.description,
        technologies: project.technologies.join(', '),
        image: project.image,
        githubLink: project.github_link || '',
        liveLink: project.live_link || '',
        order: project.order || ''
      })
    }
  }, [project])

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Proyek</DialogTitle>
          <DialogDescription>Update details for your project.</DialogDescription>
        </DialogHeader>

        <form onSubmit={(e) => onUpdate(e, editedProject)} className="space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Image Upload Section */}
            <div className="md:col-span-1">
              <div className="bg-secondary/30 border border-border rounded-lg p-4 flex flex-col items-center">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full aspect-[4/3] object-cover rounded-lg mb-4"
                  />
                ) : (
                  <div className="w-full aspect-[4/3] bg-muted/50 rounded-lg mb-4 flex items-center justify-center">
                    <span className="text-muted-foreground text-sm">No image</span>
                  </div>
                )}
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="editImageUpload"
                />
                <Button asChild variant="secondary" className="w-full cursor-pointer">
                  <label htmlFor="editImageUpload">
                    <ImagePlus className="w-4 h-4 mr-2" />
                    {imagePreview ? 'Change' : 'Upload'}
                  </label>
                </Button>
              </div>
            </div>

            {/* Project Details */}
            <div className="md:col-span-2 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Project Title</Label>
                <Input
                  id="edit-title"
                  value={editedProject.title}
                  onChange={(e) => setEditedProject({ ...editedProject, title: e.target.value })}
                  placeholder="E.g. E-Commerce Platform"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-tech">Technologies (comma-separated)</Label>
                <Input
                  id="edit-tech"
                  value={editedProject.technologies}
                  onChange={(e) => setEditedProject({ ...editedProject, technologies: e.target.value })}
                  placeholder="React, Node.js, Tailwind"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-github">GitHub Link</Label>
                  <Input
                    id="edit-github"
                    value={editedProject.githubLink}
                    onChange={(e) => setEditedProject({ ...editedProject, githubLink: e.target.value })}
                    placeholder="https://github.com/..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-live">Live Link</Label>
                  <Input
                    id="edit-live"
                    value={editedProject.liveLink}
                    onChange={(e) => setEditedProject({ ...editedProject, liveLink: e.target.value })}
                    placeholder="https://yourproject.com"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-order">Display Order (Optional)</Label>
                <Input
                  id="edit-order"
                  type="number"
                  value={editedProject.order}
                  onChange={(e) => setEditedProject({ ...editedProject, order: e.target.value })}
                  placeholder="e.g. 1"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-desc">Description</Label>
                <Textarea
                  id="edit-desc"
                  value={editedProject.description}
                  onChange={(e) => setEditedProject({ ...editedProject, description: e.target.value })}
                  placeholder="Describe your project..."
                  rows={4}
                  required
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={uploading}>
              Cancel
            </Button>
            <Button type="submit" disabled={uploading}>
              {uploading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {uploading ? 'Updating...' : 'Update Project'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

const ProjectSkeleton = () => {
  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="container mx-auto max-w-6xl">
        <Skeleton className="h-10 w-48 mb-8" />
        {/* Skeleton for Add Project Form */}
        <Card className="mb-12">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <Skeleton className="w-full aspect-[4/3] rounded-lg mb-4" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="md:col-span-2 space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <div className="grid grid-cols-2 gap-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <Skeleton className="h-24 w-full" />
              </div>
            </div>
            <Skeleton className="h-10 w-full mt-6" />
          </CardContent>
        </Card>

        {/* Projects List Skeleton */}
        <Skeleton className="h-8 w-40 mb-8 mx-auto" />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((item) => (
            <Card key={item} className="overflow-hidden">
              <Skeleton className="w-full h-48 rounded-none" />
              <CardContent className="p-6">
                <Skeleton className="h-6 w-3/4 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3 mb-4" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-16" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}


// Komponen Utama ManageProjects
const ManageProjects = () => {
  const [projects, setProjects] = useState([])
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    technologies: '',
    image: '',
    githubLink: '',
    liveLink: '',
    order: ''
  })

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProjectsWithDelay = async () => {
      setIsLoading(true)
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .order('order', { ascending: true, nullsFirst: false })
          .order('created_at', { ascending: false })

        if (error) {
          console.error('Error fetching projects:', error)
          toast.error('Gagal mengambil daftar proyek')
        } else {
          setProjects(data || [])
        }
      } catch (error) {
        console.error('Error:', error)
        toast.error('Terjadi kesalahan saat memuat data')
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
      .order('order', { ascending: true, nullsFirst: false })
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching projects:', error)
      toast.error('Gagal mengambil daftar proyek')
    } else {
      setProjects(data || [])
    }
  }

  // Handle Image Upload with Compression
  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (file) {
      toast.info('Memproses gambar...')
      try {
        const compressedFile = await handleImageCompression(file, projectImageOptions)

        // Preview compressed image
        const reader = new FileReader()
        reader.onloadend = () => {
          setImagePreview(reader.result)
        }
        reader.readAsDataURL(compressedFile)

        // Set file for upload
        setImageFile(compressedFile)
        toast.success('Gambar siap diupload')
      } catch (error) {
        console.error('Error compressing image:', error)
        toast.error('Gagal memproses gambar')
      }
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
        toast.error(`Gagal upload gambar: ${uploadError.message}`)
        return null
      }

      const { data: { publicUrl } } = supabase.storage
        .from('project-images')
        .getPublicUrl(filePath)

      return publicUrl
    } catch (error) {
      console.error('Error uploading image:', error)
      toast.error('Terjadi kesalahan saat upload gambar')
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
      liveLink: '',
      order: ''
    })
    setImageFile(null)
    setImagePreview(null)
  }

  // Handle Add Project
  const handleAddProject = async (e) => {
    e.preventDefault()

    if (!newProject.title || !newProject.description || !newProject.technologies) {
      toast.error('Harap lengkapi semua field yang wajib')
      return;
    }

    setUploading(true)
    const tid = toast.loading('Menambahkan proyek...')

    try {
      // Upload image first
      let imageUrl = null
      if (imageFile) {
        imageUrl = await uploadImage(imageFile)
        if (!imageUrl) {
          toast.dismiss(tid)
          setUploading(false)
          return
        }
      }

      // Convert technologies string to array
      const technologiesArray = newProject.technologies
        .split(',')
        .map(tech => tech.trim())
        .filter(tech => tech !== '')

      const { data, error } = await supabase
        .from('projects')
        .insert([{
          title: newProject.title,
          description: newProject.description,
          technologies: technologiesArray,
          image: imageUrl || newProject.image,
          github_link: newProject.githubLink,
          live_link: newProject.liveLink,
          order: newProject.order === '' ? null : parseInt(newProject.order)
        }])
        .select()

      if (error) {
        throw error
      }

      toast.success('Proyek berhasil ditambahkan!', { id: tid })
      resetForm()
      fetchProjects()
    } catch (error) {
      console.error('Error adding project:', error)
      toast.error('Gagal menambahkan proyek', { id: tid })
    } finally {
      setUploading(false)
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

    if (!updatedProject.title || !updatedProject.description || !updatedProject.technologies) {
      toast.error('Harap lengkapi semua field yang wajib')
      return;
    }

    setUploading(true)
    const tid = toast.loading('Memperbarui proyek...')

    try {
      let imageUrl = updatedProject.image
      if (imageFile) {
        if (editingProject.image) {
          const oldFileName = editingProject.image.split('/').pop()
          if (oldFileName) {
            await supabase.storage
              .from('project-images')
              .remove([oldFileName])
          }
        }

        imageUrl = await uploadImage(imageFile)
        if (!imageUrl) {
          toast.dismiss(tid)
          setUploading(false)
          return
        }
      }

      const technologiesArray = updatedProject.technologies
        .split(',')
        .map(tech => tech.trim())
        .filter(tech => tech !== '')

      const { data, error } = await supabase
        .from('projects')
        .update({
          title: updatedProject.title,
          description: updatedProject.description,
          technologies: technologiesArray,
          image: imageUrl,
          github_link: updatedProject.githubLink,
          live_link: updatedProject.liveLink,
          order: updatedProject.order === '' ? null : parseInt(updatedProject.order)
        })
        .eq('id', editingProject.id)
        .select()

      if (error) {
        throw error
      }

      toast.success('Proyek berhasil diperbarui!', { id: tid })
      resetForm()
      setIsEditModalOpen(false)
      fetchProjects()
    } catch (error) {
      console.error('Error updating project:', error)
      toast.error('Gagal memperbarui proyek', { id: tid })
    } finally {
      setUploading(false)
    }
  }

  // Handle Delete Project
  const handleDeleteProject = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus proyek ini? Tindakan ini tidak dapat dibatalkan.')) {
      const tid = toast.loading('Menghapus proyek...')
      try {
        const { data: projectItem, error: fetchError } = await supabase
          .from('projects')
          .select('image')
          .eq('id', id)
          .single()

        if (fetchError) {
          throw fetchError
        }

        if (projectItem?.image) {
          const fileName = projectItem.image.split('/').pop()
          if (fileName) {
            await supabase.storage
              .from('project-images')
              .remove([fileName])
          }
        }

        const { error: deleteError } = await supabase
          .from('projects')
          .delete()
          .eq('id', id)

        if (deleteError) {
          throw deleteError
        }

        fetchProjects()
        toast.success('Proyek berhasil dihapus!', { id: tid })
      } catch (error) {
        console.error('Error saat menghapus proyek:', error)
        toast.error('Terjadi kesalahan saat menghapus proyek.', { id: tid })
      }
    }
  }

  return (
    <div className="space-y-8">
      <div className="max-w-6xl mx-auto">

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-black tracking-tight flex items-center gap-3">
            Add New Project
          </h1>
          <Button variant="outline" size="sm" onClick={fetchProjects} title="Refresh Data">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>

        <Card className="mb-12 shadow-sm border-border/40">
          <CardContent className="p-6">
            <form onSubmit={handleAddProject} className="space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                {/* Image Upload Section */}
                <div className="md:col-span-1">
                  <div className="bg-secondary/30 border border-border rounded-lg p-4 flex flex-col items-center">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full aspect-[4/3] object-cover rounded-md mb-4 shadow"
                      />
                    ) : (
                      <div className="w-full aspect-[4/3] bg-muted/50 rounded-md mb-4 flex items-center justify-center border border-dashed border-border">
                        <span className="text-muted-foreground text-sm">No image</span>
                      </div>
                    )}
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="imageUpload"
                    />
                    <Button asChild variant="secondary" className="w-full cursor-pointer">
                      <label htmlFor="imageUpload">
                        <ImagePlus className="w-4 h-4 mr-2" />
                        {imagePreview ? 'Change Image' : 'Upload Image'}
                      </label>
                    </Button>
                  </div>
                </div>

                {/* Project Details */}
                <div className="md:col-span-2 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Project Title</Label>
                    <Input
                      id="title"
                      placeholder="E.g. E-Commerce Platform"
                      value={newProject.title}
                      onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tech">Technologies (comma-separated)</Label>
                    <Input
                      id="tech"
                      placeholder="React, Node.js, Tailwind"
                      value={newProject.technologies}
                      onChange={(e) => setNewProject({ ...newProject, technologies: e.target.value })}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="github">GitHub Link</Label>
                      <Input
                        id="github"
                        placeholder="https://github.com/..."
                        value={newProject.githubLink}
                        onChange={(e) => setNewProject({ ...newProject, githubLink: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="live">Live Link</Label>
                      <Input
                        id="live"
                        placeholder="https://yourproject.com"
                        value={newProject.liveLink}
                        onChange={(e) => setNewProject({ ...newProject, liveLink: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="order">Display Order (Optional)</Label>
                    <Input
                      id="order"
                      type="number"
                      placeholder="e.g. 1"
                      value={newProject.order}
                      onChange={(e) => setNewProject({ ...newProject, order: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="desc">Description</Label>
                  <Textarea
                    id="desc"
                    placeholder="Describe your project..."
                    value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                    rows={4}
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-border/50">
                <Button type="submit" disabled={uploading} className="w-full md:w-auto">
                  {uploading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {uploading ? 'Adding...' : 'Add Project'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Projects List */}
        <div className="mt-12">
          <h2 className="text-3xl font-black mb-8 text-center bg-clip-text text-transparent bg-gradient-to-br from-foreground to-muted-foreground">My Projects</h2>

          {projects.length === 0 ? (
            <div className="text-center p-12 bg-muted/20 rounded-2xl border border-dashed border-border">
              <p className="text-muted-foreground">You haven't added any projects yet.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project) => (
                <Card key={project.id} className="group overflow-hidden flex flex-col hover:shadow-xl transition-all duration-300 border-border/40 hover:-translate-y-1">
                  <div className="relative overflow-hidden aspect-[16/9] sm:aspect-[4/3]">
                    <img
                      src={project.image || 'https://via.placeholder.com/400x300?text=No+Image'}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-3 right-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="icon"
                        variant="secondary"
                        onClick={() => handleEditProject(project)}
                        className="h-8 w-8 rounded-full shadow-lg backdrop-blur bg-background/80 hover:bg-background"
                      >
                        <Pencil className="w-4 h-4 text-primary" />
                      </Button>
                      <Button
                        size="icon"
                        variant="destructive"
                        onClick={() => handleDeleteProject(project.id)}
                        className="h-8 w-8 rounded-full shadow-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <CardHeader className="flex-1 pb-4">
                    <CardTitle className="text-xl line-clamp-1">{project.title}</CardTitle>
                    <CardDescription className="line-clamp-2 mt-2">{project.description}</CardDescription>
                  </CardHeader>
                  <CardFooter className="pt-0">
                    <div className="flex flex-wrap gap-2">
                      {project.technologies?.map((tech, index) => (
                        <span
                          key={index}
                          className="bg-secondary/50 text-secondary-foreground px-2.5 py-1 rounded-md text-xs font-medium border border-border/40"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
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
      </div >
    </div >
  )
}

export default ManageProjects
