import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, Clock, AlertCircle, ChevronDown, Loader2, QrCode, Wallet, CheckCircle, XCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import QRCode from 'qrcode';
import binancePayLogo from '@/assets/binance-pay-logo.jpeg';

// Crypto logo imports
import btcLogo from '@/assets/crypto/btc-logo.png';
import ethLogo from '@/assets/crypto/eth-logo.png';
import usdtLogo from '@/assets/crypto/usdt-logo.png';
import bnbLogo from '@/assets/crypto/bnb-logo.png';
import solLogo from '@/assets/crypto/sol-logo.png';
import adaLogo from '@/assets/crypto/ada-logo.png';
import linkLogo from '@/assets/crypto/link-logo.png';
import neoLogo from '@/assets/crypto/neo-logo.png';
import ltcLogo from '@/assets/crypto/ltc-logo.png';
import xrpLogo from '@/assets/crypto/xrp-logo.png';
import dogeLogo from '@/assets/crypto/doge-logo.png';
import trxLogo from '@/assets/crypto/trx-logo.png';

// Map symbol to logo
const cryptoLogos: Record<string, string> = {
  BTC: btcLogo,
  ETH: ethLogo,
  USDT: usdtLogo,
  BNB: bnbLogo,
  SOL: solLogo,
  ADA: adaLogo,
  LINK: linkLogo,
  NEO: neoLogo,
  LTC: ltcLogo,
  XRP: xrpLogo,
  DOGE: dogeLogo,
  TRX: trxLogo,
};

interface CryptoInfo {
  symbol: string;
  name: string;
  networks: string[];
  icon: string;
}

interface BinanceCryptoPaymentProps {
  amount: number; // Amount in USD (original)
  discountedAmount?: number; // Amount after discount
  orderId: string;
  productName: string;
  onPaymentConfirmed: (txId: string) => void;
  onCancel: () => void;
}

