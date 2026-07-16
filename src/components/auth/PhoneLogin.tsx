import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import LoadingButton from '@/components/auth/LoadingButton';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';

const RESEND_TIMEOUT = 30; // seconds

const PhoneLogin = () => {
  const { signInWithPhoneOtp, verifyPhoneOtp, user } = useAuth();
  const { toast } = useToast();

  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [step, setStep] = useState<'enter' | 'verify'>('enter');
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    if (resendTimer <= 0) return;
    const t = setInterval(() => setResendTimer((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [resendTimer]);

  useEffect(() => {
    if (user) {
      // Reset state on successful login
      setPhone('');
      setOtp('');
      setStep('enter');
      setResendTimer(0);
    }
  }, [user]);

  const canResend = useMemo(() => resendTimer === 0, [resendTimer]);

  const handleSendCode = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!phone) return;
    setIsSending(true);
    const { error } = await signInWithPhoneOtp(phone);
    setIsSending(false);

    if (!error) {
      setStep('verify');
      setResendTimer(RESEND_TIMEOUT);
    }
  };

  const handleVerify = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!phone || otp.length < 4) return;
    setIsVerifying(true);
    const { error } = await verifyPhoneOtp(phone, otp);
    setIsVerifying(false);

    if (!error) {
      toast({ title: 'Logged in', description: 'Welcome back!' });
    }
  };

  return (
    <Card className="bg-transparent border-none shadow-none p-0">
      <CardContent className="space-y-4 p-0">
        <form onSubmit={step === 'enter' ? handleSendCode : handleVerify} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="phone-input">Phone number</Label>
            <PhoneInput
              defaultCountry="us"
              value={phone}
              onChange={(value) => setPhone(value)}
              inputStyle={{ width: '100%', background: 'transparent' }}
              className="[&_.react-international-phone-input]:w-full [&_.react-international-phone-input]:h-10 [&_.react-international-phone-input]:rounded-md [&_.react-international-phone-input]:border [&_.react-international-phone-input]:border-input [&_.react-international-phone-input]:bg-background/50 [&_.react-international-phone-input]:px-3 [&_.react-international-phone-input]:text-sm [&_.react-international-phone-input]:outline-none [&_.react-international-phone-input]:ring-0"
              
            />
            <p className="text-xs text-muted-foreground">Select your country to auto-fill flag and code.</p>
          </div>

          {step === 'verify' && (
            <div className="space-y-2">
              <Label htmlFor="otp">Enter verification code</Label>
              <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Didn’t receive the code?</span>
                <button
                  type="button"
                  disabled={!canResend}
                  onClick={handleSendCode}
                  className="underline disabled:opacity-50"
                >
                  {canResend ? 'Resend code' : `Resend in 0:${resendTimer.toString().padStart(2, '0')}`}
                </button>
              </div>
            </div>
          )}

          {step === 'enter' ? (
            <LoadingButton type="submit" className="w-full" isLoading={isSending}>
              Send Code
            </LoadingButton>
          ) : (
            <LoadingButton type="submit" className="w-full" isLoading={isVerifying}>
              Verify & Sign In
            </LoadingButton>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default PhoneLogin;
