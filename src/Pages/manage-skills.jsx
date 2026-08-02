import React, { useState, useEffect, useRef } from 'react'
import { supabase } from '../supabaseClient'
import { v4 as uuidv4 } from 'uuid'
import { handleImageCompression, skillImageOptions } from '../utils/imageCompression'
import { toast } from "sonner"

// shadcn UI components
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Pencil, Trash2, ImagePlus, Loader2, Plus } from "lucide-react"

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
    const [editingSkill, setEditingSkill] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    const skillNameInputRef = useRef(null)

    useEffect(() => {
        if (isModalOpen && skillNameInputRef.current) {
            skillNameInputRef.current.focus()
        }
    }, [isModalOpen])

    useEffect(() => {
        const fetchSkillsWithDelay = async () => {
            setIsLoading(true)
            try {
                const { data, error } = await supabase
                    .from('skills')
                    .select('*')
                    .order('created_at', { ascending: false })

                if (error) {
                    console.error('Error fetching skills:', error)
                    toast.error('Gagal mengambil daftar skills')
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
            } catch (error) {
                console.error('Error:', error)
                toast.error('Terjadi kesalahan saat memuat data')
            } finally {
                setIsLoading(false)
            }
        }

        fetchSkillsWithDelay()
    }, [])

    const fetchSkills = async () => {
        const { data, error } = await supabase
            .from('skills')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Error fetching skills:', error)
            toast.error('Gagal mengambil daftar skills')
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

    const handleImageUpload = async (e) => {
        const file = e.target.files[0]
        if (file) {
            toast.info('Memproses gambar...')
            try {
                const compressedFile = await handleImageCompression(file, skillImageOptions)

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
                .from('skill-icons')
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: true
                })

            if (uploadError) {
                toast.error(`Gagal upload icon: ${uploadError.message}`)
                return null
            }

            const { data: { publicUrl } } = supabase.storage
                .from('skill-icons')
                .getPublicUrl(filePath)

            return publicUrl
        } catch (error) {
            console.error('Error uploading image:', error)
            toast.error('Terjadi kesalahan saat upload icon')
            return null
        }
    }

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

    const openModal = () => {
        resetForm()
        setIsModalOpen(true)
        setTimeout(() => {
            if (skillNameInputRef.current) {
                skillNameInputRef.current.focus()
            }
        }, 100)
    }

    const handleAddSkill = async (e) => {
        e.preventDefault()

        if (!newSkill.name || !newSkill.category) {
            toast.error('Harap lengkapi nama dan kategori skill')
            return;
        }

        setUploading(true)
        const tid = toast.loading('Menambahkan skill...')

        try {
            let iconUrl = null
            if (imageFile) {
                iconUrl = await uploadImage(imageFile)
                if (!iconUrl) {
                    toast.dismiss(tid)
                    setUploading(false)
                    return
                }
            } else if (!newSkill.icon) {
                // optional icon in some cases, but warn if missing
                toast.warning('Menambahkan skill tanpa icon', { id: tid })
            }

            const { data, error } = await supabase
                .from('skills')
                .insert([{
                    name: newSkill.name,
                    icon: iconUrl || newSkill.icon,
                    category: newSkill.category
                }])
                .select()

            if (error) throw error

            toast.success('Skill berhasil ditambahkan!', { id: tid })
            resetForm()
            fetchSkills()
            setIsModalOpen(false)
        } catch (error) {
            console.error('Error adding skill:', error)
            toast.error('Gagal menambahkan skill', { id: tid })
        } finally {
            setUploading(false)
        }
    }

    const handleEditSkill = (skill) => {
        setEditingSkill(skill)
        setNewSkill({
            name: skill.name,
            icon: skill.icon,
            category: skill.category
        })
        setImagePreview(skill.icon)
        setIsModalOpen(true)

        setTimeout(() => {
            if (skillNameInputRef.current) {
                skillNameInputRef.current.focus()
            }
        }, 100)
    }

    const handleUpdateSkill = async (e) => {
        e.preventDefault()

        if (!newSkill.name || !newSkill.category) {
            toast.error('Harap lengkapi nama dan kategori skill')
            return;
        }

        setUploading(true)
        const tid = toast.loading('Memperbarui skill...')

        try {
            let iconUrl = editingSkill.icon
            if (imageFile) {
                if (editingSkill.icon) {
                    const oldFileName = editingSkill.icon.split('/').pop()
                    if (oldFileName) {
                        await supabase.storage
                            .from('skill-icons')
                            .remove([oldFileName])
                    }
                }

                iconUrl = await uploadImage(imageFile)
                if (!iconUrl) {
                    toast.dismiss(tid)
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

            if (error) throw error

            toast.success('Skill berhasil diperbarui!', { id: tid })
            resetForm()
            fetchSkills()
            setIsModalOpen(false)
        } catch (error) {
            console.error('Error updating skill:', error)
            toast.error('Gagal memperbarui skill', { id: tid })
        } finally {
            setUploading(false)
        }
    }

    const handleDeleteSkill = async (id) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus skill ini? Tindakan ini tidak dapat dibatalkan.')) {
            const tid = toast.loading('Menghapus skill...')
            try {
                const { data: skillItem, error: fetchError } = await supabase
                    .from('skills')
                    .select('icon')
                    .eq('id', id)
                    .single()

                if (fetchError) throw fetchError

                if (skillItem?.icon) {
                    const fileName = skillItem.icon.split('/').pop()
                    if (fileName) {
                        const { error: storageError } = await supabase.storage
                            .from('skill-icons')
                            .remove([fileName])

                        if (storageError) {
                            console.error('Gagal menghapus file dari storage:', storageError.message)
                        }
                    }
                }

                const { error: deleteError } = await supabase
                    .from('skills')
                    .delete()
                    .eq('id', id)

                if (deleteError) throw deleteError

                fetchSkills()
                toast.success('Skill berhasil dihapus!', { id: tid })
            } catch (error) {
                console.error('Error saat menghapus skill:', error)
                toast.error('Terjadi kesalahan saat menghapus skill.', { id: tid })
            }
        }
    }

    const SkillsSkeleton = () => {
        return (
            <div className="min-h-screen bg-background text-foreground p-8">
                <div className="container mx-auto max-w-6xl">
                    <Skeleton className="h-10 w-48 mb-8" />

                    {['Frontend', 'Backend', 'Mobile'].map((category) => (
                        <div key={category} className="mb-10">
                            <Skeleton className="h-8 w-40 mb-6" />
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                {[1, 2, 3, 4, 5, 6].map((item) => (
                                    <Card key={item} className="p-4 flex flex-col items-center">
                                        <Skeleton className="w-16 h-16 rounded-full mb-4" />
                                        <Skeleton className="h-5 w-24 mb-3" />
                                        <div className="flex gap-2 w-full justify-center">
                                            <Skeleton className="h-8 w-1/3" />
                                            <Skeleton className="h-8 w-1/3" />
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    if (isLoading) {
        return <SkillsSkeleton />
    }

    return (
        <div className="space-y-8">
            <div className="max-w-6xl mx-auto">

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
                    <h1 className="text-4xl font-black tracking-tight flex items-center gap-3">
                        Manage Skills
                    </h1>
                    <Button onClick={openModal} className="flex items-center gap-2">
                        <Plus className="w-5 h-5" />
                        Tambah Skill Baru
                    </Button>
                </div>

                {/* Skills by Category */}
                {Object.keys(skills).map((category) => (
                    <div key={category} className="mb-12">
                        <h2 className="text-2xl font-bold mb-6 capitalize flex items-center gap-2 text-foreground/80">
                            <span className="w-2 h-6 bg-primary rounded-full"></span>
                            {category} Skills
                        </h2>

                        {skills[category].length === 0 ? (
                            <div className="text-center p-8 bg-muted/20 rounded-xl border border-dashed border-border">
                                <p className="text-muted-foreground">Belum ada skill di kategori ini.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                {skills[category].map((skill) => (
                                    <div
                                        key={skill.id}
                                        className="bg-card border border-border/50 rounded-2xl p-4 flex flex-col items-center shadow-sm hover:shadow-md transition-all hover:-translate-y-1 relative group"
                                    >
                                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity">
                                            <Button
                                                size="icon"
                                                variant="secondary"
                                                className="h-7 w-7 rounded-full bg-background/80 backdrop-blur"
                                                onClick={() => handleEditSkill(skill)}
                                            >
                                                <Pencil className="w-3.5 h-3.5 text-primary" />
                                            </Button>
                                            <Button
                                                size="icon"
                                                variant="destructive"
                                                className="h-7 w-7 rounded-full"
                                                onClick={() => handleDeleteSkill(skill.id)}
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </Button>
                                        </div>
                                        <div className="w-16 h-16 mb-3 p-2 bg-secondary/30 rounded-full flex items-center justify-center">
                                            <img
                                                src={skill.icon || 'https://via.placeholder.com/64?text=?'}
                                                alt={skill.name}
                                                className="w-10 h-10 object-contain"
                                            />
                                        </div>
                                        <h3 className="text-sm font-semibold text-center text-foreground">{skill.name}</h3>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Modal Dialog */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>{editingSkill ? 'Edit Skill' : 'Tambah Skill Baru'}</DialogTitle>
                        <DialogDescription>
                            Isi formulir di bawah ini untuk menyimpan skill.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={editingSkill ? handleUpdateSkill : handleAddSkill} className="space-y-6 py-4">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="skill-name">Nama Skill</Label>
                                <Input
                                    id="skill-name"
                                    ref={skillNameInputRef}
                                    placeholder="Contoh: ReactJS"
                                    value={newSkill.name}
                                    onChange={(e) => setNewSkill(prev => ({ ...prev, name: e.target.value }))}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="category">Kategori</Label>
                                <select
                                    id="category"
                                    value={newSkill.category}
                                    onChange={(e) => setNewSkill(prev => ({ ...prev, category: e.target.value }))}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <option value="frontend">Frontend</option>
                                    <option value="backend">Backend</option>
                                    <option value="mobile">Mobile</option>
                                </select>
                            </div>

                            <div className="space-y-2 pt-2">
                                <Label>Skill Icon</Label>
                                <div className="border border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center bg-secondary/20">
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="hidden"
                                        id="modalIconUpload"
                                    />
                                    {imagePreview ? (
                                        <div className="flex flex-col items-center">
                                            <img
                                                src={imagePreview}
                                                alt="Icon Preview"
                                                className="w-20 h-20 object-contain mb-4 rounded-md shadow-sm"
                                            />
                                            <Button asChild variant="outline" size="sm">
                                                <label htmlFor="modalIconUpload" className="cursor-pointer">
                                                    Change Icon
                                                </label>
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center text-center">
                                            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                                                <ImagePlus className="w-6 h-6 text-muted-foreground" />
                                            </div>
                                            <p className="text-sm text-muted-foreground mb-4">Pilih logo/icon skill</p>
                                            <Button asChild variant="secondary" size="sm">
                                                <label htmlFor="modalIconUpload" className="cursor-pointer">
                                                    Browse Files
                                                </label>
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <DialogFooter className="gap-2 sm:gap-0 pt-4 border-t">
                            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} disabled={uploading}>
                                Batal
                            </Button>
                            <Button type="submit" disabled={uploading}>
                                {uploading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                {uploading ? 'Menyimpan...' : (editingSkill ? 'Perbarui Skill' : 'Simpan Skill')}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

        </div>
    )
}

export default ManageSkills
