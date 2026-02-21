import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const categories = [
    { id: 1, name: 'City' },
    { id: 2, name: 'Health' },
    { id: 3, name: 'Community events' },
    { id: 4, name: 'Crime & Safety' },
    { id: 5, name: 'Culture' },
    { id: 6, name: 'Discounts & Benefits' },
    { id: 7, name: 'Emergencies' },
    { id: 8, name: 'For Seniors' },
    { id: 9, name: 'Kids & Family' },
  ]

  for (const category of categories) {
    await prisma.category.upsert({
      where: { id: category.id },
      update: { name: category.name },
      create: category,
    })
  }

  const announcements = [
    { id: 1, title: 'Title 1', description: 'Mock description 1', categoryIds: [1], publicationDate: new Date('2023-08-11T04:38:00Z'), lastUpdate: new Date('2023-08-11T04:38:00Z') },
    { id: 2, title: 'Title 2', description: 'Mock description 2', categoryIds: [1], publicationDate: new Date('2023-08-11T04:36:00Z'), lastUpdate: new Date('2023-08-11T04:36:00Z') },
    { id: 3, title: 'Title 3', description: 'Mock description 3', categoryIds: [1], publicationDate: new Date('2023-08-11T04:35:00Z'), lastUpdate: new Date('2023-08-11T04:35:00Z') },
    { id: 4, title: 'Title 4', description: 'Mock description 4', categoryIds: [1], publicationDate: new Date('2023-04-19T05:14:00Z'), lastUpdate: new Date('2023-04-19T05:14:00Z') },
    { id: 5, title: 'Title 5', description: 'Mock description 5', categoryIds: [1], publicationDate: new Date('2023-04-19T05:11:00Z'), lastUpdate: new Date('2023-04-19T05:11:00Z') },
    { id: 6, title: 'Title 6', description: 'Mock description 6', categoryIds: [1], publicationDate: new Date('2023-04-19T05:11:00Z'), lastUpdate: new Date('2023-04-19T05:11:00Z') },
    { id: 7, title: 'Title 7', description: 'Mock description 7', categoryIds: [1, 2], publicationDate: new Date('2023-03-24T07:27:00Z'), lastUpdate: new Date('2023-03-24T07:27:00Z') },
    { id: 8, title: 'Title 8', description: 'Mock description 8', categoryIds: [1, 2], publicationDate: new Date('2023-03-24T07:26:00Z'), lastUpdate: new Date('2023-03-24T07:26:00Z') },
    { id: 9, title: 'Title 9', description: 'Mock description 9', categoryIds: [1, 2], publicationDate: new Date('2023-03-24T07:26:00Z'), lastUpdate: new Date('2023-03-24T07:26:00Z') },
    { id: 10, title: 'Title 10', description: 'Mock description 10', categoryIds: [1, 2], publicationDate: new Date('2023-03-24T07:26:00Z'), lastUpdate: new Date('2023-03-24T07:26:00Z') },
    { id: 11, title: 'Title 11', description: 'Mock description 11', categoryIds: [2], publicationDate: new Date('2024-02-11T08:12:00Z'), lastUpdate: new Date('2024-02-11T08:12:00Z') },
    { id: 12, title: 'Title 12', description: 'Mock description 12', categoryIds: [3], publicationDate: new Date('2024-02-18T06:40:00Z'), lastUpdate: new Date('2024-02-18T06:40:00Z') },
    { id: 13, title: 'Title 13', description: 'Mock description 13', categoryIds: [1], publicationDate: new Date('2024-03-03T11:28:00Z'), lastUpdate: new Date('2024-03-03T11:28:00Z') },
    { id: 14, title: 'Title 14', description: 'Mock description 14', categoryIds: [2], publicationDate: new Date('2024-03-08T09:00:00Z'), lastUpdate: new Date('2024-03-08T09:00:00Z') },
    { id: 15, title: 'Title 15', description: 'Mock description 15', categoryIds: [3], publicationDate: new Date('2024-04-01T12:16:00Z'), lastUpdate: new Date('2024-04-01T12:16:00Z') },
    { id: 16, title: 'Title 16', description: 'Mock description 16', categoryIds: [1], publicationDate: new Date('2024-04-13T10:53:00Z'), lastUpdate: new Date('2024-04-13T10:53:00Z') },
    { id: 17, title: 'Title 17', description: 'Mock description 17', categoryIds: [2], publicationDate: new Date('2024-05-07T14:22:00Z'), lastUpdate: new Date('2024-05-07T14:22:00Z') },
    { id: 18, title: 'Title 18', description: 'Mock description 18', categoryIds: [3], publicationDate: new Date('2024-05-24T07:05:00Z'), lastUpdate: new Date('2024-05-24T07:05:00Z') },
    { id: 19, title: 'Title 19', description: 'Mock description 19', categoryIds: [1], publicationDate: new Date('2024-06-09T16:11:00Z'), lastUpdate: new Date('2024-06-09T16:11:00Z') },
    { id: 20, title: 'Title 20', description: 'Mock description 20', categoryIds: [2], publicationDate: new Date('2024-06-26T18:35:00Z'), lastUpdate: new Date('2024-06-26T18:35:00Z') },
  ]

  for (const announcement of announcements) {
    await prisma.announcement.upsert({
      where: { id: announcement.id },
      update: {
        title: announcement.title,
        description: announcement.description,
        publicationDate: announcement.publicationDate,
        lastUpdate: announcement.lastUpdate,
        categories: {
          set: announcement.categoryIds.map((id) => ({ id })),
        },
      },
      create: {
        id: announcement.id,
        title: announcement.title,
        description: announcement.description,
        publicationDate: announcement.publicationDate,
        lastUpdate: announcement.lastUpdate,
        categories: {
          connect: announcement.categoryIds.map((id) => ({ id })),
        },
      },
    })
  }

  console.log('Mock categories and announcements were seeded successfully.')
}

main()
  .catch((error) => {
    console.error('Seed failed:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
