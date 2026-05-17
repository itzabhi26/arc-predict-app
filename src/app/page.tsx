'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useState } from 'react';
import { useAccount, useBalance, useSendTransaction } from 'wagmi';
import { parseEther } from 'viem';

export default function Home() {
  const { address, isConnected } = useAccount();
  
  // ARC Chain Faucet Token Balance (USDC/Native)
  const { data: balance } = useBalance({ 
    address: address,
    query: { refetchInterval: 5000 }
  });

  // States
  const [activeTab, setActiveTab] = useState('markets');
  const [selectedMarket, setSelectedMarket] = useState<any>(null);
  const [betAmount, setBetAmount] = useState('');
  const [selectedPrediction, setSelectedPrediction] = useState<'YES' | 'NO' | null>(null);

  // Wagmi v2 Send Transaction
  const { sendTransaction, isPending: isSending } = useSendTransaction();

  // Prediction Markets Dummy Data (ARC Chain Core Concept)
  const markets = [
    { id: 1, title: "Will Bitcoin cross $95,000 this month?", pool: "25,430 USDC", yesOdds: "1.8x", noOdds: "2.1x" },
    { id: 2, title: "Will ARC Chain Mainnet launch be in Q3?", pool: "12,900 USDC", yesOdds: "1.5x", noOdds: "3.0x" },
    { id: 3, title: "Will Ethereum Gas Fees drop below 10 Gwei tomorrow?", pool: "8,200 USDC", yesOdds: "2.5x", noOdds: "1.4x" }
  ];

  const displayBalance = isConnected && balance 
    ? (Number(balance.value) / 10 ** balance.decimals).toFixed(4) 
    : '0.00';

  // Handling the Prediction Bet
  const handlePlaceBet = () => {
    if (!betAmount || !selectedPrediction) {
      alert("Please enter amount and select YES or NO");
      return;
    }
    // Sending transaction to a target market address (or smart contract)
    sendTransaction({
      to: '0x0000000000000000000000000000000000000000', // Smart Contract placeholder
      value: parseEther(betAmount),
    });
  };

  return (
    <main className="min-h-screen bg-[#F5F6F8] text-black flex flex-col items-center pb-28 font-sans select-none">
      
      {/* HEADER */}
      <nav className="w-full p-4 flex justify-between items-center sticky top-0 bg-white shadow-sm z-50">
        <div className="flex items-center gap-2">
           <div className="w-9 h-9 bg-purple-100 rounded-full flex items-center justify-center border-2 border-purple-600">
              <span className="font-bold text-purple-700 text-sm">PM</span>
           </div>
           <h1 className="font-black text-xl tracking-tight text-purple-700">ArcPredict</h1>
        </div>
        <ConnectButton showBalance={false} chainStatus="icon" />
      </nav>

      <div className="w-full max-w-md px-4 pt-2 space-y-4">
        
        {/* WALLET BALANCE CARD */}
        <div className="p-6 rounded-[2.5rem] shadow-xl bg-gradient-to-br from-purple-700 via-purple-800 to-indigo-900 text-white">
          <p className="text-[10px] font-bold opacity-70 uppercase tracking-widest">Your Prediction Power</p>
          <h2 className="text-3xl font-black mt-1">
            {isConnected ? `${displayBalance} ${balance?.symbol}` : `0.00 USDC`}
          </h2>
        </div>

        {/* DYNAMIC SCREEN AREA */}
        <div className="min-h-[400px]">
          
          {/* MARKETS LIST VIEW */}
          {activeTab === 'markets' && !selectedMarket && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <h2 className="font-black text-xs uppercase opacity-50 px-1 tracking-wider">Active Prediction Pools</h2>
              
              {markets.map((market) => (
                <div key={market.id} onClick={() => setSelectedMarket(market)} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm cursor-pointer hover:border-purple-200 transition-all space-y-4">
                  <p className="font-bold text-sm leading-snug">{market.title}</p>
                  <div className="flex justify-between items-center text-xs border-t pt-3 border-gray-50">
                    <span className="text-gray-400 font-medium">Pool: <b className="text-black">{market.pool}</b></span>
                    <div className="flex gap-2">
                      <span className="bg-green-50 text-green-600 px-2 py-1 rounded-md font-bold">Yes {market.yesOdds}</span>
                      <span className="bg-red-50 text-red-600 px-2 py-1 rounded-md font-bold">No {market.noOdds}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* BETTING DETAIL FORM */}
          {selectedMarket && (
            <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-xl space-y-6 animate-in slide-in-from-right-8 duration-300">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-purple-600 uppercase tracking-widest">Place Your Position</span>
                <button onClick={() => { setSelectedMarket(null); setBetAmount(''); setSelectedPrediction(null); }} className="text-red-500 font-bold text-xs bg-red-50 px-3 py-1 rounded-full">BACK</button>
              </div>

              <p className="font-black text-base leading-snug text-gray-900">{selectedMarket.title}</p>

              {/* YES / NO SELECTION BUTTONS */}
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => setSelectedPrediction('YES')}
                  className={`py-4 rounded-2xl font-black text-sm border transition-all ${selectedPrediction === 'YES' ? 'bg-green-600 text-white border-green-600 shadow-lg shadow-green-200' : 'bg-gray-50 border-gray-100 text-green-600'}`}
                >
                  YES ({selectedMarket.yesOdds})
                </button>
                <button 
                  onClick={() => setSelectedPrediction('NO')}
                  className={`py-4 rounded-2xl font-black text-sm border transition-all ${selectedPrediction === 'NO' ? 'bg-red-600 text-white border-red-600 shadow-lg shadow-red-200' : 'bg-gray-50 border-gray-100 text-red-600'}`}
                >
                  NO ({selectedMarket.noOdds})
                </button>
              </div>

              {/* INPUT AMOUNT */}
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <label className="text-[10px] font-black opacity-40 uppercase tracking-widest">Investment Amount ({balance?.symbol || 'USDC'})</label>
                <input 
                  type="number"
                  value={betAmount}
                  onChange={(e) => setBetAmount(e.target.value)}
                  placeholder="0.00" 
                  className="w-full bg-transparent text-xl font-bold outline-none mt-2 text-black"
                />
              </div>

              <button 
                onClick={handlePlaceBet}
                disabled={isSending}
                className="w-full bg-purple-700 text-white py-5 rounded-[1.5rem] font-black text-sm tracking-widest shadow-lg shadow-purple-100 active:scale-95 transition-all"
              >
                {isSending ? 'SUBMITTING POSITION...' : 'STAKE ON ARC CHAIN'}
              </button>
            </div>
          )}

          {/* DASHBOARD HISTORY / ACTIVITY TAB */}
          {activeTab === 'history' && (
            <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm text-center py-10 text-gray-400 font-medium animate-in fade-in">
              🔒 No predictions submitted yet.
            </div>
          )}

        </div>
      </div>

      {/* BOTTOM NAVIGATION */}
      <div className="fixed bottom-0 w-full max-w-md bg-white border-t border-gray-200 px-12 py-4 flex justify-between items-center z-50">
        <button onClick={() => { setActiveTab('markets'); setSelectedMarket(null); }} className={`flex flex-col items-center gap-1 ${activeTab === 'markets' ? 'text-purple-700' : 'opacity-40 text-gray-500'}`}>
          <span className="text-xl">📊</span>
          <span className="text-[9px] font-black uppercase">Markets</span>
        </button>
        <button onClick={() => setActiveTab('history')} className={`flex flex-col items-center gap-1 ${activeTab === 'history' ? 'text-purple-700' : 'opacity-40 text-gray-500'}`}>
          <span className="text-xl">🕒</span>
          <span className="text-[9px] font-black uppercase">My Bets</span>
        </button>
      </div>

    </main>
  );
}