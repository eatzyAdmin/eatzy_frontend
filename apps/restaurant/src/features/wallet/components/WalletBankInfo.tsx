import { mockWallet } from '../data/mockWallet';
import { CreditCard, ShieldCheck } from '@repo/ui/icons';

export default function WalletBankInfo({ isLoading = false }: { isLoading?: boolean }) {
  const { bank_account } = mockWallet;

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-full h-full rounded-[32px] bg-gradient-to-bl from-blue-600 via-blue-700 to-indigo-900 p-8 text-white shadow-xl relative overflow-hidden group hover:shadow-2xl transition-shadow duration-500 flex flex-col justify-between">
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 rounded-full bg-white/10 blur-2xl group-hover:scale-110 transition-transform duration-1000"></div>
        <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-40 h-40 rounded-full bg-blue-400/20 blur-2xl group-hover:scale-110 transition-transform duration-1000"></div>

        <div className="relative z-10 flex flex-col h-full gap-6 justify-center">
          <div className="flex justify-between items-start">
            <div className="text-xl font-bold tracking-wider font-anton">
              {isLoading ? <div className="h-7 w-32 bg-white/20 animate-pulse rounded-md" /> : bank_account.bank_name}
            </div>
            <CreditCard className="w-8 h-8 opacity-80" />
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              {/* Simulating chip */}
              <div className="w-12 h-9 rounded-md bg-yellow-400/20 border border-yellow-400/40 relative overflow-hidden">
                <div className="absolute top-1/2 left-0 w-full h-[1px] bg-yellow-400/40"></div>
                <div className="absolute left-1/2 top-0 h-full w-[1px] bg-yellow-400/40"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full border border-yellow-400/40"></div>
              </div>
              <ShieldCheck className="w-6 h-6 opacity-60" />
            </div>
            <div className="font-mono text-2xl tracking-widest drop-shadow-md">
              {isLoading ? <div className="h-8 w-56 bg-white/20 animate-pulse rounded-md" /> : bank_account.account_number}
            </div>
          </div>

          <div className="flex justify-between items-end">
            <div>
              <div className="text-[10px] uppercase opacity-70 tracking-widest mb-1">Card Holder</div>
              <div className="font-bold tracking-wide text-sm">
                {isLoading ? <div className="h-4 w-32 bg-white/20 animate-pulse rounded mt-1" /> : bank_account.holder_name}
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] uppercase opacity-70 tracking-widest mb-1">Branch</div>
              <div className="font-bold text-xs">
                {isLoading ? <div className="h-4 w-20 bg-white/20 animate-pulse rounded mt-1 ml-auto" /> : bank_account.branch}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
