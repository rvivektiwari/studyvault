import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from './supabaseClient';
import { 
  SignedIn, 
  SignedOut, 
  RedirectToSignIn, 
  useUser, 
  useClerk, 
  useAuth,
  UserProfile 
} from '@clerk/clerk-react';
import './index.css';

const COLORS = {
  bg: '#F5F7FA',
  cardSurface: '#FFFFFF',
  primary: '#2196F3',
  primaryLight: '#E3F2FD',
  accent: '#FF9800',
  accentLight: '#FFF3E0',
  teal: '#00BCD4',
  green: '#4CAF50',
  textDark: '#1A237E',
  textPrimary: '#37474F', // textBody
  textMuted: '#90A4AE',
  shadow: '0 4px 16px rgba(33,150,243,0.10)',
  cardBorder: 'transparent', // removed hard borders
  goldAccent: '#FF9800', // mapped to accent
  blueAccent: '#2196F3' // mapped to primary
};

const ICONS = {
  Home: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokelinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>,
  Starred: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokelinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>,
  Search: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokelinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>,
  Profile: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokelinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>,
  Review: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokelinejoin="round"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>,
  Feed: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokelinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>,
  StarFilled: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokelinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>,
  Bell: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokelinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>,
};

const SUBJECTS = [
  'Mathematics', 'Science', 'English', 'Social Science', 'Hindi', 'Sanskrit', 'Computer'
];

// Profile Helper Components
const SettingRow = ({ icon, label, onClick, isDestructive, hasToggle, toggleValue, onToggle, isTheme, currentTheme, onThemeChange }) => (
  <div 
    onClick={!hasToggle && !isTheme ? onClick : undefined}
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px 20px',
      borderBottom: '1px solid #F0F2F5',
      cursor: (hasToggle || isTheme) ? 'default' : 'pointer',
      backgroundColor: '#FFF'
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
      <span style={{ fontSize: '20px' }}>{icon}</span>
      <span style={{ fontSize: '15px', fontWeight: '500', color: isDestructive ? '#FF5252' : COLORS.textDark }}>{label}</span>
    </div>
    
    {hasToggle && (
      <div 
        onClick={onToggle}
        style={{
          width: '44px',
          height: '24px',
          borderRadius: '12px',
          backgroundColor: toggleValue ? COLORS.primary : '#D1D9E0',
          position: 'relative',
          cursor: 'pointer',
          transition: 'background-color 0.2s'
        }}
      >
        <div style={{
          position: 'absolute',
          top: '2px',
          left: toggleValue ? '22px' : '2px',
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          backgroundColor: '#FFF',
          transition: 'left 0.2s'
        }} />
      </div>
    )}

    {isTheme && (
      <div style={{ display: 'flex', backgroundColor: COLORS.bg, borderRadius: '10px', padding: '2px' }}>
        <button 
          onClick={() => onThemeChange('light')}
          style={{ border: 'none', backgroundColor: currentTheme === 'light' ? '#FFF' : 'transparent', borderRadius: '8px', padding: '4px 10px', fontSize: '11px', fontWeight: '600', color: currentTheme === 'light' ? COLORS.primary : COLORS.textMuted, cursor: 'pointer' }}
        >Light</button>
        <button 
          onClick={() => onThemeChange('dark')}
          style={{ border: 'none', backgroundColor: currentTheme === 'dark' ? '#FFF' : 'transparent', borderRadius: '8px', padding: '4px 10px', fontSize: '11px', fontWeight: '600', color: currentTheme === 'dark' ? COLORS.primary : COLORS.textMuted, cursor: 'pointer' }}
        >Dark</button>
      </div>
    )}

    {!hasToggle && !isTheme && (
      <span style={{ color: COLORS.textMuted, fontSize: '18px' }}>›</span>
    )}
  </div>
);

