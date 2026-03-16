import { useState, useEffect, useCallback, useRef } from 'react';

import { 
  Home, 
  Rss, 
  Plus, 
  Bell, 
  User, 
  BookOpen, 
  Search, 
  Trash2, 
  Camera, 
  Share2, 
  Lock, 
  Check, 
  Settings, 
  Pencil, 
  Globe, 
  RefreshCw, 
  ArrowLeft, 
  X, 
  Lightbulb, 
  Star,
  ChevronUp,
  Award,
  ChevronRight,
  LogOut,
  BellOff,
  Moon,
  AlertTriangle,
  FolderOpen
} from 'lucide-react';

import { 
  SignedIn, 
  SignedOut, 
  RedirectToSignIn, 
  useUser, 
  useClerk, 
  UserProfile 
} from '@clerk/clerk-react';
import { useSupabase } from './hooks/useSupabase';
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
  Home: (props) => <Home size={20} strokeWidth={1.8} {...props} />,
  Starred: (props) => <Star size={20} strokeWidth={1.8} {...props} />,
  Search: (props) => <Search size={20} strokeWidth={1.8} {...props} />,
  Profile: (props) => <User size={20} strokeWidth={1.8} {...props} />,
  Review: (props) => <RefreshCw size={20} strokeWidth={1.8} {...props} />,
  Feed: (props) => <Rss size={20} strokeWidth={1.8} {...props} />,
  StarFilled: (props) => <Star size={20} strokeWidth={1.8} fill="currentColor" {...props} />,
  Bell: (props) => <Bell size={20} strokeWidth={1.8} {...props} />,
  Upvote: (props) => <ChevronUp size={18} strokeWidth={2.5} {...props} />,
  Best: (props) => <Award size={18} strokeWidth={1.8} {...props} />,
  Trash: (props) => <Trash2 size={16} strokeWidth={1.8} {...props} />,
  Plus: (props) => <Plus size={16} strokeWidth={1.8} {...props} />,
  Check: (props) => <Check size={16} strokeWidth={1.8} {...props} />,
  Book: (props) => <BookOpen size={16} strokeWidth={1.8} {...props} />,
  Lock: (props) => <Lock size={16} strokeWidth={1.8} {...props} />,
  Share: (props) => <Share2 size={16} strokeWidth={1.8} {...props} />,
  Camera: (props) => <Camera size={16} strokeWidth={1.8} {...props} />,
  Settings: (props) => <Settings size={16} strokeWidth={1.8} {...props} />,
  Edit: (props) => <Pencil size={16} strokeWidth={1.8} {...props} />,
  Globe: (props) => <Globe size={16} strokeWidth={1.8} {...props} />,
  Back: (props) => <ArrowLeft size={16} strokeWidth={1.8} {...props} />,
  Close: (props) => <X size={16} strokeWidth={1.8} {...props} />,
  Idea: (props) => <Lightbulb size={16} strokeWidth={1.8} {...props} />,
  ChevronRight: (props) => <ChevronRight size={18} strokeWidth={1.8} {...props} />,
  LogOut: (props) => <LogOut size={20} strokeWidth={1.8} {...props} />,
  BellOff: (props) => <BellOff size={20} strokeWidth={1.8} {...props} />,
  Moon: (props) => <Moon size={20} strokeWidth={1.8} {...props} />,
  Alert: (props) => <AlertTriangle size={36} strokeWidth={1.8} {...props} />,
  Folder: (props) => <FolderOpen size={36} strokeWidth={1.8} {...props} />
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
      padding: '16px',
      borderBottom: '1px solid #F0F2F5',
      cursor: (hasToggle || isTheme) ? 'default' : 'pointer',
      backgroundColor: '#FFF',
      width: '100%'
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
      <span style={{ color: isDestructive ? '#FF5252' : COLORS.primary }}>
        {typeof icon === 'string' ? icon : icon({ size: 20 })}
      </span>
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
      <span style={{ color: COLORS.textMuted }}><ICONS.ChevronRight /></span>
    )}
  </div>
);

const LongText = ({ text, limit = 300 }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const shouldCollapse = text.length > limit;

  return (
    <div style={{ wordBreak: 'break-word', overflowWrap: 'anywhere', whiteSpace: 'pre-wrap' }}>
      <p style={{ margin: 0, fontSize: '15px', lineHeight: '1.8', color: COLORS.textBody }}>
        {isExpanded || !shouldCollapse ? text : `${text.substring(0, limit)}...`}
      </p>
      {shouldCollapse && (
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          style={{ background: 'none', border: 'none', color: COLORS.primary, fontSize: '13px', fontWeight: 'bold', cursor: 'pointer', padding: '4px 0', marginTop: '4px' }}
        >
          {isExpanded ? 'Read Less' : 'Read More'}
        </button>
      )}
    </div>
  );
};

