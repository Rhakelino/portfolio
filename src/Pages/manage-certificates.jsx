import React, { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import { v4 as uuidv4 } from 'uuid'
import { handleImageCompression, certificateImageOptions } from '../utils/imageCompression'
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
const EditCertificateModal = ({
    certificate,
    isOpen,
    onClose,
    onUpdate,
    uploading,
    imagePreview,
    handleImageUpload
}) => {
    const [editedCertificate, setEditedCertificate] = useState({
        title: '',
        provider: '',
        date: '',
        image: '',
        description: '',
        skills: ''
    })

    useEffect(() => {
        if (certificate) {
            setEditedCertificate({
                title: certificate.title,
                provider: certificate.provider,
                date: certificate.date,
                image: certificate.image,
                description: certificate.description,
                skills: Array.isArray(certificate.skills) ? certificate.skills.join(', ') : certificate.skills
            })
        }
    }, [certificate])

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Edit Sertifikat</DialogTitle>
                    <DialogDescription>Update details for your certificate.</DialogDescription>
                </DialogHeader>

                <form onSubmit={(e) => onUpdate(e, editedCertificate)} className="space-y-6">
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
                                    id="editCertificateImageUpload"
                                />
                                <Button asChild variant="secondary" className="w-full cursor-pointer">
                                    <label htmlFor="editCertificateImageUpload">
                                        <ImagePlus className="w-4 h-4 mr-2" />
                                        {imagePreview ? 'Change' : 'Upload'}
                                    </label>
                                </Button>
                            </div>
                        </div>

                        {/* Certificate Details */}
                        <div className="md:col-span-2 space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-title">Certificate Title</Label>
                                <Input
                                    id="edit-title"
                                    value={editedCertificate.title}
                                    onChange={(e) => setEditedCertificate({ ...editedCertificate, title: e.target.value })}
                                    placeholder="E.g. Certified React Developer"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="edit-provider">Provider</Label>
                                    <Input
                                        id="edit-provider"
                                        value={editedCertificate.provider}
                                        onChange={(e) => setEditedCertificate({ ...editedCertificate, provider: e.target.value })}
                                        placeholder="E.g. Hacktiv8"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="edit-date">Date</Label>
                                    <Input
                                        id="edit-date"
                                        type="date"
                                        value={editedCertificate.date}
                                        onChange={(e) => setEditedCertificate({ ...editedCertificate, date: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-skills">Skills (comma-separated)</Label>
                                <Input
                                    id="edit-skills"
                                    value={editedCertificate.skills}
                                    onChange={(e) => setEditedCertificate({ ...editedCertificate, skills: e.target.value })}
                                    placeholder="React, CSS, HTML"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-desc">Description</Label>
                                <Textarea
                                    id="edit-desc"
                                    value={editedCertificate.description}
                                    onChange={(e) => setEditedCertificate({ ...editedCertificate, description: e.target.value })}
                                    placeholder="Describe your certificate..."
                                    rows={3}
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
                            {uploading ? 'Updating...' : 'Update Certificate'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

const ManageCertificates = () => {
    const [certificates, setCertificates] = useState([])
    const [imageFile, setImageFile] = useState(null)
    const [imagePreview, setImagePreview] = useState(null)
    const [uploading, setUploading] = useState(false)
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

    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchCertificatesWithDelay = async () => {
            setIsLoading(true)
            try {
                const { data, error } = await supabase
                    .from('certificates')
                    .select('*')
                    .order('created_at', { ascending: false })

                if (error) {
                    console.error('Error fetching certificates:', error)
                    toast.error('Gagal mengambil daftar sertifikat')
                } else {
                    setCertificates(data || [])
                }
            } catch (error) {
                console.error('Error:', error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchCertificatesWithDelay()
    }, [])

    const fetchCertificates = async () => {
        const { data, error } = await supabase
            .from('certificates')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Error fetching certificates:', error)
            toast.error('Gagal mengambil daftar sertifikat')
        } else {
            setCertificates(data || [])
        }
    }

    const handleImageUpload = async (e) => {
        const file = e.target.files[0]
        if (file) {
            toast.info('Memproses gambar...')
            try {
                const compressedFile = await handleImageCompression(file, certificateImageOptions)

                const reader = new FileReader()
                reader.onloadend = () => {
                    setImagePreview(reader.result)
                }
                reader.readAsDataURL(compressedFile)

                setImageFile(compressedFile)
                toast.success('Gambar siap diupload')
            } catch (error) {
                console.error('Error compressing image:', error)
                toast.error('Gagal memproses gambar')
            }
        }
    }

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
                toast.error(`Gagal upload gambar: ${uploadError.message}`)
                return null
            }

            const { data: { publicUrl } } = supabase.storage
                .from('certificate-images')
                .getPublicUrl(filePath)

            return publicUrl
        } catch (error) {
            console.error('Error uploading image:', error)
            toast.error('Terjadi kesalahan saat upload gambar')
            return null
        }
    }

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
        setEditingCertificate(null)
    }

    const handleAddCertificate = async (e) => {
        e.preventDefault()

        if (!newCertificate.title || !newCertificate.provider || !newCertificate.date || !newCertificate.skills) {
            toast.error('Harap lengkapi semua field yang wajib')
            return;
        }

        setUploading(true)
        const tid = toast.loading('Menambahkan sertifikat...')

        try {
            let imageUrl = null
            if (imageFile) {
                imageUrl = await uploadImage(imageFile)
                if (!imageUrl) {
                    toast.dismiss(tid)
                    setUploading(false)
                    return
                }
            }

            const skillsArray = newCertificate.skills
                .split(',')
                .map(skill => skill.trim())
                .filter(skill => skill !== '')

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

            if (error) throw error

            toast.success('Sertifikat berhasil ditambahkan!', { id: tid })
            resetForm()
            fetchCertificates()
        } catch (error) {
            console.error('Error adding certificate:', error)
            toast.error('Gagal menambahkan sertifikat', { id: tid })
        } finally {
            setUploading(false)
        }
    }

    const handleEditCertificate = (certificate) => {
        setEditingCertificate(certificate)
        setImagePreview(certificate.image)
        setIsEditModalOpen(true)
    }

    const handleUpdateCertificate = async (e, updatedCertificate) => {
        e.preventDefault()

        if (!updatedCertificate.title || !updatedCertificate.provider || !updatedCertificate.date || !updatedCertificate.skills) {
            toast.error('Harap lengkapi semua field yang wajib')
            return;
        }

        setUploading(true)
        const tid = toast.loading('Memperbarui sertifikat...')

        try {
            let imageUrl = updatedCertificate.image
            if (imageFile) {
                if (editingCertificate.image) {
                    const oldFileName = editingCertificate.image.split('/').pop()
                    if (oldFileName) {
                        await supabase.storage
                            .from('certificate-images')
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

            const skillsArray = updatedCertificate.skills
                .split(',')
                .map(skill => skill.trim())
                .filter(skill => skill !== '')

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

            if (error) throw error

            toast.success('Sertifikat berhasil diperbarui!', { id: tid })
            resetForm()
            setIsEditModalOpen(false)
            fetchCertificates()
        } catch (error) {
            console.error('Error updating certificate:', error)
            toast.error('Gagal memperbarui sertifikat', { id: tid })
        } finally {
            setUploading(false)
        }
    }

    const handleDeleteCertificate = async (id) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus sertifikat ini? Tindakan ini tidak dapat dibatalkan.')) {
            const tid = toast.loading('Menghapus sertifikat...')
            try {
                const { data: certificateItem, error: fetchError } = await supabase
                    .from('certificates')
                    .select('image')
                    .eq('id', id)
                    .single()

                if (fetchError) throw fetchError

                if (certificateItem?.image) {
                    const fileName = certificateItem.image.split('/').pop()
                    if (fileName) {
                        const { error: storageError } = await supabase.storage
                            .from('certificate-images')
                            .remove([fileName])

                        if (storageError) {
                            console.error('Gagal menghapus file dari storage:', storageError.message)
                        }
                    }
                }

                const { error: deleteError } = await supabase
                    .from('certificates')
                    .delete()
                    .eq('id', id)

                if (deleteError) throw deleteError

                fetchCertificates()
                toast.success('Sertifikat berhasil dihapus!', { id: tid })
            } catch (error) {
                console.error('Error saat menghapus sertifikat:', error)
                toast.error('Terjadi kesalahan saat menghapus sertifikat.', { id: tid })
            }
        }
    }

    const CertificateSkeleton = () => {
        return (
            <div className="min-h-screen bg-background text-foreground p-8">
                <div className="container mx-auto max-w-6xl">
                    <Skeleton className="h-10 w-48 mb-8" />
                    <Card className="mb-12">
                        <CardContent className="p-6">
                            <div className="grid md:grid-cols-3 gap-6">
                                <div className="md:col-span-1">
                                    <Skeleton className="w-full aspect-[4/3] rounded-lg mb-4" />
                                    <Skeleton className="h-10 w-full" />
                                </div>
                                <div className="md:col-span-2 space-y-4">
                                    <Skeleton className="h-10 w-full" />
                                    <div className="grid grid-cols-2 gap-4">
                                        <Skeleton className="h-10 w-full" />
                                        <Skeleton className="h-10 w-full" />
                                    </div>
                                    <Skeleton className="h-10 w-full" />
                                    <Skeleton className="h-24 w-full" />
                                </div>
                            </div>
                            <Skeleton className="h-10 w-full mt-6" />
                        </CardContent>
                    </Card>

                    <Skeleton className="h-8 w-64 mb-8 mx-auto" />
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map((item) => (
                            <Card key={item} className="overflow-hidden">
                                <Skeleton className="w-full h-48 rounded-none" />
                                <CardContent className="p-6">
                                    <Skeleton className="h-6 w-3/4 mb-2" />
                                    <Skeleton className="h-4 w-1/2 mb-4" />
                                    <Skeleton className="h-16 w-full mb-4" />
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

    if (isLoading) {
        return <CertificateSkeleton />
    }

    return (
        <div className="space-y-8">
            <div className="max-w-6xl mx-auto">

                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-black tracking-tight flex items-center gap-3">
                        Tambah Sertifikat
                    </h1>
                    <Button variant="outline" size="sm" onClick={fetchCertificates} title="Refresh Data">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Refresh
                    </Button>
                </div>

                <Card className="mb-12 shadow-sm border-border/40">
                    <CardContent className="p-6">
                        <form onSubmit={handleAddCertificate} className="space-y-6">
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
                                            id="certificateImageUpload"
                                        />
                                        <Button asChild variant="secondary" className="w-full cursor-pointer">
                                            <label htmlFor="certificateImageUpload">
                                                <ImagePlus className="w-4 h-4 mr-2" />
                                                {imagePreview ? 'Change Image' : 'Upload Image'}
                                            </label>
                                        </Button>
                                    </div>
                                </div>

                                {/* Certificate Details */}
                                <div className="md:col-span-2 space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="title">Certificate Title</Label>
                                        <Input
                                            id="title"
                                            placeholder="E.g. Certified React Developer"
                                            value={newCertificate.title}
                                            onChange={(e) => setNewCertificate({ ...newCertificate, title: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="provider">Provider</Label>
                                            <Input
                                                id="provider"
                                                placeholder="E.g. Hacktiv8"
                                                value={newCertificate.provider}
                                                onChange={(e) => setNewCertificate({ ...newCertificate, provider: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="date">Date</Label>
                                            <Input
                                                id="date"
                                                type="date"
                                                value={newCertificate.date}
                                                onChange={(e) => setNewCertificate({ ...newCertificate, date: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="skills">Skills (comma-separated)</Label>
                                        <Input
                                            id="skills"
                                            placeholder="React, CSS, HTML"
                                            value={newCertificate.skills}
                                            onChange={(e) => setNewCertificate({ ...newCertificate, skills: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="desc">Description</Label>
                                        <Textarea
                                            id="desc"
                                            placeholder="Describe your certificate..."
                                            value={newCertificate.description}
                                            onChange={(e) => setNewCertificate({ ...newCertificate, description: e.target.value })}
                                            rows={3}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end pt-4 border-t border-border/50">
                                <Button type="submit" disabled={uploading} className="w-full md:w-auto">
                                    {uploading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                    {uploading ? 'Adding...' : 'Add Certificate'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Certificates List */}
                <div className="mt-12">
                    <h2 className="text-3xl font-black mb-8 text-center bg-clip-text text-transparent bg-gradient-to-br from-foreground to-muted-foreground">My Certificates</h2>

                    {certificates.length === 0 ? (
                        <div className="text-center p-12 bg-muted/20 rounded-2xl border border-dashed border-border">
                            <p className="text-muted-foreground">You haven't added any certificates yet.</p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {certificates.map((certificate) => (
                                <Card key={certificate.id} className="group overflow-hidden flex flex-col hover:shadow-xl transition-all duration-300 border-border/40 hover:-translate-y-1">
                                    <div className="relative overflow-hidden aspect-[16/9] sm:aspect-[4/3]">
                                        <img
                                            src={certificate.image || 'https://via.placeholder.com/400x300?text=No+Image'}
                                            alt={certificate.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                        <div className="absolute top-3 right-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button
                                                size="icon"
                                                variant="secondary"
                                                onClick={() => handleEditCertificate(certificate)}
                                                className="h-8 w-8 rounded-full shadow-lg backdrop-blur bg-background/80 hover:bg-background"
                                            >
                                                <Pencil className="w-4 h-4 text-primary" />
                                            </Button>
                                            <Button
                                                size="icon"
                                                variant="destructive"
                                                onClick={() => handleDeleteCertificate(certificate.id)}
                                                className="h-8 w-8 rounded-full shadow-lg"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                    <CardHeader className="flex-none pb-2">
                                        <CardTitle className="text-xl line-clamp-1">{certificate.title}</CardTitle>
                                        <CardDescription className="flex items-center gap-1 mt-1 text-xs">
                                            <span className="font-semibold">{certificate.provider}</span> • <span>{certificate.date}</span>
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="flex-1 pb-4">
                                        <p className="text-sm text-foreground/80 line-clamp-3">
                                            {certificate.description}
                                        </p>
                                    </CardContent>
                                    <CardFooter className="pt-0">
                                        <div className="flex flex-wrap gap-2">
                                            {certificate.skills?.map((skill, index) => (
                                                <span
                                                    key={index}
                                                    className="bg-primary/10 text-primary-foreground px-2.5 py-1 rounded-md text-xs font-medium border border-border/40"
                                                >
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>

                {/* Edit Certificate Modal */}
                <EditCertificateModal
                    certificate={editingCertificate}
                    isOpen={isEditModalOpen}
                    onClose={() => {
                        setIsEditModalOpen(false)
                        resetForm()
                    }}
                    onUpdate={handleUpdateCertificate}
                    uploading={uploading}
                    imagePreview={imagePreview}
                    handleImageUpload={handleImageUpload}
                />
            </div>
        </div>
    )
}

export default ManageCertificates