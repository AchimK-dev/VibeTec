import mongoose from 'mongoose';
import Artist from '../models/Artist.js';
import dotenv from 'dotenv';

dotenv.config();

const newArtists = [
  {
    name: 'DJ Phoenix',
    musicGenre: 'Techno / Progressive House',
    pricePerHour: 750,
    description:
      'Rising from the underground scene, DJ Phoenix brings explosive energy and fire to every performance. Specializing in high-octane techno and progressive house, Phoenix creates unforgettable peak-time moments.',
    image: 'https://res.cloudinary.com/dcioapkue/image/upload/v1753043911/DJ_Sasha_fehjdm.png'
  },
  {
    name: 'DJ Luna',
    musicGenre: 'Deep House / Melodic Techno',
    pricePerHour: 680,
    description:
      'DJ Luna crafts ethereal soundscapes that transport listeners to another dimension. Her deep house and melodic techno sets are known for their emotional depth and hypnotic grooves.',
    image: 'https://res.cloudinary.com/dcioapkue/image/upload/v1753043911/DJ_Calliope_lwnerz.png'
  },
  {
    name: 'DJ Storm',
    musicGenre: 'Hard Techno / Industrial',
    pricePerHour: 900,
    description:
      'With a reputation for unleashing powerful basslines and thunderous beats, DJ Storm dominates the dancefloor. His hard techno and industrial sound is not for the faint of heart.',
    image: 'https://res.cloudinary.com/dcioapkue/image/upload/v1753043911/DJ_Sasha_fehjdm.png'
  },
  {
    name: 'DJ Velvet',
    musicGenre: 'Nu-Disco / Funk House',
    pricePerHour: 620,
    description:
      'Smooth, sophisticated, and soulful—DJ Velvet specializes in nu-disco and funk house. Her sets are perfect for bringing warmth and groove to any event.',
    image: 'https://res.cloudinary.com/dcioapkue/image/upload/v1753043911/DJ_Hattie_cfebef.png'
  },
  {
    name: 'DJ Neon',
    musicGenre: 'Synthwave / Electro-Pop',
    pricePerHour: 720,
    description:
      'DJ Neon lights up the night with vibrant synthwave and electro-pop. His retro-futuristic sound and visual aesthetic create an immersive 80s-inspired experience.',
    image: 'https://res.cloudinary.com/dcioapkue/image/upload/v1753043911/DJ_Lark_ap5uw7.png'
  },
  {
    name: 'DJ Rhythm',
    musicGenre: 'Afro-House / Tribal',
    pricePerHour: 550,
    description:
      'Master of the groove, DJ Rhythm keeps crowds moving with infectious afro-house and tribal beats. His organic sound brings a global flavor to every performance.',
    image: 'https://res.cloudinary.com/dcioapkue/image/upload/v1753043911/DJ_Haze_Indie_czgofw.png'
  },
  {
    name: 'DJ Echo',
    musicGenre: 'Minimal Techno / Ambient',
    pricePerHour: 800,
    description:
      'DJ Echo creates sonic journeys through minimal techno and ambient soundscapes. Known for subtle builds and atmospheric textures, his sets are deeply immersive.',
    image: 'https://res.cloudinary.com/dcioapkue/image/upload/v1753043911/DJ_Calliope_lwnerz.png'
  },
  {
    name: 'DJ Blaze',
    musicGenre: 'Drum and Bass',
    pricePerHour: 780,
    description:
      'Bringing the heat with fierce drum and bass, DJ Blaze delivers high-energy sets that keep the adrenaline pumping. Fast-paced and relentless.',
    image: 'https://res.cloudinary.com/dcioapkue/image/upload/v1753043911/DJ_Sasha_fehjdm.png'
  },
  {
    name: 'DJ Starlight',
    musicGenre: 'Trance / Progressive',
    pricePerHour: 660,
    description:
      'DJ Starlight shines with uplifting trance and progressive melodies. Her emotional and euphoric sets create magical moments on the dancefloor.',
    image: 'https://res.cloudinary.com/dcioapkue/image/upload/v1753043911/DJ_Hattie_cfebef.png'
  },
  {
    name: 'DJ Voltage',
    musicGenre: 'Electro House',
    pricePerHour: 850,
    description:
      'High-voltage energy meets cutting-edge electro house. DJ Voltage delivers powerful drops and electrifying performances that leave crowds wanting more.',
    image: 'https://res.cloudinary.com/dcioapkue/image/upload/v1753043911/DJ_Sasha_fehjdm.png'
  },
  {
    name: 'DJ Harmony',
    musicGenre: 'World Fusion / Electronic',
    pricePerHour: 590,
    description:
      'DJ Harmony blends world music with electronic beats, creating a unique fusion sound. Her sets are culturally rich and musically diverse.',
    image: 'https://res.cloudinary.com/dcioapkue/image/upload/v1753043911/DJ_Hattie_cfebef.png'
  },
  {
    name: 'DJ Pulse',
    musicGenre: 'Tech House / Bass House',
    pricePerHour: 740,
    description:
      'Feel the heartbeat of the music with DJ Pulse. Specializing in tech house and bass house, his driving rhythms keep the energy flowing all night.',
    image: 'https://res.cloudinary.com/dcioapkue/image/upload/v1753043911/DJ_Lark_ap5uw7.png'
  },
  {
    name: 'DJ Mystic',
    musicGenre: 'Psytrance / Progressive Psy',
    pricePerHour: 710,
    description:
      'DJ Mystic weaves mysterious and enchanting psytrance and progressive psy. Her sets take listeners on a spiritual journey through sound.',
    image: 'https://res.cloudinary.com/dcioapkue/image/upload/v1753043911/DJ_Calliope_lwnerz.png'
  },
  {
    name: 'DJ Spectrum',
    musicGenre: 'House / Techno / Breaks',
    pricePerHour: 670,
    description:
      'Covering the full spectrum of electronic music, DJ Spectrum is versatile and dynamic. From house to techno to breaks, he does it all with style.',
    image: 'https://res.cloudinary.com/dcioapkue/image/upload/v1753043911/DJ_Haze_Indie_czgofw.png'
  },
  {
    name: 'DJ Frost',
    musicGenre: 'Minimal House',
    pricePerHour: 630,
    description:
      'Cool, crisp, and precise—DJ Frost delivers minimal house with icy perfection. His clean mixing and careful selection define modern minimalism.',
    image: 'https://res.cloudinary.com/dcioapkue/image/upload/v1753043911/DJ_Lark_ap5uw7.png'
  },
  {
    name: 'DJ Rebel',
    musicGenre: 'Experimental / Electroclash',
    pricePerHour: 820,
    description:
      'Breaking all the rules, DJ Rebel mixes punk energy with electronic chaos. His experimental sets challenge conventions and push boundaries.',
    image: 'https://res.cloudinary.com/dcioapkue/image/upload/v1753043911/DJ_Sasha_fehjdm.png'
  },
  {
    name: 'DJ Serenity',
    musicGenre: 'Downtempo / Chillout',
    pricePerHour: 580,
    description:
      'Find your inner peace with DJ Serenity. Her downtempo and chillout sets create relaxing atmospheres perfect for lounge events and sunset sessions.',
    image: 'https://res.cloudinary.com/dcioapkue/image/upload/v1753043911/DJ_Calliope_lwnerz.png'
  },
  {
    name: 'DJ Thunder',
    musicGenre: 'Dubstep / Bass Music',
    pricePerHour: 880,
    description:
      'DJ Thunder brings the storm with heavy dubstep and bass music. His earth-shaking drops and aggressive sound design dominate festival stages.',
    image: 'https://res.cloudinary.com/dcioapkue/image/upload/v1753043911/DJ_Sasha_fehjdm.png'
  },
  {
    name: 'DJ Amber',
    musicGenre: 'Organic House / Downtempo',
    pricePerHour: 640,
    description:
      'Warm and inviting, DJ Amber specializes in organic house and downtempo grooves. Her sets feel like a musical embrace, perfect for intimate gatherings.',
    image: 'https://res.cloudinary.com/dcioapkue/image/upload/v1753043911/DJ_Hattie_cfebef.png'
  },
  {
    name: 'DJ Quantum',
    musicGenre: 'Glitch / IDM / Experimental',
    pricePerHour: 760,
    description:
      'Exploring the boundaries of sound, DJ Quantum fuses glitch, IDM, and experimental electronica. His sets are cerebral and innovative, perfect for open-minded crowds.',
    image: 'https://res.cloudinary.com/dcioapkue/image/upload/v1753043911/DJ_Haze_Indie_czgofw.png'
  }
];

const createArtists = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Get Admin User for author field
    const User = (await import('../models/User.js')).default;
    const adminUser = await User.findOne({ role: 'ADMIN' });

    if (!adminUser) {
      console.log('❌ No Admin User found!');
      process.exit(1);
    }

    console.log(`👤 Using Admin User: ${adminUser.firstName} ${adminUser.lastName} (${adminUser._id})`);

    // Check how many Artists already exist
    const existingCount = await Artist.countDocuments();
    console.log(`📊 Current Artists: ${existingCount}`);

    if (existingCount >= 25) {
      console.log('⚠️  25 or more Artists already exist. Skipping creation.');
      process.exit(0);
    }

    // Create new Artists
    console.log(`\n🎨 Creating ${newArtists.length} new Artists...`);

    for (const artistData of newArtists) {
      const artist = new Artist({
        ...artistData,
        author: adminUser._id
      });
      await artist.save();
      console.log(`✅ ${artist.name} created (${artist.musicGenre} - ${artist.pricePerHour}€/hour)`);
    }

    const finalCount = await Artist.countDocuments();
    console.log(`\n🎉 Done! Total Artists: ${finalCount}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

createArtists();
