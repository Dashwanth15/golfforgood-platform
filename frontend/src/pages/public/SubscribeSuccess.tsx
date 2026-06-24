import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function SubscribeSuccess() {
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
          className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircle className="w-10 h-10 text-success" />
        </motion.div>
        <h2 className="text-3xl font-bold text-ink mb-3">Payment Successful 🎉</h2>
        <p className="text-ink-muted mb-8">
          Thank you for your purchase. Your subscription is currently being activated. You will receive a confirmation email shortly.
        </p>
        <Link to="/dashboard" className="btn-primary btn-lg">
          Go to Dashboard
        </Link>
      </motion.div>
    </div>
  );
}
