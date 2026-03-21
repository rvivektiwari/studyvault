import { useState, useEffect, useCallback, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import confetti from 'canvas-confetti';

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
  FolderOpen,
  Flame
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
  bg: 'var(--sv-bg)',
  cardSurface: 'var(--sv-card-surface)',
  primary: 'var(--sv-primary)',
  primaryLight: 'var(--sv-primary-light)',
  accent: 'var(--sv-accent)',
  accentLight: 'var(--sv-accent-light)',
  teal: 'var(--sv-teal)',
  green: 'var(--sv-green)',
  greenLight: '#E8F5E9',
  danger: '#EF4444',
  dangerLight: '#FEF2F2',
  textDark: 'var(--sv-text-dark)',
  textPrimary: 'var(--sv-text-primary)',
  textBody: 'var(--sv-text-primary)',
  textMuted: 'var(--sv-text-muted)',
  shadow: 'var(--sv-shadow)',
  cardBorder: 'var(--sv-card-border)',
  goldAccent: 'var(--sv-accent)',
  blueAccent: 'var(--sv-primary)'
};

const ICONS = {
  Home: (props) => <Home size={19} strokeWidth={2.05} {...props} />,
  Starred: (props) => <Star size={19} strokeWidth={2.05} {...props} />,
  Search: (props) => <Search size={19} strokeWidth={2.05} {...props} />,
  Profile: (props) => <User size={19} strokeWidth={2.05} {...props} />,
  Review: (props) => <RefreshCw size={19} strokeWidth={2.05} {...props} />,
  Feed: (props) => <Rss size={19} strokeWidth={2.05} {...props} />,
  StarFilled: (props) => <Star size={19} strokeWidth={2.05} fill="currentColor" {...props} />,
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
const SettingRow = ({ icon, label, onClick, isDestructive, hasToggle, toggleValue, onToggle, isTheme, currentTheme, onThemeChange, children }) => (
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
      <span style={{ color: isDestructive ? COLORS.danger : COLORS.textMuted }}>
        {typeof icon === 'string' ? icon : icon({ size: 20 })}
      </span>
      <span style={{ fontSize: '15px', fontWeight: '500', color: isDestructive ? COLORS.danger : COLORS.textDark }}>{label}</span>
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
          style={{ border: 'none', backgroundColor: currentTheme === 'light' ? '#FFF' : 'transparent', borderRadius: '8px', padding: '4px 10px', fontSize: '11px', fontWeight: '600', color: currentTheme === 'light' ? COLORS.textDark : COLORS.textMuted, cursor: 'pointer' }}
        >Light</button>
        <button 
          onClick={() => onThemeChange('dark')}
          style={{ border: 'none', backgroundColor: currentTheme === 'dark' ? '#FFF' : 'transparent', borderRadius: '8px', padding: '4px 10px', fontSize: '11px', fontWeight: '600', color: currentTheme === 'dark' ? COLORS.textDark : COLORS.textMuted, cursor: 'pointer' }}
        >Dark</button>
      </div>
    )}

    {children && !hasToggle && !isTheme && children}

    {!children && !hasToggle && !isTheme && (
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
          style={{ background: 'none', border: 'none', color: COLORS.textMuted, fontSize: '13px', fontWeight: 'bold', cursor: 'pointer', padding: '4px 0', marginTop: '4px' }}
        >
          {isExpanded ? 'Read Less' : 'Read More'}
        </button>
      )}
    </div>
  );
};

const SkeletonBlock = ({ width = '100%', height = 12, radius = 10, style = {} }) => (
  <div
    className="skeleton-block"
    style={{
      width,
      height,
      borderRadius: radius,
      ...style
    }}
  />
);

const EntryCardSkeleton = () => (
  <div className="skeleton-card">
    <SkeletonBlock width="82%" height={18} radius={8} />
    <SkeletonBlock width="100%" height={12} radius={7} />
    <SkeletonBlock width="62%" height={12} radius={7} />
    <div className="skeleton-row">
      <div className="skeleton-row">
        <SkeletonBlock width={76} height={24} radius={999} />
        <SkeletonBlock width={62} height={18} radius={8} />
      </div>
      <SkeletonBlock width={46} height={14} radius={7} />
    </div>
  </div>
);

const FeedCardSkeleton = () => (
  <div className="skeleton-card">
    <div className="skeleton-row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
      <div className="skeleton-row">
        <SkeletonBlock width={32} height={32} radius={999} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <SkeletonBlock width={110} height={12} radius={7} />
          <SkeletonBlock width={70} height={10} radius={7} />
        </div>
      </div>
      <SkeletonBlock width={64} height={20} radius={999} />
    </div>
    <SkeletonBlock width="74%" height={16} radius={8} />
    <SkeletonBlock width="100%" height={12} radius={7} />
    <SkeletonBlock width="68%" height={12} radius={7} />
  </div>
);

const NotificationSkeleton = () => (
  <div className="skeleton-card skeleton-card--compact">
    <div className="skeleton-row" style={{ alignItems: 'center' }}>
      <SkeletonBlock width={36} height={36} radius={999} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
        <SkeletonBlock width="88%" height={12} radius={7} />
        <SkeletonBlock width={92} height={10} radius={7} />
      </div>
    </div>
  </div>
);

const ProfileSkeleton = () => (
  <div className="profile-layout">
    <div className="profile-card skeleton-card" style={{ alignItems: 'center' }}>
      <SkeletonBlock width={90} height={90} radius={999} style={{ marginBottom: 12 }} />
      <SkeletonBlock width={160} height={18} radius={8} />
      <SkeletonBlock width={220} height={12} radius={7} />
      <SkeletonBlock width={120} height={28} radius={999} style={{ marginTop: 12 }} />
    </div>

    <div style={{ display: 'contents' }}>
      <div className="profile-stats">
        {[0, 1, 2].map((item) => (
          <div key={item} className="profile-stat-card skeleton-card skeleton-card--compact" style={{ alignItems: 'center' }}>
            <SkeletonBlock width={44} height={18} radius={7} />
            <SkeletonBlock width={72} height={10} radius={7} />
          </div>
        ))}
      </div>

      <div className="profile-settings-card skeleton-card">
        {[0, 1, 2, 3].map((item) => (
          <div key={item} className="skeleton-row" style={{ justifyContent: 'space-between', padding: '10px 0', borderBottom: item < 3 ? '1px solid rgba(229,231,235,0.7)' : 'none' }}>
            <div className="skeleton-row">
              <SkeletonBlock width={20} height={20} radius={999} />
              <SkeletonBlock width={140} height={12} radius={7} />
            </div>
            <SkeletonBlock width={54} height={12} radius={7} />
          </div>
        ))}
      </div>
    </div>
  </div>
);

const EmptyBookIllustration = () => (
  <div className="empty-book-illustration" aria-hidden="true">
    <svg viewBox="0 0 180 140" fill="none">
      <path d="M90 28C74 18 55 16 36 22C28 24 24 31 24 39V106C24 112 29 116 35 114C55 108 74 110 90 120" />
      <path d="M90 28C106 18 125 16 144 22C152 24 156 31 156 39V106C156 112 151 116 145 114C125 108 106 110 90 120" />
      <path d="M90 28V120" />
      <path className="empty-book-line empty-book-line--one" d="M43 48H74" />
      <path className="empty-book-line empty-book-line--two" d="M43 62H79" />
      <path className="empty-book-line empty-book-line--three" d="M106 52H137" />
      <path className="empty-book-line empty-book-line--four" d="M101 66H137" />
    </svg>
  </div>
);

const AvatarStack = ({ profiles = [] }) => (
  <div className="empty-avatar-stack" aria-hidden="true">
    {profiles.slice(0, 5).map((member, index) => (
      <div
        key={member.user_id || index}
        className="empty-avatar-stack__item"
        style={{ zIndex: profiles.length - index }}
      >
        {member.avatar_url ? (
          <img src={member.avatar_url} alt="" />
        ) : (
          <span>{(member.display_name || '?')[0].toUpperCase()}</span>
        )}
      </div>
    ))}
  </div>
);

const TAB_ITEMS = [
  { id: 'Home', label: 'Home', shortLabel: 'Home', icon: Home },
  { id: 'Starred', label: 'Starred', shortLabel: 'Saved', icon: Star },
  { id: 'Feed', label: 'Feed', shortLabel: 'Feed', icon: Rss },
  { id: 'Review', label: 'Review', shortLabel: 'Review', icon: RefreshCw },
  { id: 'Notifications', label: 'Notifications', shortLabel: 'Notifs', icon: Bell },
  { id: 'Profile', label: 'Profile', shortLabel: 'Profile', icon: User }
];

const TAB_TITLES = {
  Home: 'Your Study Vault',
  Starred: 'Starred Answers',
  Feed: 'Class Feed',
  Review: 'Review Queue',
  Notifications: 'Notifications',
  Profile: 'Your Profile'
};

