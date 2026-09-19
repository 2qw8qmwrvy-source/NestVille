import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./dev.db",
});
const db = new PrismaClient({ adapter });

async function main() {
  const passwordHash = await bcrypt.hash("password123", 10);

  // Clean slate: deleting users cascades to their listings, posts, favorites, and ratings.
  await db.user.deleteMany({});

  const [maya, jordan, priya] = await Promise.all(
    [
      { name: "Maya Chisholm", email: "maya@example.com", role: "landlord" },
      { name: "Jordan Sarty", email: "jordan@acadiau.ca", role: "student" },
      { name: "Priya Nair", email: "priya@acadiau.ca", role: "student" },
    ].map((u) => db.user.create({ data: { ...u, passwordHash } }))
  );

  await db.listing.create({
    data: {
      title: "Sunny 2-bedroom, 5 min walk to Acadia",
      description:
        "Bright second-floor unit on Highland Ave, a five minute walk from the Acadia campus. Large kitchen, shared laundry in the basement, and a private balcony overlooking the backyard. Great for two students who want to split rent close to everything.",
      address: "24 Highland Ave, Wolfville, NS",
      neighborhood: "Highland Avenue",
      price: 1450,
      bedrooms: 2,
      bathrooms: 1,
      propertyType: "Apartment",
      availableFrom: new Date("2026-09-01"),
      leaseLength: "12 months",
      furnished: false,
      petsAllowed: true,
      utilitiesIncluded: true,
      parking: true,
      laundry: true,
      authorId: maya.id,
    },
  });

  await db.listing.create({
    data: {
      title: "Room in shared house on Main Street",
      description:
        "One room available in a 4-bedroom student house right on Main Street, above the shops. Fully furnished common areas, fast wifi, and a big backyard for study breaks. Looking for someone chill who keeps common spaces tidy.",
      address: "412 Main St, Wolfville, NS",
      neighborhood: "Main Street",
      price: 650,
      bedrooms: 1,
      bathrooms: 1.5,
      propertyType: "Room in shared house",
      availableFrom: new Date("2026-09-01"),
      leaseLength: "8 months (school year)",
      furnished: true,
      petsAllowed: false,
      utilitiesIncluded: true,
      parking: false,
      laundry: true,
      authorId: jordan.id,
    },
  });

  await db.listing.create({
    data: {
      title: "Cozy basement suite near Gaspereau Ave",
      description:
        "Quiet self-contained basement suite with a separate entrance. Ten minute bike ride to campus along the dyke trail. Small kitchenette and a dedicated study nook. Ideal for a single grad student.",
      address: "88 Gaspereau Ave, Wolfville, NS",
      neighborhood: "Gaspereau Avenue",
      price: 900,
      bedrooms: 1,
      bathrooms: 1,
      propertyType: "Basement suite",
      availableFrom: new Date("2026-08-15"),
      leaseLength: "12 months",
      furnished: true,
      petsAllowed: false,
      utilitiesIncluded: false,
      parking: true,
      laundry: false,
      authorId: priya.id,
    },
  });

  await db.roommatePost.create({
    data: {
      type: "have_room",
      title: "Spare room for summer sublet near campus",
      description:
        "Subletting my room for the summer (May-August) while I'm doing an internship away from Wolfville. Two easygoing roommates staying in the house, walking distance to downtown.",
      price: 550,
      location: "Prospect Street",
      moveInDate: new Date("2026-05-01"),
      moveOutDate: new Date("2026-08-31"),
      authorId: jordan.id,
    },
  });

  await db.roommatePost.create({
    data: {
      type: "need_room",
      title: "2nd-year student looking for a roommate for September",
      description:
        "Looking for a room or a roommate situation starting September. Clean, quiet, and usually studying or at the rink. Budget around $700-800/month including utilities if possible.",
      price: 750,
      location: "Anywhere near Acadia",
      moveInDate: new Date("2026-09-01"),
      authorId: priya.id,
    },
  });

  await db.rating.create({
    data: {
      score: 5,
      comment: "Great landlord, responsive and the unit was exactly as described!",
      raterId: jordan.id,
      ratedUserId: maya.id,
    },
  });

  console.log("Seeded database with demo listings and roommate posts.");
  console.log("Demo accounts (password: password123):");
  console.log("  maya@example.com (landlord)");
  console.log("  jordan@acadiau.ca, priya@acadiau.ca (students)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await db.$disconnect();
  });
