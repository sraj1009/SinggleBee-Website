import { Category, Product } from './types.ts';
import product1Image from './assets/product-1.png';
import product2Image from './assets/product-2.png';
import product3Image from './assets/product-3.jpg';
import product4Image from './assets/product-4.png';
import product5Image from './assets/product-5.jpg';
import product6Image from './assets/product-6.jpg';
import product7Image from './assets/product-7.jpg';
import product9Image from './assets/product-9.jpg';
import product10Image from './assets/product-10.jpg';
import product11Image from './assets/product-11.png';
import product12Image from './assets/product-12.png';
import product13Image from './assets/product-13.jpg';
import product14Image from './assets/product-14.png';
import product15Image from './assets/product-15.jpg';
import product16Image from './assets/product-16.jpg';
import product17Image from './assets/product-17.jpg';
import outOfStockImage from './assets/out-of-stock.png';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 3,
    title: "தமிழ் பாலபாடம் - 1",
    author: "SINGGLEBEE",
    price: 125,
    rating: 4.8,
    reviewCount: 12,
    image: product1Image,
    category: Category.BOOKS,
    description: "Tamil Balapaadam – 1 (மோராவின் பாலபாடம்) introduces children to Tamil letters, words, pictures, and rhymes, building early reading and writing skills. This comprehensive primer is designed to make learning Tamil fun and engaging for young minds through colorful illustrations and clear phonetic guides. It features curated sections on Birds (பறவைகள்), Insects (பூச்சிகள்), Sea Animals, and detailed classifications of Wild and Domestic animals.",
    bestseller: true,
    pages: 32,
    language: "Tamil",
    format: "Paperback",
    reviews: [
      { id: 1, userName: "Karthik Raja", rating: 5, comment: "The bird pictures are very realistic. My child learned the Tamil names in a day!", date: "Aug 15, 2025" },
      { id: 2, userName: "Priyadharshini", rating: 4, comment: "Excellent quality paper. The phonetic guide is very helpful for parents who aren't fluent.", date: "Sep 22, 2025" }
    ]
  },
  {
    id: 4,
    title: "தமிழ் பாலபாடம் - 2",
    author: "SINGGLEBEE",
    price: 125,
    rating: 4.9,
    reviewCount: 27,
    image: product2Image,
    category: Category.BOOKS,
    description: "Tamil Balapaadam – 2 (மோராவின் பாலபாடம்) takes the learning journey further for Level 2 students. This volume introduces advanced categories including Vehicles (ஊர்திகள்), Musical Instruments (இசைக் கருவிகள்), and Play Equipment. Children will explore Body Parts, Action Words (வினைச் சொற்கள்), and physical wellness through Exercises like Side Stretching. It also covers essential cultural knowledge such as State and National Symbols, Daily Habits, and Tastes (சுவைகள்) like Astringent (துவர்ப்பு).",
    bestseller: false,
    pages: 40,
    language: "Tamil",
    format: "Paperback",
    reviews: [
      { id: 3, userName: "Muthu Kumaran", rating: 5, comment: "Level 2 is even better! The sections on vehicles and cultural symbols are very informative.", date: "Oct 10, 2025" },
      { id: 4, userName: "Kavitha Selvam", rating: 5, comment: "Our family loves the national symbols section. Great way to teach heritage to kids.", date: "Nov 05, 2025" }
    ]
  },
  {
    id: 1,
    title: "தமிழ் அரிச்சுவடி - 1",
    author: "SINGGLEBEE",
    price: 125,
    rating: 4.7,
    reviewCount: 43,
    image: product3Image,
    category: Category.BOOKS,
    description: "Tamil Arichuvadi – 1 is a beginner learning book for children that teaches Tamil letters, words, pictures, and rhymes in a simple, fun way. It focuses on foundational literacy, helping young learners recognize vowels and consonants through engaging visual associations. This Arichuvadi is the perfect first step for kids starting their Tamil educational journey at the hive.",
    bestseller: true,
    pages: 28,
    language: "Tamil",
    format: "Paperback",
    reviews: [
      { id: 5, userName: "Rajesh Kannan", rating: 4, comment: "Simple and effective. The association between letters and pictures is perfect for 3-year-olds.", date: "Aug 28, 2025" },
      { id: 6, userName: "Meena Kumari", rating: 5, comment: "This is the best Arichuvadi I've found. Very clean design and not cluttered.", date: "Dec 12, 2025" }
    ]
  },
  {
    id: 2,
    title: "தமிழ் அரிச்சுவடி - 2",
    author: "SINGGLEBEE",
    price: 125,
    rating: 4.9,
    reviewCount: 34,
    image: product4Image,
    category: Category.BOOKS,
    description: "Tamil Arichuvadi – 2 is a beginner-level book for kids that introduces Tamil letters, simple words, pictures, and rhymes to build strong early literacy skills.",
    bestseller: false,
    pages: 32,
    language: "Tamil",
    format: "Paperback",
    reviews: [
      { id: 7, userName: "Vijay Sethupathi", rating: 5, comment: "Level 2 builds perfectly on the first book. My daughter loves the rhymes at the end.", date: "Sep 09, 2025" },
      { id: 8, userName: "Lakshmi Narayanan", rating: 5, comment: "High quality printing and very engaging. Worth every rupee for early learners.", date: "Jan 03, 2026" }
    ]
  },
  {
    id: 5,
    title: "பட்டம் பறக்கும் பட்டம் - 1",
    author: "SINGGLEBEE",
    price: 169,
    rating: 4.9,
    reviewCount: 127,
    category: Category.POEM_BOOK,
    image: product5Image,
    description: "Pattam Parakkum Pattam – 1 (Tamil Poem Book) is a joyful poetry collection for children, filled with simple, rhythmic Tamil poems that spark imagination, language skills, and a love for reading.",
    bestseller: true,
    pages: 48,
    language: "Tamil",
    format: "Paperback",
    reviews: [
      { id: 9, userName: "Sangeetha Mani", rating: 5, comment: "The poems are so rhythmic! I catch my son humming them all day. Truly joyful.", date: "Oct 22, 2025" },
      { id: 10, userName: "Dinesh Babu", rating: 5, comment: "Beautiful Tamil poetry for kids. It really sparks their imagination and love for the language.", date: "Dec 30, 2025" }
    ]
  },
  {
    id: 6,
    title: "பட்டம் பறக்கும் பட்டம் - 2",
    author: "SINGGLEBEE",
    price: 169,
    rating: 4.8,
    reviewCount: 118,
    category: Category.POEM_BOOK,
    image: product6Image,
    description: "Pattam Parakkum Pattam – 2 (Tamil Poem Book) is currently buzzing out of stock. Stay tuned for its return!",
    bestseller: true,
    isOutOfStock: true,
    pages: 48,
    language: "Tamil",
    format: "Paperback",
    reviews: [
      { id: 11, userName: "Arulmozhi Varman", rating: 4, comment: "Waiting for this to restock! My first child loved the Level 1 book so much.", date: "Nov 15, 2025" },
      { id: 12, userName: "Yazhini Devi", rating: 5, comment: "The illustrations in Pattam series are world-class. Hope it comes back to the hive soon!", date: "Jan 10, 2026" }
    ]
  },
  {
    id: 7,
    title: "Kite Flies High - 1",
    author: "SINGGLEBEE",
    price: 169,
    rating: 4.9,
    reviewCount: 213,
    category: Category.POEM_BOOK,
    image: product7Image,
    description: "Kite Flies High – 1 (English Poem Book) is a joyful poetry collection for children, filled with simple, rhythmic English poems that spark imagination, language skills, and a love for reading.",
    bestseller: true,
    pages: 48,
    language: "English",
    format: "Paperback",
    reviews: [
      { id: 13, userName: "Kavin Thangavel", rating: 5, comment: "A delightful English version. The transition from Tamil to English poems is very smooth.", date: "Aug 19, 2025" },
      { id: 14, userName: "Mathi Maran", rating: 5, comment: "My kids enjoy the English rhymes just as much as the Tamil ones. Very well written!", date: "Oct 05, 2025" }
    ]
  },
  {
    id: 8,
    title: "Kite Flies High - 2",
    author: "SINGGLEBEE",
    price: 259,
    rating: 4.8,
    reviewCount: 187,
    category: Category.POEM_BOOK,
    image: outOfStockImage,
    description: "Kite Flies High – 2 (English Poem Book) is currently buzzing out of stock. Stay tuned for its return!",
    bestseller: false,
    isOutOfStock: true,
    pages: 48,
    language: "English",
    format: "Paperback",
    reviews: [
      { id: 15, userName: "Iniyan Selvan", rating: 4, comment: "Great collection of English poems for toddlers. Simple language and cute themes.", date: "Nov 30, 2025" },
      { id: 16, userName: "Thamizhalagan", rating: 5, comment: "Every child should have this. It makes learning English poetry so much fun!", date: "Dec 18, 2025" }
    ]
  },
  {
    id: 9,
    title: "Tales of Goodness",
    author: "SINGGLEBEE",
    price: 180,
    rating: 4.9,
    reviewCount: 78,
    category: Category.STORY_BOOK,
    image: product9Image,
    description: "Tales of Goodness – Story Book is a heartwarming collection of children’s stories that teach kindness, values, and life lessons through simple, engaging narratives.",
    bestseller: false,
    pages: 64,
    language: "English",
    format: "Paperback",
    reviews: [
      { id: 17, userName: "Malar Vizhi", rating: 5, comment: "The stories are so heartwarming. They really teach good values without being preachy.", date: "Sep 28, 2025" },
      { id: 18, userName: "Shenbagam", rating: 5, comment: "Perfect bedtime stories. My daughter asks for one every single night!", date: "Jan 12, 2026" }
    ]
  },
  {
    id: 10,
    title: "Three Tiny Tales for Twilight Time",
    author: "SINGGLEBEE",
    price: 180,
    rating: 4.8,
    reviewCount: 61,
    image: product10Image,
    category: Category.STORY_BOOK,
    description: "Three Tiny Tales for Twilight Time – Story Book is a gentle collection of short bedtime stories that calm young minds, spark imagination, and nurture a love for reading before sleep.",
    bestseller: true,
    pages: 56,
    language: "English",
    format: "Paperback",
    reviews: [
      { id: 19, userName: "Ilango Adigal", rating: 5, comment: "Gentle and calming stories. The Twilight theme is perfect for winding down the day.", date: "Dec 05, 2025" },
      { id: 20, userName: "Kannagi Selvi", rating: 5, comment: "The three tales are just the right length for a quick yet satisfying bedtime read.", date: "Jan 15, 2026" }
    ]
  },
  {
    id: 11,
    title: "Bro-Sis Restaurant Game",
    author: "SINGGLEBEE",
    price: 130,
    rating: 4.7,
    reviewCount: 23,
    category: Category.STORY_BOOK,
    image: product11Image,
    description: "A fun and heartwarming story about a brother and sister who bond through playful games, laughter, and shared adventures.",
    bestseller: false,
    pages: 24,
    language: "English",
    format: "Cardstock",
    reviews: [
      { id: 21, userName: "Karthikeyan", rating: 5, comment: "My kids really connected with this story. The cardstock format is perfect for small hands!", date: "Mar 10, 2026" },
      { id: 22, userName: "Anitha Prakash", rating: 4, comment: "A very touching story that captures the sibling bond beautifully. Highly recommended.", date: "Apr 02, 2026" }
    ]
  },
  {
    id: 12,
    title: "அண்ணன் - தங்கை உணவகம் விளையாட்டு",
    author: "MOHANRAJ PJ & SINGGLEBEE TEAM",
    price: 130,
    rating: 4.7,
    reviewCount: 20,
    category: Category.STORY_BOOK,
    image: product12Image,
    description: "A delightful story about a brother and sister growing closer through playful moments, fun, and shared experiences.",
    bestseller: true,
    pages: 24,
    language: "Tamil",
    format: "Cardstock",
    reviews: [
      { id: 23, userName: "Lakshmi Priya", rating: 5, comment: "குழந்தைகளுக்கு மிகவும் பிடிக்கும் அருமையான கதை. தரம் மிக அருமை!", date: "Apr 15, 2026" },
      { id: 24, userName: "Surya Prakash", rating: 4, comment: "அண்ணன் தங்கை பாசத்தை அழகாக சொல்கிறது. நன்றி.", date: "Apr 20, 2026" }
    ]
  },
  {
    id: 13,
    title: "Terrace Garden",
    author: "MOHANRAJ PJ & SINGGLEBEE TEAM",
    price: 149,
    rating: 4.7,
    reviewCount: 27,
    category: Category.STORY_BOOK,
    image: product13Image,
    description: "A simple guide to creating a terrace garden, growing fresh plants, and enjoying nature through sustainable, space-saving urban gardening practices.",
    bestseller: false,
    pages: 20,
    language: "English",
    format: "Cardstock",
    reviews: [
      { id: 25, userName: "Murugan M", rating: 5, comment: "Very useful and beautifully illustrated. My children love the gardening tips!", date: "Apr 21, 2026" },
      { id: 26, userName: "Kavitha", rating: 4, comment: "Excellent guide for small spaces. The story makes it engaging for kids.", date: "Apr 22, 2026" }
    ]
  },
  {
    id: 14,
    title: "மாடித் தோட்டம்",
    author: "MOHANRAJ PJ & SINGGLEBEE TEAM",
    price: 149,
    rating: 4.7,
    reviewCount: 26,
    category: Category.STORY_BOOK,
    image: product14Image,
    description: "A practical book on building a terrace garden, cultivating fresh plants, and embracing eco-friendly urban gardening in limited spaces.",
    bestseller: false,
    pages: 20,
    language: "Tamil",
    format: "Cardstock",
    reviews: [
      { id: 27, userName: "Arul", rating: 5, comment: "மிகவும் பயனுள்ள புத்தகம். மாடித் தோட்டம் அமைக்க சிறந்த வழிகாட்டி.", date: "Apr 23, 2026" },
      { id: 28, userName: "Selvam", rating: 4, comment: "நல்ல விளக்கங்கள். எளிமையாக புரியும் வண்ணம் உள்ளது.", date: "Apr 24, 2026" }
    ]
  },
  {
    id: 15,
    title: "நல்லொழுக்கக் கதைகள்",
    author: "SINGGLEBEE TEAM",
    price: 180,
    rating: 4.6,
    reviewCount: 28,
    category: Category.STORY_BOOK,
    image: product15Image,
    description: "A collection of inspiring stories that highlight kindness, honesty, and compassion, teaching valuable life lessons through simple, meaningful everyday moments.",
    bestseller: false,
    pages: 32,
    language: "Tamil",
    format: "Cardstock",
    reviews: [
      { id: 29, userName: "Senthil", rating: 5, comment: "கதைகள் மிகவும் அருமையாக உள்ளன. குழந்தைகளுக்கு நல்ல ஒழுக்கத்தை போதிக்கிறது.", date: "Apr 24, 2026" },
      { id: 30, userName: "Malar", rating: 4, comment: "நல்ல புத்தகம். படங்கள் அழகாக உள்ளன.", date: "Apr 24, 2026" }
    ]
  },
  {
    id: 16,
    title: "Smart Learners on the Bus",
    author: "SINGGLEBEE TEAM",
    price: 190,
    rating: 4.8,
    reviewCount: 30,
    category: Category.STORY_BOOK,
    image: product16Image,
    description: "A lively story of children learning good manners, teamwork, and safety while traveling together on a busy bus, turning everyday moments into lessons.",
    bestseller: false,
    pages: 24,
    language: "English",
    format: "Cardstock",
    reviews: [
      { id: 31, userName: "Karthikeyan", rating: 5, comment: "Excellent book for teaching kids about bus safety and manners. My son loves it!", date: "Apr 24, 2026" },
      { id: 32, userName: "Anandhi", rating: 4, comment: "Very colorful and engaging. The bus theme is a big hit with children.", date: "Apr 24, 2026" }
    ]
  },
  {
    id: 17,
    title: "Science Stories for Wonder Kids",
    author: "SINGGLEBEE TEAM",
    price: 220,
    rating: 4.7,
    reviewCount: 25,
    category: Category.STORY_BOOK,
    image: product17Image,
    description: "A collection of engaging science stories that spark curiosity, simplify concepts, and inspire young minds to explore, question, and discover the wonders of science.",
    bestseller: false,
    pages: 40,
    language: "English",
    format: "Cardstock",
    reviews: [
      { id: 33, userName: "Vijay", rating: 5, comment: "Amazing science stories! It makes complex topics so easy for kids to understand.", date: "Apr 24, 2026" },
      { id: 34, userName: "Lakshmi", rating: 4, comment: "Very informative and well-written. My daughter is now fascinated with space!", date: "Apr 24, 2026" }
    ]
  }
];
