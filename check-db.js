const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const mongoUri = process.env.MONGODB_URI || "mongodb+srv://shaileshmitkari40:Shailesh@cluster0.jyajky2.mongodb.net/venetcta?retryWrites=true&w=majority";

console.log('Connecting to:', mongoUri.replace(/:([^@]+)@/, ':****@'));

const DoctorSchema = new mongoose.Schema({}, { strict: false });
const Doctor = mongoose.model('Doctor', DoctorSchema);

async function checkDB() {
    try {
        await mongoose.connect(mongoUri);
        console.log('✅ Connected to MongoDB');
        
        const count = await Doctor.countDocuments();
        console.log('Doctor Count:', count);
        
        const doctors = await Doctor.find().limit(3);
        console.log('Sample Doctors:', JSON.stringify(doctors, null, 2));
        
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('Collections:', collections.map(c => c.name));

        await mongoose.disconnect();
        console.log('Disconnected');
    } catch (err) {
        console.error('❌ Error:', err.message);
        process.exit(1);
    }
}

checkDB();
