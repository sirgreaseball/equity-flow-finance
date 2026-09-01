import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, ArrowRightLeft, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

// Dummy Order Book entries
const openOrders = [
  { id: 1, sellerHash: '0x94B...2F11', business: 'TechCorp Solutions', tokenTicker: 'TCS', amount: '2.5%', price: 125000, delta: '+12%', kyc: true },
  { id: 2, sellerHash: '0x1A4...0F8C', business: 'Ember Coffee Roasters', tokenTicker: 'EMB', amount: '0.5%', price: 8500, delta: '-2%', kyc: true },
  { id: 3, sellerHash: '0xCD7...4A9D', business: 'Apex Performance Labs', tokenTicker: 'APX', amount: '1.0%', price: 18000, delta: '+5%', kyc: true },
  { id: 4, sellerHash: '0x55E...B341', business: 'Vault Brewing Co.', tokenTicker: 'VLT', amount: '5.0%', price: 135000, delta: '+45%', kyc: false },
  { id: 5, sellerHash: '0x88F...C992', business: 'Luminary EdTech', tokenTicker: 'LUM', amount: '1.2%', price: 27000, delta: '+8%', kyc: true },
  { id: 6, sellerHash: '0x33A...D110', business: 'Terra Fresh Farms', tokenTicker: 'TER', amount: '4.0%', price: 60000, delta: '+22%', kyc: true },
  { id: 7, sellerHash: '0x99B...E445', business: 'Stitch & Thread', tokenTicker: 'STH', amount: '0.25%', price: 2500, delta: '-5%', kyc: false },
  { id: 8, sellerHash: '0x22C...F556', business: 'RevUp Auto', tokenTicker: 'REV', amount: '3.5%', price: 77000, delta: '+18%', kyc: true },
  { id: 9, sellerHash: '0x11D...A778', business: 'Clarity Health AI', tokenTicker: 'CLR', amount: '10.0%', price: 300000, delta: '+150%', kyc: true },
  { id: 10, sellerHash: '0x44E...B889', business: 'TechCorp Solutions', tokenTicker: 'TCS', amount: '0.1%', price: 5500, delta: '+14%', kyc: true },
  { id: 11, sellerHash: '0x77G...C001', business: 'Ember Coffee Roasters', tokenTicker: 'EMB', amount: '2.0%', price: 33000, delta: '+1%', kyc: false },
  { id: 12, sellerHash: '0x66H...D223', business: 'Luminary EdTech', tokenTicker: 'LUM', amount: '0.75%', price: 16500, delta: '+7%', kyc: true },
  { id: 13, sellerHash: '0xAA1...ZZ9', business: 'EcoClean Solutions', tokenTicker: 'ECO', amount: '2.2%', price: 88000, delta: '+9%', kyc: true },
  { id: 14, sellerHash: '0xBB2...YY8', business: 'SolarFuture Ltd.', tokenTicker: 'SOL', amount: '0.9%', price: 47000, delta: '-3%', kyc: false },
  { id: 15, sellerHash: '0xCC3...XX7', business: 'HealthPlus AI', tokenTicker: 'HPA', amount: '1.5%', price: 62000, delta: '+6%', kyc: true },
  { id: 16, sellerHash: '0xDD4...WW6', business: 'AgriGrowth Co.', tokenTicker: 'AGG', amount: '3.0%', price: 102000, delta: '+12%', kyc: true },
  { id: 17, sellerHash: '0xEE5...VV5', business: 'FinTech Innovations', tokenTicker: 'FIN', amount: '0.4%', price: 34000, delta: '+2%', kyc: false },
  { id: 18, sellerHash: '0xFF6...UU4', business: 'UrbanMobility', tokenTicker: 'URB', amount: '0.7%', price: 55000, delta: '-1%', kyc: true },
  { id: 19, sellerHash: '0xGG7...TT3', business: 'Quantum Labs', tokenTicker: 'QLB', amount: '5.5%', price: 215000, delta: '+20%', kyc: true },
  { id: 20, sellerHash: '0xHH8...SS2', business: 'BioTech Ventures', tokenTicker: 'BIO', amount: '1.1%', price: 73000, delta: '+4%', kyc: false },
];

