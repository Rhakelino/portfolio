import React, { useState, useEffect, useRef } from 'react'
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

    // Tambahan state untuk modal
    const [isModalOpen, setIsModalOpen] = useState(false)

    // Ref untuk input nama skill
    const skillNameInputRef = useRef(null)

    // Efek untuk fokus input saat modal terbuka
    useEffect(() => {
        if (isModalOpen && skillNameInputRef.current) {
            skillNameInputRef.current.focus()
        }
    }, [isModalOpen])

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

    // Fungsi untuk membuka modal
    const openModal = () => {
        resetForm()
        setIsModalOpen(true)

        // Gunakan setTimeout untuk memastikan fokus setelah render
        setTimeout(() => {
            if (skillNameInputRef.current) {
                skillNameInputRef.current.focus()
            }
        }, 100)
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
            setIsModalOpen(false)
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
        setIsModalOpen(true)

        // Gunakan setTimeout untuk memastikan fokus setelah render
        setTimeout(() => {
            if (skillNameInputRef.current) {
                skillNameInputRef.current.focus()
            }
        }, 100)
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
            setIsModalOpen(false)
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

    // Modal Komponen
    const SkillModal = () => {
        return (
            <div
                className={`fixed inset-0 z-50 flex items-center justify-center 
        ${isModalOpen ? 'visible' : 'invisible'} bg-black bg-opacity-50`}
                onClick={() => setIsModalOpen(false)}
            >
                <div
                    className="bg-gray-800 rounded-2xl p-8 w-full max-w-md mx-4"
                    onClick={(e) => e.stopPropagation()}
                >
                    <h2 className="text-2xl font-bold mb-6 text-white">
                        {editingSkill ? 'Edit Skill' : 'Tambah Skill'}
                    </h2>

                    <form onSubmit={editingSkill ? handleUpdateSkill : handleAddSkill}>
                        <div className="mb-4">
                            <input
                                ref={skillNameInputRef}
                                type="text"
                                placeholder="Skill Name"
                                value={newSkill.name || ''}
                                onChange={(e) => {
                                    setNewSkill(prev => ({
                                        ...prev,
                                        name: e.target.value
                                    }))
                                }}
                                className="w-full p-3 bg-gray-700 text-white rounded-lg"
                                required
                                autoFocus
                                autoComplete="off"
                            />
                        </div>

                        <div className="mb-4">
                            <select
                                value={newSkill.category}
                                onChange={(e) => {
                                    setNewSkill(prev => ({
                                        ...prev,
                                        category: e.target.value
                                    }))
                                }}
                                className="w-full p-3 bg-gray-700 text-white rounded-lg"
                            >
                                <option value="frontend">Frontend</option>
                                <option value="backend">Backend</option>
                                <option value="mobile">Mobile</option>
                            </select>
                        </div>

                        <div className="mb-4">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                                id="modalIconUpload"
                            />
                            <label
                                htmlFor="modalIconUpload"
                                className="w-full bg-gray-700 text-white p-3 rounded-lg cursor-pointer text-center block"
                            >
                                {imagePreview ? 'Change Icon' : 'Upload Icon'}
                            </label>

                            {imagePreview && (
                                <img
                                    src={imagePreview}
                                    alt="Icon Preview"
                                    className="mt-4 w-32 h-32 object-contain mx-auto"
                                />
                            )}
                        </div>

                        <div className="flex space-x-4">
                            <button
                                type="submit"
                                disabled={uploading}
                                className={`w-full bg-green-500 text-white p-3 rounded-lg
                  ${uploading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-600'}`}
                            >
                                {uploading ? 'Processing...' : (editingSkill ? 'Update' : 'Add')}
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="w-full bg-red-500 text-white p-3 rounded-lg hover:bg-red-600"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )
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
            {/* Modal Komponen */}
            {isModalOpen && <SkillModal />}

            <div className="container mx-auto">
                {/* Notification */}
                {notification && (
                    <NotificationModal
                        message={notification}
                        onClose={closeNotification}
                    />
                )}
                <button
                    onClick={openModal}
                    className="mb-6 bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-4 py-2 rounded-lg"
                >
                    Tambah Skill Baru
                </button>

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