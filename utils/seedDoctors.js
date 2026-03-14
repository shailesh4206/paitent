// Seed script to populate doctors in the database
const mongoose = require('mongoose');
const Doctor = require('../models/Doctor');

const doctors = [
  {
    name: "Dr. Priya Sharma",
    specialty: "Cardiologist",
    experience: 12,
    rating: 4.9,
    reviewCount: 312,
    location: "Koramangala, Bangalore",
    city: "Bangalore",
    fee: 800,
    about: "Dr. Priya Sharma is a highly experienced Cardiologist with over 12 years of practice. She specializes in preventive cardiology and heart disease management.",
    education: "MBBS, MD – Cardiology, AIIMS Delhi",
    languages: ["English", "Hindi", "Kannada"],
    available: true,
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop"
  },
  {
    name: "Dr. Rahul Mehta",
    specialty: "Neurologist",
    experience: 9,
    rating: 4.8,
    reviewCount: 274,
    location: "Bandra West, Mumbai",
    city: "Mumbai",
    fee: 700,
    about: "Dr. Rahul Mehta is a renowned Neurologist specializing in treating neurological disorders including headaches, epilepsy, and movement disorders.",
    education: "MBBS, DM – Neurology, KEM Hospital",
    languages: ["English", "Hindi", "Marathi"],
    available: true,
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&auto=format&fit=crop"
  },
  {
    name: "Dr. Anita Desai",
    specialty: "Dermatologist",
    experience: 7,
    rating: 4.7,
    reviewCount: 198,
    location: "Kalyani Nagar, Pune",
    city: "Pune",
    fee: 600,
    about: "Dr. Anita Desai is a skilled Dermatologist specializing in skin treatments, acne management, and cosmetic dermatology.",
    education: "MBBS, DVD – Dermatology, BJ Medical",
    languages: ["English", "Hindi", "Marathi"],
    available: true,
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&auto=format&fit=crop"
  },
  {
    name: "Dr. Suresh Patil",
    specialty: "Orthopedic",
    experience: 15,
    rating: 4.9,
    reviewCount: 421,
    location: "Dwarka Sector 7, Delhi",
    city: "Delhi",
    fee: 900,
    about: "Dr. Suresh Patil is an experienced Orthopedic surgeon specializing in joint replacements, sports injuries, and spine treatments.",
    education: "MBBS, MS – Orthopaedics, MAMC Delhi",
    languages: ["English", "Hindi", "Punjabi"],
    available: true,
    image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&auto=format&fit=crop"
  },
  {
    name: "Dr. Kavita Nair",
    specialty: "Pediatrician",
    experience: 11,
    rating: 5.0,
    reviewCount: 509,
    location: "Indiranagar, Bangalore",
    city: "Bangalore",
    fee: 500,
    about: "Dr. Kavita Nair is a compassionate Pediatrician dedicated to providing comprehensive healthcare for children from infancy to adolescence.",
    education: "MBBS, DCH – Paediatrics, St. John's",
    languages: ["English", "Hindi", "Malayalam"],
    available: true,
    image: "https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=400&auto=format&fit=crop"
  },
  {
    name: "Dr. Amit Kulkarni",
    specialty: "Psychiatrist",
    experience: 8,
    rating: 4.8,
    reviewCount: 187,
    location: "Jubilee Hills, Hyderabad",
    city: "Hyderabad",
    fee: 750,
    about: "Dr. Amit Kulkarni is a experienced Psychiatrist specializing in anxiety, depression, and other mental health conditions.",
    education: "MBBS, MD – Psychiatry, Osmania Medical",
    languages: ["English", "Hindi", "Telugu"],
    available: true,
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&auto=format&fit=crop"
  },
  {
    name: "Dr. Meena Joshi",
    specialty: "Gynaecologist",
    experience: 14,
    rating: 4.9,
    reviewCount: 360,
    location: "T.Nagar, Chennai",
    city: "Chennai",
    fee: 850,
    about: "Dr. Meena Joshi is a trusted Gynaecologist providing comprehensive women's healthcare services including prenatal care and IVF consultation.",
    education: "MBBS, MS – Obstetrics, Madras Medical",
    languages: ["English", "Hindi", "Tamil"],
    available: true,
    image: "https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?w=400&auto=format&fit=crop"
  },
  {
    name: "Dr. Ravi Kumar",
    specialty: "Dentist",
    experience: 6,
    rating: 4.6,
    reviewCount: 142,
    location: "Salt Lake City, Kolkata",
    city: "Kolkata",
    fee: 400,
    about: "Dr. Ravi Kumar is a skilled Dentist specializing in dental implants, root canal treatments, and cosmetic dentistry.",
    education: "BDS, MDS – Oral Surgery, Dental College",
    languages: ["English", "Hindi", "Bengali"],
    available: true,
    image: "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=400&auto=format&fit=crop"
  },
  {
    name: "Dr. Sneha Reddy",
    specialty: "Ophthalmologist",
    experience: 10,
    rating: 4.8,
    reviewCount: 223,
    location: "Banjara Hills, Hyderabad",
    city: "Hyderabad",
    fee: 650,
    about: "Dr. Sneha Reddy is a proficient Ophthalmologist specializing in cataract surgery, LASIK, and treatment of eye diseases.",
    education: "MBBS, MS – Ophthalmology, LV Prasad Eye",
    languages: ["English", "Hindi", "Telugu"],
    available: true,
    image: "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=400&auto=format&fit=crop"
  },
  {
    name: "Dr. Vikram Singh",
    specialty: "Cardiologist",
    experience: 18,
    rating: 4.9,
    reviewCount: 588,
    location: "South Ex, Delhi",
    city: "Delhi",
    fee: 1200,
    about: "Dr. Vikram Singh is a senior Cardiologist with 18 years of experience in interventional cardiology and cardiac surgeries.",
    education: "MBBS, DM – Cardiology, AIIMS Delhi",
    languages: ["English", "Hindi", "Punjabi"],
    available: true,
    image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&auto=format&fit=crop"
  },
  {
    name: "Dr. Pooja Iyer",
    specialty: "Dermatologist",
    experience: 5,
    rating: 4.5,
    reviewCount: 98,
    location: "Andheri West, Mumbai",
    city: "Mumbai",
    fee: 550,
    about: "Dr. Pooja Iyer is a young and energetic Dermatologist specializing in skin rejuvenation and anti-aging treatments.",
    education: "MBBS, MD – Dermatology, Grant Medical",
    languages: ["English", "Hindi", "Marathi"],
    available: true,
    image: "https://images.unsplash.com/photo-1643300411282-11bc3c38e9af?w=400&auto=format&fit=crop"
  },
  {
    name: "Dr. Arun Patel",
    specialty: "Orthopedic",
    experience: 13,
    rating: 4.7,
    reviewCount: 267,
    location: "Whitefield, Bangalore",
    city: "Bangalore",
    fee: 850,
    about: "Dr. Arun Patel is an experienced Orthopedic surgeon specializing in sports medicine and minimally invasive joint surgeries.",
    education: "MBBS, MS – Orthopaedics, Manipal Hospital",
    languages: ["English", "Hindi", "Kannada"],
    available: true,
    image: "https://images.unsplash.com/photo-1607990281513-27cde2baca2b?w=400&auto=format&fit=crop"
  },
  {
    name: "Dr. Shalini Gupta",
    specialty: "Pediatrician",
    experience: 9,
    rating: 4.8,
    reviewCount: 315,
    location: "Vasant Kunj, Delhi",
    city: "Delhi",
    fee: 600,
    about: "Dr. Shalini Gupta is a dedicated Pediatrician providing quality healthcare for children with a focus on preventive care.",
    education: "MBBS, MD – Paediatrics, Safdarjung Hospital",
    languages: ["English", "Hindi"],
    available: true,
    image: "https://images.unsplash.com/photo-1571772996211-2f02c9727629?w=400&auto=format&fit=crop"
  },
  {
    name: "Dr. Rajesh Nambiar",
    specialty: "Neurologist",
    experience: 16,
    rating: 4.9,
    reviewCount: 401,
    location: "Anna Nagar, Chennai",
    city: "Chennai",
    fee: 900,
    about: "Dr. Rajesh Nambiar is a senior Neurologist specializing in stroke treatment, Parkinson's disease, and neuro-rehabilitation.",
    education: "MBBS, DM – Neurology, NIMHANS Bangalore",
    languages: ["English", "Tamil", "Malayalam"],
    available: true,
    image: "https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?w=400&auto=format&fit=crop"
  },
  {
    name: "Dr. Nisha Kapoor",
    specialty: "Gynaecologist",
    experience: 12,
    rating: 4.8,
    reviewCount: 289,
    location: "Juhu, Mumbai",
    city: "Mumbai",
    fee: 900,
    about: "Dr. Nisha Kapoor is an expert Gynaecologist providing comprehensive women's healthcare including high-risk pregnancy care.",
    education: "MBBS, MD – Obstetrics, KEM Hospital",
    languages: ["English", "Hindi", "Marathi"],
    available: true,
    image: "https://images.unsplash.com/photo-1614608683457-a4d1b8c4c46c?w=400&auto=format&fit=crop"
  }
];

const seedDoctors = async () => {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || "mongodb+srv://shaileshmitkari40:Shailesh@cluster0.jyajky2.mongodb.net/venetcta?retryWrites=true&w=majority";
    
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 45000
    });
    
    console.log('Connected to MongoDB');

    // Clear existing doctors
    await Doctor.deleteMany({});
    console.log('Cleared existing doctors');

    // Insert new doctors
    const result = await Doctor.insertMany(doctors);
    console.log(`Inserted ${result.length} doctors`);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDoctors();