const Trade = () => {
  const { isAuthenticated } = useAuth();
  const { format } = useCurrency();
  const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

  const handleBuy = (ticker: string) => {
    if (!isAuthenticated) {
      toast.error('Wallet not connected', { description: 'You must connect a Web3 wallet to mint equity tokens.' });
      return;
    }
    toast.success('Trade Executed Successfully!', {
      description: `You have purchased the ${ticker} tokens from the secondary market via an atomic swap.`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-24 pb-12">
        <div className="max-w-6xl mx-auto px-6 md:px-10">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="mb-12 border-b border-border pb-8"
          >
            <div className="inline-block px-3 py-1 mb-4 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-xs font-bold tracking-widest uppercase">
              Equity Flow Liquidity Engine
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-extrabold tracking-[-0.02em] mb-4">
              Secondary Market
            </h1>
            <p className="text-muted-foreground max-w-2xl text-lg">
              Peer-to-peer liquidity for Business tokens. Instantly exit early investments or buy premium holdings from verified traders using decentralized atomic swaps.
            </p>
          </motion.div>

          <div className="w-full">
            <h3 className="font-display font-bold text-xl mb-4">Live Order Book</h3>
            
            {!isAuthenticated && (
              <div className="mb-6 p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium">
                You must be logged in to execute trades.
              </div>
            )}

            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5, ease }}
              className="bg-card border border-border shadow-xl rounded-xl overflow-hidden"
            >
              {/* Header row */}
              <div className="grid grid-cols-12 gap-4 p-4 border-b border-border bg-muted/30 text-xs font-display tracking-widest uppercase text-muted-foreground font-bold">
                <div className="col-span-4 pl-4">Asset Under Management</div>
                <div className="col-span-3">Seller / Ledger Hash</div>
                <div className="col-span-2 text-right">Listing Price</div>
                <div className="col-span-3 text-right pr-4">Action</div>
              </div>

              {/* Orders */}
              <div className="divide-y divide-border">
                {openOrders.map((order, i) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * i + 0.3 }}
                    key={order.id} 
                    className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-muted/10 transition-colors"
                  >
                    
                    <div className="col-span-4 pl-4 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-muted flex flex-col items-center justify-center border border-border">
                        <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">{order.tokenTicker}</span>
                        <span className="font-display font-bold text-foreground">{order.amount}</span>
                      </div>
                      <div>
                        <div className="font-bold text-sm">{order.business}</div>
                        <div className={`text-xs mt-0.5 ${order.delta.startsWith('+') ? 'text-green-500' : 'text-destructive'}`}>
                          {order.delta} All time ROI
                        </div>
                      </div>
                    </div>

                    <div className="col-span-3 flex items-center">
                      <div>
                        <div className="font-mono text-xs">{order.sellerHash}</div>
                        {order.kyc ? (
                          <div className="flex items-center gap-1 mt-1 text-green-500 text-[9px] uppercase font-bold tracking-widest">
                            <ShieldCheck className="w-3 h-3" /> KYC Verified Maker
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 mt-1 text-muted-foreground text-[9px] uppercase font-bold tracking-widest">
                            Untrusted Maker
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="col-span-2 text-right">
                      <div className="font-display font-bold text-lg">{format(order.price)}</div>
                      <div className="text-[10px] text-muted-foreground uppercase tracking-widest">USDC Eqv.</div>
                    </div>

                    <div className="col-span-3 text-right pr-4 flex justify-end">
                      <Button 
                        disabled={!isAuthenticated}
                        onClick={() => handleBuy(order.tokenTicker)}
                        className="font-display tracking-[0.15em] uppercase text-[10px] h-10 w-full max-w-[140px] bg-foreground hover:bg-muted text-background hover:text-foreground border border-transparent shadow-[0_0_15px_rgba(255,255,255,0.05)] transition-all"
                      >
                        <ArrowRightLeft className="w-4 h-4 mr-2" /> Execute Buy
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Trade;
