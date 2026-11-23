import connectDB from '../../Config/db.js';
import { loadEnv } from '../../Helpers/env.js';
import { seedBlogs } from './BlogSeeder.js';

const run = async () => {
    try {
        loadEnv();
        console.log('[Runner] Connecting to database...');
        await connectDB();
        console.log('[Runner] Populating travel blogs...');
        const res = await seedBlogs();
        console.log('[Runner] Blog seeding finished:', res);
        process.exit(0);
    } catch (err) {
        console.error('[Runner] Seeding error:', err);
        process.exit(1);
    }
};

run();
