import dotenv from 'dotenv';
dotenv.config();

import app from './app';

const PORT = process.env.PORT ?? '5000';

app.listen(PORT, () => {
  console.log(`\n🚀 GolfForGood API running on http://localhost:${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV ?? 'development'}`);
  console.log(`🏥 Health:      http://localhost:${PORT}/api/health\n`);
});