export default function App() {
  const { isLoaded, isSignedIn, user } = useUser();
  const { signOut } = useClerk();
  const { getToken } = useAuth();
  
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [currentTab, setCurrentTab] = useState('Home');
  const [ignoredReviewIds, setIgnoredReviewIds] = useState(new Set());
  const [revealedReviewIds, setRevealedReviewIds] = useState(new Set());
  
  // Profile State
  const [profile, setProfile] = useState(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState('');
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [tempBio, setTempBio] = useState('');
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [showClerkSettings, setShowClerkSettings] = useState(false);
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);
  const [ svTheme, setSvTheme ] = useState(localStorage.getItem('sv_theme') || 'light');
  const [ svNotifs, setSvNotifs ] = useState(localStorage.getItem('sv_notifs_enabled') === 'true');
  
  // Feed State
  const [feedEntries, setFeedEntries] = useState([]);
  const [memberCount, setMemberCount] = useState(0);
  const [isSharing, setIsSharing] = useState(false);
  const [feedSearch, setFeedSearch] = useState('');
  
  // Notifications State
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isNotifLoading, setIsNotifLoading] = useState(false);
  
  const searchInputRef = useRef(null);
  
  // Detail View State
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Add Entry State
  const [showAddEntry, setShowAddEntry] = useState(false);
  const [addStep, setAddStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [showAIModal, setShowAIModal] = useState(false);
  
  // Form Fields
  const [formQuestion, setFormQuestion] = useState('');
  const [formSubject, setFormSubject] = useState(SUBJECTS[0]);
  const [formChapter, setFormChapter] = useState('');
  const [formAnswer, setFormAnswer] = useState('');
  const [formTags, setFormTags] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showLightbox, setShowLightbox] = useState(false);

  const fetchEntries = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setFetchError(false);
    try {
      const db = await import('./supabaseClient').then(m => m.getSupabase(getToken));
      const { data, error } = await db
        .from('entries')
        .select('id, user_id, question, answer, subject, chapter, tags, starred, review_count, last_reviewed, created_at, image_url, is_public')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setEntries(data || []);
    } catch {
      setFetchError(true);
    } finally {
      setLoading(false);
    }
  }, [user, getToken]);

  // Profile Sync
  const fetchProfile = useCallback(async () => {
    if (!user) return;
    try {
      const db = await import('./supabaseClient').then(m => m.getSupabase(getToken));
      const { data, error } = await db
        .from('profiles')
        .select('user_id, display_name, avatar_url, bio, reviews_done')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      if (!data) {
        // First-time login — create profile
        const { data: newProfile, error: insertError } = await db
          .from('profiles')
          .insert([{
            user_id: user.id,
            display_name: (user.fullName || user.firstName || 'Student').trim(),
            avatar_url: user.imageUrl,
            bio: ''
          }])
          .select()
          .single();
        if (!insertError && newProfile) {
          setProfile(newProfile);
          notifyAllUsers(
            user.id,
            null,
            `${newProfile.display_name} just joined the class! 👋`,
            'new_member'
          );
        }
      } else {
        setProfile(data);
      }
    } catch {
      // Profile fetch failure is non-critical, continue silently
    }
  }, [user, getToken]);

  const getTimeAgo = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    if (diffInSeconds < 60) return "just now";
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const handleShareToFeed = async (entry) => {
    if (!user) return;
    setIsSharing(true);
    try {
      const db = await import('./supabaseClient').then(m => m.getSupabase(getToken));
      const { error: updateError } = await db
        .from('entries')
        .update({ is_public: true })
        .eq('id', entry.id);
      if (updateError) throw updateError;

      const { error: insertError } = await db
        .from('class_feed')
        .insert([{ entry_id: entry.id, user_id: user.id }]);
      if (insertError) throw insertError;

      showToast('Shared to class feed!', 'success');
      await notifyAllUsers(user.id, entry.id,
        `${profile?.display_name || user.firstName} shared a new question in ${entry.subject}`);
      setSelectedEntry(prev => ({ ...prev, is_public: true }));
      setEntries(prev => prev.map(e => e.id === entry.id ? { ...e, is_public: true } : e));
    } catch {
      showToast('Failed to share. Try again.', 'error');
    } finally {
      setIsSharing(false);
    }
  };

  const handleRemoveFromFeed = async (entry) => {
    if (!user) return;
    setIsSharing(true);
    try {
      const db = await import('./supabaseClient').then(m => m.getSupabase(getToken));
      const { error: updateError } = await db
        .from('entries')
        .update({ is_public: false })
        .eq('id', entry.id);
      if (updateError) throw updateError;

      const { error: deleteError } = await db
        .from('class_feed')
        .delete()
        .eq('entry_id', entry.id);
      if (deleteError) throw deleteError;

      showToast('Removed from class feed', 'success');
      setSelectedEntry(prev => ({ ...prev, is_public: false }));
      setEntries(prev => prev.map(e => e.id === entry.id ? { ...e, is_public: false } : e));
    } catch {
      showToast('Failed to remove. Try again.', 'error');
    } finally {
      setIsSharing(false);
    }
  };

  const notifyAllUsers = async (fromUserId, entryId, message, type = 'new_feed_post') => {
    try {
      const db = await import('./supabaseClient').then(m => m.getSupabase(getToken));
      const { data: allProfiles } = await db
        .from('profiles')
        .select('user_id')
        .neq('user_id', fromUserId);
      if (!allProfiles || allProfiles.length === 0) return;
      const notifs = allProfiles.map(p => ({
        user_id: p.user_id,
        from_user_id: fromUserId,
        type,
        message,
        entry_id: entryId,
        is_read: false,
      }));
      await db.from('notifications').insert(notifs);
    } catch {
      // Silently fail — notifications are non-critical
    }
  };

  const fetchUnreadCount = useCallback(async () => {
    if (!user) return;
    try {
      const db = await import('./supabaseClient').then(m => m.getSupabase(getToken));
      const { count } = await db
        .from('notifications')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('is_read', false);
      setUnreadCount(count || 0);
    } catch { /* silent */ }
  }, [user, getToken]);

  const fetchNotifications = useCallback(async () => {
    if (!user) return;
    setIsNotifLoading(true);
    try {
      const db = await import('./supabaseClient').then(m => m.getSupabase(getToken));
      const { data } = await db
        .from('notifications')
        .select('id, message, type, entry_id, is_read, created_at, profiles:from_user_id(display_name, avatar_url)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);
      setNotifications(data || []);
    } catch { /* silent */ } finally {
      setIsNotifLoading(false);
    }
  }, [user, getToken]);

  const markAllAsRead = async () => {
    if (!user) return;
    try {
      const db = await import('./supabaseClient').then(m => m.getSupabase(getToken));
      await db.from('notifications').update({ is_read: true })
        .eq('user_id', user.id).eq('is_read', false);
      setUnreadCount(0);
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    } catch { /* silent */ }
  };

  const markAsRead = async (notifId) => {
    try {
      const db = await import('./supabaseClient').then(m => m.getSupabase(getToken));
      await db.from('notifications').update({ is_read: true }).eq('id', notifId);
      setUnreadCount(prev => Math.max(0, prev - 1));
      setNotifications(prev => prev.map(n => n.id === notifId ? { ...n, is_read: true } : n));
    } catch { /* silent */ }
  };

  const fetchMemberCount = useCallback(async () => {
    try {
      const { count } = await supabase
        .from('profiles')
        .select('user_id', { count: 'exact', head: true });
      setMemberCount(count || 0);
    } catch { /* silent */ }
  }, []);

  const fetchFeed = useCallback(async () => {
    try {
      const { data } = await supabase
        .from('class_feed')
        .select('posted_at, user_id, entry_id, entries!inner(id, question, answer, subject, chapter, tags, image_url, user_id), profiles!inner(display_name, avatar_url)')
        .order('posted_at', { ascending: false })
        .limit(50);
      setFeedEntries(data || []);
    } catch { /* silent */ }
  }, []);

  useEffect(() => {
    if (isSignedIn && user) {
      fetchEntries();
      fetchProfile();
      fetchMemberCount();
      fetchFeed();
      fetchUnreadCount();

      // Real-time notifications subscription
      const channel = supabase
        .channel(`notifs-${user.id}`)
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`,
        }, payload => {
          const notif = payload.new;
          setUnreadCount(prev => prev + 1);
          showToast(notif.message, 'info');
          if (navigator.vibrate) navigator.vibrate(200);
          fetchNotifications();
        })
        .subscribe();

      // Cleanup on unmount — prevents memory leaks
      return () => { supabase.removeChannel(channel); };
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSignedIn, user?.id]);

  useEffect(() => {
    if (currentTab === 'Feed') {
      fetchFeed();
      fetchMemberCount();
    }
    if (currentTab === 'Notifications') {
      fetchNotifications();
      // Reset count locally when viewing the screen
      setUnreadCount(0);
    }
  }, [currentTab, fetchFeed, fetchMemberCount, fetchNotifications]);

  useEffect(() => {
    document.title = "StudyVault — Class X";
    fetchEntries();

    const handleKeyDown = (e) => {
      // Escape key closes modals/detail
      if (e.key === 'Escape') {
        setShowLightbox(false);
        setShowAddEntry(false);
        setSelectedEntry(null);
        setShowDeleteConfirm(false);
        setShowAIModal(false);
        setShowClerkSettings(false);
        setShowSignOutConfirm(false);
        setIsEditingName(false);
        setIsEditingBio(false);
      }
      // Ctrl+K or Cmd+K focuses search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [fetchEntries]);

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 2500);
  };

  const saveName = async () => {
    if (!tempName.trim() || !user) return;
    try {
      await user.update({ firstName: tempName.trim() });
      const db = await import('./supabaseClient').then(m => m.getSupabase(getToken));
      const { error } = await db
        .from('profiles')
        .update({ display_name: tempName.trim() })
        .eq('user_id', user.id);
      if (error) throw error;
      setProfile(prev => ({ ...prev, display_name: tempName.trim() }));
      setIsEditingName(false);
      showToast('Name updated!', 'success');
    } catch {
      showToast('Failed to update name. Try again.', 'error');
    }
  };

  const saveBio = async () => {
    if (!user) return;
    try {
      const db = await import('./supabaseClient').then(m => m.getSupabase(getToken));
      const { error } = await db
        .from('profiles')
        .update({ bio: tempBio.trim() })
        .eq('user_id', user.id);
      if (error) throw error;
      setProfile(prev => ({ ...prev, bio: tempBio.trim() }));
      setIsEditingBio(false);
      showToast('Bio updated!', 'success');
    } catch {
      showToast('Failed to update bio. Try again.', 'error');
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Security: validate file type
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      showToast('Only JPEG, PNG, or WebP images are allowed.', 'error');
      return;
    }
    // Security: validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      showToast('Image must be under 5MB.', 'error');
      return;
    }

    setIsUploadingAvatar(true);
    try {
      // Compress to max 400x400 JPEG at 85%
      const img = new Image();
      img.src = URL.createObjectURL(file);
      await new Promise(resolve => { img.onload = resolve; });

      const canvas = document.createElement('canvas');
      const MAX_SIZE = 400;
      let { width, height } = img;
      if (width > height) {
        if (width > MAX_SIZE) { height = Math.round(height * MAX_SIZE / width); width = MAX_SIZE; }
      } else {
        if (height > MAX_SIZE) { width = Math.round(width * MAX_SIZE / height); height = MAX_SIZE; }
      }
      canvas.width = width;
      canvas.height = height;
      canvas.getContext('2d').drawImage(img, 0, 0, width, height);
      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.85));

      const path = `${user.id}/avatar.jpg`;
      const db = await import('./supabaseClient').then(m => m.getSupabase(getToken));
      const { error: uploadError } = await db.storage
        .from('avatars')
        .upload(path, blob, { upsert: true, contentType: 'image/jpeg' });
      if (uploadError) throw uploadError;

      const { data: urlData } = db.storage.from('avatars').getPublicUrl(path);
      const publicUrl = urlData.publicUrl;

      const { error: dbError } = await db
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('user_id', user.id);
      if (dbError) throw dbError;

      // Update Clerk profile image (non-critical)
      try { await user.setProfileImage({ file: blob }); } catch { /* ignore Clerk image sync */ }

      setProfile(prev => ({ ...prev, avatar_url: publicUrl }));
      showToast('Avatar updated!', 'success');
    } catch {
      showToast('Failed to upload avatar. Try again.', 'error');
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleToggleStar = async (entryToToggle, e) => {
    if (e) e.stopPropagation();
    const newStarredStatus = !entryToToggle.starred;
    // Optimistic update
    setEntries(prev => prev.map(en => en.id === entryToToggle.id ? { ...en, starred: newStarredStatus } : en));
    if (selectedEntry?.id === entryToToggle.id) {
      setSelectedEntry(prev => ({ ...prev, starred: newStarredStatus }));
    }
    if (e) {
      const btn = e.currentTarget;
      btn.style.animation = 'none';
      void btn.offsetWidth;
      btn.style.animation = 'starPop 0.3s ease';
    }
    try {
      const db = await import('./supabaseClient').then(m => m.getSupabase(getToken));
      const { error } = await db.from('entries').update({ starred: newStarredStatus }).eq('id', entryToToggle.id);
      if (error) throw error;
    } catch {
      // Revert on error
      setEntries(prev => prev.map(en => en.id === entryToToggle.id ? { ...en, starred: !newStarredStatus } : en));
      if (selectedEntry?.id === entryToToggle.id) {
        setSelectedEntry(prev => ({ ...prev, starred: !newStarredStatus }));
      }
      showToast('Could not update star. Try again.', 'error');
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const db = await import('./supabaseClient').then(m => m.getSupabase(getToken));
      const { error } = await db.from('entries').delete().eq('id', selectedEntry.id);
      if (error) throw error;
      setEntries(prev => prev.filter(e => e.id !== selectedEntry.id));
      setSelectedEntry(null);
      setShowDeleteConfirm(false);
    } catch {
      showToast('Delete failed. Try again.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSaveEntry = async () => {
    if (!formQuestion.trim()) {
      showToast('Question cannot be empty.', 'error');
      return;
    }
    if (!formAnswer.trim()) {
      showToast('Answer cannot be empty.', 'error');
      return;
    }
    setIsSaving(true);
    const parsedTags = formTags
      ? formTags.split(',').map(t => t.trim()).filter(Boolean)
      : [];

    let imageUrl = null;
    if (imageFile) {
      // Validate file type
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(imageFile.type)) {
        showToast('Only JPEG, PNG, or WebP images are allowed.', 'error');
        setIsSaving(false);
        return;
      }
      // Validate file size (5MB)
      if (imageFile.size > 5 * 1024 * 1024) {
        showToast('Image must be under 5MB.', 'error');
        setIsSaving(false);
        return;
      }
      try {
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('entry-images')
          .upload(fileName, imageFile, { contentType: imageFile.type });
        if (uploadError) throw uploadError;
        const { data: urlData } = supabase.storage.from('entry-images').getPublicUrl(fileName);
        imageUrl = urlData?.publicUrl || null;
      } catch {
        showToast('Image upload failed. Saving without image.', 'error');
      }
    }

    const newEntry = {
      user_id: user.id,
      question: formQuestion.trim(),
      answer: formAnswer.trim(),
      subject: formSubject,
      chapter: formChapter.trim() || null,
      tags: parsedTags,
      starred: false,
      image_url: imageUrl,
    };

    try {
      const db = await import('./supabaseClient').then(m => m.getSupabase(getToken));
      const { data, error } = await db.from('entries').insert([newEntry]).select();
      if (error) throw error;
      if (data && data.length > 0) {
        setEntries(prev => [data[0], ...prev]);
        showToast('✓ Saved to your vault!', 'success');
        setFormQuestion(''); setFormSubject(SUBJECTS[0]); setFormChapter('');
        setFormAnswer(''); setFormTags(''); setImageFile(null); setImagePreview(null);
        setAddStep(1); setShowAddEntry(false);
      }
    } catch {
      showToast('Something went wrong. Try again.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleMarkReviewed = async (entry) => {
    // Optimistic update
    setEntries(prev => prev.map(e => e.id === entry.id
      ? { ...e, review_count: (e.review_count || 0) + 1, last_reviewed: new Date().toISOString() }
      : e
    ));
    setRevealedReviewIds(prev => {
      const s = new Set(prev); s.delete(entry.id); return s;
    });
    try {
      const db = await import('./supabaseClient').then(m => m.getSupabase(getToken));
      const { error } = await db.from('entries').update({
        review_count: (entry.review_count || 0) + 1,
        last_reviewed: new Date().toISOString()
      }).eq('id', entry.id);
      if (error) throw error;
      showToast('Review saved! ✓', 'success');
    } catch {
      showToast('Could not save review. Try again.', 'error');
    }
  };

  const handleReviewAgain = (entry) => {
    setIgnoredReviewIds(prev => new Set(prev).add(entry.id));
    setRevealedReviewIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(entry.id);
      return newSet;
    });
  };

  const reviewQueue = entries.filter(entry => {
    if (ignoredReviewIds.has(entry.id)) return false;
    if (!entry.last_reviewed) return true;
    const lastReviewedDate = new Date(entry.last_reviewed);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return lastReviewedDate < sevenDaysAgo;
  });

  const filteredEntries = entries.filter(entry => {
    const matchesSubject = selectedSubject === 'All' || entry.subject === selectedSubject;
    const searchLower = searchQuery.toLowerCase();
    
    const matchesSearch = !searchLower || (
      (entry.question && entry.question.toLowerCase().includes(searchLower)) ||
      (entry.answer && entry.answer.toLowerCase().includes(searchLower)) ||
      (entry.chapter && entry.chapter.toLowerCase().includes(searchLower)) ||
      (Array.isArray(entry.tags) && entry.tags.some(t => String(t).toLowerCase().includes(searchLower))) ||
      (typeof entry.tags === 'string' && entry.tags.toLowerCase().includes(searchLower))
    );
    
    const matchesTab = currentTab === 'Starred' ? entry.starred : true;
    
    return matchesSubject && matchesSearch && matchesTab;
  });

  const filteredFeedEntries = feedEntries.filter(item => {
    const searchLower = feedSearch.toLowerCase();
    if (!searchLower) return true;
    const e = item.entries;
    const p = item.profiles;
    return (
      (e.question && e.question.toLowerCase().includes(searchLower)) ||
      (e.answer && e.answer.toLowerCase().includes(searchLower)) ||
      (e.subject && e.subject.toLowerCase().includes(searchLower)) ||
      (p.display_name && p.display_name.toLowerCase().includes(searchLower))
    );
  });

  const totalSaved = entries.length;
  const starred = entries.filter(e => e.starred).length;
  const subjectsCovered = new Set(entries.map(e => e.subject)).size;

  return (
    <>
      {/* Clerk Loading State - prevent blank page flash */}
      {!isLoaded && (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F5F7FA' }}>
          <div style={{ textAlign: 'center' }}>
            <div className="spinner-blue" style={{ width: '36px', height: '36px', margin: '0 auto 16px' }} />
            <p style={{ color: '#90A4AE', fontSize: '14px', fontFamily: "'Poppins', sans-serif" }}>Loading StudyVault...</p>
          </div>
        </div>
      )}
      <SignedIn>
        <div style={{
          minHeight: '100vh',
          backgroundColor: COLORS.bg,
          fontFamily: "'Poppins', sans-serif",
          color: COLORS.textPrimary,
          position: 'relative',
          overflowX: 'hidden'
        }}>
      {/* Toast Notification */}
      <div style={{
        position: 'fixed',
        bottom: toast.show ? '90px' : '-100px',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: toast.type === 'error' ? '#FF5252' : COLORS.green,
        color: '#fff',
        padding: '12px 24px',
        borderRadius: '30px',
        fontSize: '14px',
        fontFamily: "'Poppins', sans-serif",
        zIndex: 1000,
        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
        fontWeight: '500',
        opacity: toast.show ? 1 : 0
      }}>
        {toast.message}
      </div>

      {/* MAIN CONTENT WRAPPER */}
        
        {/* HOMEPAGE VIEW */}
        <div className="safe-bottom-pad" style={{ 
          display: (selectedEntry || showAddEntry) ? 'none' : 'flex', 
          flexDirection: 'column', 
          gap: '24px',
          padding: '20px 16px',
        }}>
          {/* 1. HEADER ROW (Hidden on Search and Profile) */}
          {(currentTab === 'Home' || currentTab === 'Starred') && (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              backgroundColor: COLORS.cardSurface,
              padding: '20px',
              borderRadius: '20px',
              boxShadow: COLORS.shadow
            }}>
              <div>
                <div style={{ 
                  fontSize: '13px', 
                  color: COLORS.textMuted, 
                  marginBottom: '2px',
                  fontWeight: '500'
                }}>
                  Hello,
                </div>
                <div style={{ 
                  fontSize: '22px', 
                  margin: 0, 
                  color: COLORS.textDark, 
                  fontWeight: '700',
                  letterSpacing: '-0.5px'
                }}>
                  {profile?.display_name || user?.firstName || 'User'} <span style={{ fontWeight: 400, marginLeft: '4px' }}>👋</span>
                </div>
              </div>
              <div 
                onClick={() => setCurrentTab('Profile')}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: COLORS.primaryLight,
                  color: COLORS.primary,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  fontSize: '18px',
                  overflow: 'hidden',
                  cursor: 'pointer'
                }}>
                {(profile?.avatar_url || user?.imageUrl) ? (
                  <img src={profile?.avatar_url || user?.imageUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (profile?.display_name || user?.firstName || 'U')[0].toUpperCase()}
              </div>
            </div>
          )}

          {/* 2. PROFILE VIEW */}
          {currentTab === 'Profile' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Profile Card */}
              <div style={{
                backgroundColor: COLORS.cardSurface,
                borderRadius: '24px',
                padding: '24px',
                boxShadow: COLORS.shadow,
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center',
                position: 'relative'
              }}>
                <div style={{ position: 'relative', width: '90px', height: '90px', marginBottom: '16px' }}>
                  <div style={{
                    width: '90px',
                    height: '90px',
                    borderRadius: '50%',
                    backgroundColor: COLORS.primary,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFF',
                    fontSize: '32px',
                    fontWeight: 'bold',
                    overflow: 'hidden'
                  }}>
                    {(profile?.avatar_url || user?.imageUrl) ? (
                      <img src={profile?.avatar_url || user?.imageUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (profile?.display_name || user?.firstName || 'U')[0].toUpperCase()}
                  </div>
                  {isUploadingAvatar && (
                    <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(255,255,255,0.7)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span className="spinner"></span>
                    </div>
                  )}
                  <label style={{
                    position: 'absolute',
                    bottom: '2px',
                    right: '2px',
                    width: '24px',
                    height: '24px',
                    backgroundColor: '#FFF',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={COLORS.primary} strokeWidth="2.5" strokeLinecap="round" strokelinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
                    <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarUpload} />
                  </label>
                </div>

                {isEditingName ? (
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                    <input 
                      value={tempName} 
                      onChange={e => setTempName(e.target.value)}
                      style={{ border: 'none', backgroundColor: COLORS.bg, borderRadius: '8px', padding: '4px 12px', textAlign: 'center', fontSize: '18px', fontWeight: '600', fontFamily: 'inherit' }}
                      autoFocus
                      onBlur={saveName}
                      onKeyDown={e => e.key === 'Enter' && saveName()}
                    />
                  </div>
                ) : (
                  <h3 onClick={() => { setIsEditingName(true); setTempName(profile?.display_name || user?.fullName || ''); }} style={{ fontSize: '18px', fontWeight: '600', color: COLORS.textDark, margin: '0 0 4px 0', cursor: 'pointer' }}>
                    {profile?.display_name || user?.fullName}
                  </h3>
                )}
                <p style={{ fontSize: '13px', color: COLORS.textMuted, margin: '0 0 12px 0' }}>{user?.primaryEmailAddress?.emailAddress}</p>
                
                {isEditingBio ? (
                  <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <textarea 
                      value={tempBio} 
                      onChange={e => setTempBio(e.target.value)}
                      placeholder="Tell your classmates about yourself..."
                      style={{ width: '100%', border: 'none', backgroundColor: COLORS.bg, borderRadius: '12px', padding: '12px', fontSize: '13px', minHeight: '60px', resize: 'none', fontFamily: 'inherit' }}
                      autoFocus
                    />
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <button onClick={() => setIsEditingBio(false)} style={{ background: 'none', border: 'none', color: COLORS.textMuted, fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>Cancel</button>
                      <button onClick={saveBio} style={{ backgroundColor: COLORS.primary, color: '#FFF', border: 'none', borderRadius: '8px', padding: '6px 16px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>Save Bio</button>
                    </div>
                  </div>
                ) : (
                  <p onClick={() => { setIsEditingBio(true); setTempBio(profile?.bio || ''); }} style={{ fontSize: '13px', color: COLORS.textPrimary, textAlign: 'center', margin: '0 0 16px 0', fontStyle: profile?.bio ? 'normal' : 'italic', cursor: 'pointer', lineHeight: '1.5' }}>
                    {profile?.bio || "Tap to add a bio..."}
                  </p>
                )}

                <div style={{ backgroundColor: COLORS.primaryLight, color: COLORS.primary, padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase' }}>
                  Class X
                </div>
              </div>

              {/* Stats Row */}
              <div style={{ display: 'flex', gap: '12px' }}>
                {[
                  { label: 'My Entries', value: totalSaved },
                  { label: 'My Starred', value: starred },
                  { label: 'Reviews Done', value: profile?.reviews_done || 0 }
                ].map((stat, i) => (
                  <div key={i} style={{ flex: 1, backgroundColor: COLORS.cardSurface, padding: '16px 12px', borderRadius: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                    <span style={{ fontSize: '18px', fontWeight: 'bold', color: COLORS.primary }}>{stat.value}</span>
                    <span style={{ fontSize: '10px', color: COLORS.textMuted, textAlign: 'center' }}>{stat.label}</span>
                  </div>
                ))}
              </div>

              {/* Settings Section */}
              <div style={{ backgroundColor: COLORS.cardSurface, borderRadius: '24px', overflow: 'hidden', boxShadow: COLORS.shadow }}>
                <SettingRow icon="🔑" label="Change Password" onClick={() => setShowClerkSettings(true)} />
                <SettingRow icon="🔔" label="Notification Preferences" hasToggle toggleValue={svNotifs} onToggle={() => {
                  const next = !svNotifs;
                  setSvNotifs(next);
                  localStorage.setItem('sv_notifs_enabled', next);
                }} />
                <SettingRow icon="🌓" label="App Theme" isTheme currentTheme={svTheme} onThemeChange={(t) => {
                  setSvTheme(t);
                  localStorage.setItem('sv_theme', t);
                }} />
                <SettingRow icon="🚪" label="Sign Out" isDestructive onClick={() => setShowSignOutConfirm(true)} />
              </div>
            </div>
          )}

          {/* 3. CLASS FEED VIEW */}
          {currentTab === 'Feed' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: COLORS.textDark, margin: 0 }}>Class Feed</h2>
                  <p style={{ fontSize: '13px', color: COLORS.textMuted, margin: '2px 0 0 0' }}>{memberCount} members active</p>
                </div>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: COLORS.cardSurface, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', color: COLORS.textMuted }}>
                  <ICONS.Search />
                </div>
              </div>

              {/* Feed Search */}
              <div style={{ position: 'relative' }}>
                <input 
                  type="text" 
                  placeholder="Search the feed..." 
                  value={feedSearch}
                  onChange={(e) => setFeedSearch(e.target.value)}
                  style={{
                    width: '100%',
                    backgroundColor: COLORS.cardSurface,
                    border: 'none',
                    borderRadius: '16px',
                    padding: '12px 16px 12px 44px',
                    fontSize: '14px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                    fontFamily: 'inherit'
                  }}
                />
                <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: COLORS.textMuted }}>
                  <ICONS.Search />
                </span>
              </div>

              {filteredFeedEntries.length === 0 ? (
                <div style={{ padding: '60px 20px', textAlign: 'center' }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>🌎</div>
                  <h3 style={{ fontSize: '18px', fontWeight: '700', color: COLORS.textDark, margin: '0 0 8px 0' }}>Nothing shared yet</h3>
                  <p style={{ fontSize: '13px', color: COLORS.textMuted, margin: '0 0 24px 0' }}>Be the first to share a Q&A with your class!</p>
                  <button 
                    onClick={() => setCurrentTab('Home')}
                    style={{ backgroundColor: COLORS.primary, color: '#FFF', border: 'none', borderRadius: '12px', padding: '12px 24px', fontSize: '14px', fontWeight: '600' }}
                  >Share an Entry</button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {filteredFeedEntries.map((item, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => setSelectedEntry(item.entries)}
                      style={{
                        backgroundColor: COLORS.cardSurface,
                        borderRadius: '20px',
                        padding: '16px',
                        boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: COLORS.primaryLight, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold', color: COLORS.primary }}>
                            {item.profiles.avatar_url ? (
                              <img src={item.profiles.avatar_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                            ) : item.profiles.display_name[0].toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontSize: '14px', fontWeight: '700', color: COLORS.textDark }}>{item.profiles.display_name}</div>
                            <div style={{ fontSize: '11px', color: COLORS.textMuted }}>{getTimeAgo(item.posted_at)}</div>
                          </div>
                        </div>
                        <div style={{ backgroundColor: COLORS.primaryLight, color: COLORS.primary, padding: '2px 10px', borderRadius: '10px', fontSize: '10px', fontWeight: 'bold' }}>
                          {item.entries.subject}
                        </div>
                      </div>
                      <div style={{ fontSize: '14px', fontWeight: '700', color: COLORS.textDark, marginBottom: '8px', lineHeight: '1.4' }}>
                        {item.entries.question}
                      </div>
                      <div style={{ fontSize: '12px', color: COLORS.textPrimary, opacity: 0.8, marginBottom: '12px', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {item.entries.answer}
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #F0F2F5', paddingTop: '12px' }}>
                        <div style={{ fontSize: '11px', color: COLORS.textMuted }}>#{item.entries.chapter || 'Knowledge'}</div>
                        <div style={{ fontSize: '12px', color: COLORS.primary, fontWeight: '600' }}>View Full Answer →</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 5. NOTIFICATIONS VIEW */}
          {currentTab === 'Notifications' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: COLORS.textDark, margin: 0 }}>Notifications</h2>
                {unreadCount > 0 && (
                  <button 
                    onClick={markAllAsRead}
                    style={{ background: 'none', border: 'none', color: COLORS.primary, fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}
                  >
                    Mark all read
                  </button>
                )}
              </div>

              {notifications.length === 0 ? (
                <div style={{ padding: '80px 20px', textAlign: 'center' }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.5 }}>🔔</div>
                  <h3 style={{ fontSize: '18px', fontWeight: '700', color: COLORS.textDark, margin: '0 0 8px 0' }}>No notifications yet</h3>
                  <p style={{ fontSize: '13px', color: COLORS.textMuted, margin: 0 }}>We'll alert you when someone shares a new entry!</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {notifications.map((notif) => (
                    <div 
                      key={notif.id}
                      onClick={async () => {
                        await markAsRead(notif.id);
                        if (notif.entry_id) {
                          // Fetch entry detail and open it
                          const { data: entryData } = await supabase.from('entries').select('*').eq('id', notif.entry_id).single();
                          if (entryData) setSelectedEntry(entryData);
                        }
                      }}
                      style={{
                        backgroundColor: notif.is_read ? COLORS.cardSurface : COLORS.primaryLight,
                        borderRadius: '16px',
                        padding: '14px 16px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                        border: notif.is_read ? 'none' : `1px solid ${COLORS.primaryLight}`
                      }}
                    >
                      <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: COLORS.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                        {notif.profiles?.avatar_url ? (
                          <img src={notif.profiles.avatar_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                        ) : (
                          <span style={{ color: '#FFF', fontSize: '14px', fontWeight: 'bold' }}>
                            {(notif.profiles?.display_name || '?')[0].toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '13px', color: COLORS.textDark, lineHeight: '1.4', fontWeight: notif.is_read ? '400' : '600' }}>
                          {notif.message}
                        </div>
                        <div style={{ fontSize: '11px', color: COLORS.textMuted, marginTop: '2px' }}>
                          {getTimeAgo(notif.created_at)}
                        </div>
                      </div>
                      {!notif.is_read && (
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: COLORS.primary }}></div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 4. SEARCH BAR (Hidden on Profile or Feed) */}
          {currentTab !== 'Profile' && currentTab !== 'Feed' && (
            <div style={{ position: 'relative' }}>
              <span style={{ 
                position: 'absolute', 
                left: '20px', 
                top: '50%', 
                transform: 'translateY(-50%)', 
                color: COLORS.textMuted, 
                display: 'flex',
                alignItems: 'center'
              }}>
                <ICONS.Search />
              </span>
              <input 
                ref={searchInputRef}
                type="text" 
                placeholder="Search your questions..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  backgroundColor: COLORS.cardSurface,
                  border: 'none',
                  borderRadius: '20px',
                  padding: '16px 48px',
                  color: COLORS.textPrimary,
                  fontFamily: 'inherit',
                  fontSize: '15px',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                  boxShadow: COLORS.shadow,
                  minHeight: '56px'
                }}
                onFocus={(e) => {
                  e.target.style.boxShadow = `0 0 0 2px ${COLORS.primary}, 0 4px 16px rgba(33,150,243,0.2)`;
                }}
                onBlur={(e) => {
                  e.target.style.boxShadow = COLORS.shadow;
                }}
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  style={{
                    position: 'absolute', 
                    right: '16px', 
                    top: '50%', 
                    transform: 'translateY(-50%)',
                    background: COLORS.primaryLight,
                    borderRadius: '50%',
                    width: '24px',
                    height: '24px',
                    border: 'none', 
                    color: COLORS.primary, 
                    cursor: 'pointer',
                    fontSize: '12px', 
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold'
                  }}
                >
                  ✕
                </button>
              )}
            </div>
          )}

          {/* 4. FILTER ROW (Hidden on Profile, Review, Feed) */}
          {currentTab !== 'Profile' && currentTab !== 'Review' && currentTab !== 'Feed' && (
            <div className="hide-scrollbar" style={{
              display: 'flex',
              gap: '8px',
              overflowX: 'auto',
              paddingBottom: '4px'
            }}>
              {['All', ...SUBJECTS].map(subject => {
                const isSelected = selectedSubject === subject;
                return (
                  <button
                    key={subject}
                    onClick={() => setSelectedSubject(subject)}
                    style={{
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                      padding: '0 20px',
                      height: '36px',
                      borderRadius: '8px',
                      backgroundColor: isSelected ? COLORS.primary : COLORS.cardSurface,
                      border: isSelected ? 'none' : `1px solid ${COLORS.primary}`,
                      color: isSelected ? '#fff' : COLORS.primary,
                      fontFamily: 'inherit',
                      fontSize: '13px',
                      fontWeight: isSelected ? '600' : '500',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      outline: 'none'
                    }}
                  >
                    {subject}
                  </button>
                )
              })}
            </div>
          )}

          {/* 5. ENTRIES LIST (Hidden on Profile, Review, Feed) */}
          {currentTab !== 'Profile' && currentTab !== 'Review' && currentTab !== 'Feed' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {loading ? (
                // Skeleton shimmer
                Array(3).fill(0).map((_, i) => (
                  <div key={i} style={{
                    backgroundColor: COLORS.cardSurface,
                    borderRadius: '20px',
                    padding: '20px',
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '12px',
                    boxShadow: COLORS.shadow,
                    animation: 'shimmer 1.5s infinite linear',
                    background: `linear-gradient(90deg, ${COLORS.cardSurface} 25%, #F0F4F8 50%, ${COLORS.cardSurface} 75%)`,
                    backgroundSize: '200% 100%'
                  }}>
                    <div style={{ height: '16px', backgroundColor: '#E3E8EE', borderRadius: '4px', width: '80%' }}></div>
                    <div style={{ height: '12px', backgroundColor: '#E3E8EE', borderRadius: '4px', width: '100%', marginTop: '4px' }}></div>
                    <div style={{ height: '12px', backgroundColor: '#E3E8EE', borderRadius: '4px', width: '60%' }}></div>
                    <div style={{ display: 'flex', gap: '8px', marginTop: '8px', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <div style={{ height: '22px', width: '70px', backgroundColor: '#E3E8EE', borderRadius: '12px' }}></div>
                        <div style={{ height: '22px', width: '50px', backgroundColor: '#E3E8EE', borderRadius: '4px' }}></div>
                      </div>
                      <div style={{ height: '14px', width: '40px', backgroundColor: '#E3E8EE', borderRadius: '4px' }}></div>
                    </div>
                  </div>
                ))
              ) : fetchError ? (
                // Error State
                <div style={{
                  textAlign: 'center',
                  padding: '40px 20px',
                  backgroundColor: '#FFF0F0',
                  borderRadius: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '16px'
                }}>
                  <div style={{ fontSize: '32px' }}>⚠️</div>
                  <div style={{ color: COLORS.textDark, fontSize: '15px', fontWeight: '500' }}>
                    Could not connect. Check your internet connection.
                  </div>
                  <button
                    onClick={fetchEntries}
                    style={{
                      backgroundColor: '#FF5252',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '10px 20px',
                      fontSize: '13px',
                      fontFamily: 'inherit',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    Retry
                  </button>
                </div>
              ) : entries.length === 0 && !searchQuery ? (
                // Empty State (Vault completely empty)
                <div className="animate-fade-in-up" style={{
                  textAlign: 'center',
                  padding: '60px 20px',
                  color: COLORS.textMuted,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '16px'
                }}>
                  <div style={{ fontSize: '48px', opacity: 0.8, filter: 'grayscale(0.5)' }}>📖</div>
                  <div style={{ fontSize: '15px', lineHeight: '1.6', color: COLORS.textMuted }}>
                    Your vault is empty.<br/>Tap <span style={{color: COLORS.primary, fontWeight: 'bold'}}>{'+'}</span> to save your first answer!
                  </div>
                </div>
              ) : filteredEntries.length === 0 ? (
                // Empty State (No results)
                searchQuery.length >= 4 ? (
                  <div style={{
                    backgroundColor: COLORS.accentLight,
                    border: `2px dashed ${COLORS.accent}`,
                    borderRadius: '20px',
                    padding: '32px 20px',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '12px'
                  }}>
                    <div style={{ fontSize: '32px' }}>🔍</div>
                    <div style={{ color: COLORS.textDark, fontWeight: 'bold', fontSize: '16px' }}>
                      No saved answer found
                    </div>
                    <div style={{ color: COLORS.textBody, fontSize: '14px', lineHeight: '1.5', maxWidth: '80%' }}>
                      Ask an AI, then come back and save the refined answer
                    </div>
                    <button 
                      onClick={() => setShowAIModal(true)}
                      style={{
                        marginTop: '8px',
                        backgroundColor: COLORS.accent,
                        color: '#fff',
                        border: 'none',
                        borderRadius: '12px',
                        padding: '12px 24px',
                        fontSize: '14px',
                        fontFamily: 'inherit',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(255,152,0,0.3)'
                      }}
                    >
                      Ask AI →
                    </button>
                  </div>
                ) : (
                  <div className="animate-fade-in-up" style={{
                    textAlign: 'center',
                    padding: '60px 20px',
                    color: COLORS.textMuted,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '16px'
                  }}>
                    <div style={{ fontSize: '48px', opacity: 0.8, filter: 'grayscale(0.5)' }}>📂</div>
                    <div style={{ fontSize: '15px', lineHeight: '1.6', color: COLORS.textMuted }}>
                      No entries found.
                    </div>
                  </div>
                )
              ) : (
                // List Entries
                filteredEntries.map((entry, idx) => (
                  <div 
                    className="animate-fade-in-up"
                    key={entry.id} 
                    onClick={() => setSelectedEntry(entry)}
                    style={{
                      animationDelay: `${idx * 50}ms`,
                      backgroundColor: COLORS.cardSurface,
                      borderRadius: '20px',
                      padding: '20px',
                      cursor: 'pointer',
                      position: 'relative',
                      boxShadow: COLORS.shadow,
                      transition: 'transform 0.15s ease, box-shadow 0.15s ease'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = 'scale(1.01) translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 8px 24px rgba(33,150,243,0.15)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'scale(1) translateY(0)';
                      e.currentTarget.style.boxShadow = COLORS.shadow;
                    }}
                  >
                    <button 
                      onClick={(e) => handleToggleStar(entry, e)}
                      style={{
                        position: 'absolute', 
                        top: '18px', 
                        right: '18px',
                        background: 'none', 
                        border: 'none', 
                        padding: '4px',
                        cursor: 'pointer',
                        color: entry.starred ? COLORS.accent : COLORS.textMuted,
                        outline: 'none',
                        zIndex: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {entry.starred ? <ICONS.StarFilled /> : <ICONS.Starred />}
                    </button>
                    
                    <h3 style={{ 
                      margin: '0 0 8px 0', 
                      fontSize: '15px',
                      color: COLORS.textDark,
                      paddingRight: '32px',
                      lineHeight: '1.4',
                      fontWeight: '600',
                      letterSpacing: '-0.3px'
                    }}>
                      {entry.question}
                    </h3>
                    
                    <p style={{
                      margin: '0 0 16px 0',
                      fontSize: '13px',
                      color: COLORS.textBody,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      lineHeight: '1.6',
                      fontFamily: "'Poppins', sans-serif"
                    }}>
                      {entry.answer}
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{
                          backgroundColor: COLORS.primaryLight,
                          color: COLORS.primary,
                          padding: '4px 10px',
                          borderRadius: '8px',
                          fontSize: '11px',
                          fontWeight: '600',
                          letterSpacing: '0.2px'
                        }}>
                          {entry.subject}
                        </span>
                        {entry.chapter && (
                          <span style={{ fontSize: '12px', color: COLORS.textMuted, fontWeight: '500' }}>
                            {entry.chapter}
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '11px', color: COLORS.textMuted, fontWeight: '500' }}>
                        {new Date(entry.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* 6. REVIEW QUEUE (Visible only on Review Tab) */}
          {currentTab === 'Review' && (
            <div className="animate-fade-in-up" style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '24px' }}>
              <div style={{ textAlign: 'center', marginBottom: '8px' }}>
                <h2 style={{ margin: '0 0 8px 0', fontSize: '24px', fontWeight: '700', color: COLORS.textDark }}>Review Queue</h2>
                <p style={{ margin: 0, fontSize: '14px', color: COLORS.textMuted }}>
                  {reviewQueue.length} {reviewQueue.length === 1 ? 'entry needs' : 'entries need'} review today
                </p>
              </div>

              {reviewQueue.length === 0 ? (
                <div style={{
                  backgroundColor: COLORS.primaryLight,
                  borderRadius: '20px',
                  padding: '40px 20px',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '16px'
                }}>
                  <div style={{ fontSize: '48px' }}>🎉</div>
                  <div style={{ color: COLORS.primary, fontWeight: '700', fontSize: '18px' }}>
                    All caught up! ✓
                  </div>
                  <div style={{ color: COLORS.textPrimary, fontSize: '14px' }}>
                    Come back tomorrow for more reviews.
                  </div>
                </div>
              ) : (
                reviewQueue.map(entry => {
                  const isRevealed = revealedReviewIds.has(entry.id);
                  return (
                    <div key={entry.id} style={{
                      backgroundColor: COLORS.cardSurface,
                      borderRadius: '20px',
                      padding: '24px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '16px',
                      boxShadow: COLORS.shadow
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{
                          backgroundColor: COLORS.primaryLight,
                          color: COLORS.primary,
                          padding: '4px 10px',
                          borderRadius: '8px',
                          fontSize: '11px',
                          fontWeight: '600',
                          letterSpacing: '0.2px'
                        }}>
                          {entry.subject}
                        </span>
                        <span style={{ fontSize: '11px', color: COLORS.textMuted, fontWeight: '500' }}>
                          Reviewed {entry.review_count || 0} times
                        </span>
                      </div>

                      <h3 style={{ 
                        margin: '0', 
                        fontSize: '18px',
                        color: COLORS.textDark,
                        lineHeight: '1.4',
                        fontWeight: '600',
                        letterSpacing: '-0.3px',
                        textAlign: 'center',
                        padding: '20px 0'
                      }}>
                        {entry.question}
                      </h3>

                      {!isRevealed ? (
                        <button 
                          onClick={() => setRevealedReviewIds(prev => new Set(prev).add(entry.id))}
                          style={{
                            width: '100%',
                            backgroundColor: COLORS.primaryLight,
                            color: COLORS.primary,
                            border: 'none',
                            borderRadius: '12px',
                            padding: '16px',
                            fontSize: '15px',
                            fontWeight: '600',
                            fontFamily: 'inherit',
                            cursor: 'pointer',
                            marginTop: '8px',
                            transition: 'background-color 0.2s ease'
                          }}
                          onMouseOver={e => e.currentTarget.style.backgroundColor = '#d0e8fc'}
                          onMouseOut={e => e.currentTarget.style.backgroundColor = COLORS.primaryLight}
                        >
                          Show Answer
                        </button>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', animation: 'fadeIn 0.3s ease' }}>
                          <div style={{
                            width: '100%',
                            height: '1px',
                            borderBottom: '1px dashed #E3E8EE'
                          }}></div>
                          
                          <p style={{
                            margin: '0',
                            fontSize: '15px',
                            lineHeight: '1.8',
                            color: COLORS.textPrimary,
                            whiteSpace: 'pre-wrap'
                          }}>
                            {entry.answer}
                          </p>

                          <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                            <button 
                              onClick={() => handleReviewAgain(entry)}
                              style={{
                                flex: 1,
                                backgroundColor: COLORS.accentLight,
                                color: COLORS.accent,
                                border: 'none',
                                borderRadius: '12px',
                                padding: '14px',
                                fontSize: '14px',
                                fontWeight: '600',
                                fontFamily: 'inherit',
                                cursor: 'pointer',
                                transition: 'opacity 0.2s ease'
                              }}
                              onMouseOver={e => e.currentTarget.style.opacity = '0.8'}
                              onMouseOut={e => e.currentTarget.style.opacity = '1'}
                            >
                              Review Again
                            </button>
                            <button 
                              onClick={() => handleMarkReviewed(entry)}
                              style={{
                                flex: 1,
                                backgroundColor: '#E8F5E9',
                                color: COLORS.green,
                                border: 'none',
                                borderRadius: '12px',
                                padding: '14px',
                                fontSize: '14px',
                                fontWeight: '600',
                                fontFamily: 'inherit',
                                cursor: 'pointer',
                                transition: 'opacity 0.2s ease'
                              }}
                              onMouseOver={e => e.currentTarget.style.opacity = '0.8'}
                              onMouseOut={e => e.currentTarget.style.opacity = '1'}
                            >
                              Got it ✓
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })
              )}
            </div>
          )}
        </div>
      
      {/* DETAIL VIEW OVERLAY */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 50,
        backgroundColor: COLORS.bg,
        transform: selectedEntry ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 250ms ease-out',
        // Optional: Ensure mobile devices don't clip contents, allow vertical scroll only in overlay
        overflowY: 'auto',
        overflowX: 'hidden'
      }}>
        {/* Detail view no longer needs the complex dark pattern */}

        {selectedEntry && (
          <div style={{
            position: 'relative',
            zIndex: 1,
            maxWidth: '480px',
            margin: '0 auto',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Overlay Top Bar */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '24px 20px 16px',
              borderBottom: 'none',
              position: 'sticky',
              top: 0,
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(12px)',
              boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
            }}>
              <button 
                onClick={() => {
                  setSelectedEntry(null);
                  setShowDeleteConfirm(false);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: COLORS.textDark,
                  fontSize: '24px',
                  cursor: 'pointer',
                  padding: '8px',
                  marginLeft: '-8px',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                ←
              </button>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                  color: COLORS.primary,
                  fontSize: '11px',
                  textTransform: 'uppercase',
                  fontWeight: '700',
                  letterSpacing: '1px'
                }}>
                  {selectedEntry.subject}
                </span>
                {selectedEntry.chapter && (
                  <>
                    <span style={{ color: COLORS.textMuted, fontSize: '10px' }}>•</span>
                    <span style={{ color: COLORS.textMuted, fontSize: '11px', fontWeight: '500' }}>
                      {selectedEntry.chapter}
                    </span>
                  </>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {(selectedEntry.user_id === user.id) && (
                  <button 
                    onClick={() => setShowDeleteConfirm(true)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#FF5252',
                      fontSize: '16px',
                      cursor: 'pointer',
                      padding: '8px',
                    }}
                  >
                    🗑️
                  </button>
                )}
                <button 
                  onClick={() => handleToggleStar(selectedEntry)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: selectedEntry.starred ? COLORS.accent : COLORS.textMuted,
                    cursor: 'pointer',
                    padding: '8px',
                    marginRight: '-8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {selectedEntry.starred ? <ICONS.StarFilled /> : <ICONS.Starred />}
                </button>
              </div>
            </div>

            {/* Shared By info (if not owner) */}
            {selectedEntry.user_id !== user.id && (
              <div style={{ padding: '4px 20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ backgroundColor: COLORS.primaryLight, padding: '4px 10px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '10px', color: COLORS.primary, fontWeight: '700' }}>SHARED BY</span>
                  <div style={{ width: '18px', height: '18px', borderRadius: '50%', backgroundColor: COLORS.primary, color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '8px', fontWeight: 'bold', overflow: 'hidden' }}>
                    {/* Note: we might not have profiles info in selectedEntry if it came from Home tab, but for shared entries via Feed it might be there */}
                    {/* Actually handleFeedCard sets selectedEntry to item.entries. We should probably pass the whole item? */}
                    {/* For now, just show a generic icon or initials if possible */}
                    🌎
                  </div>
                </div>
              </div>
            )}

            {/* Scrollable Content */}
            <div style={{ padding: '32px 20px', display: 'flex', flexDirection: 'column', gap: '24px', flex: 1 }}>
              
              {/* Delete Confirmation Box */}
              {showDeleteConfirm && (
                <div style={{
                  backgroundColor: '#FFF0F0',
                  borderRadius: '16px',
                  padding: '16px',
                  marginBottom: '8px'
                }}>
                  <p style={{ margin: '0 0 12px 0', fontSize: '13px', color: '#D32F2F', fontWeight: '500' }}>
                    Delete this entry? This cannot be undone.
                  </p>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                    <button 
                      onClick={() => setShowDeleteConfirm(false)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: COLORS.textMuted,
                        padding: '8px 16px',
                        borderRadius: '8px',
                        fontSize: '13px',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleDelete}
                      disabled={isDeleting}
                      style={{
                        background: '#FF5252',
                        border: 'none',
                        color: '#fff',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        fontSize: '13px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        opacity: isDeleting ? 0.7 : 1
                      }}
                    >
                      {isDeleting ? <span className="spinner"></span> : 'Delete'}
                    </button>
                  </div>
                </div>
              )}

              {/* Question Section */}
              <div>
                <div style={{ 
                  fontSize: '11px', 
                  color: COLORS.textMuted, 
                  letterSpacing: '1px', 
                  marginBottom: '10px',
                  fontWeight: '600'
                }}>
                  QUESTION
                </div>
                <h1 style={{ 
                  fontSize: '18px', 
                  color: COLORS.textDark,
                  lineHeight: '1.5',
                  margin: 0,
                  fontWeight: '600',
                  letterSpacing: '-0.2px'
                }}>
                  {selectedEntry.question}
                </h1>
              </div>

              {/* Decorative Divider */}
              <div style={{
                width: '40px',
                height: '4px',
                borderRadius: '2px',
                backgroundColor: COLORS.primaryLight,
                margin: '8px 0'
              }} />

              {/* Answer Section */}
              <div>
                <div style={{ 
                  fontSize: '11px', 
                  color: COLORS.textMuted, 
                  letterSpacing: '1px', 
                  marginBottom: '10px',
                  fontWeight: '600'
                }}>
                  YOUR ANSWER
                </div>
                <div style={{
                  backgroundColor: COLORS.bg,
                  borderRadius: '20px',
                  padding: '24px'
                }}>
                  <p className="answer-text" style={{
                    margin: 0,
                    fontSize: '15px',
                    lineHeight: '1.8',
                    color: COLORS.textBody,
                    whiteSpace: 'pre-wrap'
                  }}>
                    {selectedEntry.answer}
                  </p>
                </div>

                {/* Share to Feed Button (Owner Only) */}
                {selectedEntry.user_id === user.id && (
                  <div style={{ marginTop: '20px' }}>
                    {selectedEntry.is_public ? (
                      <button
                        onClick={() => handleRemoveFromFeed(selectedEntry)}
                        disabled={isSharing}
                        style={{
                          width: '100%',
                          backgroundColor: 'transparent',
                          color: '#FF5252',
                          border: '1.5px solid #FF5252',
                          borderRadius: '12px',
                          padding: '12px',
                          fontSize: '13px',
                          fontWeight: '600',
                          fontFamily: 'inherit',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px'
                        }}
                      >
                        {isSharing ? <span className="spinner"></span> : 'Remove from Class Feed'}
                      </button>
                    ) : (
                      <button
                        onClick={() => handleShareToFeed(selectedEntry)}
                        disabled={isSharing}
                        style={{
                          width: '100%',
                          backgroundColor: 'transparent',
                          color: COLORS.primary,
                          border: `1.5px solid ${COLORS.primary}`,
                          borderRadius: '12px',
                          padding: '12px',
                          fontSize: '13px',
                          fontWeight: '600',
                          fontFamily: 'inherit',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px'
                        }}
                      >
                        {isSharing ? <span className="spinner"></span> : 'Share to Class Feed 🌎'}
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Image below answer, if present */}
              {selectedEntry.image_url && (
                <div style={{ marginTop: '16px' }}>
                  <img
                    src={selectedEntry.image_url}
                    alt="Attached"
                    onClick={() => setShowLightbox(true)}
                    style={{
                      width: '100%',
                      maxHeight: '200px',
                      borderRadius: '12px',
                      objectFit: 'cover',
                      cursor: 'zoom-in',
                      display: 'block',
                      boxShadow: COLORS.shadow
                    }}
                  />
                  <div style={{ fontSize: '11px', color: COLORS.textMuted, textAlign: 'center', marginTop: '6px' }}>
                    Tap to view full screen
                  </div>
                </div>
              )}
              {/* Tags Row */}
              {selectedEntry.tags && selectedEntry.tags.length > 0 && (
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
                  {(Array.isArray(selectedEntry.tags) ? selectedEntry.tags : String(selectedEntry.tags).split(',').map(s=>s.trim())).filter(Boolean).map((tag, idx) => (
                    <span key={idx} style={{
                      color: COLORS.primary,
                      backgroundColor: COLORS.primaryLight,
                      padding: '6px 14px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}>
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              <div style={{ flex: 1 }} /> {/* Spacer */}

              {/* Footer */}
              <div style={{
                textAlign: 'center',
                color: COLORS.textMuted,
                fontSize: '11px',
                letterSpacing: '0.5px',
                marginTop: '32px'
              }}>
                Saved on {new Date(selectedEntry.created_at).toLocaleString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>

            </div>
          </div>
        )}
      </div>

      {/* IMAGE LIGHTBOX */}
      {showLightbox && selectedEntry?.image_url && (
        <div
          onClick={() => setShowLightbox(false)}
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.95)',
            zIndex: 500,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            cursor: 'zoom-out'
          }}
        >
          <button
            onClick={() => setShowLightbox(false)}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              backgroundColor: 'rgba(255,255,255,0.15)',
              color: '#fff',
              border: 'none',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              fontSize: '20px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              lineHeight: '1'
            }}
          >
            ×
          </button>
          <img
            src={selectedEntry.image_url}
            alt="Full screen"
            onClick={e => e.stopPropagation()}
            style={{
              maxWidth: '100%',
              maxHeight: '90vh',
              borderRadius: '16px',
              objectFit: 'contain',
              boxShadow: '0 8px 40px rgba(0,0,0,0.5)'
            }}
          />
        </div>
      )}

      {/* ADD ENTRY OVERLAY */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 60,
        backgroundColor: COLORS.bg,
        transform: showAddEntry ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 250ms ease-out',
        overflowY: 'auto',
        overflowX: 'hidden'
      }}>
        {/* Repeating background pattern for overlay not needed for Light theme */}

        <div style={{
            position: 'relative',
            zIndex: 1,
            maxWidth: '480px',
            margin: '0 auto',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column'
        }}>
          {/* Add Entry Header & Progress */}
          <div style={{
            padding: '24px 20px 16px',
            borderBottom: 'none',
            position: 'sticky',
            top: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(12px)',
            zIndex: 2,
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <button 
                onClick={() => {
                  if (addStep === 2) {
                    setAddStep(1);
                  } else {
                    setShowAddEntry(false);
                    setTimeout(() => {
                      setFormQuestion('');
                      setFormSubject(SUBJECTS[0]);
                      setFormChapter('');
                      setFormAnswer('');
                      setFormTags('');
                      setAddStep(1);
                    }, 300);
                  }
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: COLORS.textDark,
                  fontSize: '24px',
                  cursor: 'pointer',
                  padding: '8px',
                  marginLeft: '-8px',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                ←
              </button>
              <div style={{ 
                color: COLORS.textDark, 
                fontSize: '16px', 
                fontWeight: '700',
                letterSpacing: '-0.3px'
              }}>
                {addStep === 1 ? 'New Question' : 'The Answer'}
              </div>
              <div style={{ width: '36px' }}></div>
            </div>

            {/* Progress Bar */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <div style={{ flex: 1, height: '4px', borderRadius: '2px', backgroundColor: COLORS.primary }}></div>
              <div style={{ flex: 1, height: '4px', borderRadius: '2px', backgroundColor: addStep === 2 ? COLORS.primary : COLORS.bg }}></div>
            </div>
          </div>

          {/* Form Content Area */}
          <div style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: '24px', flex: 1 }}>
            
            {addStep === 1 ? (
              // STEP 1 CONTENT
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', animation: 'fadeIn 0.3s ease' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: COLORS.textMuted, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    Question
                  </label>
                  <textarea 
                    value={formQuestion}
                    onChange={(e) => setFormQuestion(e.target.value)}
                    placeholder="What question came up while studying?"
                    rows="5"
                    style={{
                      width: '100%',
                      backgroundColor: COLORS.bg,
                      border: 'none',
                      borderRadius: '16px',
                      padding: '16px',
                      color: COLORS.textDark,
                      fontFamily: 'inherit',
                      fontSize: '15px',
                      lineHeight: '1.5',
                      outline: 'none',
                      resize: 'none',
                      boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)'
                    }}
                    onFocus={(e) => { e.target.style.boxShadow = `0 0 0 2px ${COLORS.primary}`; }}
                    onBlur={(e) => { e.target.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.02)'; }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: COLORS.textMuted, marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    Subject
                  </label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {SUBJECTS.map(sub => (
                      <button
                        key={sub}
                        onClick={() => setFormSubject(sub)}
                        style={{
                          padding: '8px 16px',
                          borderRadius: '20px',
                          backgroundColor: formSubject === sub ? COLORS.primary : COLORS.bg,
                          border: 'none',
                          color: formSubject === sub ? '#fff' : COLORS.textBody,
                          fontFamily: 'inherit',
                          fontSize: '13px',
                          fontWeight: formSubject === sub ? '600' : '500',
                          cursor: 'pointer',
                          outline: 'none',
                          transition: 'all 0.2s ease',
                          boxShadow: formSubject === sub ? '0 4px 12px rgba(33,150,243,0.3)' : 'none'
                        }}
                      >
                        {sub}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: COLORS.textMuted, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    Chapter (Optional)
                  </label>
                  <input 
                    type="text"
                    value={formChapter}
                    onChange={(e) => setFormChapter(e.target.value)}
                    placeholder="e.g. Acids, Bases and Salts"
                    style={{
                      width: '100%',
                      backgroundColor: COLORS.bg,
                      border: 'none',
                      borderRadius: '16px',
                      padding: '16px',
                      color: COLORS.textDark,
                      fontFamily: 'inherit',
                      fontSize: '14px',
                      outline: 'none',
                      boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)'
                    }}
                    onFocus={(e) => { e.target.style.boxShadow = `0 0 0 2px ${COLORS.primary}`; }}
                    onBlur={(e) => { e.target.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.02)'; }}
                  />
                </div>

                <div style={{ flex: 1 }} />

                <button
                  onClick={() => {
                    if (!formQuestion.trim()) {
                      showToast("Please enter a question first.", "error");
                      return;
                    }
                    setAddStep(2);
                  }}
                  style={{
                    width: '100%',
                    backgroundColor: COLORS.primary,
                    color: '#fff',
                    border: 'none',
                    borderRadius: '16px',
                    padding: '16px',
                    fontSize: '15px',
                    fontFamily: 'inherit',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    marginTop: '20px',
                    boxShadow: '0 4px 16px rgba(33,150,243,0.3)'
                  }}
                >
                  Next: Add Answer →
                </button>
              </div>
            ) : (
              // STEP 2 CONTENT
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', animation: 'fadeIn 0.3s ease', flex: 1 }}>
                
                {/* Quote Box */}
                <div style={{
                  backgroundColor: COLORS.primaryLight,
                  borderLeft: `3px solid ${COLORS.primary}`,
                  padding: '16px',
                  borderRadius: '0 12px 12px 0'
                }}>
                  <p style={{ margin: 0, fontSize: '14px', color: COLORS.textDark, lineHeight: '1.5', fontWeight: '500' }}>
                    "{formQuestion}"
                  </p>
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: COLORS.textMuted, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    Answer
                  </label>
                  <textarea 
                    value={formAnswer}
                    onChange={(e) => setFormAnswer(e.target.value)}
                    placeholder="Paste your refined answer here..."
                    rows="8"
                    style={{
                      width: '100%',
                      backgroundColor: COLORS.bg,
                      border: 'none',
                      borderRadius: '16px',
                      padding: '16px',
                      color: COLORS.textDark,
                      fontFamily: 'inherit',
                      fontSize: '14px',
                      lineHeight: '1.6',
                      outline: 'none',
                      resize: 'none',
                      flex: 1,
                      boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)'
                    }}
                    onFocus={(e) => { e.target.style.boxShadow = `0 0 0 2px ${COLORS.primary}`; }}
                    onBlur={(e) => { e.target.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.02)'; }}
                  />
                  <div style={{ fontSize: '11px', color: COLORS.textMuted, marginTop: '8px', fontStyle: 'italic' }}>
                    Write in your own words for best memory
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: COLORS.textMuted, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    Tags (Optional)
                  </label>
                  <input 
                    type="text"
                    value={formTags}
                    onChange={(e) => setFormTags(e.target.value)}
                    placeholder="e.g. photosynthesis, chapter-6 (comma separated)"
                    style={{
                      width: '100%',
                      backgroundColor: COLORS.bg,
                      border: 'none',
                      borderRadius: '16px',
                      padding: '16px',
                      color: COLORS.textDark,
                      fontFamily: 'inherit',
                      fontSize: '13px',
                      outline: 'none',
                      boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)'
                    }}
                    onFocus={(e) => { e.target.style.boxShadow = `0 0 0 2px ${COLORS.primary}`; }}
                    onBlur={(e) => { e.target.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.02)'; }}
                  />
                </div>

                {/* Attach Photo Section */}
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: COLORS.textMuted, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    Photo (Optional)
                  </label>
                  {imagePreview ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <img
                        src={imagePreview}
                        alt="Preview"
                        style={{ width: '80px', height: '80px', borderRadius: '12px', objectFit: 'cover', boxShadow: COLORS.shadow }}
                      />
                      <button
                        onClick={() => { setImageFile(null); setImagePreview(null); }}
                        style={{
                          backgroundColor: '#FFEBEE',
                          color: '#F44336',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '8px 16px',
                          fontFamily: 'inherit',
                          fontSize: '13px',
                          fontWeight: '600',
                          cursor: 'pointer'
                        }}
                      >
                        × Remove
                      </button>
                    </div>
                  ) : (
                    <label style={{ cursor: 'pointer', display: 'block' }}>
                      <div style={{
                        border: `2px dashed ${COLORS.primary}`,
                        borderRadius: '16px',
                        height: '120px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'column',
                        gap: '8px',
                        color: COLORS.primary,
                        fontSize: '14px',
                        fontWeight: '500',
                        transition: 'background-color 0.2s ease'
                      }}
                      onMouseOver={e => e.currentTarget.style.backgroundColor = COLORS.primaryLight}
                      onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <span style={{ fontSize: '28px' }}>📷</span>
                        <span>Tap to attach a photo</span>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        style={{ display: 'none' }}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setImageFile(file);
                            setImagePreview(URL.createObjectURL(file));
                          }
                        }}
                      />
                    </label>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                  <button
                    onClick={() => setAddStep(1)}
                    style={{
                      width: '40%',
                      backgroundColor: COLORS.bg,
                      color: COLORS.textDark,
                      border: 'none',
                      borderRadius: '16px',
                      padding: '16px',
                      fontSize: '15px',
                      fontFamily: 'inherit',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    ← Back
                  </button>
                  <button
                    onClick={handleSaveEntry}
                    disabled={isSaving}
                    style={{
                      width: '60%',
                      backgroundColor: COLORS.primary,
                      color: '#fff',
                      border: 'none',
                      borderRadius: '16px',
                      padding: '16px',
                      fontSize: '15px',
                      fontFamily: 'inherit',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      opacity: isSaving ? 0.7 : 1,
                      boxShadow: '0 4px 16px rgba(33,150,243,0.3)'
                    }}
                  >
                    {isSaving ? (
                      <div style={{display:'flex', alignItems:'center', justifyContent:'center', gap:'8px'}}>
                        <span className="spinner"></span> Saving...
                      </div>
                    ) : 'Save to Vault ✓'}
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* ASK AI BOTTOM SHEET MODAL */}
      <div style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.8)',
        zIndex: 100,
        opacity: showAIModal ? 1 : 0,
        pointerEvents: showAIModal ? 'auto' : 'none',
        transition: 'opacity 300ms ease',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end'
      }}>
        <div style={{
          backgroundColor: COLORS.cardSurface,
          borderTopLeftRadius: '24px',
          borderTopRightRadius: '24px',
          padding: '24px',
          transform: showAIModal ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 300ms ease',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          paddingBottom: 'max(24px, env(safe-area-inset-bottom))'
        }}>
          {/* Quote box */}
          <div style={{
            backgroundColor: COLORS.bg,
            borderLeft: `3px solid ${COLORS.accent}`,
            borderRadius: '0 8px 8px 0',
            padding: '16px',
            color: COLORS.textDark,
            fontStyle: 'italic',
            fontSize: '15px',
            lineHeight: '1.5',
            wordBreak: 'break-word',
            fontWeight: '500'
          }}>
            "{searchQuery}"
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { name: 'ChatGPT', color: '#10a37f', url: 'https://chat.openai.com/?q=' },
              { name: 'Claude', color: '#c96442', url: 'https://claude.ai/new?q=' },
              { name: 'Gemini', color: '#4285f4', url: 'https://gemini.google.com/app?q=' },
              { name: 'Perplexity', color: '#20b2aa', url: 'https://www.perplexity.ai/search?q=' },
            ].map(ai => (
              <button
                key={ai.name}
                onClick={() => {
                  window.open(ai.url + encodeURIComponent(searchQuery), '_blank');
                  setShowAIModal(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: COLORS.bg,
                  border: 'none',
                  borderRadius: '16px',
                  padding: '16px',
                  cursor: 'pointer',
                  color: COLORS.textDark,
                  fontFamily: 'inherit',
                  fontSize: '16px',
                  fontWeight: '600',
                  transition: 'background-color 0.2s ease',
                  outline: 'none'
                }}
                onMouseOver={e => e.currentTarget.style.backgroundColor = '#E3E8EE'}
                onMouseOut={e => e.currentTarget.style.backgroundColor = COLORS.bg}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: ai.color }} />
                  {ai.name}
                </div>
                <div style={{ color: COLORS.textMuted }}>→</div>
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowAIModal(false)}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              color: COLORS.textMuted,
              padding: '12px',
              fontSize: '15px',
              fontWeight: '600',
              fontFamily: 'inherit',
              cursor: 'pointer',
              marginTop: '4px'
            }}
          >
            Cancel
          </button>
        </div>
      </div>

      {/* BOTTOM NAVIGATION BAR */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: '480px',
        backgroundColor: COLORS.cardSurface,
        borderTop: `1px solid #E3E8EE`,
        display: 'flex',
        justifyContent: 'space-around',
        padding: '12px 20px max(12px, env(safe-area-inset-bottom))',
        zIndex: 40,
        boxShadow: '0 -4px 16px rgba(0,0,0,0.05)'
      }}>
        {[
           { id: 'Home', icon: ICONS.Home },
          { id: 'Feed', icon: ICONS.Feed },
          { id: 'Notifs', icon: ICONS.Bell, badge: unreadCount },
          { id: 'Add', icon: () => <span style={{ fontSize: '24px', lineHeight: '1', fontWeight: '300' }}>+</span>, isAction: true },
          { id: 'Review', icon: ICONS.Review, badge: reviewQueue.length },
          { id: 'Search', icon: ICONS.Search },
          { id: 'Profile', icon: ICONS.Profile }
        ].map(tab => {
          if (tab.isAction) {
            return (
              <div key={tab.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start' }}>
                <button
                  onClick={() => setShowAddEntry(true)}
                  style={{
                    backgroundColor: COLORS.primary,
                    border: 'none',
                    width: '56px',
                    height: '56px',
                    borderRadius: '28px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: '#fff',
                    boxShadow: '0 8px 24px rgba(33,150,243,0.3)',
                    transform: 'translateY(-20px)',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-22px) scale(1.05)';
                    e.currentTarget.style.boxShadow = '0 12px 28px rgba(33,150,243,0.4)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(-20px) scale(1)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(33,150,243,0.3)';
                  }}
                >
                  <tab.icon />
                </button>
              </div>
            );
          }

          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setCurrentTab(tab.id);
                if (tab.id === 'Search') {
                  setTimeout(() => searchInputRef.current?.focus(), 100);
                }
              }}
              style={{
                background: 'none',
                border: 'none',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                color: isActive ? COLORS.primary : COLORS.textMuted,
                cursor: 'pointer',
                fontFamily: "'Poppins', sans-serif",
                flex: 1
              }}
            >
              <div style={{
                padding: '8px 20px',
                borderRadius: '20px',
                backgroundColor: isActive ? COLORS.primaryLight : 'transparent',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative'
              }}>
                <tab.icon />
                {tab.badge > 0 && (
                  <div style={{
                    position: 'absolute',
                    top: '2px',
                    right: '8px',
                    backgroundColor: '#FF5252',
                    color: '#FFF',
                    fontSize: '10px',
                    fontWeight: 'bold',
                    borderRadius: '10px',
                    minWidth: '16px',
                    height: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    lineHeight: '1',
                    boxShadow: '0 2px 4px rgba(255,82,82,0.3)',
                    padding: '0 4px',
                    zIndex: 2
                  }}>
                    {tab.badge}
                  </div>
                )}
              </div>
              <span style={{ fontSize: '11px', fontWeight: isActive ? '600' : '500' }}>
                {tab.id}
              </span>
            </button>
          )
        })}
      </div>

      {/* CLERK USER PROFILE SETTINGS OVERLAY */}
      {showClerkSettings && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }} onClick={() => setShowClerkSettings(false)}>
          <div style={{ 
            backgroundColor: '#FFF', 
            borderRadius: '24px', 
            width: '100%', 
            maxWidth: '1000px', 
            maxHeight: '90vh', 
            overflow: 'auto',
            position: 'relative'
          }} onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setShowClerkSettings(false)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                zIndex: 101,
                background: COLORS.bg,
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >✕</button>
            <UserProfile routing="hash" />
          </div>
        </div>
      )}

      {/* SIGN OUT CONFIRMATION OVERLAY */}
      {showSignOutConfirm && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }} onClick={() => setShowSignOutConfirm(false)}>
          <div style={{
            backgroundColor: '#FFF',
            borderRadius: '24px',
            padding: '32px 24px',
            width: '100%',
            maxWidth: '320px',
            textAlign: 'center',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
          }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🚪</div>
            <h3 style={{ fontSize: '20px', fontWeight: '700', color: COLORS.textDark, margin: '0 0 12px 0' }}>Sign Out?</h3>
            <p style={{ fontSize: '14px', color: COLORS.textMuted, margin: '0 0 24px 0', lineHeight: '1.5' }}>
              Are you sure you want to sign out of StudyVault?
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button 
                onClick={() => signOut()}
                style={{
                  backgroundColor: '#FF5252',
                  color: '#FFF',
                  border: 'none',
                  borderRadius: '16px',
                  padding: '14px',
                  fontSize: '15px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >Sign Out</button>
              <button 
                onClick={() => setShowSignOutConfirm(false)}
                style={{
                  backgroundColor: 'transparent',
                  color: COLORS.textMuted,
                  border: 'none',
                  borderRadius: '16px',
                  padding: '14px',
                  fontSize: '15px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >Stay Logged In</button>
            </div>
          </div>
        </div>
      )}
      </div>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}
