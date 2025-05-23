import Image from 'next/image';
import LoginForm from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="max-w-md w-full px-6 py-8 bg-white">
        <div className="text-center mb-8">
          <div className="w-24 h-24 mx-auto mb-4 relative">
            <Image src="/padre-pio.png" alt="Padre Pio" className="w-24 h-24 mx-auto mb-4" />
            
          </div>
          <h2 className="text-3xl font-bold text-accent">Welcome Back</h2>
          <p className="text-gray-600 mt-2">Sign in to your account</p>
        </div>

        <LoginForm />
      </div>
    </div>
  );
}
