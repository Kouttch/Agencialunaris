import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Get all auth users
    const { data: { users }, error: authError } = await supabaseAdmin.auth.admin.listUsers()
    
    if (authError) {
      throw authError
    }

    // Get all profiles
    const { data: profiles, error: profilesError } = await supabaseAdmin
      .from('profiles')
      .select('user_id, full_name, company')
    
    if (profilesError) {
      throw profilesError
    }

    // Get all user roles
    const { data: roles, error: rolesError } = await supabaseAdmin
      .from('user_roles')
      .select('user_id, role')
    
    if (rolesError) {
      throw rolesError
    }

    // Combine the data
    const combinedUsers = users.map(user => {
      const profile = profiles?.find(p => p.user_id === user.id)
      const userRole = roles?.find(r => r.user_id === user.id)
      
      return {
        id: user.id,
        email: user.email || '',
        full_name: profile?.full_name || '',
        company: profile?.company || '',
        role: userRole?.role || 'user'
      }
    })

    return new Response(
      JSON.stringify({ users: combinedUsers }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
