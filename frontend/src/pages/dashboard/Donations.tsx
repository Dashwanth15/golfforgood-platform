import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Heart, Loader2, Calendar } from 'lucide-react';
import { charitiesApi } from '../../features/charities/charitiesApi';
import { formatCurrency, formatDate } from '../../utils/formatters';
import type { Donation } from '../../types';

function DonationCard({ donation, index }: { donation: Donation; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="card flex items-center justify-between hover:shadow-elevated transition-all duration-300"
    >
      <div className="flex items-center gap-4">
        {donation.charity?.image_url ? (
          <img src={donation.charity.image_url} alt={donation.charity.name} className="w-12 h-12 rounded-full object-cover border border-border" />
        ) : (
          <div className="w-12 h-12 rounded-full bg-surface flex items-center justify-center border border-border">
            <Heart className="w-5 h-5 text-brand" />
          </div>
        )}
        <div>
          <h3 className="font-bold text-ink">{donation.charity?.name}</h3>
          <p className="text-xs text-ink-muted flex items-center gap-1 mt-1">
            <Calendar className="w-3 h-3" /> {formatDate(donation.created_at)}
          </p>
        </div>
      </div>
      <div className="text-right">
        <div className="text-lg font-black text-brand">{formatCurrency(donation.donation_amount)}</div>
        <div className="text-xs text-ink-muted capitalize">{donation.donation_type.replace('_', ' ')}</div>
      </div>
    </motion.div>
  );
}

export default function Donations() {
  const { data: res, isLoading } = useQuery({
    queryKey: ['my-donations'],
    queryFn: charitiesApi.getMyDonations,
  });
  const donations = res?.data ?? [];

  const totalDonated = donations.reduce((sum, d) => sum + Number(d.donation_amount), 0);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-ink">Donation History</h1>
        <p className="text-ink-muted text-sm mt-1">Your independent one-time contributions</p>
      </div>

      {totalDonated > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="card bg-gradient-to-r from-brand to-[#047857] text-white mb-8"
        >
          <div className="flex items-center gap-4">
            <Heart className="w-10 h-10 text-white fill-white/20" />
            <div>
              <p className="text-white/70 text-sm">Total Donated</p>
              <p className="text-3xl font-black">{formatCurrency(totalDonated)}</p>
            </div>
          </div>
        </motion.div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-brand" /></div>
      ) : donations.length === 0 ? (
        <div className="card text-center py-16">
          <Heart className="w-12 h-12 text-border mx-auto mb-4" />
          <h3 className="font-bold text-ink mb-2">No donations yet</h3>
          <p className="text-sm text-ink-muted mb-6">Support your favorite charities with a one-time donation.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {donations.map((d, i) => <DonationCard key={d.id} donation={d} index={i} />)}
        </div>
      )}
    </div>
  );
}
