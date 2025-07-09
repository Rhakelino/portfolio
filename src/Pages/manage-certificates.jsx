import React, { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import { v4 as uuidv4 } from 'uuid'

const ManageCertificates = () => {
    const [certificates, setCertificates] = useState([])
    const [imageFile, setImageFile] = useState(null)
    const [imagePreview, setImagePreview] = useState(null)
    const [uploading, setUploading] = useState(false)
    const [notification, setNotification] = useState(null)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [editingCertificate, setEditingCertificate] = useState(null)
    const [newCertificate, setNewCertificate] = useState({
        title: '',
        provider: '',
        date: '',
        image: '',
        description: '',
        skills: ''
    })

    // Fetch Certificates
    useEffect(() => {
        fetchCertificates()
    }, [])

    const fetchCertificates = async () => {
        const { data, error } = await supabase
            .from('certificates')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Error fetching certificates:', error)
            setNotification('Gagal mengambil daftar sertifikat')
        } else {
            setCertificates(data || [])
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
                .from('certificate-images')
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
                .from('certificate-images')
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
        setNewCertificate({
            title: '',
            provider: '',
            date: '',
            image: '',
            description: '',
            skills: ''
        })
        setImageFile(null)
        setImagePreview(null)
    }

    // Handle Add Certificate
    const handleAddCertificate = async (e) => {
        e.preventDefault()
        setUploading(true)

        try {
            let imageUrl = null
            if (imageFile) {
                imageUrl = await uploadImage(imageFile)
                if (!imageUrl) {
                    setNotification('Gagal mengupload gambar')
                    setUploading(false)
                    return
                }
            }

            // Convert skills string to array
            const skillsArray = newCertificate.skills
                .split(',')
                .map(skill => skill.trim())

            const { data, error } = await supabase
                .from('certificates')
                .insert([{
                    title: newCertificate.title,
                    provider: newCertificate.provider,
                    date: newCertificate.date,
                    image: imageUrl || newCertificate.image,
                    description: newCertificate.description,
                    skills: skillsArray
                }])
                .select()

            if (error) {
                throw error
            }

            setNotification('Sertifikat berhasil ditambahkan!')
            resetForm()
            fetchCertificates()
        } catch (error) {
            console.error('Error adding certificate:', error)
            setNotification('Gagal menambahkan sertifikat')
        } finally {
            setUploading(false)
            setTimeout(() => setNotification(null), 3000)
        }
    }

    // Handle Edit Certificate
    const handleEditCertificate = (certificate) => {
        setEditingCertificate(certificate)
        setImagePreview(certificate.image)
        setIsEditModalOpen(true)
    }

    // Handle Update Certificate
    const handleUpdateCertificate = async (e, updatedCertificate) => {
        e.preventDefault()
        setUploading(true)

        try {
            let imageUrl = updatedCertificate.image
            if (imageFile) {
                imageUrl = await uploadImage(imageFile)
                if (!imageUrl) {
                    setNotification('Gagal mengupload gambar')
                    setUploading(false)
                    return
                }
            }

            // Convert skills string to array
            const skillsArray = updatedCertificate.skills
                .split(',')
                .map(skill => skill.trim())

            const { data, error } = await supabase
                .from('certificates')
                .update({
                    title: updatedCertificate.title,
                    provider: updatedCertificate.provider,
                    date: updatedCertificate.date,
                    image: imageUrl,
                    description: updatedCertificate.description,
                    skills: skillsArray
                })
                .eq('id', editingCertificate.id)
                .select()

            if (error) {
                throw error
            }

            setNotification('Sertifikat berhasil diperbarui!')
            resetForm()
            setIsEditModalOpen(false)
            fetchCertificates()
        } catch (error) {
            console.error('Error updating certificate:', error)
            setNotification('Gagal memperbarui sertifikat')
        } finally {
            setUploading(false)
            setTimeout(() => setNotification(null), 3000)
        }
    }

    // Handle Delete Certificate
    const handleDeleteCertificate = async (id) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus sertifikat ini?')) {
            try {
                const { data: certificateItem, error: fetchError } = await supabase
                    .from('certificates')
                    .select('image')
                    .eq('id', id)
                    .single()

                if (fetchError) {
                    console.error('Gagal mengambil data sertifikat:', fetchError.message)
                    setNotification('Gagal mengambil data sertifikat.')
                    return
                }

                if (certificateItem?.image) {
                    const fileName = certificateItem.image.split('/').pop()

                    if (fileName) {
                        const { error: storageError } = await supabase.storage
                            .from('certificate-images')
                            .remove([fileName])

                        if (storageError) {
                            console.error('Gagal menghapus file dari storage:', storageError.message)
                            setNotification('Gagal menghapus file dari storage.')
                            return
                        }
                    }
                }

                const { error: deleteError } = await supabase
                    .from('certificates')
                    .delete()
                    .eq('id', id)

                if (deleteError) {
                    console.error('Gagal menghapus sertifikat:', deleteError.message)
                    setNotification('Gagal menghapus sertifikat.')
                    return
                }

                fetchCertificates()
                setNotification('Sertifikat berhasil dihapus!')
            } catch (error) {
                console.error('Error saat menghapus sertifikat:', error)
                setNotification('Terjadi kesalahan saat menghapus sertifikat.')
            } finally {
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
                    Tambah Sertifikat
                </h1>

                <form
                    onSubmit={handleAddCertificate}
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
                                    id="certificateImageUpload"
                                />
                                <label
                                    htmlFor="certificateImageUpload"
                                    className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white py-2 rounded-lg text-center cursor-pointer hover:scale-105 transition-transform"
                                >
                                    {imagePreview ? 'Change Image' : 'Upload Image'}
                                </label>
                            </div>
                        </div>

                        {/* Certificate Details */}
                        <div className="md:col-span-2 grid grid-cols-2 gap-4">
                            <input
                                type="text"
                                placeholder="Certificate Title"
                                value={newCertificate.title}
                                onChange={(e) => setNewCertificate({ ...newCertificate, title: e.target.value })}
                                className="bg-gray-700 text-white p-3 rounded-lg col-span-2"
                                required
                            />
                            <input
                                type="text"
                                placeholder="Provider"
                                value={newCertificate.provider}
                                onChange={(e) => setNewCertificate({ ...newCertificate, provider: e.target.value })}
                                className="bg-gray-700 text-white p-3 rounded-lg"
                                required
                            />
                            <input
                                type="date"
                                placeholder="Date"
                                value={newCertificate.date}
                                onChange={(e) => setNewCertificate({ ...newCertificate, date: e.target.value })}
                                className="bg-gray-700 text-white p-3 rounded-lg"
                                required
                            />
                            <input
                                type="text"
                                placeholder="Skills (comma-separated)"
                                value={newCertificate.skills}
                                onChange={(e) => setNewCertificate({ ...newCertificate, skills: e.target.value })}
                                className="bg-gray-700 text-white p-3 rounded-lg col-span-2"
                                required
                            />
                            <textarea
                                placeholder="Description"
                                value={newCertificate.description}
                                onChange={(e) => setNewCertificate({ ...newCertificate, description: e.target.value })}
                                className="bg-gray-700 text-white p-3 rounded-lg col-span-2"
                                rows="4"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={uploading}
                        className={`mt-4 w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white p-3 rounded-lg transition-transform ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {uploading ? 'Processing...' : 'Add Certificate'}
                    </button>
                </form>

                {/* Daftar Sertifikat */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {certificates.map((certificate) => (
                        <div
                            key={certificate.id}
                            className="bg-gray-800 border border-gray-700 rounded-2xl overflow-hidden shadow-lg"
                        >
                            <div className="relative">
                                <img
                                    src={certificate.image}
                                    alt={certificate.title}
                                    className="w-full h-48 object-cover"
                                />
                                <div className="absolute top-4 right-4 flex space-x-2">
                                    <button
                                        onClick={() => handleEditCertificate(certificate)}
                                        className="bg-yellow-500 text-white p-2 rounded-full hover:bg-yellow-600 transition-colors"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.379-8.379-2.828-2.828z" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => handleDeleteCertificate(certificate.id)}
                                        className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-bold mb-2 text-purple-400">
                                    {certificate.title}
                                </h3>
                                <p className="text-sm text-gray-400 mb-2">
                                    {certificate.provider} | {certificate.date}
                                </p>
                                <p className="text-sm text-gray-300 mb-4">
                                    {certificate.description}
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {certificate.skills.map((skill, index) => (
                                        <span
                                            key={index}
                                            className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full text-xs"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Edit Certificate Modal */}
                {isEditModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8 w-full max-w-2xl">
                            <h2 className="text-3xl font-bold mb-6 text-white">Edit Sertifikat</h2>

                            <form
                                onSubmit={(e) => handleUpdateCertificate(e, {
                                    ...editingCertificate,
                                    skills: editingCertificate.skills.join(', ')
                                })}
                                className="space-y-4"
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
                                                id="editCertificateImageUpload"
                                            />
                                            <label
                                                htmlFor="editCertificateImageUpload"
                                                className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white py-2 rounded-lg text-center cursor-pointer hover:scale-105 transition-transform"
                                            >
                                                {imagePreview ? 'Change Image' : 'Upload Image'}
                                            </label>
                                        </div>
                                    </div>

                                    {/* Certificate Details */}
                                    <div className="md:col-span-2 grid grid-cols-2 gap-4">
                                        <input
                                            type="text"
                                            placeholder="Certificate Title"
                                            value={editingCertificate.title}
                                            onChange={(e) => setEditingCertificate({
                                                ...editingCertificate,
                                                title: e.target.value
                                            })}
                                            className="bg-gray-700 text-white p-3 rounded-lg col-span-2"
                                            required
                                        />
                                        <input
                                            type="text"
                                            placeholder="Provider"
                                            value={editingCertificate.provider}
                                            onChange={(e) => setEditingCertificate({
                                                ...editingCertificate,
                                                provider: e.target.value
                                            })}
                                            className="bg-gray-700 text-white p-3 rounded-lg"
                                            required
                                        />
                                        <input
                                            type="date"
                                            placeholder="Date"
                                            value={editingCertificate.date}
                                            onChange={(e) => setEditingCertificate({
                                                ...editingCertificate,
                                                date: e.target.value
                                            })}
                                            className="bg-gray-700 text-white p-3 rounded-lg"
                                            required
                                        />
                                        <input
                                            type="text"
                                            placeholder="Skills (comma-separated)"
                                            value={editingCertificate.skills.join(', ')}
                                            onChange={(e) => setEditingCertificate({
                                                ...editingCertificate,
                                                skills: e.target.value.split(',').map(skill => skill.trim())
                                            })}
                                            className="bg-gray-700 text-white p-3 rounded-lg col-span-2"
                                            required
                                        />
                                        <textarea
                                            placeholder="Description"
                                            value={editingCertificate.description}
                                            onChange={(e) => setEditingCertificate({
                                                ...editingCertificate,
                                                description: e.target.value
                                            })}
                                            className="bg-gray-700 text-white p-3 rounded-lg col-span-2"
                                            rows="4"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end space-x-4 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsEditModalOpen(false)
                                            resetForm()
                                        }}
                                        className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-500"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={uploading}
                                        className={`bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-4 py-2 rounded-lg ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        {uploading ? 'Memperbarui...' : 'Perbarui Sertifikat'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ManageCertificates