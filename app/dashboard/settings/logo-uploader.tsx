'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Image as ImageIcon, Loader2, Upload } from 'lucide-react'
import Image from 'next/image'

export function LogoUploader({ currentLogoUrl, customerId }: { currentLogoUrl?: string | null, customerId: string }) {
    const [uploading, setUploading] = useState(false)
    const [logoUrl, setLogoUrl] = useState<string | null>(currentLogoUrl || null)
    const supabase = createClient()

    async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
        try {
            setUploading(true)
            const file = e.target.files?.[0]
            if (!file) return

            const fileExt = file.name.split('.').pop()
            const fileName = `${customerId}-${Math.random()}.${fileExt}`
            const filePath = `${fileName}`

            // Upload to 'logos' bucket
            const { error: uploadError } = await supabase.storage
                .from('logos')
                .upload(filePath, file)

            if (uploadError) throw uploadError

            // Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('logos')
                .getPublicUrl(filePath)

            // Update Customer Record
            const { error: updateError } = await (supabase.from('customers') as any)
                .update({ logo_url: publicUrl })
                .eq('id', customerId)

            if (updateError) throw updateError

            setLogoUrl(publicUrl)
        } catch (error) {
            console.error('Error uploading logo:', error)
            alert('Error uploading logo')
        } finally {
            setUploading(false)
        }
    }

    return (
        <Card className="glass border-white/10 bg-card/30">
            <CardHeader>
                <div className="flex items-center gap-2">
                    <ImageIcon className="h-5 w-5 text-brand-glow" />
                    <CardTitle>Company Logo</CardTitle>
                </div>
                <CardDescription>
                    Upload your company logo for reports.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                    <div className="relative h-20 w-20 rounded-lg border border-white/10 bg-zinc-900/50 flex items-center justify-center overflow-hidden">
                        {logoUrl ? (
                            <Image
                                src={logoUrl}
                                alt="Company Logo"
                                fill
                                className="object-contain p-2"
                            />
                        ) : (
                            <ImageIcon className="h-8 w-8 text-zinc-700" />
                        )}
                    </div>
                    <div className="flex-1">
                        <div className="relative">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleUpload}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                disabled={uploading}
                            />
                            <Button variant="outline" className="w-full sm:w-auto" disabled={uploading}>
                                {uploading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Uploading...
                                    </>
                                ) : (
                                    <>
                                        <Upload className="mr-2 h-4 w-4" />
                                        Upload Logo
                                    </>
                                )}
                            </Button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                            Recommended: 200x200px PNG or JPG.
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