const BinanceCryptoPayment = ({
  amount,
  discountedAmount,
  orderId,
  productName,
  onPaymentConfirmed,
  onCancel
}: BinanceCryptoPaymentProps) => {
  // Use discounted amount if provided, otherwise use original amount
  const finalAmount = discountedAmount ?? amount;
  const [cryptos, setCryptos] = useState<CryptoInfo[]>([]);
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoInfo | null>(null);
  const [selectedNetwork, setSelectedNetwork] = useState<string>('');
  const [cryptoAmount, setCryptoAmount] = useState<number>(0);
  const [depositAddress, setDepositAddress] = useState<string>('');
  const [depositTag, setDepositTag] = useState<string>('');
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [copied, setCopied] = useState<'address' | 'amount' | 'tag' | null>(null);
  const [step, setStep] = useState<'select' | 'payment' | 'confirming' | 'success' | 'failed'>('select');
  const [isLoading, setIsLoading] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(30 * 60); // 30 minutes
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCheckingPayment, setIsCheckingPayment] = useState(false);
  const [pollCount, setPollCount] = useState(0);
  const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const backgroundPollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const maxPollAttempts = 12; // Fail after ~3 minutes (12 x 15s)

  // Fetch supported cryptocurrencies
  useEffect(() => {
    const fetchCryptos = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('binance-crypto-deposit', {
          body: { action: 'get_cryptos' }
        });

        if (error) throw error;
        if (data?.success) {
          setCryptos(data.cryptos);
        }
      } catch (error) {
        console.error('Failed to fetch cryptos:', error);
        toast({
          title: 'Error',
          description: 'Failed to load payment options',
          variant: 'destructive'
        });
      }
    };

    fetchCryptos();
  }, []);

  // Countdown timer
  useEffect(() => {
    if (step !== 'payment' && step !== 'confirming') return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          toast({
            title: 'Payment Timeout',
            description: 'Payment session expired. Please try again.',
            variant: 'destructive'
          });
          onCancel();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [step, onCancel]);

  // Background polling for payment confirmation - starts immediately when address is generated
  useEffect(() => {
    if (step !== 'payment' && step !== 'confirming') {
      if (backgroundPollRef.current) {
        clearInterval(backgroundPollRef.current);
        backgroundPollRef.current = null;
      }
      return;
    }

    const checkPayment = async () => {
      try {
        setIsCheckingPayment(true);
        setPollCount(prev => prev + 1);
        
        const { data, error } = await supabase.functions.invoke('binance-crypto-deposit', {
          body: {
            action: 'check_deposit',
            coin: selectedCrypto?.symbol,
            amount: cryptoAmount.toString(),
            orderId
          }
        });

        if (error) throw error;
        
        if (data?.confirmed) {
          if (backgroundPollRef.current) {
            clearInterval(backgroundPollRef.current);
          }
          setStep('success');
          toast({
            title: '✅ Payment Confirmed!',
            description: 'Your cryptocurrency payment has been received and verified.',
          });
          // Wait a moment then call callback
          setTimeout(() => {
            onPaymentConfirmed(data.deposit.txId);
          }, 2000);
        } else if (step === 'confirming' && pollCount >= maxPollAttempts) {
          // Timeout after max attempts in confirming mode
          if (backgroundPollRef.current) {
            clearInterval(backgroundPollRef.current);
          }
          setStep('failed');
          toast({
            title: 'Payment Not Found',
            description: 'No payment detected. Please verify you sent the correct amount.',
            variant: 'destructive'
          });
        }
      } catch (error) {
        console.error('Error checking payment:', error);
      } finally {
        setIsCheckingPayment(false);
      }
    };

    // Start polling immediately, then every 15 seconds
    checkPayment();
    backgroundPollRef.current = setInterval(checkPayment, 15000);

    return () => {
      if (backgroundPollRef.current) {
        clearInterval(backgroundPollRef.current);
      }
    };
  }, [step, selectedCrypto, cryptoAmount, orderId, onPaymentConfirmed]);

  const handleCryptoSelect = async (crypto: CryptoInfo) => {
    setSelectedCrypto(crypto);
    setSelectedNetwork(crypto.networks[0]);
    setIsDropdownOpen(false);

    // Fetch current price
    try {
      const { data, error } = await supabase.functions.invoke('binance-crypto-deposit', {
        body: { action: 'get_price', coin: crypto.symbol }
      });

      if (error) throw error;
      if (data?.success) {
        const cryptoAmt = finalAmount / data.priceInUsdt;
        setCryptoAmount(Number(cryptoAmt.toFixed(8)));
      }
    } catch (error) {
      console.error('Failed to get price:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch current price',
        variant: 'destructive'
      });
    }
  };

  const handleNetworkChange = (network: string) => {
    setSelectedNetwork(network);
  };

  const handleProceedToPayment = async () => {
    if (!selectedCrypto || !selectedNetwork) {
      toast({
        title: 'Selection Required',
        description: 'Please select a cryptocurrency and network',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('binance-crypto-deposit', {
        body: {
          action: 'get_deposit_address',
          coin: selectedCrypto.symbol,
          network: selectedNetwork,
          orderId,
          amount: cryptoAmount
        }
      });

      if (error) throw error;
      if (data?.success) {
        setDepositAddress(data.address);
        setDepositTag(data.tag || '');
        
        // Generate QR code locally
        const qrData = data.tag 
          ? `${data.address}?memo=${data.tag}&amount=${cryptoAmount}`
          : `${data.address}`;
        const qrUrl = await QRCode.toDataURL(qrData, { width: 200 });
        setQrCodeDataUrl(qrUrl);
        
        setStep('payment');
      }
    } catch (error: any) {
      console.error('Failed to get deposit address:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to generate payment address',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string, type: 'address' | 'amount' | 'tag') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
      toast({
        title: 'Copied!',
        description: `${type.charAt(0).toUpperCase() + type.slice(1)} copied to clipboard`,
      });
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleConfirmPayment = () => {
    setStep('confirming');
    toast({
      title: '🔍 Verifying Payment',
      description: 'Checking blockchain for your deposit. This usually takes 1-5 minutes.',
    });
  };

  const handleCancelPayment = () => {
    if (backgroundPollRef.current) {
      clearInterval(backgroundPollRef.current);
    }
    onCancel();
  };

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {step === 'select' && (
          <motion.div
            key="select"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-5"
          >
            {/* Amount Display Only - No header text */}
            <div className="text-center mb-4">
              <p className="text-gray-400 text-sm">
                Amount: {discountedAmount ? (
                  <>
                    <span className="text-gray-500 line-through mr-2">${amount.toFixed(2)}</span>
                    <span className="text-[#F0B90B] font-bold">${finalAmount.toFixed(2)} USD</span>
                  </>
                ) : (
                  <span className="text-[#F0B90B] font-bold">${finalAmount.toFixed(2)} USD</span>
                )}
              </p>
            </div>

            {/* Cryptocurrency Dropdown */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Select Cryptocurrency
              </label>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-[#1E2329] to-[#2B3139] border border-[#F0B90B]/30 rounded-xl hover:border-[#F0B90B] transition-all shadow-lg"
              >
                {selectedCrypto ? (
                  <div className="flex items-center gap-3">
                    <img 
                      src={cryptoLogos[selectedCrypto.symbol]} 
                      alt={selectedCrypto.name} 
                      className="w-8 h-8 rounded-full object-contain"
                    />
                    <div className="text-left">
                      <div className="text-white font-medium">{selectedCrypto.name}</div>
                      <div className="text-gray-400 text-sm">{selectedCrypto.symbol}</div>
                    </div>
                  </div>
                ) : (
                  <span className="text-gray-400">Choose a cryptocurrency</span>
                )}
                <ChevronDown className={`w-5 h-5 text-[#F0B90B] transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className="absolute z-50 w-full mt-2 bg-[#1E2329] border border-[#F0B90B]/30 rounded-xl shadow-2xl max-h-64 overflow-y-auto"
                  >
                    {cryptos.map((crypto) => (
                      <button
                        key={crypto.symbol}
                        onClick={() => handleCryptoSelect(crypto)}
                        className={`w-full flex items-center gap-3 p-4 hover:bg-[#F0B90B]/10 transition-colors first:rounded-t-xl last:rounded-b-xl ${
                          selectedCrypto?.symbol === crypto.symbol ? 'bg-[#F0B90B]/20' : ''
                        }`}
                      >
                        <img 
                          src={cryptoLogos[crypto.symbol]} 
                          alt={crypto.name} 
                          className="w-8 h-8 rounded-full object-contain"
                        />
                        <div className="text-left flex-1">
                          <div className="text-white font-medium">{crypto.name}</div>
                          <div className="text-gray-400 text-sm">{crypto.symbol}</div>
                        </div>
                        {selectedCrypto?.symbol === crypto.symbol && (
                          <Check className="w-5 h-5 text-[#F0B90B]" />
                        )}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Network Selection */}
            {selectedCrypto && selectedCrypto.networks.length > 1 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
              >
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Select Network
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {selectedCrypto.networks.map((network) => (
                    <button
                      key={network}
                      onClick={() => handleNetworkChange(network)}
                      className={`p-3 rounded-lg border-2 transition-all font-medium ${
                        selectedNetwork === network
                          ? 'border-[#F0B90B] bg-[#F0B90B]/20 text-[#F0B90B]'
                          : 'border-gray-700 text-gray-400 hover:border-[#F0B90B]/50 hover:text-white'
                      }`}
                    >
                      {network}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Amount Preview */}
            {selectedCrypto && cryptoAmount > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-r from-[#F0B90B]/10 to-[#F0B90B]/5 border border-[#F0B90B]/40 rounded-xl p-4"
              >
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">You will pay:</span>
                  <div className="text-right">
                    <span className="text-[#F0B90B] font-bold text-xl">
                      {cryptoAmount.toFixed(8)} {selectedCrypto.symbol}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  *Rate locked for 30 minutes after proceeding
                </p>
              </motion.div>
            )}

            {/* Proceed Button */}
            <Button
              onClick={handleProceedToPayment}
              disabled={!selectedCrypto || !selectedNetwork || isLoading}
              className="w-full py-6 bg-gradient-to-r from-[#F0B90B] to-[#FCD535] hover:from-[#F0B90B]/90 hover:to-[#FCD535]/90 text-black font-bold text-lg rounded-xl shadow-lg shadow-[#F0B90B]/20"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Generating Address...
                </>
              ) : (
                <>
                  <QrCode className="w-5 h-5 mr-2" />
                  Get Payment Address
                </>
              )}
            </Button>

            <Button
              variant="ghost"
              onClick={handleCancelPayment}
              className="w-full text-gray-400 hover:text-white hover:bg-white/5"
            >
              ← Back to Payment Methods
            </Button>
          </motion.div>
        )}

        {(step === 'payment' || step === 'confirming') && (
          <motion.div
            key="payment"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {/* Timer & Status */}
            <div className="flex items-center justify-between">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                timeRemaining < 300 ? 'bg-red-500/20 text-red-400' : 'bg-[#F0B90B]/20 text-[#F0B90B]'
              }`}>
                <Clock className="w-4 h-4" />
                <span className="font-mono font-bold">{formatTime(timeRemaining)}</span>
              </div>
              
              {step === 'confirming' && (
                <div className="flex items-center gap-2 text-green-400 text-sm">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying...</span>
                </div>
              )}
              
              {step === 'payment' && isCheckingPayment && (
                <div className="flex items-center gap-2 text-[#F0B90B] text-xs">
                  <div className="w-2 h-2 rounded-full bg-[#F0B90B] animate-pulse" />
                  <span>Auto-checking</span>
                </div>
              )}
            </div>

            {/* QR Code Card */}
            <div className="bg-gradient-to-b from-[#1E2329] to-[#2B3139] rounded-2xl p-6 border border-[#F0B90B]/20">
              <div className="flex flex-col items-center mb-4">
                <div className="bg-white p-3 rounded-xl mb-3 shadow-lg">
                  {qrCodeDataUrl ? (
                    <img src={qrCodeDataUrl} alt="Payment QR Code" className="w-40 h-40" />
                  ) : (
                    <div className="w-40 h-40 flex items-center justify-center">
                      <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500">
                  Scan with your wallet app
                </p>
              </div>

            {/* Amount */}
              <div className="bg-black/30 rounded-xl p-3 mb-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-gray-400 text-xs">Send exactly</span>
                  <button
                    onClick={() => copyToClipboard(cryptoAmount.toString(), 'amount')}
                    className="text-[#F0B90B] hover:text-[#FCD535] transition-colors"
                  >
                    {copied === 'amount' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white font-mono text-base sm:text-lg font-bold truncate mr-2">
                    {cryptoAmount.toFixed(8)}
                  </span>
                  <span className="text-[#F0B90B] font-medium text-sm flex-shrink-0">{selectedCrypto?.symbol}</span>
                </div>
              </div>

              {/* Address */}
              <div className="bg-black/30 rounded-xl p-4 mb-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-gray-400 text-sm">
                    To {selectedNetwork} address
                  </span>
                  <button
                    onClick={() => copyToClipboard(depositAddress, 'address')}
                    className="text-[#F0B90B] hover:text-[#FCD535] transition-colors"
                  >
                    {copied === 'address' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-white font-mono text-sm break-all">{depositAddress}</p>
              </div>

              {/* Memo/Tag */}
              {depositTag && (
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4 mb-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-orange-400 text-sm font-medium">Memo/Tag (REQUIRED)</span>
                    <button
                      onClick={() => copyToClipboard(depositTag, 'tag')}
                      className="text-orange-400 hover:text-orange-300 transition-colors"
                    >
                      {copied === 'tag' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-white font-mono font-bold">{depositTag}</p>
                  <div className="flex items-center gap-2 mt-2 text-orange-400 text-xs">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>Include this memo or your payment may be lost!</span>
                  </div>
                </div>
              )}
            </div>

            {/* Instructions */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
              <ul className="text-sm text-gray-300 space-y-1">
                <li className="flex items-start gap-2">
                  <span className="text-[#F0B90B]">•</span>
                  Send <span className="text-white font-mono">{cryptoAmount.toFixed(8)} {selectedCrypto?.symbol}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#F0B90B]">•</span>
                  Use <span className="text-white">{selectedNetwork}</span> network only
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#F0B90B]">•</span>
                  Payment auto-detects in 1-5 minutes
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            {step === 'payment' ? (
              <Button
                onClick={handleConfirmPayment}
                className="w-full py-5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold text-base rounded-xl"
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                I Have Sent the Payment
              </Button>
            ) : (
              <div className="bg-[#F0B90B]/10 rounded-xl p-4">
                <div className="flex items-center justify-center gap-3 text-[#F0B90B]">
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <div className="text-center">
                    <span className="font-medium block">Verifying Payment...</span>
                    <span className="text-xs text-gray-400">Check #{pollCount} - Auto-refreshing every 15s</span>
                  </div>
                </div>
              </div>
            )}

            <Button
              variant="outline"
              onClick={handleCancelPayment}
              className="w-full border-gray-700 text-gray-400 hover:text-white hover:bg-white/5 hover:border-gray-600"
            >
              Cancel Payment
            </Button>
          </motion.div>
        )}

        {step === 'success' && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8"
          >
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Payment Confirmed!</h3>
            <p className="text-gray-400">Your order is being processed...</p>
          </motion.div>
        )}

        {step === 'failed' && (
          <motion.div
            key="failed"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8"
          >
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
              <XCircle className="w-10 h-10 text-red-500" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Payment Not Found</h3>
            <p className="text-gray-400 mb-4">We couldn't verify your payment. Please try again or contact support.</p>
            <Button onClick={handleCancelPayment} variant="outline">
              Try Again
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BinanceCryptoPayment;
