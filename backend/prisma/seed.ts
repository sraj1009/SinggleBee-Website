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

async function main() {
  console.log('🌱 Starting database seeding...\n');
  
  await seedAdminUser();
  await seedCategories();
  await seedBrands();
  
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
