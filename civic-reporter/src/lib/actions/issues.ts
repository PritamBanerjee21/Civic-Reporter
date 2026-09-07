'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import type { Category, Status } from '@/types'

export async function createIssue(formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const category = formData.get('category') as Category
  const location = formData.get('location') as string
  const image = formData.get('image') as File | null

  let imageUrl: string | null = null

  if (image && image.size > 0) {
    try {
      const fileExt = image.name.split('.').pop() || 'jpg'
      const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${fileExt}`

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('issue-images')
        .upload(fileName, image, {
          cacheControl: '3600',
          upsert: false,
          contentType: image.type || 'image/jpeg',
        })

      if (uploadError) {
        console.error('Upload error:', uploadError)
        return { error: `Failed to upload image: ${uploadError.message}` }
      }

      const { data: urlData } = supabase.storage
        .from('issue-images')
        .getPublicUrl(uploadData.path)

      imageUrl = urlData.publicUrl
    } catch (uploadErr) {
      console.error('Upload threw:', uploadErr)
      const message = uploadErr instanceof Error ? uploadErr.message : 'Unknown upload error'
      return { error: `Failed to upload image: ${message}` }
    }
  }

  try {
    const { error: insertError } = await supabase.from('issues').insert({
      title,
      description,
      category,
      location: location || null,
      image_url: imageUrl,
      reported_by: user.id,
    })

    if (insertError) {
      console.error('Insert error:', insertError)
      return { error: `Failed to create report: ${insertError.message}` }
    }
  } catch (insertErr) {
    console.error('Insert threw:', insertErr)
    const message = insertErr instanceof Error ? insertErr.message : 'Unknown insert error'
    return { error: `Failed to create report: ${message}` }
  }

  revalidatePath('/my-reports')
  redirect('/my-reports')
}

export async function getMyIssues() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data, error } = await supabase
    .from('issues')
    .select('*')
    .eq('reported_by', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    return { issues: [], error: error.message }
  }

  return { issues: data, error: null }
}

export async function getAllIssues() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data, error } = await supabase
    .from('issues')
    .select('*, profiles:reported_by(full_name, role)')
    .order('created_at', { ascending: false })

  if (error) {
    return { issues: [], error: error.message }
  }

  return { issues: data, error: null }
}

export async function getIssueById(id: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data, error } = await supabase
    .from('issues')
    .select('*, profiles:reported_by(full_name, role)')
    .eq('id', id)
    .single()

  if (error) {
    return { issue: null, error: error.message }
  }

  return { issue: data, error: null }
}

export async function updateIssueStatus(issueId: string, status: Status) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { error } = await supabase
    .from('issues')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', issueId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard')
  revalidatePath('/issues')
  revalidatePath(`/issues/${issueId}`)
  return { error: null }
}

export async function getDashboardStats() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: allIssues, error } = await supabase
    .from('issues')
    .select('status')

  if (error) {
    return { total: 0, pending: 0, inProgress: 0, resolved: 0, error: error.message }
  }

  return {
    total: allIssues.length,
    pending: allIssues.filter((i) => i.status === 'pending').length,
    inProgress: allIssues.filter((i) => i.status === 'in_progress').length,
    resolved: allIssues.filter((i) => i.status === 'resolved').length,
    error: null,
  }
}
