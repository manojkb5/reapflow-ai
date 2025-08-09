import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.52.1";

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ActivityNotification {
  activity_id: string;
  activity_type: string;
  description: string;
  subaccount_id: string;
  created_by: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const notification: ActivityNotification = await req.json();

    // Get subaccount details and owner email
    const { data: subaccount, error: subaccountError } = await supabase
      .from('subaccounts')
      .select(`
        name,
        email,
        created_by,
        profiles!subaccounts_created_by_fkey(email)
      `)
      .eq('id', notification.subaccount_id)
      .single();

    if (subaccountError || !subaccount) {
      console.error('Error fetching subaccount:', subaccountError);
      return new Response(
        JSON.stringify({ error: 'Subaccount not found' }),
        { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Get activity creator details
    const { data: creator, error: creatorError } = await supabase
      .from('profiles')
      .select('email, first_name, last_name')
      .eq('user_id', notification.created_by)
      .single();

    if (creatorError || !creator) {
      console.error('Error fetching creator:', creatorError);
      return new Response(
        JSON.stringify({ error: 'Creator not found' }),
        { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Use Resend to send email
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    if (!resendApiKey) {
      console.error('RESEND_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'Email service not configured' }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'ReapFlow <noreply@resend.dev>',
        to: [subaccount.profiles?.email || subaccount.email || 'admin@reapflow.com'],
        subject: `New Activity: ${notification.activity_type}`,
        html: `
          <h2>New Activity in ${subaccount.name}</h2>
          <p><strong>Activity:</strong> ${notification.description}</p>
          <p><strong>Type:</strong> ${notification.activity_type}</p>
          <p><strong>Created by:</strong> ${creator.first_name} ${creator.last_name} (${creator.email})</p>
          <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
          
          <hr style="margin: 20px 0;">
          <p style="color: #666; font-size: 12px;">
            This notification was sent automatically by ReapFlow CRM.
          </p>
        `,
      }),
    });

    if (!emailResponse.ok) {
      const error = await emailResponse.text();
      console.error('Failed to send email:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to send email' }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const emailResult = await emailResponse.json();
    console.log('Email sent successfully:', emailResult);

    return new Response(
      JSON.stringify({ success: true, emailResult }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-activity-notification function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);