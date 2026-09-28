import { Metadata } from "next";
import LoginForm from "./login-form";

export const metadata: Metadata = {
  title: "Login - ERP System",
  description: "Secure login to access the ERP dashboard",
};

export default function LoginPage() {
  return (
    <div 
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{
        backgroundImage: "url('/login_bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Very light gradient overlay for readability while keeping the image visible */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-100/30 to-white/10 backdrop-blur-sm"></div>
      
      {/* Glassmorphism Card */}
      <div className="relative z-10 w-full max-w-md p-10 bg-white/60 backdrop-blur-xl rounded-2xl shadow-[0_8px_40px_rgb(0,0,0,0.08)] border border-white/60">
        <div className="text-center mb-10">
          <div className="mx-auto w-14 h-14 bg-gradient-to-br from-teal-600 to-emerald-500 rounded-xl flex items-center justify-center mb-5 shadow-lg border border-teal-500/30">
            <span className="text-white font-bold text-2xl tracking-wider">ERP</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Welcome Back</h1>
          <p className="text-sm text-slate-600 mt-2 font-medium">Please enter your secure credentials</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
