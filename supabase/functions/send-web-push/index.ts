import { createClient } from 'npm:@supabase/supabase-js@2.57.4';
import webpush from 'npm:web-push@3.6.7';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const vapidPublicKey = Deno.env.get('WEB_PUSH_PUBLIC_KEY') ?? '';
const vapidPrivateKey = Deno.env.get('WEB_PUSH_PRIVATE_KEY') ?? '';
const vapidSubject = Deno.env.get('WEB_PUSH_SUBJECT') ?? 'mailto:hello@example.com';

if (vapidPublicKey && vapidPrivateKey) {
  webpush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey);
}

type NotificationPayload = {
  id: string;
  user_id: string;
  message: string;
  type?: string | null;
  entry_id?: string | number | null;
};

type PushSubscriptionRow = {
  endpoint: string;
  subscription: Record<string, unknown>;
  user_id: string;
};

const buildDestinationUrl = (notification: NotificationPayload) => {
  const tab = notification.type === 'new_feed_post' ? 'Feed' : 'Notifications';
  const params = new URLSearchParams({ tab });

  if (notification.entry_id) {
    params.set('entry', String(notification.entry_id));
  }

  return `/?${params.toString()}`;
};

const buildTitle = (notification: NotificationPayload) => {
  if (notification.type === 'new_feed_post') return 'Class Feed';
  if (notification.type === 'new_answer') return 'New Answer';
  if (notification.type === 'test') return 'StudyVault Test';
  return 'StudyVault';
};

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (!supabaseUrl || !supabaseServiceRoleKey || !vapidPublicKey || !vapidPrivateKey) {
    return new Response(
      JSON.stringify({
        error: 'Missing push notification environment variables.'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }

  let body: { notifications?: NotificationPayload[] };
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body.' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  const notifications = Array.isArray(body.notifications)
    ? body.notifications.filter((item) => item?.user_id && item?.message)
    : [];

  if (!notifications.length) {
    return new Response(JSON.stringify({ sent: 0, pruned: 0 }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  const admin = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false }
  });

  const targetUserIds = [...new Set(notifications.map((item) => item.user_id))];
  const { data: subscriptions, error: subscriptionError } = await admin
    .from('push_subscriptions')
    .select('endpoint, subscription, user_id')
    .in('user_id', targetUserIds);

  if (subscriptionError) {
    return new Response(JSON.stringify({ error: subscriptionError.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  const subscriptionsByUser = new Map<string, PushSubscriptionRow[]>();
  for (const row of (subscriptions ?? []) as PushSubscriptionRow[]) {
    const existing = subscriptionsByUser.get(row.user_id) ?? [];
    existing.push(row);
    subscriptionsByUser.set(row.user_id, existing);
  }

  let sent = 0;
  const endpointsToPrune: string[] = [];

  for (const notification of notifications) {
    const userSubscriptions = subscriptionsByUser.get(notification.user_id) ?? [];
    if (!userSubscriptions.length) continue;

    const payload = JSON.stringify({
      title: buildTitle(notification),
      body: notification.message,
      url: buildDestinationUrl(notification),
      entryId: notification.entry_id ?? null,
      tag: `studyvault-${notification.id}`,
      icon: '/web-app-manifest-192x192.png',
      badge: '/web-app-manifest-192x192.png'
    });

    const deliveryResults = await Promise.allSettled(
      userSubscriptions.map((subscriptionRow) =>
        webpush.sendNotification(subscriptionRow.subscription as webpush.PushSubscription, payload)
      )
    );

    deliveryResults.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        sent += 1;
        return;
      }

      const statusCode = (result.reason as { statusCode?: number })?.statusCode;
      if (statusCode === 404 || statusCode === 410) {
        endpointsToPrune.push(userSubscriptions[index].endpoint);
      } else {
        console.error('Web push delivery failed:', result.reason);
      }
    });
  }

  if (endpointsToPrune.length) {
    await admin
      .from('push_subscriptions')
      .delete()
      .in('endpoint', [...new Set(endpointsToPrune)]);
  }

  return new Response(JSON.stringify({
    sent,
    pruned: [...new Set(endpointsToPrune)].length
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
});
