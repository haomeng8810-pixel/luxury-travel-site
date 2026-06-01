-- Drop existing types (in reverse dependency order)
DROP TYPE IF EXISTS "ChatRole" CASCADE;
DROP TYPE IF EXISTS "ArticleType" CASCADE;
DROP TYPE IF EXISTS "UserRole" CASCADE;
DROP TYPE IF EXISTS "InquiryStatus" CASCADE;

-- Drop existing tables (in reverse dependency order)
DROP TABLE IF EXISTS "ai_chat_messages" CASCADE;
DROP TABLE IF EXISTS "ai_chats" CASCADE;
DROP TABLE IF EXISTS "ai_itineraries" CASCADE;
DROP TABLE IF EXISTS "site_config" CASCADE;
DROP TABLE IF EXISTS "podcasts" CASCADE;
DROP TABLE IF EXISTS "articles" CASCADE;
DROP TABLE IF EXISTS "seo" CASCADE;
DROP TABLE IF EXISTS "users" CASCADE;
DROP TABLE IF EXISTS "reviews" CASCADE;
DROP TABLE IF EXISTS "inquiries" CASCADE;
DROP TABLE IF EXISTS "travel_experts" CASCADE;
DROP TABLE IF EXISTS "accommodations" CASCADE;
DROP TABLE IF EXISTS "experiences" CASCADE;
DROP TABLE IF EXISTS "trips" CASCADE;
DROP TABLE IF EXISTS "destinations" CASCADE;
DROP TABLE IF EXISTS "emotions" CASCADE;

-- CreateEnum
CREATE TYPE "InquiryStatus" AS ENUM ('NEW', 'CONTACTED', 'IN_PROGRESS', 'QUOTED', 'BOOKED', 'CLOSED', 'LOST');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('CUSTOMER', 'EXPERT', 'ADMIN');

-- CreateEnum
CREATE TYPE "ArticleType" AS ENUM ('STORY', 'GUIDE', 'FEATURE', 'NEWS');

-- CreateEnum
CREATE TYPE "ChatRole" AS ENUM ('user', 'assistant');