export default function App() {
  const { isLoaded, isSignedIn, user } = useUser();
  const { signOut } = useClerk();
  const { supabase, isReady } = useSupabase();

  // rest of your code

  
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
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  
  // Notifications State
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  
  const searchInputRef = useRef(null);
  
  // Answers State
  const [answers, setAnswers] = useState([]);
  const [answersLoading, setAnswersLoading] = useState(false);
  const [newAnswer, setNewAnswer] = useState('');
  const [isSubmittingAnswer, setIsSubmittingAnswer] = useState(false);
  const [isAnswerFormOpen, setIsAnswerFormOpen] = useState(false);
  
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
  
  const showToast = useCallback((message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 2500);
  }, []);

  const fetchEntries = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setFetchError(false);
    try {
      const db = supabase;
      const { data, error } = await db
        .from('entries')
        .select('id, user_id, question, answer, subject, chapter, tags, starred, review_count, last_reviewed, created_at, image_url, is_public')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setEntries(data || []);
    } catch (err) {
      console.error('Fetch entries error:', err);
      setFetchError(true);
    } finally {
      setLoading(false);
    }
  }, [user, supabase]);


  const notifyAllUsers = useCallback(async (fromUserId, entryId, message, type = 'new_feed_post') => {
    if (!fromUserId) return; // CRITICAL: prevent sending if user ID is undefined
    try {
      const db = supabase;
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
    } catch (err) {
      console.error('Notify users error:', err);
    }
  }, [supabase]);

  // Profile Sync
  const fetchProfile = useCallback(async () => {
    if (!user) return;
    try {
      const db = supabase;
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
    } catch (err) {
      console.error('Fetch profile error:', err);
    }
  }, [user, supabase, notifyAllUsers]);


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
      const db = supabase;
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
      
      const updatedEntry = { ...entry, is_public: true };
      setSelectedEntry(updatedEntry);
      setEntries(prev => prev.map(e => e.id === entry.id ? updatedEntry : e));
      if (currentTab === 'Feed') await fetchFeed();
    } catch (err) {
      console.error('Share to feed error:', err);
      showToast('Failed to share. Try again.', 'error');
    } finally {
      setIsSharing(false);
    }
  };


  const handleRemoveFromFeed = async (entry) => {
    if (!user) return;
    setIsSharing(true);
    try {
      const db = supabase;
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
      if (currentTab === 'Feed') await fetchFeed();
    } catch (err) {
      console.error('Remove from feed error:', err);
      showToast('Failed to remove. Try again.', 'error');
    } finally {
      setIsSharing(false);
    }
  };


  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      showToast('Notifications not supported in this browser.', 'info');
      return;
    }
    if (Notification.permission === 'granted') {
      setSvNotifs(true);
      localStorage.setItem('sv_notifs_enabled', 'true');
      return;
    }
    if (Notification.permission === 'denied') {
      showToast('Notifications blocked. Enable in browser settings.', 'info');
      return;
    }
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      showToast('✓ Notifications enabled!', 'success');
      setSvNotifs(true);
      localStorage.setItem('sv_notifs_enabled', 'true');
    } else if (permission === 'denied') {
      showToast('Notifications blocked by browser.', 'info');
    }
  };

  const sendTestNotification = async () => {
    if (!user) return;
    showToast('Sending test notification...', 'info');
    try {
      const db = supabase;
      await db.from('notifications').insert({
        user_id: user.id,
        from_user_id: user.id,
        type: 'test',
        message: 'This is a test notification from StudyVault! 📚',
        is_read: false
      });
    } catch (err) {
      console.error('Test notification error:', err);
      showToast('Test failed.', 'error');
    }
  };



  const fetchUnreadCount = useCallback(async () => {
    if (!user) return;
    try {
      const db = supabase;
      const { count } = await db
        .from('notifications')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('is_read', false);
      setUnreadCount(count || 0);
    } catch (err) { console.error('Fetch unread count error:', err); }
  }, [user, supabase]);


  const fetchNotifications = useCallback(async () => {
    if (!user) return;
    try {
      const db = supabase;
      const { data } = await db
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);
      setNotifications(data || []);
    } catch (err) { console.error('Fetch notifications error:', err); }
  }, [user, supabase]);


  const markAllAsRead = useCallback(async () => {
    if (!user) return;
    
    console.log("Marking all notifications as read for user:", user.id);
    
    // Optimistic UI update
    setUnreadCount(0);
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    
    try {
      const db = supabase;
      const { error } = await db.from('notifications').update({ is_read: true })
        .eq('user_id', user.id).eq('is_read', false);
        
      if (error) {
        console.error("Failed to mark notifications as read:", error.message);
        // Revert by fetching fresh instead of manually reverting to potentially stale state
        fetchNotifications();
        if (typeof fetchUnreadCount === 'function') fetchUnreadCount();
      } else {
        console.log("Successfully marked notifications as read in Supabase.");
      }
    } catch (err) { 
      console.error('Mark all read error:', err);
      fetchNotifications();
      if (typeof fetchUnreadCount === 'function') fetchUnreadCount();
    }
  }, [user, supabase, fetchNotifications, fetchUnreadCount]);


  const markAsRead = async (notifId) => {
    try {
      const notif = notifications.find(n => n.id === notifId);
      if (notif && !notif.is_read) {
        const db = supabase;
        await db.from('notifications').update({ is_read: true }).eq('id', notifId);
        setNotifications(prev => prev.map(n => n.id === notifId ? { ...n, is_read: true } : n));
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (err) { console.error('Mark read error:', err); }
  };


  const fetchMemberCount = useCallback(async () => {
    try {
      const db = supabase;
      const { count } = await db
        .from('profiles')
        .select('user_id', { count: 'exact', head: true });
      setMemberCount(count || 0);
    } catch (err) { console.error('Fetch member count error:', err); }
  }, [supabase]);


  const fetchFeed = useCallback(async () => {
    try {
      const db = supabase;
      const { data } = await db
        .from('class_feed')
        .select('posted_at, user_id, entry_id, entries!inner(id, question, answer, subject, chapter, tags, image_url, user_id, is_public), profiles!inner(display_name, avatar_url)')
        .order('posted_at', { ascending: false })
        .limit(50);
      
      // Filter out duplicates by entry_id
      const uniqueData = [];
      const seenIds = new Set();
      (data || []).forEach(item => {
        if (!seenIds.has(item.entry_id)) {
          seenIds.add(item.entry_id);
          uniqueData.push(item);
        }
      });

      setFeedEntries(uniqueData);
    } catch (err) { console.error('Fetch feed error:', err); }
  }, [supabase]);

  const fetchAnswers = useCallback(async (entryId) => {
    if (!entryId) return;
    setAnswersLoading(true);
    try {
      const db = supabase;
      const { data, error } = await db
        .from('answers')
        .select(`
          *,
          profiles:user_id(display_name, avatar_url),
          votes:answer_votes(user_id, vote_type)
        `)
        .eq('entry_id', entryId);
      
      if (error) throw error;
      
      const processed = (data || []).map(ans => {
        const score = (ans.votes || []).reduce((acc, v) => acc + v.vote_type, 0);
        const userVote = ans.votes?.find(v => v.user_id === user.id)?.vote_type || 0;
        return {
          ...ans,
          score,
          user_vote: userVote
        };
      });
 
      const sorted = processed.sort((a, b) => {
        if (a.is_best_answer) return -1;
        if (b.is_best_answer) return 1;
        if (b.score !== a.score) return b.score - a.score;
        return new Date(b.created_at) - new Date(a.created_at);
      });

      setAnswers(sorted);
    } catch (err) {
      console.error('Fetch answers error:', err);
    } finally {
      setAnswersLoading(false);
    }
  }, [supabase, user?.id]);

  const handleVote = useCallback(async (answerId, voteType) => {
    if (!user) return;
    
    // 1. Find answer
    const answer = answers.find(a => a.id === answerId);
    if (!answer) return;

    // 2. Optimistic Update
    const oldAnswers = [...answers];
    const newVote = answer.user_vote === voteType ? 0 : voteType;
    const scoreDiff = newVote - answer.user_vote;

    setAnswers(prev => prev.map(a => a.id === answerId ? {
      ...a,
      score: a.score + scoreDiff,
      user_vote: newVote
    } : a));

    // 3. Persistent Update
    const db = supabase;
    try {
      if (newVote === 0) {
        // Delete vote
        await db.from('answer_votes').delete().eq('answer_id', answerId).eq('user_id', user.id);
      } else {
        // Upsert vote (using the UNIQUE constraint we added in Step 1)
        await db.from('answer_votes').upsert({
          answer_id: answerId,
          user_id: user.id,
          vote_type: newVote
        }, { onConflict: 'answer_id, user_id' });
      }
    } catch (err) {
      console.error('Vote error:', err);
      // Revert if failed
      setAnswers(oldAnswers);
      showToast('Voting failed. Try again.', 'error');
    }
  }, [supabase, answers, user, showToast]);

  const handleSetBestAnswer = async (answerId) => {
    if (!selectedEntry || selectedEntry.user_id !== user.id) return;
    const db = supabase;
    try {
      const answer = answers.find(a => a.id === answerId);
      if (answer && answer.is_best_answer) {
        // Toggle off
        await db.from('answers').update({ is_best_answer: false }).eq('id', answerId);
        showToast('Best answer removed.', 'info');
      } else {
        // Unset previous best for THIS entry
        await db.from('answers').update({ is_best_answer: false }).eq('entry_id', selectedEntry.id);
        // Set new best
        await db.from('answers').update({ is_best_answer: true }).eq('id', answerId);
        showToast('Best answer set! ⭐', 'success');
      }
      fetchAnswers(selectedEntry.id);
    } catch (err) {
      console.error('Set best answer error:', err);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!newAnswer.trim() || !selectedEntry) return;
    setIsSubmittingAnswer(true);
    const db = supabase;
    try {
      const { error } = await db.from('answers').insert({
        entry_id: selectedEntry.id,
        user_id: user.id,
        answer_text: newAnswer.trim()
      });
      if (error) throw error;
      setNewAnswer('');
      fetchAnswers(selectedEntry.id);
      showToast('Answer added! 🚀', 'success');
      
      // Notify question owner
      if (selectedEntry.user_id !== user.id) {
        await db.from('notifications').insert({
          user_id: selectedEntry.user_id,
          from_user_id: user.id,
          type: 'new_answer',
          message: `${profile?.display_name || user.firstName} answered your question! 💡`,
          entry_id: selectedEntry.id,
          is_read: false
        });
      }
    } catch (err) {
      console.error('Submit answer error:', err);
      showToast('Failed to post answer.', 'error');
    } finally {
      setIsSubmittingAnswer(false);
    }
  };

  const handleDeleteAnswer = async (answerId) => {
    if (!user) return;
    
    // Optimistic Update
    const oldAnswers = [...answers];
    setAnswers(prev => prev.filter(a => a.id !== answerId));
    
    try {
      const db = supabase;
      const { error } = await db
        .from('answers')
        .delete()
        .eq('id', answerId)
        .eq('user_id', user.id); // Security check
        
      if (error) throw error;
      showToast('Answer deleted.', 'success');
    } catch (err) {
      console.error('Delete answer error:', err);
      // Revert if failed
      setAnswers(oldAnswers);
      showToast('Failed to delete answer.', 'error');
    }
  };


  useEffect(() => {
    if (isSignedIn && user && isReady) {
      fetchEntries();
      fetchProfile();
      fetchMemberCount();
      fetchFeed();
      fetchUnreadCount();

      // Real-time subscriptions
      const setupSubscription = async () => {
        const db = supabase;
        
        // Notifications subscription
        const notifChannel = db
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
            if (Notification.permission === 'granted') {
              new Notification('StudyVault', {
                body: notif.message,
                icon: '/web-app-manifest-192x192.png',
                tag: 'studyvault-notif',
                renotify: true,
              });
            }
            if (navigator.vibrate) navigator.vibrate(200);
            fetchNotifications();
          })
          .subscribe();

        // Feed subscription
        const feedChannel = db
          .channel('feed')
          .on('postgres_changes', {
            event: 'INSERT',
            schema: 'public',
            table: 'class_feed'
          }, () => {
            fetchFeed();
            fetchMemberCount();
          })
          .subscribe();

        // Answers & Votes subscription
        const answersChannel = db
          .channel('answers')
          .on('postgres_changes', {
            event: '*',
            schema: 'public',
            table: 'answers'
          }, payload => {
            if (selectedEntry && (payload.new?.entry_id === selectedEntry.id || payload.old?.entry_id === selectedEntry.id)) {
              fetchAnswers(selectedEntry.id);
            }
          })
          .on('postgres_changes', {
            event: '*',
            schema: 'public',
            table: 'answer_votes'
          }, () => {
            if (selectedEntry) {
              fetchAnswers(selectedEntry.id);
            }
          })
          .subscribe();
        
        return { notifChannel, feedChannel, answersChannel };
      };

      let channels;
      setupSubscription().then(res => { channels = res; });

      // Cleanup on unmount
      return () => { 
        if (channels) {
          supabase.removeChannel(channels.notifChannel);
          supabase.removeChannel(channels.feedChannel);
          supabase.removeChannel(channels.answersChannel);
        }
      };
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSignedIn, user?.id, isReady]);

  useEffect(() => {
    if (selectedEntry && isReady) {
      fetchAnswers(selectedEntry.id);
    }
  }, [selectedEntry, fetchAnswers, isReady]);

  useEffect(() => {
    console.log("Current Tab changed to:", currentTab);
    if (!isReady) return;
    
    if (currentTab && currentTab.toLowerCase() === 'notifs') {
      console.log("Notifications tab opened: Clearing badge...");
      fetchNotifications();
      // 1. Optimistic UI: Instantly clear the badge
      setUnreadCount(0); 
      // 2. Database Sync: Mark as read
      markAllAsRead();
    } else if (currentTab && currentTab.toLowerCase() === 'feed') {
      fetchFeed();
      fetchMemberCount();
    }
  }, [currentTab, fetchFeed, fetchMemberCount, fetchNotifications, isReady, markAllAsRead]);

  useEffect(() => {
    document.title = "StudyVault — Class X";
    if (isReady && isSignedIn) {
      fetchEntries();
    }

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
  }, [fetchEntries, isReady, isSignedIn]);


  const saveName = async () => {
    if (!tempName.trim() || !user) return;
    try {
      await user.update({ firstName: tempName.trim() });
      const db = supabase;
      await db
        .from('profiles')
        .update({ display_name: tempName.trim() })
        .eq('user_id', user.id);

      setIsEditingName(false);
      showToast('Name updated!', 'success');
    } catch (err) {
      console.error('Save name error:', err);
      showToast('Failed to update name. Try again.', 'error');
    }

  };

  const saveBio = async () => {
    if (!user) return;
    try {
      const db = supabase;
      await db
        .from('profiles')
        .update({ bio: tempBio.trim() })
        .eq('user_id', user.id);

      setIsEditingBio(false);
      showToast('Bio updated!', 'success');
    } catch (err) {
      console.error('Save bio error:', err);
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
      const db = supabase;
      const { error: uploadError } = await db.storage
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
    } catch (err) {
      console.error('Avatar upload error:', err);
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
      const db = supabase;
      const { error } = await db.from('entries').update({ starred: newStarredStatus }).eq('id', entryToToggle.id);
      if (error) throw error;
    } catch (err) {
      console.error('Toggle star error:', err);
      // Revert on error
      setEntries(prev => prev.map(en => en.id === entryToToggle.id ? { ...en, starred: !newStarredStatus } : en));
      if (selectedEntry?.id === entryToToggle.id) {
        setSelectedEntry(prev => ({ ...prev, starred: !newStarredStatus }));
      }
      showToast('Could not update star. Try again.', 'error');
    }
  };

  const handleDelete = async () => {
    if (!selectedEntry) return;
    setIsDeleting(true);
    try {
      const db = supabase;

      // 1. Delete associated image from storage if exists
      if (selectedEntry.image_url) {
        try {
          // Find where the bucket name ends and the file path begins
          const bucketString = 'entry-images/';
          const pathIndex = selectedEntry.image_url.indexOf(bucketString);
          
          if (pathIndex !== -1) {
            // Extract strictly the file name/path
            const filePath = selectedEntry.image_url.substring(pathIndex + bucketString.length);
            console.log("Attempting to delete storage file:", filePath);
            
            // Execute deletion
            const { error: storageError } = await db.storage
              .from('entry-images')
              .remove([filePath]);
              
            if (storageError) {
              console.error("Supabase Storage deletion failed:", storageError.message);
            } else {
              console.log("Storage file deleted successfully.");
            }
          }
        } catch (err) {
          console.error("Failed to parse image URL for deletion:", err);
        }
      }

      // 2. Delete database row
      // Database will handle cascading deletions for class_feed, answers, and notifications
      const { error } = await db.from('entries').delete().eq('id', selectedEntry.id);
      if (error) throw error;
      
      // Update local state
      setEntries(prev => prev.filter(e => e.id !== selectedEntry.id));
      setFeedEntries(prev => prev.filter(f => f.entry_id !== selectedEntry.id));
      
      setShowDeleteConfirm(false);
      setSelectedEntry(null);
      showToast('✓ Entry deleted', 'success');
    } catch (err) {
      console.error('Delete error:', err);
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
    
    try {
      const db = supabase;
      const parsedTags = formTags
        ? formTags.split(',').map(t => t.trim()).filter(Boolean)
        : [];

      let imageUrl = null;
      if (imageFile) {
        // Validate file type
        const allowed = ['image/jpeg', 'image/png', 'image/webp'];
        if (!allowed.includes(imageFile.type)) {
          showToast('Only JPEG, PNG, or WebP allowed', 'error');
          setIsSaving(false);
          return;
        }
        // Validate file size (5MB)
        if (imageFile.size > 5 * 1024 * 1024) {
          showToast('Image must be under 5MB', 'error');
          setIsSaving(false);
          return;
        }

        try {
          const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`;
          const { error: uploadError } = await db.storage
            .from('entry-images')
            .upload(fileName, imageFile, { contentType: imageFile.type });
          
          if (uploadError) throw uploadError;
          
          const { data: urlData } = db.storage.from('entry-images').getPublicUrl(fileName);
          imageUrl = urlData?.publicUrl || null;
        } catch (err) {
          console.error('Upload error:', err);
          showToast('Image upload failed. Saving without image.', 'error');
        }
      }

      const newEntry = {
        question: formQuestion.trim(),
        answer: formAnswer.trim(),
        subject: formSubject,
        chapter: formChapter.trim() || null,
        tags: parsedTags,
        user_id: user?.id,
        starred: false,
        is_public: false,
        image_url: imageUrl,
      };

      const { data, error } = await db.from('entries').insert(newEntry).select();
      
      if (error) throw error;
      
      // Update local state (no longer auto-shares to feed)
      if (data && data.length > 0) {
        setEntries(prev => [data[0], ...prev]);
        showToast('✓ Entry saved', 'success');
        // Reset form
        setFormQuestion(''); setFormSubject(SUBJECTS[0]); setFormChapter('');
        setFormAnswer(''); setFormTags(''); setImageFile(null); setImagePreview(null);
        setAddStep(1); setShowAddEntry(false);
      }
    } catch (err) {
      console.error('Save error:', err);
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
      const db = supabase;
      const { error } = await db.from('entries').update({
        review_count: (entry.review_count || 0) + 1,
        last_reviewed: new Date().toISOString()
      }).eq('id', entry.id);
      if (error) throw error;
      showToast('Review saved! ✓', 'success');
    } catch (err) {
      console.error('Mark reviewed error:', err);
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

  if (!isLoaded) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: COLORS.bg, color: COLORS.textMuted }}>
        Loading StudyVault...
      </div>
    );
  }

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
        <div className="bg-bgsoft" style={{
          minHeight: '100vh',
          fontFamily: "'Poppins', sans-serif",
          color: COLORS.textPrimary,
          position: 'relative',
          overflowX: 'hidden',
          overflowY: 'auto'
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button
                  onClick={() => {
                    setIsSearchVisible(!isSearchVisible);
                    if (!isSearchVisible) setTimeout(() => searchInputRef.current?.focus(), 100);
                  }}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: isSearchVisible ? COLORS.primary : COLORS.cardSurface,
                    color: isSearchVisible ? '#FFF' : COLORS.textMuted,
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <ICONS.Search />
                </button>
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
            </div>
          )}



          {/* 2. PROFILE VIEW */}
          {currentTab === 'Profile' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Profile Card */}
              <div style={{
                backgroundColor: COLORS.cardSurface,
                borderRadius: '24px',
                padding: '20px 16px',
                boxShadow: COLORS.shadow,
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center',
                position: 'relative',
                width: '100%'
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
                    <ICONS.Camera size={14} color={COLORS.primary} strokeWidth={2.5} />
                    <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarUpload} />
                  </label>
                </div>

                {isEditingName ? (
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                    <input 
                      id="profile-name"
                      name="display_name"
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
                      id="profile-bio"
                      name="bio"
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
              <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
                {[
                  { label: 'My Entries', value: totalSaved },
                  { label: 'My Starred', value: starred },
                  { label: 'Reviews Done', value: profile?.reviews_done || 0 }
                ].map((stat, i) => (
                  <div key={i} style={{ flex: 1, backgroundColor: COLORS.cardSurface, padding: '12px 8px', borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', minWidth: 0 }}>
                    <span style={{ fontSize: '16px', fontWeight: 'bold', color: COLORS.primary }}>{stat.value}</span>
                    <span style={{ fontSize: '9px', color: COLORS.textMuted, textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.3px' }}>{stat.label}</span>
                  </div>
                ))}
              </div>

              <div style={{ backgroundColor: COLORS.cardSurface, borderRadius: '24px', overflow: 'hidden', boxShadow: COLORS.shadow }}>
                <SettingRow icon={ICONS.Lock} label="Change Password" onClick={() => setShowClerkSettings(true)} />
                <SettingRow icon={ICONS.Edit} label={`My Review Queue (${reviewQueue.length})`} onClick={() => setCurrentTab('Review')} />
                <SettingRow icon={ICONS.Bell} label="Notification Status" onClick={() => {
                  if (Notification.permission === 'default') requestNotificationPermission();
                }}>
                  <div style={{ fontSize: '12px', fontWeight: '600', color: Notification.permission === 'granted' ? COLORS.green : '#FF5252' }}>
                    {Notification.permission === 'granted' ? (svNotifs ? 'ENABLED' : 'MUTED') : Notification.permission.toUpperCase()}
                  </div>
                </SettingRow>
                {/* Enable Browser Notifications button — shown only when not yet granted */}
                {Notification.permission !== 'granted' && (
                  <div style={{ padding: '12px 16px', borderBottom: '1px solid #F0F2F5' }}>
                    <button
                      onClick={requestNotificationPermission}
                      className="no-select"
                      style={{
                        width: '100%',
                        backgroundColor: COLORS.primary,
                        color: '#FFF',
                        border: 'none',
                        borderRadius: '12px',
                        padding: '12px 16px',
                        fontSize: '14px',
                        fontWeight: '600',
                        fontFamily: 'inherit',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        boxShadow: '0 4px 12px rgba(37,99,235,0.25)',
                        transition: 'transform 0.15s ease, box-shadow 0.15s ease'
                      }}
                      onMouseOver={e => { e.currentTarget.style.transform = 'scale(0.98)'; }}
                      onMouseOut={e => { e.currentTarget.style.transform = 'scale(1)'; }}
                    >
                      🔔 Enable Browser Notifications
                    </button>
                  </div>
                )}
                <SettingRow icon={ICONS.Bell} label="Test Push Notification" onClick={sendTestNotification} />
                <SettingRow icon={ICONS.BellOff} label="Mute Notifications" hasToggle toggleValue={!svNotifs} onToggle={() => {
                  const next = !svNotifs;
                  setSvNotifs(next);
                  localStorage.setItem('sv_notifs_enabled', next);
                }} />
                <SettingRow icon={ICONS.Moon} label="App Theme" isTheme currentTheme={svTheme} onThemeChange={(t) => {
                  setSvTheme(t);
                  localStorage.setItem('sv_theme', t);
                }} />
                <SettingRow icon={ICONS.LogOut} label="Sign Out" isDestructive onClick={() => setShowSignOutConfirm(true)} />
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
                  id="feed-search"
                  name="feed-search"
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
                <div style={{ padding: '60px 20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Globe size={36} strokeWidth={1.8} style={{ color: '#90A4AE', marginBottom: '16px' }} />
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
                <div style={{ padding: '80px 20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Bell size={36} strokeWidth={1.8} style={{ color: '#90A4AE', marginBottom: '16px' }} />
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
                          const db = supabase;
                          const { data: entryData } = await db.from('entries').select('*').eq('id', notif.entry_id).single();
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

          {/* 4. SEARCH BAR (Shown on Home when toggled or on Feed) */}
          {((currentTab === 'Home' && isSearchVisible) || (currentTab === 'Feed')) && (

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
                id="home-search"
                name="home-search"
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
                  <ICONS.Close size={12} strokeWidth={2.5} />
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
                    className={`no-select transition ${
                      isSelected
                        ? 'bg-primary text-white font-semibold'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                    style={{
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                      padding: '6px 16px',
                      borderRadius: '9999px',
                      border: 'none',
                      fontFamily: 'inherit',
                      fontSize: '13px',
                      cursor: 'pointer',
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
                  <ICONS.Alert />
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
                  <BookOpen size={36} strokeWidth={1.8} style={{ color: '#90A4AE', marginBottom: '16px' }} />
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
                    <Search size={36} strokeWidth={1.8} style={{ color: '#90A4AE', marginBottom: '16px' }} />
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
                    <FolderOpen size={36} strokeWidth={1.8} style={{ color: '#90A4AE', marginBottom: '16px' }} />
                    <div style={{ fontSize: '15px', lineHeight: '1.6', color: COLORS.textMuted }}>
                      No entries found.
                    </div>
                  </div>
                )
              ) : (
                // List Entries
                filteredEntries.map((entry, idx) => (
                  <div 
                    className="animate-fade-in-up border border-borderSoft shadow-soft"
                    key={entry.id} 
                    onClick={() => setSelectedEntry(entry)}
                    style={{
                      animationDelay: `${idx * 50}ms`,
                      backgroundColor: COLORS.cardSurface,
                      borderRadius: '18px',
                      padding: '20px',
                      cursor: 'pointer',
                      position: 'relative',
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

              {/* Header: Question First */}
              <div style={{ padding: '0 4px', marginBottom: '8px' }}>
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
                margin: '12px 0 24px 0'
              }} />

              {/* Original Answer Section */}
              <div style={{ marginBottom: '32px' }}>
                <div style={{ 
                  fontSize: '11px', 
                  color: COLORS.textMuted, 
                  letterSpacing: '1px', 
                  marginBottom: '10px',
                  fontWeight: '600'
                }}>
                  ORIGINAL ANSWER
                </div>
                <div style={{
                  backgroundColor: COLORS.bg,
                  borderRadius: '20px',
                  padding: '24px',
                  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)'
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

                {/* Action Section (Owner Only) */}
                {selectedEntry.user_id === user.id && (
                  <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {/* Share/Remove Toggle */}
                    {(!selectedEntry.is_public && currentTab !== 'Feed') ? (
                      <button
                        onClick={() => handleShareToFeed(selectedEntry)}
                        disabled={isSharing}
                        style={{
                          width: '100%',
                          backgroundColor: COLORS.primary,
                          color: '#fff',
                          border: 'none',
                          borderRadius: '12px',
                          padding: '16px',
                          fontSize: '14px',
                          fontWeight: '600',
                          fontFamily: 'inherit',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                          boxShadow: '0 4px 12px rgba(33,150,243,0.3)'
                        }}
                      >
                        {isSharing ? <span className="spinner"></span> : '🚀 Share to Class Feed'}
                      </button>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ 
                          flex: 1,
                          backgroundColor: '#E8F5E9', 
                          border: `1px solid ${COLORS.green}`, 
                          borderRadius: '12px', 
                          padding: '12px 16px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px'
                        }}>
                          <span style={{ fontSize: '18px' }}>✅</span>
                          <span style={{ fontSize: '13px', color: COLORS.green, fontWeight: '600' }}>
                            Shared with class
                          </span>
                        </div>
                        <button
                          onClick={() => handleRemoveFromFeed(selectedEntry)}
                          disabled={isSharing}
                          style={{
                            padding: '12px 20px',
                            backgroundColor: 'transparent',
                            color: '#FF5252',
                            border: '1.5px solid #FF5252',
                            borderRadius: '12px',
                            fontSize: '13px',
                            fontWeight: '600',
                            cursor: 'pointer'
                          }}
                        >
                          {isSharing ? <span className="spinner"></span> : 'Remove'}
                        </button>
                      </div>
                    )}

                    {/* Permanent Delete Action */}
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      style={{
                        width: '100%',
                        backgroundColor: 'transparent',
                        color: COLORS.textMuted,
                        border: '1px solid #ECEFF1',
                        borderRadius: '12px',
                        padding: '12px',
                        fontSize: '13px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        marginTop: '4px'
                      }}
                    >
                      🗑️ Delete Permanently
                    </button>
                  </div>
                )}
              </div>

              {/* Image below answer, if present */}
              {selectedEntry.image_url && (
                <div style={{ marginBottom: '24px' }}>
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
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '32px' }}>
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

              {/* Community Answers Section */}
              {Boolean(selectedEntry.is_public) && (
                <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div style={{ 
                    fontSize: '11px', 
                    color: COLORS.textMuted, 
                    letterSpacing: '1px', 
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <span>COMMUNITY ANSWERS ({answers.length})</span>
                    <button 
                      onClick={() => setIsAnswerFormOpen(!isAnswerFormOpen)}
                      style={{
                        backgroundColor: isAnswerFormOpen ? COLORS.bg : COLORS.primaryLight,
                        color: isAnswerFormOpen ? COLORS.textMuted : COLORS.primary,
                        border: 'none',
                        borderRadius: '10px',
                        padding: '6px 12px',
                        fontSize: '11px',
                        fontWeight: '700',
                        cursor: 'pointer'
                      }}
                    >
                      {isAnswerFormOpen ? 'Cancel' : 'Add Your Answer'}
                    </button>
                  </div>

                  {/* Submit Answer Form (Toggleable) */}
                  {isAnswerFormOpen && (
                    <div style={{ 
                      backgroundColor: COLORS.cardSurface,
                      borderRadius: '20px',
                      padding: '16px',
                      boxShadow: COLORS.shadow,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                      border: `1.5px solid ${COLORS.primaryLight}`
                    }}>
                      <textarea 
                        placeholder="Add your answer to help your classmates..."
                        value={newAnswer}
                        onChange={e => setNewAnswer(e.target.value)}
                        rows="3"
                        style={{
                          width: '100%',
                          backgroundColor: COLORS.bg,
                          border: 'none',
                          borderRadius: '12px',
                          padding: '12px',
                          fontSize: '14px',
                          fontFamily: 'inherit',
                          outline: 'none',
                          color: COLORS.textDark,
                          lineHeight: '1.5'
                        }}
                      />
                      <button
                        onClick={handleSubmitAnswer}
                        disabled={isSubmittingAnswer || !newAnswer.trim()}
                        style={{
                          alignSelf: 'flex-end',
                          backgroundColor: COLORS.primary,
                          color: '#fff',
                          border: 'none',
                          borderRadius: '12px',
                          padding: '10px 20px',
                          fontSize: '13px',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                          opacity: (isSubmittingAnswer || !newAnswer.trim()) ? 0.6 : 1,
                          transition: 'all 0.2s'
                        }}
                      >
                        {isSubmittingAnswer ? 'Posting...' : 'Post Answer'}
                      </button>
                    </div>
                  )}

                  {answersLoading ? (
                    <div style={{ padding: '20px', textAlign: 'center' }}>
                      <span className="spinner-blue"></span>
                    </div>
                  ) : answers.length === 0 ? (
                    <div style={{ 
                      padding: '32px 24px', 
                      textAlign: 'center', 
                      backgroundColor: '#F0F2F5', 
                      borderRadius: '16px',
                      color: COLORS.textMuted,
                      fontSize: '13px'
                    }}>
                      No answers yet. Share your knowledge!
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {answers.map(ans => (
                        <div key={ans.id} style={{
                          backgroundColor: ans.is_best_answer ? '#F1F8E9' : COLORS.cardSurface,
                          borderRadius: '16px',
                          padding: '16px',
                          boxShadow: COLORS.shadow,
                          border: ans.is_best_answer ? `1px solid ${COLORS.green}` : `1px solid #F0F2F5`,
                          position: 'relative',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '12px'
                        }}>
                          {/* Answer User Info */}
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <div style={{ 
                                width: '28px', 
                                height: '28px', 
                                borderRadius: '50%', 
                                backgroundColor: COLORS.primaryLight, 
                                overflow: 'hidden', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                fontSize: '10px',
                                fontWeight: 'bold',
                                color: COLORS.primary
                              }}>
                                {ans.profiles?.avatar_url ? (
                                  <img src={ans.profiles.avatar_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                                ) : (ans.profiles?.display_name || 'U')[0].toUpperCase()}
                              </div>
                              <div>
                                <div style={{ fontSize: '13px', fontWeight: '600', color: COLORS.textDark }}>
                                  {ans.profiles?.display_name || 'Classmate'}
                                </div>
                                <div style={{ fontSize: '10px', color: COLORS.textMuted }}>
                                  {getTimeAgo(ans.created_at)}
                                </div>
                              </div>
                            </div>
                            
                            {/* Best Answer Badge / Toggle */}
                            {ans.is_best_answer ? (
                              <div 
                                onClick={() => selectedEntry.user_id === user.id && handleSetBestAnswer(ans.id)}
                                style={{ 
                                  display: 'flex', 
                                  alignItems: 'center', 
                                  gap: '4px', 
                                  color: COLORS.green, 
                                  fontSize: '10px', 
                                  fontWeight: '800',
                                  backgroundColor: '#DCEDC8',
                                  padding: '4px 8px',
                                  borderRadius: '8px',
                                  cursor: selectedEntry.user_id === user.id ? 'pointer' : 'default',
                                  letterSpacing: '0.5px'
                                }}
                              >
                                🏆 BEST ANSWER
                              </div>
                            ) : (
                              selectedEntry.user_id === user.id && (
                                <button 
                                  onClick={() => handleSetBestAnswer(ans.id)}
                                  style={{
                                    backgroundColor: 'transparent',
                                    border: `1px solid ${COLORS.textMuted}`,
                                    color: COLORS.textMuted,
                                    borderRadius: '8px',
                                    padding: '4px 12px',
                                    fontSize: '11px',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                  }}
                                  onMouseOver={e => { e.currentTarget.style.borderColor = COLORS.green; e.currentTarget.style.color = COLORS.green; }}
                                  onMouseOut={e => { e.currentTarget.style.borderColor = COLORS.textMuted; e.currentTarget.style.color = COLORS.textMuted; }}
                                >
                                  Mark Best
                                </button>
                              )
                            )}
                          </div>

                          <LongText text={ans.answer_text} limit={200} />

                          <div style={{ 
                            display: 'flex', 
                            justifyContent: 'flex-start', 
                            alignItems: 'center', 
                            gap: '4px', 
                            backgroundColor: '#F0F2F5', 
                            alignSelf: 'flex-start', 
                            padding: '4px', 
                            borderRadius: '12px' 
                          }}>
                            <button 
                              onClick={() => handleVote(ans.id, 1)}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: ans.user_vote === 1 ? COLORS.green : 'transparent',
                                color: ans.user_vote === 1 ? '#fff' : COLORS.textMuted,
                                border: 'none',
                                borderRadius: '8px',
                                padding: '6px',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                              }}
                            >
                              <ICONS.Upvote />
                            </button>
                            <span style={{ 
                              fontSize: '14px', 
                              fontWeight: '800', 
                              color: COLORS.textDark, 
                              padding: '0 8px', 
                              minWidth: '24px', 
                              textAlign: 'center' 
                            }}>
                              {ans.score || 0}
                            </span>
                            <button 
                              onClick={() => handleVote(ans.id, -1)}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: ans.user_vote === -1 ? '#FF5252' : 'transparent',
                                color: ans.user_vote === -1 ? '#fff' : COLORS.textMuted,
                                border: 'none',
                                borderRadius: '8px',
                                padding: '6px',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                              }}
                            >
                              <div style={{ transform: 'rotate(180deg)', display: 'flex' }}><ICONS.Upvote /></div>
                            </button>
                          </div>

                          {/* Delete My Answer */}
                          {ans.user_id === user.id && (
                            <button
                              onClick={() => handleDeleteAnswer(ans.id)}
                              style={{
                                position: 'absolute',
                                bottom: '16px',
                                right: '16px',
                                backgroundColor: 'transparent',
                                border: 'none',
                                color: '#FF5252',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                cursor: 'pointer',
                                opacity: 0.6,
                                transition: 'opacity 0.2s',
                                padding: '8px'
                              }}
                              onMouseOver={e => e.currentTarget.style.opacity = 1}
                              onMouseOut={e => e.currentTarget.style.opacity = 0.6}
                            >
                              <ICONS.Trash />
                              <span style={{ fontSize: '11px', fontWeight: '700' }}>DELETE</span>
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
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
            <ICONS.Close size={24} />
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
                <ICONS.Back size={24} />
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
                  <label htmlFor="entry-question" style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: COLORS.textMuted, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    Question
                  </label>
                  <textarea 
                    id="entry-question"
                    name="question"
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
                  <label htmlFor="entry-chapter" style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: COLORS.textMuted, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    Chapter (Optional)
                  </label>
                  <input 
                    id="entry-chapter"
                    name="chapter"
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
                  Next: Add Answer <ChevronRight size={16} strokeWidth={2.5} style={{ marginLeft: '4px' }} />
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
                  <label htmlFor="entry-answer" style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: COLORS.textMuted, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    Answer
                  </label>
                  <textarea 
                    id="entry-answer"
                    name="answer"
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
                  <label htmlFor="entry-tags" style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: COLORS.textMuted, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    Tags (Optional)
                  </label>
                  <input 
                    id="entry-tags"
                    name="tags"
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
                        <Camera size={28} strokeWidth={1.8} style={{ color: COLORS.primary }} />
                        <span>Tap to attach a photo</span>
                      </div>
                      <input
                        id="entry-image"
                        name="image"
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        style={{ display: 'none' }}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            if (file.size > 5 * 1024 * 1024) {
                              showToast('Image must be under 5MB', 'error'); return;
                            }
                            const allowed = ['image/jpeg', 'image/png', 'image/webp'];
                            if (!allowed.includes(file.type)) {
                              showToast('Only JPEG, PNG, or WebP allowed', 'error'); return;
                            }
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
                    ) : (
                      <div style={{display:'flex', alignItems:'center', justifyContent:'center', gap:'8px'}}>
                         Save to Vault <Check size={18} strokeWidth={2.5} />
                      </div>
                    )}
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
                <div style={{ color: COLORS.textMuted }}><ICONS.ChevronRight size={16} /></div>
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
      <div className="no-select" style={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: '480px',
        backgroundColor: 'rgba(255, 255, 255, 0.97)',
        backdropFilter: 'blur(12px)',
        borderTopLeftRadius: '30px',
        borderTopRightRadius: '30px',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: `10px 10px max(env(safe-area-inset-bottom), 8px)`,
        zIndex: 40,
        boxShadow: '0 -6px 24px rgba(0,0,0,0.08)'
      }}>
        {[
          { id: 'Home', icon: ICONS.Home },
          { id: 'Feed', icon: ICONS.Feed },
          { id: 'Add', icon: () => <Plus size={26} color="white" strokeWidth={1.8} />, isAction: true },
          { id: 'Notifs', icon: ICONS.Bell, badge: unreadCount, label: 'Notifications' },
          { id: 'Profile', icon: ICONS.Profile }
        ].map(tab => {
          if (tab.isAction) {
            return (
              <div key={tab.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '20%' }}>
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
                    transform: 'translateY(-12px)',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-14px) scale(1.05)';
                    e.currentTarget.style.boxShadow = '0 12px 28px rgba(33,150,243,0.4)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(-12px) scale(1)';
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
                if (tab.id === 'Home') {
                  // Keep search visible if it was open, or let user toggle it
                }
              }}
              className="no-select"
              style={{
                background: 'none',
                border: 'none',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '2px',
                color: isActive ? '#2563EB' : '#90A4AE',
                cursor: 'pointer',
                fontFamily: "'Poppins', sans-serif",
                width: '20%',
                height: '100%',
                padding: '0'
              }}
            >
              <div style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '4px'
              }}>
                <tab.icon />
                {tab.badge > 0 && (
                  <div style={{
                    position: 'absolute',
                    top: '-2px',
                    right: '-4px',
                    backgroundColor: '#FF5252',
                    color: '#FFF',
                    fontSize: '9px',
                    fontWeight: 'bold',
                    borderRadius: '10px',
                    minWidth: '14px',
                    height: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    lineHeight: '1',
                    boxShadow: '0 2px 4px rgba(255,82,82,0.3)',
                    padding: '0 3px',
                    zIndex: 2
                  }}>
                    {tab.badge}
                  </div>
                )}
              </div>
              <span style={{ fontSize: '10px', fontWeight: isActive ? '600' : '500' }}>
                {tab.label || tab.id}
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
            <div style={{ color: '#FF5252', marginBottom: '16px' }}>
              <LogOut size={48} strokeWidth={1.5} />
            </div>
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

