
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { Eye, EyeOff, Lock, AlertTriangle, UserCheck } from "lucide-react";

interface LoginProps {
  onLogin: (username: string, password: string) => boolean;
}

const Login = ({ onLogin }: LoginProps) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockTimer, setLockTimer] = useState(0);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    
    // Check if account is locked from previous session
    const lockedUntil = localStorage.getItem("accountLockedUntil");
    if (lockedUntil) {
      const timeLeft = parseInt(lockedUntil) - Date.now();
      if (timeLeft > 0) {
        setIsLocked(true);
        setLockTimer(Math.ceil(timeLeft / 1000));
      } else {
        localStorage.removeItem("accountLockedUntil");
      }
    }
    
    // Get previous login attempts
    const attempts = localStorage.getItem("loginAttempts");
    if (attempts) {
      setLoginAttempts(parseInt(attempts));
    }
    
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);
  
  // Timer for account lockout
  useEffect(() => {
    let interval: number | undefined;
    
    if (isLocked && lockTimer > 0) {
      interval = window.setInterval(() => {
        setLockTimer((prev) => prev - 1);
        if (lockTimer === 1) {
          setIsLocked(false);
          localStorage.removeItem("accountLockedUntil");
          setLoginAttempts(0);
          localStorage.removeItem("loginAttempts");
        }
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLocked, lockTimer]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLocked) return;
    
    setIsLoading(true);
    
    setTimeout(() => {
      const success = onLogin(username, password);
      
      if (!success) {
        const newAttempts = loginAttempts + 1;
        setLoginAttempts(newAttempts);
        localStorage.setItem("loginAttempts", newAttempts.toString());
        
        // Lock account after 5 failed attempts
        if (newAttempts >= 5) {
          const lockoutTime = 5 * 60; // 5 minutes in seconds
          setIsLocked(true);
          setLockTimer(lockoutTime);
          const lockedUntil = Date.now() + (lockoutTime * 1000);
          localStorage.setItem("accountLockedUntil", lockedUntil.toString());
          
          toast({
            title: "Account Temporarily Locked",
            description: `Too many failed login attempts. Please try again in ${lockoutTime / 60} minutes.`,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Authentication Failed",
            description: `Invalid username or password. Attempts remaining: ${5 - newAttempts}`,
            variant: "destructive",
          });
        }
      } else {
        // Reset attempts on successful login
        setLoginAttempts(0);
        localStorage.removeItem("loginAttempts");
      }
      
      setIsLoading(false);
    }, 600);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="min-h-screen flex flex-col justify-center relative overflow-hidden bg-midasbuy-darkBlue">
      <div className="absolute inset-0 bg-hero-pattern bg-cover bg-center opacity-20"></div>
      
      <div className="relative w-full max-w-md mx-auto p-6 animate-fade-in">
        <div className="flex justify-center mb-8">
          <img 
            src="/lovable-uploads/c6fd77e7-3682-428e-8154-140308b4a06b.png" 
            alt="Logo" 
            className="h-12"
            width="233"
            height="48"
            loading="eager"
            decoding="async"
          />
        </div>
        
        <div className="glass-effect rounded-xl overflow-hidden shadow-xl border border-midasbuy-blue/20 animate-scale-up p-8">
          <h2 className="text-2xl font-bold text-center mb-6 text-white flex items-center justify-center">
            <Lock className="mr-2 h-6 w-6 text-midasbuy-blue" />
            Secure Login
          </h2>
          
          {isLocked ? (
            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 mb-4">
              <div className="flex items-center text-red-400 mb-2">
                <AlertTriangle className="h-5 w-5 mr-2" />
                <h3 className="font-medium">Account Temporarily Locked</h3>
              </div>
              <p className="text-sm text-gray-300 mb-2">
                Too many failed login attempts. Please try again in:
              </p>
              <div className="text-center">
                <span className="font-mono text-xl font-bold text-red-400">{formatTime(lockTimer)}</span>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium text-gray-300 flex items-center">
                  <UserCheck className="h-4 w-4 mr-1 text-midasbuy-blue" /> 
                  Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-midasbuy-navy/50 border-midasbuy-blue/30 text-white focus:border-midasbuy-blue focus:ring-midasbuy-blue/20"
                  placeholder="Enter your username"
                  required
                  autoComplete="off"
                  disabled={isLoading || isLocked}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-300 flex items-center">
                  <Lock className="h-4 w-4 mr-1 text-midasbuy-blue" />
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-midasbuy-navy/50 border-midasbuy-blue/30 text-white focus:border-midasbuy-blue focus:ring-midasbuy-blue/20 pr-10"
                    placeholder="Enter your password"
                    required
                    autoComplete="off"
                    disabled={isLoading || isLocked}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                    onClick={togglePasswordVisibility}
                    disabled={isLoading || isLocked}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
              
              {loginAttempts > 0 && !isLocked && (
                <div className="text-sm text-amber-400 flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  Failed attempts: {loginAttempts}/5
                </div>
              )}
              
              <Button
                type="submit"
                className="w-full bg-midasbuy-blue hover:bg-blue-600 text-white font-medium py-2 rounded-md transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-midasbuy-blue/50 focus:ring-opacity-50"
                disabled={isLoading || isLocked}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  "Sign In"
                )}
              </Button>
              
              <div className="text-xs text-gray-400 mt-4">
                <p className="text-center">This login is for authorized personnel only.</p>
                <p className="text-center mt-1">Your IP address and login attempts are being monitored.</p>
              </div>
            </form>
          )}
        </div>
        
        <div className="mt-8 text-center text-gray-400 text-sm">
          <p>© 2023 All rights reserved.</p>
          <p className="mt-1 text-xs text-gray-500">Secure login portal v2.1</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
