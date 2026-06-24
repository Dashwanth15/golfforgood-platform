import { motion } from 'framer-motion';
import { XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function SubscribeCancel() {
  return (
    <div className="min-h-screen bg-surface pt-20 flex items-center justify-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center p-12 max-w-lg mx-auto"
      >
        <motion.div
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2 }}
          className="w-20 h-20 rounded-full bg-error/10 flex items-center justify-center mx-auto mb-6"
        >
          <XCircle className="w-10 h-10 text-error" />
        </motion.div>
        <h2 className="text-3xl font-bold text-ink mb-3">Payment Cancelled</h2>
        <p className="text-ink-muted mb-8">
          Your payment was cancelled. You have not been charged.
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/subscribe" className="btn-primary btn-lg">
            Try Again
          </Link>
          <Link to="/dashboard" className="btn-ghost btn-lg">
            Go to Dashboard
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
