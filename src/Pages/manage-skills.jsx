import React, { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import { v4 as uuidv4 } from 'uuid'

const ManageSkills = () => {
  const [skills, setSkills] = useState({
    frontend: [],
    backend: [],
    mobile: []
  })
  const [newSkill, setNewSkill] = useState({
    name: '',
    icon: '',
    category: 'frontend'
  })
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [notification, setNotification] = useState(null)
  const [editingSkill, setEditingSkill] = useState(null)

  // Fetch Skills
  useEffect(() => {
    fetchSkills()
  }, [])

  const fetchSkills = async () => {
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching skills:', error)
      setNotification('Gagal mengambil daftar skills')
    } else {
      // Group skills by category
      const groupedSkills = data.reduce((acc, skill) => {
        if (!acc[skill.category]) {
          acc[skill.category] = []
        }
        acc[skill.category].push(skill)
        return acc
      }, { frontend: [], backend: [], mobile: [] })

      setSkills(groupedSkills)
    }
  }

  // Handle Image Upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
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
        .from('skill-icons')
        .upload(filePath, file, { 
          cacheControl: '3600',
          upsert: true 
        })

      if (uploadError) {
        console.error('Gagal upload icon:', uploadError)
        setNotification(`Gagal upload icon: ${uploadError.message}`)
        return null
      }

      const { data: { publicUrl } } = supabase.storage
        .from('skill-icons')
        .getPublicUrl(filePath)

      return publicUrl
    } catch (error) {
      console.error('Error uploading image:', error)
      setNotification('Terjadi kesalahan saat upload icon')
      return null
    }
  }

  // Reset Form
  const resetForm = () => {
    setNewSkill({
      name: '',
      icon: '',
      category: 'frontend'
    })
    setImageFile(null)
    setImagePreview(null)
    setEditingSkill(null)
  }

  // Handle Add Skill
  const handleAddSkill = async (e) => {
    e.preventDefault()
    setUploading(true)

    try {
      let iconUrl = null
      if (imageFile) {
        iconUrl = await uploadImage(imageFile)
        if (!iconUrl) {
          setNotification('Gagal mengupload icon')
          setUploading(false)
          return
        }
      }

      const { data, error } = await supabase
        .from('skills')
        .insert([{
          name: newSkill.name,
          icon: iconUrl || newSkill.icon,
          category: newSkill.category
        }])
        .select()

      if (error) {
        throw error
      }

      setNotification('Skill berhasil ditambahkan!')
      resetForm()
      fetchSkills()
    } catch (error) {
      console.error('Error adding skill:', error)
      setNotification('Gagal menambahkan skill')
    } finally {
      setUploading(false)
      setTimeout(() => setNotification(null), 3000)
    }
  }

  // Handle Edit Skill
  const handleEditSkill = (skill) => {
    setEditingSkill(skill)
    setNewSkill({
      name: skill.name,
      icon: skill.icon,
      category: skill.category
    })
    setImagePreview(skill.icon)
  }

  // Handle Update Skill
  const handleUpdateSkill = async (e) => {
    e.preventDefault()
    setUploading(true)

    try {
      let iconUrl = editingSkill.icon
      if (imageFile) {
        iconUrl = await uploadImage(imageFile)
        if (!iconUrl) {
          setNotification('Gagal mengupload icon')
          setUploading(false)
          return
        }
      }

      const { data, error } = await supabase
        .from('skills')
        .update({
          name: newSkill.name,
          icon: iconUrl,
          category: newSkill.category
        })
        .eq('id', editingSkill.id)
        .select()

      if (error) {
        throw error
      }

      setNotification('Skill berhasil diperbarui!')
      resetForm()
      fetchSkills()
    } catch (error) {
      console.error('Error updating skill:', error)
      setNotification('Gagal memperbarui skill')
    } finally {
      setUploading(false)
      setTimeout(() => setNotification(null), 3000)
    }
  }

  // Handle Delete Skill
  const handleDeleteSkill = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus skill ini?')) {
      try {
        const { data: skillItem, error: fetchError } = await supabase
          .from('skills')
          .select('icon')
          .eq('id', id)
          .single()

        if (fetchError) {
          console.error('Gagal mengambil data skill:', fetchError.message)
          setNotification('Gagal mengambil data skill.')
          return
        }

        if (skillItem?.icon) {
          const fileName = skillItem.icon.split('/').pop()

          if (fileName) {
            const { error: storageError } = await supabase.storage
              .from('skill-icons')
              .remove([fileName])

            if (storageError) {
              console.error('Gagal menghapus file dari storage:', storageError.message)
              setNotification('Gagal menghapus file dari storage.')
              return
            }
          }
        }

        const { error: deleteError } = await supabase
          .from('skills')
          .delete()
          .eq('id', id)

        if (deleteError) {
          console.error('Gagal menghapus skill:', deleteError.message)
          setNotification('Gagal menghapus skill.')
          return
        }

        fetchSkills()
        setNotification('Skill berhasil dihapus!')
      } catch (error) {
        console.error('Error saat menghapus skill:', error)
        setNotification('Terjadi kesalahan saat menghapus skill.')
      } finally {
        setTimeout(() => setNotification(null), 3000)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-8">
      <div className="container mx-auto">
        {/* Notification */}
        {notification && (
          <div className="bg-green-500 text-white p-2 rounded text-center mb-4">
            {notification}
          </div>
        )}

        <h1 className="text-4xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-indigo-500">
          {editingSkill ? 'Edit Skill' : 'Tambah Skill'}
        </h1>

        <form
          onSubmit={editingSkill ? handleUpdateSkill : handleAddSkill}
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
                    No icon selected
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="iconUpload"
                />
                <label
                  htmlFor="iconUpload"
                  className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white py-2 rounded-lg text-center cursor-pointer hover:scale-105 transition-transform"
                >
                  {imagePreview ? 'Change Icon' : 'Upload Icon'}
                </label>
              </div>
            </div>

            {/* Skill Details */}
            <div className="md:col-span-2 grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Skill Name"
                value={newSkill.name}
                onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                className="bg-gray-700 text-white p-3 rounded-lg col-span-2"
                required
              />
              <select
                value={newSkill.category}
                onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
                className="bg-gray-700 text-white p-3 rounded-lg col-span-2"
              >
                <option value="frontend">Frontend</option>
                <option value="backend">Backend</option>
                <option value="mobile">Mobile</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={uploading}
            className={`mt-4 w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white p-3 rounded-lg transition-transform ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {uploading ? 'Processing...' : (editingSkill ? 'Update Skill' : 'Add Skill')}
          </button>
        </form>

        {/* Skills by Category */}
        {Object.keys(skills).map((category) => (
          <div key={category} className="mb-8">
            <h2 className="text-3xl font-bold mb-4 capitalize">
              {category} Skills
            </h2>
            <div className="grid md:grid-cols-4 lg:grid-cols-6 gap-6">
              {skills[category].map((skill) => (
                <div
                  key={skill.id}
                  className="bg-gray-800 border border-gray-700 rounded-2xl p-4 flex flex-col items-center"
                >
                  <img
                    src={skill.icon}
                    alt={skill.name}
                    className="w-16 h-16 mb-2 object-contain"
                  />
                  <h3 className="text-lg font-semibold mb-2">{skill.name}</h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditSkill(skill)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteSkill(skill.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ManageSkills