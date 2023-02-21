import mongoose from 'mongoose';
import { getEnv } from '../helpers';
async function connect() {
  try {
    mongoose.connect(getEnv('MONGO_URI'));
    console.log('🔥 Database connected successfully 🔥');
  } catch (error) {
    console.log('💀 Failed to connect to database 💀');
  }
}
export default connect;
