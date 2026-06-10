const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@lib.com';
  const adminPassword = process.env.ADMIN_PASSWORD || '1234';

  // Check if admin exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail }
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    
    await prisma.user.create({
      data: {
        name: 'Administrator',
        email: adminEmail,
        password: hashedPassword,
        role: 'ADMIN'
      }
    });
    
    console.log('✅ Admin user created:', adminEmail);
  } else {
    console.log('ℹ️ Admin user already exists');
  }

  // Seed sample books
  const bookCount = await prisma.book.count();
  if (bookCount === 0) {
    const sampleBooks = [
      { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', year: '1925', isbn: '978-0743273565' },
      { title: 'To Kill a Mockingbird', author: 'Harper Lee', year: '1960', isbn: '978-0446310789' },
      { title: '1984', author: 'George Orwell', year: '1949', isbn: '978-0451524935' },
      { title: 'Pride and Prejudice', author: 'Jane Austen', year: '1813', isbn: '978-0141439518' },
      { title: 'The Catcher in the Rye', author: 'J.D. Salinger', year: '1951', isbn: '978-0316769488' }
    ];

    await prisma.book.createMany({
      data: sampleBooks
    });
    
    console.log('✅ Sample books seeded');
  } else {
    console.log('ℹ️ Books already exist, skipping seed');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });