import React, { useState } from 'react'
import { supabase } from '@/supabaseClient'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Upload, FileText, Loader2 } from 'lucide-react'

export default function ManageSettings() {
    const [file, setFile] = useState(null)
    const [isUploading, setIsUploading] = useState(false)
    const [cvUrl, setCvUrl] = useState('')

    // Get current CV URL on mount
    React.useEffect(() => {
        const { data } = supabase.storage.from('documents').getPublicUrl('cv.pdf')
        if (data?.publicUrl) {
            setCvUrl(data.publicUrl)
        }
    }, [])

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0]
        if (selectedFile && selectedFile.type === 'application/pdf') {
            setFile(selectedFile)
        } else {
            toast.error('Invalid file', { description: 'Please select a PDF file.' })
            e.target.value = null
        }
    }

    const handleUpload = async () => {
        if (!file) {
            toast.error('No file selected')
            return
        }

        setIsUploading(true)
        try {
            const { data, error } = await supabase.storage
                .from('documents')
                .upload('cv.pdf', file, {
                    cacheControl: '3600',
                    upsert: true
                })

            if (error) throw error

            const { data: publicUrlData } = supabase.storage
                .from('documents')
                .getPublicUrl('cv.pdf')
                
            // Force refresh UI string to break browser cache visually
            setCvUrl(`${publicUrlData.publicUrl}?t=${new Date().getTime()}`)
            toast.success('CV Updated Successfully')
            setFile(null)
            
            // Reset input
            const fileInput = document.getElementById('cv-upload')
            if (fileInput) fileInput.value = ''

        } catch (error) {
            toast.error('Upload failed', { description: error.message })
        } finally {
            setIsUploading(false)
        }
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground mt-2">
                    Manage global portfolio settings and documents.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="w-5 h-5 text-primary" />
                            Curriculum Vitae (CV)
                        </CardTitle>
                        <CardDescription>
                            Upload your latest CV in PDF format. This will replace the existing CV on the live site.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {cvUrl && (
                            <div className="rounded-lg border bg-secondary/20 p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-primary/10 rounded-full">
                                            <FileText className="w-4 h-4 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">Current CV</p>
                                            <a 
                                                href={cvUrl} 
                                                target="_blank" 
                                                rel="noreferrer"
                                                className="text-xs text-muted-foreground hover:text-primary transition-colors truncate block max-w-[200px] sm:max-w-[300px]"
                                            >
                                                {cvUrl.split('?')[0]}
                                            </a>
                                        </div>
                                    </div>
                                    <Button variant="outline" size="sm" asChild>
                                        <a href={cvUrl} target="_blank" rel="noreferrer">View</a>
                                    </Button>
                                </div>
                            </div>
                        )}

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="cv-upload">Upload New PDF</Label>
                                <Input
                                    id="cv-upload"
                                    type="file"
                                    accept=".pdf"
                                    onChange={handleFileChange}
                                    disabled={isUploading}
                                />
                            </div>
                            <Button 
                                onClick={handleUpload} 
                                disabled={!file || isUploading}
                                className="w-full"
                            >
                                {isUploading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Uploading...
                                    </>
                                ) : (
                                    <>
                                        <Upload className="w-4 h-4 mr-2" />
                                        Update CV
                                    </>
                                )}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}