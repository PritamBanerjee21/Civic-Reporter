export type Role = 'citizen' | 'admin'

export type Category = 'pothole' | 'garbage' | 'streetlight' | 'water' | 'other'

export type Status = 'pending' | 'in_progress' | 'resolved'

export interface Profile {
  id: string
  full_name: string
  role: Role
  created_at: string
}

export interface Issue {
  id: string
  title: string
  description: string
  category: Category
  status: Status
  image_url: string | null
  location: string | null
  reported_by: string
  created_at: string
  updated_at: string
  profiles?: Profile
}

export interface IssueWithProfile extends Issue {
  profiles: Profile
}