-- CreateTable
CREATE TABLE "emotions" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameCn" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT,
    "color" TEXT NOT NULL DEFAULT '#000000',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "emotions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "destinations" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameCn" TEXT NOT NULL,
    "nameLocal" TEXT,
    "continent" TEXT NOT NULL,
    "region" TEXT,
    "countryCode" TEXT,
    "description" TEXT NOT NULL,
    "descriptionLong" TEXT,
    "coverImage" TEXT NOT NULL,
    "gallery" TEXT NOT NULL,
    "videoUrl" TEXT,
    "highlight" TEXT NOT NULL,
    "bestSeason" TEXT,
    "currency" TEXT,
    "language" TEXT NOT NULL,
    "timezone" TEXT,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "destinations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trips" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "titleCn" TEXT NOT NULL,
    "subtitle" TEXT,
    "tagline" TEXT,
    "description" TEXT NOT NULL,
    "descriptionLong" TEXT,
    "coverImage" TEXT NOT NULL,
    "gallery" TEXT NOT NULL,
    "videoUrl" TEXT,
    "duration" INTEGER NOT NULL,
    "nights" INTEGER NOT NULL,
    "minGuests" INTEGER NOT NULL DEFAULT 1,
    "maxGuests" INTEGER,
    "difficulty" TEXT,
    "activityLevel" TEXT,
    "emotionId" TEXT,
    "categories" TEXT NOT NULL,
    "experiences" TEXT NOT NULL,
    "destinationId" TEXT NOT NULL,
    "subDestinations" TEXT NOT NULL,
    "priceFrom" DECIMAL(65,30),
    "priceCurrency" TEXT NOT NULL DEFAULT 'USD',
    "priceNote" TEXT,
    "isInquireOnly" BOOLEAN NOT NULL DEFAULT true,
    "itinerary" TEXT,
    "inclusions" TEXT NOT NULL,
    "exclusions" TEXT NOT NULL,
    "packingList" TEXT NOT NULL,
    "bookingNote" TEXT,
    "cancellationPolicy" TEXT,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "isExclusive" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "trips_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "experiences" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "titleCn" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "coverImage" TEXT NOT NULL,
    "gallery" TEXT NOT NULL,
    "duration" TEXT,
    "location" TEXT NOT NULL,
    "destinationId" TEXT,
    "category" TEXT NOT NULL,
    "priceIncluded" BOOLEAN NOT NULL DEFAULT true,
    "isOptional" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "experiences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accommodations" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameCn" TEXT,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "coverImage" TEXT NOT NULL,
    "gallery" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "latitude" DECIMAL(65,30),
    "longitude" DECIMAL(65,30),
    "starRating" INTEGER,
    "category" TEXT NOT NULL,
    "amenities" TEXT NOT NULL,
    "priceLevel" TEXT,
    "website" TEXT,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "accommodations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "travel_experts" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "avatar" TEXT NOT NULL,
    "bio" TEXT NOT NULL,
    "specialties" TEXT NOT NULL,
    "languages" TEXT NOT NULL,
    "yearsExperience" INTEGER NOT NULL,
    "quote" TEXT,
    "videoIntro" TEXT,
    "email" TEXT,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "travel_experts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inquiries" (
    "id" TEXT NOT NULL,
    "status" "InquiryStatus" NOT NULL DEFAULT 'NEW',
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "country" TEXT,
    "tripId" TEXT,
    "destination" TEXT,
    "emotions" TEXT NOT NULL,
    "travelDates" TIMESTAMP(3),
    "travelDatesFlexible" BOOLEAN NOT NULL DEFAULT false,
    "duration" INTEGER,
    "travelers" INTEGER NOT NULL DEFAULT 1,
    "travelerType" TEXT,
    "budget" TEXT,
    "interests" TEXT NOT NULL,
    "notes" TEXT,
    "expertId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "contactedAt" TIMESTAMP(3),
    "convertedAt" TIMESTAMP(3),
    "closedAt" TIMESTAMP(3),
    "closedReason" TEXT,

    CONSTRAINT "inquiries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reviews" (
    "id" TEXT NOT NULL,
    "tripId" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "customerAvatar" TEXT,
    "location" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "tripDate" TIMESTAMP(3),
    "isVerified" BOOLEAN NOT NULL DEFAULT true,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "phone" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'CUSTOMER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seo" (
    "id" TEXT NOT NULL,
    "destinationId" TEXT,
    "tripId" TEXT,
    "pageSlug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "keywords" TEXT NOT NULL,
    "ogImage" TEXT,
    "canonical" TEXT,

    CONSTRAINT "seo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "articles" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "type" "ArticleType" NOT NULL DEFAULT 'STORY',
    "title" TEXT NOT NULL,
    "titleCn" TEXT,
    "subtitle" TEXT,
    "coverImage" TEXT NOT NULL,
    "gallery" TEXT NOT NULL,
    "videoUrl" TEXT,
    "content" TEXT NOT NULL,
    "categories" TEXT NOT NULL,
    "tags" TEXT NOT NULL,
    "author" TEXT,
    "readTime" INTEGER,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "articles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "podcasts" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "coverImage" TEXT NOT NULL,
    "audioUrl" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "episodeNumber" INTEGER NOT NULL,
    "seasonNumber" INTEGER NOT NULL DEFAULT 1,
    "guests" TEXT NOT NULL,
    "transcript" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "podcasts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "site_config" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "category" TEXT NOT NULL,

    CONSTRAINT "site_config_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_itineraries" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "travelers" INTEGER NOT NULL DEFAULT 1,
    "budget" TEXT,
    "travelerType" TEXT,
    "interests" TEXT NOT NULL,
    "specialNotes" TEXT,
    "title" TEXT NOT NULL,
    "titleCn" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "dailyPlan" TEXT NOT NULL,
    "estimatedCost" TEXT,
    "tips" TEXT NOT NULL,
    "convertedToInquiry" BOOLEAN NOT NULL DEFAULT false,
    "inquiryId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_itineraries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_chats" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ai_chats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_chat_messages" (
    "id" TEXT NOT NULL,
    "chatId" TEXT NOT NULL,
    "role" "ChatRole" NOT NULL,
    "content" TEXT NOT NULL,
    "context" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_chat_messages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "emotions_name_key" ON "emotions"("name");

-- CreateIndex
CREATE UNIQUE INDEX "destinations_slug_key" ON "destinations"("slug");

-- CreateIndex
CREATE INDEX "destinations_continent_isActive_idx" ON "destinations"("continent", "isActive");

-- CreateIndex
CREATE INDEX "destinations_isFeatured_idx" ON "destinations"("isFeatured");

-- CreateIndex
CREATE UNIQUE INDEX "trips_slug_key" ON "trips"("slug");

-- CreateIndex
CREATE INDEX "trips_destinationId_isActive_idx" ON "trips"("destinationId", "isActive");

-- CreateIndex
CREATE INDEX "trips_emotionId_idx" ON "trips"("emotionId");

-- CreateIndex
CREATE INDEX "trips_isFeatured_idx" ON "trips"("isFeatured");

-- CreateIndex
CREATE INDEX "trips_categories_idx" ON "trips"("categories");

-- CreateIndex
CREATE INDEX "experiences_destinationId_idx" ON "experiences"("destinationId");

-- CreateIndex
CREATE INDEX "experiences_category_idx" ON "experiences"("category");

-- CreateIndex
CREATE UNIQUE INDEX "accommodations_slug_key" ON "accommodations"("slug");

-- CreateIndex
CREATE INDEX "accommodations_category_idx" ON "accommodations"("category");

-- CreateIndex
CREATE INDEX "accommodations_starRating_idx" ON "accommodations"("starRating");

-- CreateIndex
CREATE UNIQUE INDEX "travel_experts_slug_key" ON "travel_experts"("slug");

-- CreateIndex
CREATE INDEX "inquiries_status_idx" ON "inquiries"("status");

-- CreateIndex
CREATE INDEX "inquiries_expertId_idx" ON "inquiries"("expertId");

-- CreateIndex
CREATE INDEX "inquiries_createdAt_idx" ON "inquiries"("createdAt");

-- CreateIndex
CREATE INDEX "reviews_tripId_idx" ON "reviews"("tripId");

-- CreateIndex
CREATE INDEX "reviews_isFeatured_idx" ON "reviews"("isFeatured");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "seo_destinationId_key" ON "seo"("destinationId");

-- CreateIndex
CREATE UNIQUE INDEX "seo_tripId_key" ON "seo"("tripId");

-- CreateIndex
CREATE UNIQUE INDEX "seo_pageSlug_key" ON "seo"("pageSlug");

-- CreateIndex
CREATE INDEX "seo_pageSlug_idx" ON "seo"("pageSlug");

-- CreateIndex
CREATE UNIQUE INDEX "articles_slug_key" ON "articles"("slug");

-- CreateIndex
CREATE INDEX "articles_type_isPublished_idx" ON "articles"("type", "isPublished");

-- CreateIndex
CREATE INDEX "articles_isFeatured_idx" ON "articles"("isFeatured");

-- CreateIndex
CREATE UNIQUE INDEX "podcasts_slug_key" ON "podcasts"("slug");

-- CreateIndex
CREATE INDEX "podcasts_isPublished_idx" ON "podcasts"("isPublished");

-- CreateIndex
CREATE UNIQUE INDEX "site_config_key_key" ON "site_config"("key");

-- CreateIndex
CREATE INDEX "site_config_category_idx" ON "site_config"("category");

-- CreateIndex
CREATE UNIQUE INDEX "ai_itineraries_sessionId_key" ON "ai_itineraries"("sessionId");

-- CreateIndex
CREATE INDEX "ai_itineraries_sessionId_idx" ON "ai_itineraries"("sessionId");

-- CreateIndex
CREATE INDEX "ai_itineraries_createdAt_idx" ON "ai_itineraries"("createdAt");

-- CreateIndex
CREATE INDEX "ai_chats_sessionId_idx" ON "ai_chats"("sessionId");

-- CreateIndex
CREATE INDEX "ai_chat_messages_chatId_idx" ON "ai_chat_messages"("chatId");

-- AddForeignKey
ALTER TABLE "trips" ADD CONSTRAINT "trips_emotionId_fkey" FOREIGN KEY ("emotionId") REFERENCES "emotions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trips" ADD CONSTRAINT "trips_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES "destinations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "experiences" ADD CONSTRAINT "experiences_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES "destinations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inquiries" ADD CONSTRAINT "inquiries_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "trips"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inquiries" ADD CONSTRAINT "inquiries_expertId_fkey" FOREIGN KEY ("expertId") REFERENCES "travel_experts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "trips"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seo" ADD CONSTRAINT "seo_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES "destinations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seo" ADD CONSTRAINT "seo_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "trips"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_chat_messages" ADD CONSTRAINT "ai_chat_messages_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "ai_chats"("id") ON DELETE CASCADE ON UPDATE CASCADE;
