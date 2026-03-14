import { SignIn } from "@clerk/clerk-react";

export default function SignInPage() {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      backgroundColor: '#F5F7FA'
    }}>
      <SignIn routing="path" path="/sign-in" />
    </div>
  );
}
