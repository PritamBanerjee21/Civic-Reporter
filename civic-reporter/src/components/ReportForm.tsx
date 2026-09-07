'use client'

import { useState, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createIssue } from '@/lib/actions/issues'
import { cn } from '@/lib/utils'
import { Upload, X, Loader2, AlertCircle } from 'lucide-react'
import type { Category } from '@/types'

const CATEGORIES: { value: Category; label: string }[] = [
  { value: 'pothole', label: 'Pothole' },
  { value: 'garbage', label: 'Garbage' },
  { value: 'streetlight', label: 'Streetlight' },
  { value: 'water', label: 'Water Leak' },
  { value: 'other', label: 'Other' },
]

const MAX_FILE_SIZE = 5 * 1024 * 1024
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

const issueSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(100, 'Title must be less than 100 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters').max(1000, 'Description must be less than 1000 characters'),
  category: z.enum(['pothole', 'garbage', 'streetlight', 'water', 'other'], {
    required_error: 'Please select a category',
  }),
  location: z.string().max(200, 'Location must be less than 200 characters').optional(),
})

type IssueFormData = z.infer<typeof issueSchema>

interface FormErrors {
  image?: string
  submit?: string
}

export function ReportForm() {
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [errors, setErrors] = useState<FormErrors>({})
  const [isDragging, setIsDragging] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [categoryValue, setCategoryValue] = useState<string>('')

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors: formErrors },
  } = useForm<IssueFormData>({
    resolver: zodResolver(issueSchema),
    defaultValues: {
      title: '',
      description: '',
      category: undefined,
      location: '',
    },
  })

  const handleImageChange = useCallback((file: File | null) => {
    setErrors({})
    setSelectedFile(file)

    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        setErrors({ image: 'File size must be less than 5MB' })
        return
      }
      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        setErrors({ image: 'Please upload a valid image file (JPEG, PNG, or WebP)' })
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      setImagePreview(null)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    handleImageChange(file)
  }, [handleImageChange])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const removeImage = useCallback(() => {
    setSelectedFile(null)
    setImagePreview(null)
    setErrors({})
  }, [])

  const onSubmit = async (data: IssueFormData) => {
    setErrors({})

    const formData = new FormData()
    formData.append('title', data.title)
    formData.append('description', data.description)
    formData.append('category', data.category)
    formData.append('location', data.location || '')

    if (selectedFile) {
      formData.append('image', selectedFile)
    }

    setIsSubmitting(true)

    try {
      const result = await createIssue(formData)
      if (result?.error) {
        setErrors({ submit: result.error })
        setIsSubmitting(false)
      }
    } catch (error) {
      if (
        error &&
        typeof error === 'object' &&
        'digest' in error &&
        typeof error.digest === 'string' &&
        (error.digest.startsWith('NEXT_REDIRECT') || error.digest.startsWith('NEXT_NOT_FOUND'))
      ) {
        throw error
      }
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.'
      setErrors({ submit: errorMessage })
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Report an Issue
        </CardTitle>
        <CardDescription>
          Provide details about the civic issue you want to report
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {errors.submit && (
            <div className="flex items-center gap-2 p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg">
              <AlertCircle className="h-4 w-4" />
              {errors.submit}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Brief summary of the issue"
              {...register('title')}
            />
            {formErrors.title && (
              <p className="text-sm text-destructive">{formErrors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe the issue in detail..."
              rows={4}
              {...register('description')}
            />
            {formErrors.description && (
              <p className="text-sm text-destructive">{formErrors.description.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={categoryValue}
              onValueChange={(value) => {
                if (value) {
                  setCategoryValue(value)
                  setValue('category', value as Category)
                }
              }}
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formErrors.category && (
              <p className="text-sm text-destructive">{formErrors.category.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              placeholder="e.g., Near Central Park, 123 Main St"
              {...register('location')}
            />
            {formErrors.location && (
              <p className="text-sm text-destructive">{formErrors.location.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Image (Optional)</Label>
            {!imagePreview ? (
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={cn(
                  'relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors',
                  isDragging
                    ? 'border-primary bg-primary/5'
                    : 'border-muted-foreground/25 hover:border-muted-foreground/50',
                  errors.image && 'border-red-500 bg-red-50'
                )}
              >
                <input
                  type="file"
                  accept={ACCEPTED_IMAGE_TYPES.join(',')}
                  onChange={(e) => handleImageChange(e.target.files?.[0] || null)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  PNG, JPEG, or WebP (max 5MB)
                </p>
              </div>
            ) : (
              <div className="relative w-full h-48 rounded-xl overflow-hidden bg-muted">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 h-8 w-8"
                  onClick={removeImage}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
            {errors.image && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.image}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Report'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