const createTempId = (prefix) => `temp-${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
const PAGE_EASE = [0.32, 0.72, 0, 1];
const PAGE_DURATION = 0.22;
const SHEET_SPRING = { type: 'spring', stiffness: 400, damping: 35 };
const STAR_ON_ANIMATION = { scale: [1, 1.4, 0.9, 1] };
const STAR_ON_TRANSITION = {
  duration: 0.24,
  times: [0, 0.42, 0.75, 1],
  ease: 'easeOut'
};
const STAR_OFF_ANIMATION = { scale: [1, 0.92, 1] };
const STAR_OFF_TRANSITION = {
  duration: 0.16,
  times: [0, 0.55, 1],
  ease: 'easeOut'
};
const BELL_SHAKE_ANIMATION = { rotate: [0, -15, 15, -10, 10, 0] };
const BELL_SHAKE_TRANSITION = {
  duration: 0.6,
  times: [0, 0.18, 0.36, 0.58, 0.78, 1],
  ease: 'easeInOut'
};
const STREAK_MILESTONES = new Set([3, 7, 14, 30]);
const STREAK_SCHEMA_STORAGE_KEY = 'sv_streak_schema_available';
const WEB_PUSH_PUBLIC_KEY = import.meta.env.VITE_WEB_PUSH_PUBLIC_KEY || '';
const HAPTIC_PATTERNS = {
  starOn: 12,
  starOff: 8,
  saveSuccess: [10, 60, 10],
  deleteEntry: 28,
  notification: [15, 80, 15, 80, 15],
  wrongPin: [30, 50, 30]
};
const MotionDiv = motion.div;
const MotionButton = motion.button;

const getLocalDateKey = (date = new Date()) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const parseDateKey = (value) => {
  if (!value) return null;
  const [year, month, day] = String(value).split('-').map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
};

const diffInCalendarDays = (fromKey, toKey) => {
  const fromDate = parseDateKey(fromKey);
  const toDate = parseDateKey(toKey);
  if (!fromDate || !toDate) return null;
  return Math.round((toDate - fromDate) / 86400000);
};

const withStreakDefaults = (profile) => ({
  ...profile,
  current_streak: profile?.current_streak ?? 0,
  last_activity_date: profile?.last_activity_date ?? null,
  streak_freezes: profile?.streak_freezes ?? 2
});

const readCachedStreakSchemaAvailability = () => {
  if (typeof window === 'undefined') return true;
  const cached = localStorage.getItem(STREAK_SCHEMA_STORAGE_KEY);
  if (cached === 'false') return false;
  if (cached === 'true') return true;
  return true;
};

const urlBase64ToUint8Array = (base64String) => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i += 1) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

const NavItemButton = ({ item, active, badge, onClick, compact = false, bellShakeKey = 0 }) => {
  const Icon = item.icon;
  const isNotificationTab = item.id === 'Notifications';

  return (
    <button
      onClick={onClick}
      className={`press ${compact ? 'mobile-nav-item' : 'desktop-nav-item'} ${active ? 'is-active' : ''}`}
      style={{
        position: 'relative',
        background: 'none',
        border: 'none',
        color: active ? COLORS.primary : COLORS.textMuted
      }}
    >
      <span className={compact ? 'mobile-nav-icon' : 'desktop-nav-icon'}>
        <MotionDiv
          key={isNotificationTab ? `bell-${bellShakeKey}` : item.id}
          initial={false}
          animate={isNotificationTab && bellShakeKey > 0 ? BELL_SHAKE_ANIMATION : { rotate: 0 }}
          transition={isNotificationTab ? BELL_SHAKE_TRANSITION : { duration: 0.12 }}
          style={{ display: 'inline-flex' }}
        >
          <Icon size={compact ? 21 : 20} strokeWidth={active ? 2.4 : 1.9} />
        </MotionDiv>
        {badge > 0 && (
          <span className="nav-badge">
            {badge > 99 ? '99+' : badge}
          </span>
        )}
      </span>
      <span className={compact ? 'mobile-nav-label' : 'desktop-nav-label'}>{compact ? item.shortLabel : item.label}</span>
    </button>
  );
};

const AnimatedSearchField = ({
  id,
  name,
  value,
  onChange,
  placeholder,
  inputRef,
  isExpanded,
  onFocus,
  onBlur,
  onCancel
}) => (
  <div className="search-shell">
    <MotionDiv
      className="search-shell__field-wrap"
      animate={{ width: isExpanded ? '100%' : '90%' }}
      transition={{ duration: 0.18, ease: PAGE_EASE }}
      style={{ position: 'relative' }}
    >
      <span
        style={{
          position: 'absolute',
          left: '20px',
          top: '50%',
          transform: 'translateY(-50%)',
          color: COLORS.textMuted,
          display: 'flex',
          alignItems: 'center',
          zIndex: 1
        }}
      >
        <ICONS.Search />
      </span>
      <input
        id={id}
        name={name}
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onFocus}
        onBlur={onBlur}
        style={{
          width: '100%',
          backgroundColor: COLORS.cardSurface,
          border: 'none',
          borderRadius: '20px',
          padding: '16px 18px 16px 48px',
          color: COLORS.textPrimary,
          fontFamily: 'inherit',
          fontSize: '16px',
          outline: 'none',
          transition: 'box-shadow 0.18s ease',
          boxShadow: COLORS.shadow,
          minHeight: '56px'
        }}
      />
    </MotionDiv>
    <AnimatePresence>
      {isExpanded && (
        <MotionButton
          className="search-shell__cancel"
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={onCancel}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 10 }}
          transition={{ duration: 0.18, ease: PAGE_EASE }}
          style={{
            background: 'none',
            border: 'none',
            color: COLORS.primary,
            fontSize: '14px',
            fontWeight: '600',
            fontFamily: 'inherit',
            cursor: 'pointer',
            padding: '0 2px'
          }}
        >
          Cancel
        </MotionButton>
      )}
    </AnimatePresence>
  </div>
);

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
  const [profileLoading, setProfileLoading] = useState(true);
  const [streakPersistenceAvailable, setStreakPersistenceAvailable] = useState(readCachedStreakSchemaAvailability);
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState('');
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [tempBio, setTempBio] = useState('');
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [showClerkSettings, setShowClerkSettings] = useState(false);
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);
  const [ svTheme, setSvTheme ] = useState(() => {
    if (typeof window === 'undefined') return 'light';
    return localStorage.getItem('sv_theme') || 'light';
  });
  const [ svNotifs, setSvNotifs ] = useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('sv_notifs_enabled') === 'true';
  });
  
  // Feed State
  const [feedEntries, setFeedEntries] = useState([]);
  const [feedLoading, setFeedLoading] = useState(true);
  const [memberCount, setMemberCount] = useState(0);
  const [classmatePreview, setClassmatePreview] = useState([]);
  const [isSharing, setIsSharing] = useState(false);
  const [feedSearch, setFeedSearch] = useState('');
  const [feedError, setFeedError] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  
  // Notifications State
  const [notifications, setNotifications] = useState([]);
  const [notificationsLoading, setNotificationsLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationsError, setNotificationsError] = useState(false);
  const [pushSupported, setPushSupported] = useState(false);
  const [pushRegistered, setPushRegistered] = useState(false);
  const [isStandalonePwa, setIsStandalonePwa] = useState(false);
  
  const searchInputRef = useRef(null);
  
  // Answers State
  const [answers, setAnswers] = useState([]);
  const [answersLoading, setAnswersLoading] = useState(false);
  const [answersError, setAnswersError] = useState(false);
  const [newAnswer, setNewAnswer] = useState('');
  const [isSubmittingAnswer, setIsSubmittingAnswer] = useState(false);
  const [isAnswerFormOpen, setIsAnswerFormOpen] = useState(false);
  
  // Detail View State
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [cardActionEntry, setCardActionEntry] = useState(null);
  const [editingEntryId, setEditingEntryId] = useState(null);
  const [swipeOffsets, setSwipeOffsets] = useState({});

  // Add Entry State
  const [showAddEntry, setShowAddEntry] = useState(false);
  const [addStep, setAddStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [showAIModal, setShowAIModal] = useState(false);
  const [pageTransition, setPageTransition] = useState({ axis: 'x', direction: 0 });
  const [hasAnimatedEntryList, setHasAnimatedEntryList] = useState(false);
  const [activeSearchSurface, setActiveSearchSurface] = useState(null);
  const [starAnimationState, setStarAnimationState] = useState({ id: null, starred: false });
  const [bellShakeKey, setBellShakeKey] = useState(0);
  const [milestoneCelebration, setMilestoneCelebration] = useState(null);
  
  // Form Fields
  const [formQuestion, setFormQuestion] = useState('');
  const [formSubject, setFormSubject] = useState(SUBJECTS[0]);
  const [formChapter, setFormChapter] = useState('');
  const [formAnswer, setFormAnswer] = useState('');
  const [formTags, setFormTags] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showLightbox, setShowLightbox] = useState(false);
  const notificationPermission = typeof Notification !== 'undefined' ? Notification.permission : 'unsupported';
  const previousTabRef = useRef('Home');
  const longPressTimerRef = useRef(null);
  const pointerSessionRef = useRef(null);
  const suppressCardClickRef = useRef(false);
  
  const showToast = useCallback((message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 2500);
  }, []);

  const playHaptic = useCallback((pattern) => {
    if (typeof navigator === 'undefined' || typeof navigator.vibrate !== 'function') return;
    navigator.vibrate(pattern);
  }, []);

  const persistPushSubscription = useCallback(async (subscription) => {
    if (!user || !subscription) return false;
    try {
      const db = supabase;
      const payload = subscription.toJSON();
      const { error } = await db.from('push_subscriptions').upsert({
        user_id: user.id,
        endpoint: payload.endpoint,
        subscription: payload,
        user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
        updated_at: new Date().toISOString()
      }, { onConflict: 'endpoint' });
      if (error) throw error;
      setPushRegistered(true);
      return true;
    } catch (err) {
      console.error('Persist push subscription error:', err);
      setPushRegistered(false);
      return false;
    }
  }, [supabase, user]);

  const removePushSubscription = useCallback(async (endpoint) => {
    if (!user || !endpoint) return;
    try {
      const db = supabase;
      await db.from('push_subscriptions').delete().eq('endpoint', endpoint).eq('user_id', user.id);
    } catch (err) {
      console.error('Remove push subscription error:', err);
    }
  }, [supabase, user]);

  const syncPushSubscription = useCallback(async ({ requestPermission = false } = {}) => {
    if (typeof window === 'undefined') return false;
    const supported = 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window && Boolean(WEB_PUSH_PUBLIC_KEY);
    setPushSupported(supported);
    if (!supported || !user || !svNotifs) {
      setPushRegistered(false);
      return false;
    }

    let permission = Notification.permission;
    if (requestPermission && permission === 'default') {
      permission = await Notification.requestPermission();
    }
    if (permission !== 'granted') {
      setPushRegistered(false);
      return false;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      let subscription = await registration.pushManager.getSubscription();
      if (!subscription) {
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(WEB_PUSH_PUBLIC_KEY)
        });
      }
      return await persistPushSubscription(subscription);
    } catch (err) {
      console.error('Sync push subscription error:', err);
      setPushRegistered(false);
      return false;
    }
  }, [persistPushSubscription, svNotifs, user]);

  const disablePushSubscription = useCallback(async () => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      setPushRegistered(false);
      return;
    }
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      if (subscription) {
        const endpoint = subscription.endpoint;
        await subscription.unsubscribe();
        await removePushSubscription(endpoint);
      }
    } catch (err) {
      console.error('Disable push subscription error:', err);
    } finally {
      setPushRegistered(false);
    }
  }, [removePushSubscription]);

  const triggerWebPush = useCallback(async (notificationsToSend) => {
    if (!notificationsToSend?.length) return;
    try {
      const db = supabase;
      const { error } = await db.functions.invoke('send-web-push', {
        body: {
          notifications: notificationsToSend.map((notif) => ({
            id: notif.id,
            user_id: notif.user_id,
            message: notif.message,
            type: notif.type,
            entry_id: notif.entry_id || null
          }))
        }
      });
      if (error) throw error;
    } catch (err) {
      console.error('Trigger web push error:', err);
    }
  }, [supabase]);

  const resetEntryComposer = useCallback(() => {
    setEditingEntryId(null);
    setFormQuestion('');
    setFormSubject(SUBJECTS[0]);
    setFormChapter('');
    setFormAnswer('');
    setFormTags('');
    setImageFile(null);
    setImagePreview(null);
    setAddStep(1);
  }, []);

  const closeTransientLayers = useCallback(() => {
    setSelectedEntry(null);
    setShowDeleteConfirm(false);
    setShowAddEntry(false);
    setShowAIModal(false);
    setShowClerkSettings(false);
    setShowSignOutConfirm(false);
    setShowLightbox(false);
    setCardActionEntry(null);
    setIsAnswerFormOpen(false);
    setActiveSearchSurface(null);
  }, []);

  const navigateToTab = useCallback((nextTab) => {
    closeTransientLayers();
    setCurrentTab(nextTab);
  }, [closeTransientLayers]);

  const handleNotificationNavigation = useCallback((destinationUrl = '/') => {
    if (typeof window === 'undefined') return;

    try {
      const url = new URL(destinationUrl, window.location.origin);
      const nextTab = url.searchParams.get('tab');
      const entryId = url.searchParams.get('entry');

      if (nextTab && TAB_ITEMS.some((item) => item.id === nextTab)) {
        navigateToTab(nextTab);
      } else if (entryId) {
        navigateToTab('Notifications');
      }

      if (entryId) {
        const linkedEntry =
          entries.find((item) => `${item.id}` === `${entryId}`) ||
          feedEntries.find((item) => `${item.entry_id || item.id}` === `${entryId}`);

        if (linkedEntry) {
          setSelectedEntry(linkedEntry.entry_id ? {
            id: linkedEntry.entry_id,
            question: linkedEntry.question,
            answer: linkedEntry.answer,
            subject: linkedEntry.subject,
            chapter: linkedEntry.chapter,
            user_id: linkedEntry.user_id,
            is_starred: linkedEntry.is_starred,
            is_public: linkedEntry.is_public,
            created_at: linkedEntry.created_at
          } : linkedEntry);
        }
      }

      window.history.replaceState({}, '', url.pathname);
    } catch (err) {
      console.error('Handle notification navigation error:', err);
    }
  }, [entries, feedEntries, navigateToTab]);

  const closeEntryComposer = useCallback(() => {
    setShowAddEntry(false);
    setTimeout(() => {
      resetEntryComposer();
    }, 300);
  }, [resetEntryComposer]);

  const openEntryEditor = useCallback((entry) => {
    setEditingEntryId(entry.id);
    setFormQuestion(entry.question || '');
    setFormSubject(entry.subject || SUBJECTS[0]);
    setFormChapter(entry.chapter || '');
    setFormAnswer(entry.answer || '');
    setFormTags(Array.isArray(entry.tags) ? entry.tags.join(', ') : (entry.tags || ''));
    setImageFile(null);
    setImagePreview(entry.image_url || null);
    setAddStep(1);
    setCardActionEntry(null);
    setShowAddEntry(true);
  }, []);

  const applyStreakActivity = useCallback(async () => {
    if (!user || !profile) return null;

    const todayKey = getLocalDateKey();
    const previousDateKey = profile.last_activity_date || null;
    const currentStreak = profile.current_streak || 0;
    const currentFreezes = profile.streak_freezes ?? 2;

    let nextStreak = currentStreak;
    let nextFreezes = currentFreezes;
    let usedFreeze = false;

    if (previousDateKey === todayKey) {
      return { current_streak: currentStreak, streak_freezes: currentFreezes, usedFreeze: false, milestone: null };
    }

    if (!previousDateKey) {
      nextStreak = 1;
    } else {
      const daysSinceLastActivity = diffInCalendarDays(previousDateKey, todayKey);
      if (daysSinceLastActivity === 1) {
        nextStreak = currentStreak + 1;
      } else if ((daysSinceLastActivity ?? 0) >= 2) {
        if (currentStreak > 0 && currentFreezes > 0) {
          nextStreak = currentStreak;
          nextFreezes = currentFreezes - 1;
          usedFreeze = true;
        } else {
          nextStreak = 1;
        }
      }
    }

    const nextProfile = withStreakDefaults({
      ...profile,
      current_streak: nextStreak,
      streak_freezes: nextFreezes,
      last_activity_date: todayKey
    });
    const previousProfile = profile;
    setProfile(nextProfile);

    if (!streakPersistenceAvailable) {
      if (usedFreeze) {
        showToast('Streak saved by a freeze.', 'success');
      }
      const milestone = nextStreak !== currentStreak && STREAK_MILESTONES.has(nextStreak) ? nextStreak : null;
      if (milestone) {
        setMilestoneCelebration({ streak: milestone });
      }
      return { current_streak: nextStreak, streak_freezes: nextFreezes, usedFreeze, milestone };
    }

    try {
      const db = supabase;
      const { error } = await db
        .from('profiles')
        .update({
          current_streak: nextStreak,
          streak_freezes: nextFreezes,
          last_activity_date: todayKey
        })
        .eq('user_id', user.id);
      if (error) throw error;

      if (usedFreeze) {
        showToast('Streak saved by a freeze.', 'success');
      }

      const milestone = nextStreak !== currentStreak && STREAK_MILESTONES.has(nextStreak) ? nextStreak : null;
      if (milestone) {
        setMilestoneCelebration({ streak: milestone });
      }

      return { current_streak: nextStreak, streak_freezes: nextFreezes, usedFreeze, milestone };
    } catch (err) {
      if (err?.code === '42703') {
        console.warn('Streak columns are not available in Supabase yet. Falling back to local-only streak state.');
        setStreakPersistenceAvailable(false);
        if (usedFreeze) {
          showToast('Streak saved by a freeze.', 'success');
        }
        const milestone = nextStreak !== currentStreak && STREAK_MILESTONES.has(nextStreak) ? nextStreak : null;
        if (milestone) {
          setMilestoneCelebration({ streak: milestone });
        }
        return { current_streak: nextStreak, streak_freezes: nextFreezes, usedFreeze, milestone };
      }
      console.error('Streak update error:', err);
      setProfile(previousProfile);
      return null;
    }
  }, [profile, showToast, streakPersistenceAvailable, supabase, user]);

  useEffect(() => {
    document.documentElement.dataset.theme = svTheme;
    document.documentElement.style.colorScheme = svTheme;
  }, [svTheme]);

  useEffect(() => {
    const supported = typeof window !== 'undefined'
      && 'serviceWorker' in navigator
      && 'PushManager' in window
      && 'Notification' in window
      && Boolean(WEB_PUSH_PUBLIC_KEY);
    setPushSupported(supported);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const syncStandaloneState = () => {
      setIsStandalonePwa(Boolean(mediaQuery.matches || window.navigator.standalone));
    };

    syncStandaloneState();
    mediaQuery.addEventListener?.('change', syncStandaloneState);

    return () => {
      mediaQuery.removeEventListener?.('change', syncStandaloneState);
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STREAK_SCHEMA_STORAGE_KEY, streakPersistenceAvailable ? 'true' : 'false');
  }, [streakPersistenceAvailable]);

  useEffect(() => {
    if (!milestoneCelebration) return undefined;

    confetti({
      particleCount: 180,
      spread: 90,
      startVelocity: 34,
      origin: { y: 0.62 }
    });

    const timeoutId = window.setTimeout(() => {
      setMilestoneCelebration(null);
    }, 2500);

    return () => window.clearTimeout(timeoutId);
  }, [milestoneCelebration]);

  useEffect(() => {
    if (!isReady || !user) return;
    if (!svNotifs) {
      disablePushSubscription();
      return;
    }
    if (notificationPermission === 'granted') {
      syncPushSubscription();
    }
  }, [disablePushSubscription, isReady, notificationPermission, svNotifs, syncPushSubscription, user]);

  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return undefined;

    const applyInitialNotificationRoute = () => {
      if (window.location.search.includes('tab=') || window.location.search.includes('entry=')) {
        handleNotificationNavigation(window.location.href);
      }
    };

    const handleServiceWorkerMessage = (event) => {
      if (event.data?.type === 'studyvault-notification-click') {
        handleNotificationNavigation(event.data.url || '/');
      }
    };

    applyInitialNotificationRoute();
    navigator.serviceWorker.addEventListener('message', handleServiceWorkerMessage);

    return () => {
      navigator.serviceWorker.removeEventListener('message', handleServiceWorkerMessage);
    };
  }, [handleNotificationNavigation]);

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
        .order('created_at', { ascending: false })
        .limit(30);
      
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
      const { data: insertedNotifications, error: insertError } = await db
        .from('notifications')
        .insert(notifs)
        .select('id, user_id, message, type, entry_id');
      if (insertError) throw insertError;
      await triggerWebPush(insertedNotifications || []);
    } catch (err) {
      console.error('Notify users error:', err);
    }
  }, [supabase, triggerWebPush]);

  // Profile Sync
  const fetchProfile = useCallback(async () => {
    if (!user) return;
    setProfileLoading(true);
    try {
      const db = supabase;
      let data = null;
      let error = null;
      let canPersistStreak = streakPersistenceAvailable;

      if (streakPersistenceAvailable) {
        const streakSelect = await db
          .from('profiles')
          .select('user_id, display_name, avatar_url, bio, reviews_done, current_streak, last_activity_date, streak_freezes')
          .eq('user_id', user.id)
          .maybeSingle();

        if (streakSelect.error?.code === '42703') {
          canPersistStreak = false;
          setStreakPersistenceAvailable(false);
          const fallbackSelect = await db
            .from('profiles')
            .select('user_id, display_name, avatar_url, bio, reviews_done')
            .eq('user_id', user.id)
            .maybeSingle();
          data = fallbackSelect.data ? withStreakDefaults(fallbackSelect.data) : null;
          error = fallbackSelect.error;
        } else {
          setStreakPersistenceAvailable(true);
          data = streakSelect.data ? withStreakDefaults(streakSelect.data) : null;
          error = streakSelect.error;
        }
      } else {
        const fallbackSelect = await db
          .from('profiles')
          .select('user_id, display_name, avatar_url, bio, reviews_done')
          .eq('user_id', user.id)
          .maybeSingle();
        data = fallbackSelect.data ? withStreakDefaults(fallbackSelect.data) : null;
        error = fallbackSelect.error;
      }

      if (error) throw error;
      if (!data) {
        // First-time login — create profile
        const baseProfile = {
          user_id: user.id,
          display_name: (user.fullName || user.firstName || 'Student').trim(),
          avatar_url: user.imageUrl,
          bio: ''
        };
        const insertPayload = canPersistStreak
          ? { ...baseProfile, current_streak: 0, last_activity_date: null, streak_freezes: 2 }
          : baseProfile;
        const { data: newProfile, error: insertError } = await db
          .from('profiles')
          .insert([insertPayload])
          .select()
          .single();
        if (!insertError && newProfile) {
          setProfile(withStreakDefaults(newProfile));
          notifyAllUsers(
            user.id,
            null,
            `${newProfile.display_name} just joined the class! 👋`,
            'new_member'
          );
        }
      } else {
        setProfile(withStreakDefaults(data));
      }
    } catch (err) {
      console.error('Fetch profile error:', err);
    } finally {
      setProfileLoading(false);
    }
  }, [user, supabase, notifyAllUsers, streakPersistenceAvailable]);


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
    const updatedEntry = { ...entry, is_public: true };
    const optimisticFeedItem = {
      posted_at: new Date().toISOString(),
      user_id: user.id,
      entry_id: entry.id,
      entries: updatedEntry,
      profiles: {
        display_name: profile?.display_name || user.firstName || 'You',
        avatar_url: profile?.avatar_url || user.imageUrl || null
      }
    };

    setSelectedEntry(prev => prev?.id === entry.id ? updatedEntry : prev);
    setEntries(prev => prev.map(e => e.id === entry.id ? updatedEntry : e));
    setFeedEntries(prev => {
      if (prev.some(item => item.entry_id === entry.id)) return prev;
      return [optimisticFeedItem, ...prev];
    });

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
      await applyStreakActivity();
      await notifyAllUsers(user.id, entry.id,
        `${profile?.display_name || user.firstName} shared a new question in ${entry.subject}`);

      if (currentTab === 'Feed') await fetchFeed();
    } catch (err) {
      console.error('Share to feed error:', err);
      setSelectedEntry(prev => prev?.id === entry.id ? entry : prev);
      setEntries(prev => prev.map(e => e.id === entry.id ? entry : e));
      setFeedEntries(prev => prev.filter(item => item.entry_id !== entry.id));
      showToast('Failed to share. Try again.', 'error');
    } finally {
      setIsSharing(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedEntry) return;
    await deleteEntryById(selectedEntry, { reopenDetailOnFailure: true });
  };


  const handleRemoveFromFeed = async (entry) => {
    if (!user) return;
    setIsSharing(true);
    const previousFeedEntries = feedEntries;

    setSelectedEntry(prev => prev?.id === entry.id ? { ...prev, is_public: false } : prev);
    setEntries(prev => prev.map(e => e.id === entry.id ? { ...e, is_public: false } : e));
    setFeedEntries(prev => prev.filter(item => item.entry_id !== entry.id));

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
      if (currentTab === 'Feed') await fetchFeed();
    } catch (err) {
      console.error('Remove from feed error:', err);
      setSelectedEntry(prev => prev?.id === entry.id ? { ...entry, is_public: true } : prev);
      setEntries(prev => prev.map(e => e.id === entry.id ? { ...e, is_public: true } : e));
      setFeedEntries(previousFeedEntries);
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
      await syncPushSubscription({ requestPermission: false });
    } else if (permission === 'denied') {
      showToast('Notifications blocked by browser.', 'info');
    }
  };

  const sendTestNotification = async () => {
    if (!user) return;
    showToast('Sending test notification...', 'info');
    try {
      const db = supabase;
      const { data, error } = await db.from('notifications').insert({
        user_id: user.id,
        from_user_id: user.id,
        type: 'test',
        message: 'This is a test notification from StudyVault! 📚',
        is_read: false
      }).select('id, user_id, message, type, entry_id');
      if (error) throw error;
      await triggerWebPush(data || []);
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
    setNotificationsLoading(true);
    setNotificationsError(false);
    try {
      const db = supabase;
      const { data, error } = await db
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);
      if (error) throw error;
      setNotifications(data || []);
    } catch (err) {
      console.error('Fetch notifications error:', err);
      setNotificationsError(true);
    } finally {
      setNotificationsLoading(false);
    }
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
    const notif = notifications.find(n => n.id === notifId);
    if (!notif || notif.is_read) return;

    setNotifications(prev => prev.map(n => n.id === notifId ? { ...n, is_read: true } : n));
    setUnreadCount(prev => Math.max(0, prev - 1));

    try {
      const db = supabase;
      const { error } = await db.from('notifications').update({ is_read: true }).eq('id', notifId);
      if (error) throw error;
    } catch (err) {
      console.error('Mark read error:', err);
      setNotifications(prev => prev.map(n => n.id === notifId ? notif : n));
      setUnreadCount(prev => prev + 1);
      showToast('Could not mark notification as read.', 'error');
    }
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

  const fetchClassmatePreview = useCallback(async () => {
    try {
      const db = supabase;
      const { data, error } = await db
        .from('profiles')
        .select('user_id, display_name, avatar_url')
        .order('user_id', { ascending: true })
        .limit(5);
      if (error) throw error;
      setClassmatePreview(data || []);
    } catch (err) {
      console.error('Fetch classmate preview error:', err);
      setClassmatePreview([]);
    }
  }, [supabase]);


  const fetchFeed = useCallback(async () => {
    setFeedLoading(true);
    setFeedError(false);
    try {
      const db = supabase;
      const { data, error } = await db
        .from('class_feed')
        .select('posted_at, user_id, entry_id, entries!inner(id, question, answer, subject, chapter, tags, image_url, user_id, is_public), profiles!inner(display_name, avatar_url)')
        .order('posted_at', { ascending: false })
        .limit(50);
      if (error) throw error;
      
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
    } catch (err) {
      console.error('Fetch feed error:', err);
      setFeedError(true);
    } finally {
      setFeedLoading(false);
    }
  }, [supabase]);

  const fetchAnswers = useCallback(async (entryId) => {
    if (!entryId) return;
    setAnswersLoading(true);
    setAnswersError(false);
    try {
      const db = supabase;
      const { data, error } = await db
        .from('answers')
        .select(`
          *,
          profiles:user_id(display_name, avatar_url),
          votes:answer_votes(user_id, vote_type)
        `)
        .eq('entry_id', entryId)
        .order('created_at', { ascending: false })
        .limit(100);
      
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
      setAnswersError(true);
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
        const { data: answerNotifications, error: notificationError } = await db.from('notifications').insert({
          user_id: selectedEntry.user_id,
          from_user_id: user.id,
          type: 'new_answer',
          message: `${profile?.display_name || user.firstName} answered your question! 💡`,
          entry_id: selectedEntry.id,
          is_read: false
        }).select('id, user_id, message, type, entry_id');
        if (notificationError) throw notificationError;
        await triggerWebPush(answerNotifications || []);
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
      fetchClassmatePreview();
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
            setBellShakeKey(prev => prev + 1);
            showToast(notif.message, 'info');
            if (Notification.permission === 'granted') {
              new Notification('StudyVault', {
                body: notif.message,
                icon: '/web-app-manifest-192x192.png',
                tag: 'studyvault-notif',
                renotify: true,
              });
            }
            playHaptic(HAPTIC_PATTERNS.notification);
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
    
    if (currentTab && currentTab.toLowerCase() === 'notifications') {
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
    const previousTab = previousTabRef.current;
    const horizontalOrder = ['Home', 'Starred', 'Feed', 'Review', 'Notifications'];

    if (currentTab === previousTab) return;

    if (currentTab === 'Profile') {
      setPageTransition({ axis: 'y', direction: 1 });
    } else if (previousTab === 'Profile') {
      setPageTransition({ axis: 'y', direction: -1 });
    } else {
      const previousIndex = horizontalOrder.indexOf(previousTab);
      const currentIndex = horizontalOrder.indexOf(currentTab);
      setPageTransition({
        axis: 'x',
        direction: currentIndex >= previousIndex ? 1 : -1,
      });
    }

    previousTabRef.current = currentTab;
  }, [currentTab]);

  useEffect(() => {
    if (!loading && entries.length > 0 && !hasAnimatedEntryList) {
      setHasAnimatedEntryList(true);
    }
  }, [entries.length, hasAnimatedEntryList, loading]);

  useEffect(() => {
    document.title = "StudyVault — Class X";
    const handleKeyDown = (e) => {
      // Escape key closes modals/detail
      if (e.key === 'Escape') {
        setShowLightbox(false);
        closeEntryComposer();
        setSelectedEntry(null);
        setShowDeleteConfirm(false);
        setCardActionEntry(null);
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
  }, [closeEntryComposer]);


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
    setStarAnimationState({ id: entryToToggle.id, starred: newStarredStatus });
    playHaptic(newStarredStatus ? HAPTIC_PATTERNS.starOn : HAPTIC_PATTERNS.starOff);
    // Optimistic update
    setEntries(prev => prev.map(en => en.id === entryToToggle.id ? { ...en, starred: newStarredStatus } : en));
    if (selectedEntry?.id === entryToToggle.id) {
      setSelectedEntry(prev => ({ ...prev, starred: newStarredStatus }));
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

  const deleteEntryById = useCallback(async (entryToDelete, options = {}) => {
    if (!entryToDelete) return;
    const previousEntries = entries;
    const previousFeedEntries = feedEntries;
    const wasSelectedEntry = selectedEntry?.id === entryToDelete.id;
    setIsDeleting(true);
    setEntries(prev => prev.filter(e => e.id !== entryToDelete.id));
    setFeedEntries(prev => prev.filter(f => f.entry_id !== entryToDelete.id));
    setSwipeOffsets(prev => ({ ...prev, [entryToDelete.id]: 0 }));
    setCardActionEntry(null);
    setShowDeleteConfirm(false);
    if (wasSelectedEntry) {
      setSelectedEntry(null);
    }
    try {
      const db = supabase;

      // 1. Delete associated image from storage if exists
      if (entryToDelete.image_url) {
        try {
          // Find where the bucket name ends and the file path begins
          const bucketString = 'entry-images/';
          const pathIndex = entryToDelete.image_url.indexOf(bucketString);
          
          if (pathIndex !== -1) {
            // Extract strictly the file name/path
            const filePath = entryToDelete.image_url.substring(pathIndex + bucketString.length);
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
      const { error } = await db.from('entries').delete().eq('id', entryToDelete.id);
      if (error) throw error;
      
      // Update local state
      setEntries(prev => prev.filter(e => e.id !== entryToDelete.id));
      setFeedEntries(prev => prev.filter(f => f.entry_id !== entryToDelete.id));
      
      setShowDeleteConfirm(false);
      if (wasSelectedEntry) {
        setSelectedEntry(null);
      }
      playHaptic(HAPTIC_PATTERNS.deleteEntry);
      showToast('✓ Entry deleted', 'success');
    } catch (err) {
      console.error('Delete error:', err);
      setEntries(previousEntries);
      setFeedEntries(previousFeedEntries);
      if (wasSelectedEntry || options.reopenDetailOnFailure) {
        setSelectedEntry(entryToDelete);
      }
      if (wasSelectedEntry) {
        setShowDeleteConfirm(true);
      }
      showToast('Delete failed. Try again.', 'error');
    } finally {
      setIsDeleting(false);
    }
  }, [entries, feedEntries, playHaptic, selectedEntry, showToast, supabase]);

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
    const tempId = createTempId('entry');
    const isEditingEntry = Boolean(editingEntryId);
    const existingEntry = isEditingEntry ? entries.find(entry => entry.id === editingEntryId) : null;
    const formSnapshot = {
      editingEntryId,
      question: formQuestion,
      subject: formSubject,
      chapter: formChapter,
      answer: formAnswer,
      tags: formTags,
      imageFile,
      imagePreview,
    };
    
    try {
      const db = supabase;
      const parsedTags = formTags
        ? formTags.split(',').map(t => t.trim()).filter(Boolean)
        : [];

      let imageUrl = typeof imagePreview === 'string' ? imagePreview : (existingEntry?.image_url || null);
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
        user_id: existingEntry?.user_id || user?.id,
        starred: existingEntry?.starred ?? false,
        is_public: existingEntry?.is_public ?? false,
        image_url: imageUrl,
      };

      const optimisticEntry = {
        ...(existingEntry || {}),
        ...newEntry,
        id: existingEntry?.id || tempId,
        created_at: existingEntry?.created_at || new Date().toISOString(),
        review_count: existingEntry?.review_count || 0,
        last_reviewed: existingEntry?.last_reviewed || null,
      };

      if (isEditingEntry) {
        setEntries(prev => prev.map(entry => entry.id === editingEntryId ? optimisticEntry : entry));
        setSelectedEntry(prev => prev?.id === editingEntryId ? optimisticEntry : prev);
        showToast('Saving changes...', 'info');
      } else {
        setEntries(prev => [optimisticEntry, ...prev]);
        showToast('Saving entry...', 'info');
      }
      resetEntryComposer();
      setShowAddEntry(false);

      const query = isEditingEntry
        ? db.from('entries').update(newEntry).eq('id', editingEntryId).select()
        : db.from('entries').insert(newEntry).select();
      const { data, error } = await query;
      
      if (error) throw error;
      
      // Update local state (no longer auto-shares to feed)
      if (data && data.length > 0) {
        const savedEntry = data[0];
        if (isEditingEntry) {
          setEntries(prev => prev.map(entry => entry.id === editingEntryId ? savedEntry : entry));
          setSelectedEntry(prev => prev?.id === editingEntryId ? savedEntry : prev);
          showToast('Changes saved', 'success');
        } else {
          setEntries(prev => prev.map(entry => entry.id === tempId ? savedEntry : entry));
          playHaptic(HAPTIC_PATTERNS.saveSuccess);
          await applyStreakActivity();
          showToast('✓ Entry saved', 'success');
        }
        setEditingEntryId(null);
      }
    } catch (err) {
      console.error('Save error:', err);
      if (isEditingEntry && existingEntry) {
        setEntries(prev => prev.map(entry => entry.id === editingEntryId ? existingEntry : entry));
        setSelectedEntry(prev => prev?.id === editingEntryId ? existingEntry : prev);
      } else {
        setEntries(prev => prev.filter(entry => entry.id !== tempId));
      }
      setEditingEntryId(formSnapshot.editingEntryId);
      setFormQuestion(formSnapshot.question);
      setFormSubject(formSnapshot.subject);
      setFormChapter(formSnapshot.chapter);
      setFormAnswer(formSnapshot.answer);
      setFormTags(formSnapshot.tags);
      setImageFile(formSnapshot.imageFile);
      setImagePreview(formSnapshot.imagePreview);
      setAddStep(2);
      setShowAddEntry(true);
      showToast('Something went wrong. Try again.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEntryCardClick = useCallback((entry) => {
    if (suppressCardClickRef.current) {
      suppressCardClickRef.current = false;
      return;
    }
    setSelectedEntry(entry);
  }, []);

  const clearLongPressTimer = useCallback(() => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  }, []);

  const handleCardPointerDown = useCallback((entry, event) => {
    if (entry.user_id !== user?.id) return;
    suppressCardClickRef.current = false;
    pointerSessionRef.current = {
      entryId: entry.id,
      startX: event.clientX,
      startY: event.clientY,
      width: event.currentTarget.offsetWidth || 1,
      swiping: false,
      pointerType: event.pointerType
    };
    clearLongPressTimer();
    longPressTimerRef.current = window.setTimeout(() => {
      suppressCardClickRef.current = true;
      setCardActionEntry(entry);
      setSwipeOffsets(prev => ({ ...prev, [entry.id]: 0 }));
      pointerSessionRef.current = null;
    }, 420);
  }, [clearLongPressTimer, user?.id]);

  const handleCardPointerMove = useCallback((entry, event) => {
    const session = pointerSessionRef.current;
    if (!session || session.entryId !== entry.id || entry.user_id !== user?.id) return;

    const deltaX = event.clientX - session.startX;
    const deltaY = event.clientY - session.startY;

    if (Math.abs(deltaY) > 10 && Math.abs(deltaY) > Math.abs(deltaX)) {
      clearLongPressTimer();
      pointerSessionRef.current = null;
      setSwipeOffsets(prev => ({ ...prev, [entry.id]: 0 }));
      return;
    }

    if (deltaX < -12 && Math.abs(deltaX) > Math.abs(deltaY)) {
      clearLongPressTimer();
      session.swiping = true;
      suppressCardClickRef.current = true;
      const nextOffset = Math.max(deltaX, -session.width * 0.78);
      setSwipeOffsets(prev => ({ ...prev, [entry.id]: nextOffset }));
    }
  }, [clearLongPressTimer, user?.id]);

  const handleCardPointerEnd = useCallback(async (entry) => {
    const session = pointerSessionRef.current;
    clearLongPressTimer();

    if (session && session.entryId === entry.id && session.swiping) {
      const offset = swipeOffsets[entry.id] || 0;
      pointerSessionRef.current = null;
      if (Math.abs(offset) >= session.width * 0.6) {
        await deleteEntryById(entry);
      } else {
        setSwipeOffsets(prev => ({ ...prev, [entry.id]: 0 }));
      }
      return;
    }

    pointerSessionRef.current = null;
    setSwipeOffsets(prev => ({ ...prev, [entry.id]: 0 }));
  }, [clearLongPressTimer, deleteEntryById, swipeOffsets]);


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
      await applyStreakActivity();
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
  const currentPageTitle = TAB_TITLES[currentTab] || 'StudyVault';
  const currentPageSubtitle = currentTab === 'Home'
    ? `${filteredEntries.length} saved answers ready to revisit`
    : currentTab === 'Starred'
      ? `${starred} starred answers kept handy`
      : currentTab === 'Feed'
        ? `${memberCount} members active in the class feed`
        : currentTab === 'Review'
          ? `${reviewQueue.length} ${reviewQueue.length === 1 ? 'entry needs' : 'entries need'} review`
          : currentTab === 'Notifications'
            ? `${unreadCount} unread notifications`
            : 'Manage your account and study preferences';
  const isHomeSearchExpanded = activeSearchSurface === 'home' || searchQuery.length > 0;
  const isFeedSearchExpanded = activeSearchSurface === 'feed' || feedSearch.length > 0;
  const currentStreak = profile?.current_streak || 0;
  const currentStreakFreezes = profile?.streak_freezes ?? 2;
  const nextReviewDueLabel = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(
    new Date(Date.now() + 24 * 60 * 60 * 1000)
  );
  const isDesktopSummaryVisible = !selectedEntry && !showAddEntry && currentTab !== 'Profile';
  const shouldAnimateEntryCards = !hasAnimatedEntryList && !loading && entries.length > 0 && (currentTab === 'Home' || currentTab === 'Starred');

  if (!isLoaded) {
    return (
      <div className="skeleton-app-shell">
        <div className="skeleton-app-shell__content">
          <EntryCardSkeleton />
          <EntryCardSkeleton />
          <EntryCardSkeleton />
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Clerk Loading State - prevent blank page flash */}
      {!isLoaded && null}
      <SignedIn>
        <div className={`app-shell ${isStandalonePwa ? 'app-shell--standalone' : ''}`}>
          <aside className="desktop-sidebar">
            <div className="desktop-sidebar__brand card-base">
              <div className="desktop-sidebar__logo">SV</div>
              <div>
                <div className="desktop-sidebar__title">StudyVault</div>
                <div className="desktop-sidebar__subtitle">Class X knowledge hub</div>
              </div>
            </div>

            <div className="desktop-sidebar__profile card-base">
              <div className="desktop-sidebar__avatar" onClick={() => navigateToTab('Profile')}>
                {(profile?.avatar_url || user?.imageUrl) ? (
                  <img src={profile?.avatar_url || user?.imageUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (profile?.display_name || user?.firstName || 'U')[0].toUpperCase()}
              </div>
              <div className="desktop-sidebar__profile-copy">
                <div className="desktop-sidebar__profile-name">{profile?.display_name || user?.firstName || 'User'}</div>
                <div className="desktop-sidebar__profile-email">{user?.primaryEmailAddress?.emailAddress}</div>
              </div>
            </div>

            <div className="desktop-sidebar__nav card-base">
              {TAB_ITEMS.map((item) => (
                <NavItemButton
                  key={item.id}
                  item={item}
                  active={currentTab === item.id}
                  badge={item.id === 'Notifications' ? unreadCount : 0}
                  bellShakeKey={bellShakeKey}
                  onClick={() => navigateToTab(item.id)}
                />
              ))}
            </div>

            <button className="desktop-sidebar__add btn-primary press" onClick={() => { resetEntryComposer(); setShowAddEntry(true); }}>
              <Plus size={18} strokeWidth={2.3} />
              Add New Entry
            </button>
          </aside>

          <div className="app-main-shell">
            <div className="content-area scroll-native app-main-scroll">
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

      <AnimatePresence>
        {milestoneCelebration && (
          <MotionDiv
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 120,
              backgroundColor: 'rgba(15, 23, 42, 0.54)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px'
            }}
          >
            <MotionDiv
              initial={{ opacity: 0, scale: 0.9, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 12 }}
              transition={SHEET_SPRING}
              className="card-base"
              style={{
                width: 'min(100%, 360px)',
                padding: '32px 24px',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                alignItems: 'center'
              }}
            >
              <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '72px', height: '72px', borderRadius: '999px', backgroundColor: COLORS.accentLight, color: COLORS.accent }}>
                <Flame size={34} strokeWidth={2.2} />
              </div>
              <div style={{ fontSize: '42px', lineHeight: 1, fontWeight: '800', color: COLORS.accent }}>
                {milestoneCelebration.streak}
              </div>
              <div style={{ fontSize: '20px', fontWeight: '700', color: COLORS.textDark }}>
                Streak milestone reached
              </div>
              <div style={{ fontSize: '14px', color: COLORS.textMuted, lineHeight: '1.6' }}>
                You just hit {milestoneCelebration.streak} days in a row. Keep the momentum going.
              </div>
            </MotionDiv>
          </MotionDiv>
        )}
      </AnimatePresence>

      {/* MAIN CONTENT WRAPPER */}
        
        {/* HOMEPAGE VIEW */}
        <div className={`app-page safe-bottom-pad ${currentTab === 'Profile' ? 'app-page-profile' : ''}`} style={{ 
          display: (selectedEntry || showAddEntry) ? 'none' : 'flex', 
          flexDirection: 'column', 
          gap: '24px'
        }}>
          <div className="desktop-page-header card-base">
            <div>
              <div className="desktop-page-header__eyebrow">{currentTab === 'Home' ? 'Welcome back' : 'StudyVault'}</div>
              <h1 className="desktop-page-header__title">{currentPageTitle}</h1>
              <p className="desktop-page-header__subtitle">{currentPageSubtitle}</p>
              {currentTab === 'Home' && currentStreak > 0 && (
                <div style={{ marginTop: '12px', display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 12px', borderRadius: '999px', backgroundColor: COLORS.accentLight, color: COLORS.accent, fontSize: '13px', fontWeight: '700' }}>
                  <Flame size={16} strokeWidth={2.2} />
                  <span>{currentStreak} day streak</span>
                </div>
              )}
            </div>
            <div className="desktop-page-header__actions">
              {(currentTab === 'Home' || currentTab === 'Starred') && (
                <button
                  onClick={() => {
                    setIsSearchVisible(!isSearchVisible);
                    if (!isSearchVisible) {
                      setActiveSearchSurface('home');
                      setTimeout(() => searchInputRef.current?.focus(), 100);
                    } else {
                      setActiveSearchSurface(null);
                    }
                  }}
                  className="desktop-header-icon press"
                  style={{
                    backgroundColor: isSearchVisible ? COLORS.primary : COLORS.cardSurface,
                    color: isSearchVisible ? '#FFF' : COLORS.textMuted
                  }}
                >
                  <ICONS.Search />
                </button>
              )}
              <button className="btn-primary desktop-page-header__add press" onClick={() => { resetEntryComposer(); setShowAddEntry(true); }}>
                <Plus size={18} strokeWidth={2.3} />
                Add Entry
              </button>
            </div>
          </div>
          <AnimatePresence mode="wait" initial={false}>
            <MotionDiv
              key={currentTab}
              className="page-transition-shell"
              initial={
                pageTransition.axis === 'y'
                  ? { opacity: 0, y: 28 }
                  : { opacity: 0, x: 24 * pageTransition.direction }
              }
              animate={{ opacity: 1, x: 0, y: 0 }}
              exit={
                pageTransition.axis === 'y'
                  ? { opacity: 0, y: -18 * pageTransition.direction }
                  : { opacity: 0, x: -24 * pageTransition.direction }
              }
              transition={{ duration: PAGE_DURATION, ease: PAGE_EASE }}
            >
          {/* 1. HEADER ROW (Hidden on Search and Profile) */}
          {(currentTab === 'Home' || currentTab === 'Starred') && (
            <div className="hero-header" style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              backgroundColor: COLORS.cardSurface,
              padding: '20px 16px 16px',
              borderRadius: '20px',
              boxShadow: COLORS.shadow,
              borderBottom: '1px solid #E5E7EB'
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
                {currentStreak > 0 && (
                  <div style={{ marginTop: '10px', display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 10px', borderRadius: '999px', backgroundColor: COLORS.accentLight, color: COLORS.accent, fontSize: '12px', fontWeight: '700' }}>
                    <Flame size={14} strokeWidth={2.2} />
                    <span>{currentStreak} day streak</span>
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button
                  onClick={() => {
                    setIsSearchVisible(!isSearchVisible);
                    if (!isSearchVisible) {
                      setActiveSearchSurface('home');
                      setTimeout(() => searchInputRef.current?.focus(), 100);
                    } else {
                      setActiveSearchSurface(null);
                    }
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
                  onClick={() => navigateToTab('Profile')}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: COLORS.bg,
                    color: COLORS.textMuted,
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
            profileLoading ? (
              <ProfileSkeleton />
            ) : (
            <div className="profile-layout">
              {/* Profile Card */}
              <div className="profile-card" style={{
                backgroundColor: COLORS.cardSurface,
                borderRadius: '24px',
                padding: '16px',
                boxShadow: COLORS.shadow,
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center',
                position: 'relative',
                width: '100%'
              }}>
                <div style={{ position: 'relative', width: '90px', height: '90px', marginBottom: '8px' }}>
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
                      <SkeletonBlock width={44} height={44} radius={999} />
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
                  <div style={{ display: 'flex', gap: '12px', marginBottom: '8px' }}>
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

                <div style={{ backgroundColor: COLORS.bg, color: COLORS.textMuted, padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase' }}>
                  Class X
                </div>
                <div style={{ fontSize: '12px', color: COLORS.textMuted }}>
                  {currentStreakFreezes} freeze{currentStreakFreezes === 1 ? '' : 's'} left
                </div>
              </div>

              {/* Stats Row */}
              <div className="profile-stats">
                {[
                  { label: 'My Entries', value: totalSaved },
                  { label: 'My Starred', value: starred },
                  { label: 'Reviews Done', value: profile?.reviews_done || 0 }
                ].map((stat, i) => (
                  <div className="profile-stat-card" key={i} style={{ flex: 1, backgroundColor: COLORS.cardSurface, padding: '12px 8px', borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', minWidth: 0 }}>
                    <span style={{ fontSize: '16px', fontWeight: 'bold', color: COLORS.textDark }}>{stat.value}</span>
                    <span style={{ fontSize: '9px', color: COLORS.textMuted, textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.3px' }}>{stat.label}</span>
                  </div>
                ))}
              </div>

              <div className="profile-settings-card" style={{ backgroundColor: COLORS.cardSurface, borderRadius: '24px', overflow: 'hidden', boxShadow: COLORS.shadow }}>
                <SettingRow icon={ICONS.Lock} label="Change Password" onClick={() => setShowClerkSettings(true)} />
                <SettingRow icon={ICONS.Edit} label={`My Review Queue (${reviewQueue.length})`} onClick={() => navigateToTab('Review')} />
                <SettingRow icon={ICONS.Bell} label="Notification Status" onClick={() => {
                  if (notificationPermission === 'default') requestNotificationPermission();
                }}>
                  <div style={{ fontSize: '12px', fontWeight: '600', color: notificationPermission === 'granted' && pushRegistered ? COLORS.green : (notificationPermission === 'unsupported' ? COLORS.textMuted : COLORS.danger) }}>
                    {notificationPermission === 'unsupported'
                      ? 'UNSUPPORTED'
                      : notificationPermission !== 'granted'
                        ? notificationPermission.toUpperCase()
                        : !svNotifs
                          ? 'MUTED'
                          : pushSupported && pushRegistered
                            ? 'BACKGROUND READY'
                            : 'FOREGROUND ONLY'}
                  </div>
                </SettingRow>
                {/* Enable Browser Notifications button — shown only when not yet granted */}
                {notificationPermission !== 'granted' && notificationPermission !== 'unsupported' && (
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
                  localStorage.setItem('sv_notifs_enabled', String(next));
                  if (next) {
                    syncPushSubscription({ requestPermission: notificationPermission !== 'granted' });
                  } else {
                    disablePushSubscription();
                  }
                }} />
                <SettingRow icon={ICONS.Moon} label="App Theme" isTheme currentTheme={svTheme} onThemeChange={(t) => {
                  setSvTheme(t);
                  localStorage.setItem('sv_theme', t);
                }} />
                <SettingRow icon={ICONS.LogOut} label="Sign Out" isDestructive onClick={() => setShowSignOutConfirm(true)} />
              </div>
            </div>
            )
          )}


          {/* 3. CLASS FEED VIEW */}
          {currentTab === 'Feed' && (
            <div className="stack-layout">
              <div className="section-heading" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: COLORS.textDark, margin: 0 }}>Class Feed</h2>
                  <p style={{ fontSize: '13px', color: COLORS.textMuted, margin: '2px 0 0 0' }}>{memberCount} members active</p>
                </div>
              </div>

              {/* Feed Search */}
              <AnimatedSearchField
                id="feed-search"
                name="feed-search"
                value={feedSearch}
                onChange={setFeedSearch}
                placeholder="Search the feed..."
                isExpanded={isFeedSearchExpanded}
                onFocus={() => setActiveSearchSurface('feed')}
                onBlur={() => setActiveSearchSurface(prev => (prev === 'feed' ? null : prev))}
                onCancel={() => {
                  setFeedSearch('');
                  setActiveSearchSurface(null);
                }}
              />

              {feedLoading ? (
                <div className="stack-list">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <FeedCardSkeleton key={index} />
                  ))}
                </div>
              ) : feedError ? (
                <div style={{ padding: '48px 24px', textAlign: 'center', backgroundColor: COLORS.cardSurface, borderRadius: '18px', border: `1px solid ${COLORS.cardBorder}`, boxShadow: COLORS.shadow }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '700', color: COLORS.textDark, margin: '0 0 8px 0' }}>Could not load the class feed</h3>
                  <p style={{ fontSize: '13px', color: COLORS.textMuted, margin: '0 0 20px 0' }}>Check your connection and try again.</p>
                  <button onClick={fetchFeed} className="btn-primary press" style={{ maxWidth: '220px' }}>Retry Feed</button>
                </div>
              ) : filteredFeedEntries.length === 0 ? (
                <div className="card-base" style={{ padding: '40px 24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <AvatarStack profiles={classmatePreview} />
                  <div style={{ fontSize: '13px', color: COLORS.textMuted, margin: classmatePreview.length > 0 ? '0 0 14px 0' : '6px 0 14px 0' }}>
                    {memberCount} {memberCount === 1 ? 'member' : 'members'} in class
                  </div>
                  <h3 style={{ fontSize: '18px', fontWeight: '700', color: COLORS.textDark, margin: '0 0 8px 0' }}>Be the first to share a question with your class.</h3>
                  <p style={{ fontSize: '13px', color: COLORS.textMuted, margin: '0 0 24px 0' }}>One shared entry can help everyone revise faster.</p>
                  <button 
                    onClick={() => navigateToTab('Home')}
                    className="btn-primary press"
                    style={{ maxWidth: '240px' }}
                  >Share an Entry</button>
                </div>
              ) : (
                <div className="stack-list">
                  {filteredFeedEntries.map((item, idx) => (
                    <div 
                      className="feed-card"
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
                          <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: COLORS.bg, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold', color: COLORS.textMuted }}>
                            {item.profiles.avatar_url ? (
                              <img src={item.profiles.avatar_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                            ) : item.profiles.display_name[0].toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontSize: '14px', fontWeight: '700', color: COLORS.textDark }}>{item.profiles.display_name}</div>
                            <div style={{ fontSize: '11px', color: COLORS.textMuted }}>{getTimeAgo(item.posted_at)}</div>
                          </div>
                        </div>
                        <div style={{ backgroundColor: COLORS.greenLight, color: COLORS.green, padding: '2px 10px', borderRadius: '10px', fontSize: '10px', fontWeight: 'bold' }}>
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
                        <div style={{ fontSize: '12px', color: COLORS.textMuted, fontWeight: '600' }}>View Full Answer →</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 5. NOTIFICATIONS VIEW */}
          {currentTab === 'Notifications' && (
            <div className="stack-layout">
              <div className="section-heading" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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

              {notificationsLoading ? (
                <div className="stack-list">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <NotificationSkeleton key={index} />
                  ))}
                </div>
              ) : notificationsError ? (
                <div style={{ padding: '48px 24px', textAlign: 'center', backgroundColor: COLORS.cardSurface, borderRadius: '18px', border: `1px solid ${COLORS.cardBorder}`, boxShadow: COLORS.shadow }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '700', color: COLORS.textDark, margin: '0 0 8px 0' }}>Could not load notifications</h3>
                  <p style={{ fontSize: '13px', color: COLORS.textMuted, margin: '0 0 20px 0' }}>Please try again in a moment.</p>
                  <button onClick={fetchNotifications} className="btn-primary press" style={{ maxWidth: '240px' }}>Retry Notifications</button>
                </div>
              ) : notifications.length === 0 ? (
                <div className="card-base" style={{ padding: '64px 20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Bell size={48} strokeWidth={1.8} style={{ color: COLORS.textMuted, marginBottom: '16px' }} />
                  <h3 style={{ fontSize: '18px', fontWeight: '700', color: COLORS.textDark, margin: '0 0 8px 0' }}>You are all caught up.</h3>
                  <p style={{ fontSize: '13px', color: COLORS.textMuted, margin: 0 }}>Notifications will appear when classmates share entries.</p>
                </div>
              ) : (
                <div className="stack-list">
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
                        backgroundColor: notif.is_read ? COLORS.cardSurface : COLORS.dangerLight,
                        borderRadius: '16px',
                        padding: '14px 16px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                        border: notif.is_read ? 'none' : '1px solid #FECACA'
                      }}
                    >
                      <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: COLORS.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                        {notif.profiles?.avatar_url ? (
                          <img src={notif.profiles.avatar_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                        ) : (
                          <span style={{ color: COLORS.textDark, fontSize: '14px', fontWeight: 'bold' }}>
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
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: COLORS.danger }}></div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 4. SEARCH BAR (Shown on Home when toggled or on Feed) */}
          {(currentTab === 'Home' && isSearchVisible) && (
            <AnimatedSearchField
                id="home-search"
                name="home-search"
                inputRef={searchInputRef}
                placeholder="Search your questions..."
                value={searchQuery}
                onChange={setSearchQuery}
                isExpanded={isHomeSearchExpanded}
                onFocus={() => setActiveSearchSurface('home')}
                onBlur={() => setActiveSearchSurface(prev => (prev === 'home' ? null : prev))}
                onCancel={() => {
                  setSearchQuery('');
                  setIsSearchVisible(false);
                  setActiveSearchSurface(null);
                }}
              />
          )}

          {/* 4. FILTER ROW (Hidden on Profile, Review, Feed) */}
          {currentTab !== 'Profile' && currentTab !== 'Review' && currentTab !== 'Feed' && (
            <div className="hide-scrollbar subject-filter-row" style={{
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
                      outline: 'none',
                      position: 'relative',
                      overflow: 'hidden',
                      paddingBottom: '11px'
                    }}
                  >
                    <span style={{ position: 'relative', zIndex: 1 }}>{subject}</span>
                    {isSelected && (
                      <MotionDiv
                        layoutId="subject-filter-indicator"
                        className="subject-filter-indicator"
                        transition={{ type: 'spring', stiffness: 500, damping: 38 }}
                      />
                    )}
                  </button>
                )
              })}
            </div>
          )}

          {/* 5. ENTRIES LIST (Hidden on Profile, Review, Feed) */}
          {currentTab !== 'Profile' && currentTab !== 'Review' && currentTab !== 'Feed' && (
            <div className="entries-grid">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => <EntryCardSkeleton key={i} />)
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
                <div className="card-base animate-fade-in-up" style={{
                  textAlign: 'center',
                  padding: '44px 24px',
                  color: COLORS.textMuted,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '16px'
                }}>
                  <EmptyBookIllustration />
                  <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '700', color: COLORS.textDark }}>Your vault is empty.</h3>
                  <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.6', color: COLORS.textMuted, maxWidth: '30rem' }}>
                    Start by saving your first question.
                  </p>
                  <button
                    onClick={() => { resetEntryComposer(); setShowAddEntry(true); }}
                    className="btn-primary press"
                    style={{ maxWidth: '240px' }}
                  >
                    Add First Entry
                  </button>
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
                    key={entry.id}
                    style={{
                      position: 'relative',
                      borderRadius: '18px',
                      overflow: 'hidden',
                      backgroundColor: entry.user_id === user?.id ? COLORS.danger : 'transparent'
                    }}
                  >
                  {entry.user_id === user?.id && (
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      paddingRight: '20px',
                      color: '#fff'
                    }}>
                      <Trash2 size={18} strokeWidth={2.2} />
                    </div>
                  )}
                  <MotionDiv
                    className="animate-fade-in-up border border-borderSoft shadow-soft entry-card"
                    initial={shouldAnimateEntryCards ? { opacity: 0, y: 16 } : false}
                    animate={{
                      ...(shouldAnimateEntryCards ? { opacity: 1, y: 0 } : {}),
                      x: swipeOffsets[entry.id] || 0
                    }}
                    transition={shouldAnimateEntryCards ? { duration: 0.22, delay: idx * 0.04, ease: PAGE_EASE } : { duration: 0.16 }}
                    onClick={() => handleEntryCardClick(entry)}
                    onContextMenu={(e) => {
                      if (entry.user_id !== user?.id) return;
                      e.preventDefault();
                      setCardActionEntry(entry);
                    }}
                    onPointerDown={(e) => handleCardPointerDown(entry, e)}
                    onPointerMove={(e) => handleCardPointerMove(entry, e)}
                    onPointerUp={() => handleCardPointerEnd(entry)}
                    onPointerCancel={() => handleCardPointerEnd(entry)}
                    style={{
                      backgroundColor: COLORS.cardSurface,
                      borderRadius: '18px',
                      padding: '20px',
                      cursor: 'pointer',
                      position: 'relative',
                      transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                      touchAction: entry.user_id === user?.id ? 'pan-y' : 'auto'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = 'scale(1.01) translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 8px 24px rgba(15,23,42,0.08)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'scale(1) translateY(0)';
                      e.currentTarget.style.boxShadow = COLORS.shadow;
                    }}
                  >
                    <MotionButton 
                      onClick={(e) => handleToggleStar(entry, e)}
                      animate={starAnimationState.id === entry.id ? (starAnimationState.starred ? STAR_ON_ANIMATION : STAR_OFF_ANIMATION) : { scale: 1 }}
                      transition={starAnimationState.id === entry.id ? (starAnimationState.starred ? STAR_ON_TRANSITION : STAR_OFF_TRANSITION) : { duration: 0.12 }}
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
                    </MotionButton>
                    
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

                    <div className="entry-card__meta" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div className="entry-card__meta-main" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{
                          backgroundColor: COLORS.bg,
                          color: COLORS.textMuted,
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
                  </MotionDiv>
                  </div>
                ))
              )}
            </div>
          )}

          {/* 6. REVIEW QUEUE (Visible only on Review Tab) */}
          {currentTab === 'Review' && (
            <div className="animate-fade-in-up stack-layout" style={{ paddingBottom: '24px' }}>
              <div className="section-heading section-heading--center" style={{ textAlign: 'center', marginBottom: '8px' }}>
                <h2 style={{ margin: '0 0 8px 0', fontSize: '24px', fontWeight: '700', color: COLORS.textDark }}>Review Queue</h2>
                <p style={{ margin: 0, fontSize: '14px', color: COLORS.textMuted }}>
                  {reviewQueue.length} {reviewQueue.length === 1 ? 'entry needs' : 'entries need'} review today
                </p>
              </div>

              {reviewQueue.length === 0 ? (
                <div className="card-base" style={{
                  backgroundColor: COLORS.greenLight,
                  borderRadius: '20px',
                  padding: '48px 20px',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '16px'
                }}>
                  <Check size={48} strokeWidth={2} style={{ color: COLORS.green }} />
                  <div style={{ color: COLORS.textDark, fontWeight: '700', fontSize: '18px' }}>
                    Nothing to review today.
                  </div>
                  <div style={{ color: COLORS.textPrimary, fontSize: '14px' }}>
                    Come back tomorrow.
                  </div>
                  <div style={{ color: COLORS.textMuted, fontSize: '12px' }}>
                    Next review due: {nextReviewDueLabel}
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
                          backgroundColor: COLORS.accentLight,
                          color: COLORS.accent,
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
                            backgroundColor: COLORS.bg,
                            color: COLORS.textDark,
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
                          onMouseOver={e => e.currentTarget.style.backgroundColor = '#E5E7EB'}
                          onMouseOut={e => e.currentTarget.style.backgroundColor = COLORS.bg}
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
                                backgroundColor: COLORS.greenLight,
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

          {isDesktopSummaryVisible && (
            <aside className="desktop-summary card-base">
              <div className="desktop-summary__section">
                <div className="desktop-summary__eyebrow">Overview</div>
                <h3 className="desktop-summary__title">{currentPageTitle}</h3>
                <p className="desktop-summary__text">{currentPageSubtitle}</p>
              </div>

              <div className="desktop-summary__stats">
                <div className="desktop-summary__stat">
                  <span className="desktop-summary__stat-value">{totalSaved}</span>
                  <span className="desktop-summary__stat-label">Saved</span>
                </div>
                <div className="desktop-summary__stat">
                  <span className="desktop-summary__stat-value">{starred}</span>
                  <span className="desktop-summary__stat-label">Starred</span>
                </div>
                <div className="desktop-summary__stat">
                  <span className="desktop-summary__stat-value">{reviewQueue.length}</span>
                  <span className="desktop-summary__stat-label">To review</span>
                </div>
              </div>

              <div className="desktop-summary__section desktop-summary__tips">
                <div className="desktop-summary__eyebrow">Quick actions</div>
                <button className="btn-secondary press" onClick={() => navigateToTab('Review')}>
                  <RefreshCw size={16} strokeWidth={2.1} />
                  Open Review Queue
                </button>
                <button className="btn-secondary press" onClick={() => navigateToTab('Starred')}>
                  <Star size={16} strokeWidth={2.1} />
                  View Starred
                </button>
              </div>
            </aside>
          )}
            </MotionDiv>
          </AnimatePresence>
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
        overflowY: 'auto',
        overflowX: 'hidden',
        paddingTop: 'env(safe-area-inset-top, 0px)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)'
      }}>
        {/* Detail view no longer needs the complex dark pattern */}

        {selectedEntry && (
          <div style={{
            position: 'relative',
            zIndex: 1,
            width: 'min(100%, 480px)',
            margin: '0 auto',
            minHeight: '100dvh',
            display: 'flex',
            flexDirection: 'column',
            paddingBottom: 'calc(112px + env(safe-area-inset-bottom, 0px))'
          }}>
            {/* Overlay Top Bar */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '18px 20px 16px',
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
                <MotionButton 
                  onClick={() => handleToggleStar(selectedEntry)}
                  animate={starAnimationState.id === selectedEntry.id ? (starAnimationState.starred ? STAR_ON_ANIMATION : STAR_OFF_ANIMATION) : { scale: 1 }}
                  transition={starAnimationState.id === selectedEntry.id ? (starAnimationState.starred ? STAR_ON_TRANSITION : STAR_OFF_TRANSITION) : { duration: 0.12 }}
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
                </MotionButton>
              </div>
            </div>

            {/* Shared By info (if not owner) */}
            {selectedEntry.user_id !== user.id && (
              <div style={{ padding: '4px 20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ backgroundColor: COLORS.bg, padding: '4px 10px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '10px', color: COLORS.textMuted, fontWeight: '700' }}>SHARED BY</span>
                  <div style={{ width: '18px', height: '18px', borderRadius: '50%', backgroundColor: COLORS.textMuted, color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '8px', fontWeight: 'bold', overflow: 'hidden' }}>
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
                      {isDeleting ? 'Deleting...' : 'Delete'}
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
                backgroundColor: COLORS.bg,
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
                        {isSharing ? 'Sharing...' : '🚀 Share to Class Feed'}
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
                          {isSharing ? 'Removing...' : 'Remove'}
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
                      color: COLORS.textMuted,
                      backgroundColor: COLORS.bg,
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
                        {isSubmittingAnswer ? 'Submitting...' : 'Post Answer'}
                      </button>
                    </div>
                  )}

                  {answersLoading ? (
                    <div className="stack-list">
                      {Array.from({ length: 3 }).map((_, index) => (
                        <NotificationSkeleton key={index} />
                      ))}
                    </div>
                  ) : answersError ? (
                    <div style={{ 
                      padding: '32px 24px',
                      textAlign: 'center',
                      backgroundColor: COLORS.cardSurface,
                      borderRadius: '18px',
                      border: `1px solid ${COLORS.cardBorder}`,
                      color: COLORS.textMuted,
                      boxShadow: COLORS.shadow
                    }}>
                      <div style={{ marginBottom: '12px', fontSize: '14px', color: COLORS.textDark, fontWeight: '600' }}>
                        Could not load answers right now.
                      </div>
                      <button onClick={() => fetchAnswers(selectedEntry.id)} className="btn-primary press" style={{ maxWidth: '220px' }}>
                        Retry Answers
                      </button>
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
                                backgroundColor: COLORS.bg, 
                                overflow: 'hidden', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                fontSize: '10px',
                                fontWeight: 'bold',
                                color: COLORS.textMuted
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

      <AnimatePresence>
        {cardActionEntry && (
          <MotionDiv
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={() => setCardActionEntry(null)}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 90,
              backgroundColor: 'rgba(15, 23, 42, 0.38)',
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center',
              padding: '16px'
            }}
          >
            <MotionDiv
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={SHEET_SPRING}
              onClick={(e) => e.stopPropagation()}
              className="card-base"
              style={{
                width: 'min(100%, 420px)',
                padding: '12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}
            >
              <div style={{ width: '44px', height: '4px', borderRadius: '999px', backgroundColor: COLORS.cardBorder, alignSelf: 'center', margin: '4px 0 8px' }} />
              <button className="btn-secondary press" onClick={() => openEntryEditor(cardActionEntry)}>
                <Pencil size={16} strokeWidth={2} />
                Edit
              </button>
              {cardActionEntry.is_public ? (
                <button className="btn-secondary press" onClick={() => { handleRemoveFromFeed(cardActionEntry); setCardActionEntry(null); }}>
                  <Share2 size={16} strokeWidth={2} />
                  Remove From Feed
                </button>
              ) : (
                <button className="btn-secondary press" onClick={() => { handleShareToFeed(cardActionEntry); setCardActionEntry(null); }}>
                  <Share2 size={16} strokeWidth={2} />
                  Share
                </button>
              )}
              <button className="btn-danger press" onClick={() => deleteEntryById(cardActionEntry)}>
                <Trash2 size={16} strokeWidth={2} />
                Delete
              </button>
              <button className="btn-secondary press" onClick={() => setCardActionEntry(null)}>
                Cancel
              </button>
            </MotionDiv>
          </MotionDiv>
        )}
      </AnimatePresence>

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
      <AnimatePresence>
      {showAddEntry && (
      <MotionDiv
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ duration: PAGE_DURATION, ease: PAGE_EASE }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 60,
          backgroundColor: COLORS.bg,
          overflowY: 'auto',
          overflowX: 'hidden'
        }}
      >
        {/* Repeating background pattern for overlay not needed for Light theme */}

        <div style={{
            position: 'relative',
            zIndex: 1,
            maxWidth: '480px',
            margin: '0 auto',
            minHeight: '100dvh',
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
                    closeEntryComposer();
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
                {editingEntryId ? (addStep === 1 ? 'Edit Question' : 'Edit Answer') : (addStep === 1 ? 'New Question' : 'The Answer')}
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
                        {editingEntryId ? 'Saving changes...' : 'Saving entry...'}
                      </div>
                    ) : (
                      <div style={{display:'flex', alignItems:'center', justifyContent:'center', gap:'8px'}}>
                         {editingEntryId ? 'Save Changes' : 'Save to Vault'} <Check size={18} strokeWidth={2.5} />
                      </div>
                    )}
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </MotionDiv>
      )}
      </AnimatePresence>

      {/* ASK AI BOTTOM SHEET MODAL */}
      <AnimatePresence>
      {showAIModal && (
      <MotionDiv
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18 }}
        style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.8)',
          zIndex: 100,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end'
        }}
      >
        <MotionDiv
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={SHEET_SPRING}
          style={{
            backgroundColor: COLORS.cardSurface,
            borderTopLeftRadius: '24px',
            borderTopRightRadius: '24px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            paddingBottom: 'max(24px, env(safe-area-inset-bottom))'
          }}
        >
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
        </MotionDiv>
      </MotionDiv>
      )}
      </AnimatePresence>

      <nav className="mobile-bottom-nav nav-bar no-select">
        <div className="mobile-bottom-nav__inner">
          <NavItemButton
            item={TAB_ITEMS[0]}
            active={currentTab === 'Home'}
            badge={0}
            bellShakeKey={bellShakeKey}
            onClick={() => navigateToTab('Home')}
            compact
          />
          <NavItemButton
            item={TAB_ITEMS[2]}
            active={currentTab === 'Feed'}
            badge={0}
            bellShakeKey={bellShakeKey}
            onClick={() => navigateToTab('Feed')}
            compact
          />

          <div className="mobile-bottom-nav__center">
            <MotionButton
              onClick={() => { resetEntryComposer(); setShowAddEntry(true); }}
              className="mobile-bottom-nav__fab press"
              animate={entries.length === 0 ? { scale: [1, 1.07, 1] } : { scale: 1 }}
              transition={entries.length === 0 ? { duration: 2, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.2 }}
            >
              <Plus size={26} color="white" strokeWidth={2.5} />
            </MotionButton>
          </div>

          <NavItemButton
            item={TAB_ITEMS[4]}
            active={currentTab === 'Notifications'}
            badge={unreadCount}
            bellShakeKey={bellShakeKey}
            onClick={() => navigateToTab('Notifications')}
            compact
          />
          <NavItemButton
            item={TAB_ITEMS[5]}
            active={currentTab === 'Profile'}
            badge={0}
            bellShakeKey={bellShakeKey}
            onClick={() => navigateToTab('Profile')}
            compact
          />
        </div>
      </nav>
            </div>
          </div>
        </div>


      {/* CLERK USER PROFILE SETTINGS OVERLAY */}
      <AnimatePresence>
      {showClerkSettings && (
        <MotionDiv
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }} onClick={() => setShowClerkSettings(false)}>
          <MotionDiv
            initial={{ scale: 0.96, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.96, y: 20 }}
            transition={SHEET_SPRING}
            style={{ 
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
          </MotionDiv>
        </MotionDiv>
      )}
      </AnimatePresence>

      {/* SIGN OUT CONFIRMATION OVERLAY */}
      <AnimatePresence>
      {showSignOutConfirm && (
        <MotionDiv
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }} onClick={() => setShowSignOutConfirm(false)}>
          <MotionDiv
            initial={{ scale: 0.96, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.96, y: 20 }}
            transition={SHEET_SPRING}
            style={{
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
          </MotionDiv>
        </MotionDiv>
      )}
      </AnimatePresence>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}

