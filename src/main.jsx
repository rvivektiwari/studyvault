import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react'
import './index.css'
import App from './App.jsx'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

const configErrorScreen = (
  <div style={{
    minHeight: '100dvh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
    background: 'var(--sv-bg)',
    color: 'var(--sv-text-primary)'
  }}>
    <div style={{
      width: '100%',
      maxWidth: '480px',
      background: 'var(--sv-card-surface)',
      borderRadius: '24px',
      padding: '28px',
      boxShadow: 'var(--sv-shadow)',
      textAlign: 'center'
    }}>
      <h1 style={{ margin: '0 0 12px 0', color: 'var(--sv-text-dark)' }}>StudyVault needs Clerk setup</h1>
      <p style={{ margin: 0, color: 'var(--sv-text-muted)', lineHeight: 1.7 }}>
        Add <code>VITE_CLERK_PUBLISHABLE_KEY</code> to your environment so the sign-in UI can load.
      </p>
    </div>
  </div>
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {PUBLISHABLE_KEY ? (
      <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
        <SignedIn>
          <App />
        </SignedIn>
        <SignedOut>
          <RedirectToSignIn />
        </SignedOut>
      </ClerkProvider>
    ) : configErrorScreen}
  </StrictMode>,
)
