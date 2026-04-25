import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function seedAdminUser() {
  try {
    const adminEmail = 'admin@singglebee.com';
    const adminPassword = 'Secure#DB_2026!Access';
    
    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail },
    });

    if (existingAdmin) {
      console.log('✅ Admin user already exists');
      
      // Update password if needed
      const hashedPassword = await bcrypt.hash(adminPassword, 12);
      await prisma.user.update({
        where: { email: adminEmail },
        data: { 
          password: hashedPassword,
          role: 'ADMIN',
          emailVerified: true,
          isActive: true,
        },
      });
      console.log('✅ Admin password updated');
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(adminPassword, 12);

    // Create admin user
    const admin = await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        firstName: 'Admin',
        lastName: 'User',
        role: 'ADMIN',
        emailVerified: true,
        isActive: true,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
      },
    });

    console.log('✅ Admin user created successfully:');
    console.log(`   Email: ${adminEmail}`);
    console.log(`   Password: ${adminPassword}`);
    console.log(`   Role: ${admin.role}`);

    // Create cart for admin
    await prisma.cart.create({
      data: {
        userId: admin.id,
      },
    });

    console.log('✅ Admin cart created');

  } catch (error) {
    console.error('❌ Error seeding admin user:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

async function seedCategories() {
  try {
    const categories = [
      { name: 'Books', slug: 'books', description: 'All types of books' },
      { name: 'Poem Books', slug: 'poem-books', description: 'Collection of poems' },
      { name: 'Story Books', slug: 'story-books', description: 'Fiction and non-fiction stories' },
      { name: 'Educational', slug: 'educational', description: 'Learning materials' },
      { name: 'Children', slug: 'children', description: 'Books for children' },
    ];

    for (const category of categories) {
      await prisma.category.upsert({
        where: { slug: category.slug },
        update: {},
        create: category,
      });
    }

    console.log('✅ Categories seeded');
  } catch (error) {
    console.error('❌ Error seeding categories:', error);
  }
}

async function seedBrands() {
  try {
    const brands = [
      { name: 'SinggleBee Publishing', slug: 'singglebee-publishing' },
      { name: 'Independent Authors', slug: 'independent-authors' },
    ];

    for (const brand of brands) {
      await prisma.brand.upsert({
        where: { slug: brand.slug },
        update: {},
        create: brand,
      });
    }

    console.log('✅ Brands seeded');
  } catch (error) {
    console.error('❌ Error seeding brands:', error);
  }
}

async function seedSampleProducts() {
  try {
    const category = await prisma.category.findFirst({ where: { slug: 'books' } });
    const brand = await prisma.brand.findFirst({ where: { slug: 'singglebee-publishing' } });

    if (!category || !brand) return;

    const products = [
      {
        name: 'The Art of Poetry',
        slug: 'the-art-of-poetry',
        description: 'A comprehensive guide to understanding and writing poetry.',
        shortDescription: 'Master the art of poetry writing',
        price: 24.99,
        comparePrice: 29.99,
        status: 'ACTIVE',
        featured: true,
        publishedAt: new Date(),
        categoryId: category.id,
        brandId: brand.id,
        tags: ['poetry', 'writing', 'education'],
      },
      {
        name: 'Tales of Adventure',
        slug: 'tales-of-adventure',
        description: 'Exciting adventure stories for all ages.',
        shortDescription: 'Thrilling adventure collection',
        price: 19.99,
        comparePrice: 24.99,
        status: 'ACTIVE',
        featured: true,
        publishedAt: new Date(),
        categoryId: category.id,
        brandId: brand.id,
        tags: ['adventure', 'fiction', 'stories'],
      },
      {
        name: 'Learning Mathematics',
        slug: 'learning-mathematics',
        description: 'Make math fun and easy to understand.',
        shortDescription: 'Fun approach to learning math',
        price: 34.99,
        status: 'ACTIVE',
        featured: false,
        publishedAt: new Date(),
        categoryId: category.id,
        brandId: brand.id,
        tags: ['education', 'mathematics', 'learning'],
      },
    ];

    for (const product of products) {
      const created = await prisma.product.create({
        data: {
          ...product,
          images: {
            create: {
              url: 'https://via.placeholder.com/400x400?text=' + encodeURIComponent(product.name),
              altText: product.name,
              position: 0,
            },
          },
        },
      });
      console.log(`✅ Product created: ${created.name}`);
    }
  } catch (error) {
    console.error('❌ Error seeding products:', error);
  }
}

async function seedCoupons() {
  try {
    const coupons = [
      {
        code: 'WELCOME10',
        description: 'Welcome discount for new customers',
        type: 'PERCENTAGE',
        value: 10,
        minOrderAmount: 50,
        maxDiscountAmount: 20,
        usageLimit: 1000,
        startsAt: new Date(),
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
        isActive: true,
      },
      {
        code: 'SUMMER25',
        description: 'Summer sale discount',
        type: 'PERCENTAGE',
        value: 25,
        minOrderAmount: 100,
        maxDiscountAmount: 50,
        usageLimit: 500,
        startsAt: new Date(),
        expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
        isActive: true,
      },
      {
        code: 'FREESHIP',
        description: 'Free shipping on any order',
        type: 'FIXED',
        value: 9.99,
        minOrderAmount: 75,
        usageLimit: null,
        startsAt: new Date(),
        expiresAt: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000), // 180 days
        isActive: true,
      },
    ];

    for (const coupon of coupons) {
      await prisma.coupon.upsert({
        where: { code: coupon.code },
        update: {},
        create: coupon,
      });
      console.log(`✅ Coupon created: ${coupon.code}`);
    }
  } catch (error) {
    console.error('❌ Error seeding coupons:', error);
  }
}

async function main() {
  console.log('🌱 Starting database seeding...\n');
  
  await seedAdminUser();
  await seedCategories();
  await seedBrands();
  await seedSampleProducts();
  await seedCoupons();
  
  console.log('\n✨ Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
