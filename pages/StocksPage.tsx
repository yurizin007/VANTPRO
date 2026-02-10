
import React from 'react';
import AcoesScanner from '../components/AcoesScanner';
import { Disclaimer } from '../components/SharedUI';
import { Asset } from '../types';

export const StocksPage: React.FC<{ onAnalyze: (asset: Asset) => void }> = () => {
  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-20 text-left">
      <AcoesScanner />
      <Disclaimer />
    </div>
  );
};
