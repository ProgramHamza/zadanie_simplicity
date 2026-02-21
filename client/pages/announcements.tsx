import { useEffect, useState } from 'react'

export type Announcement = {
  id: number
  title: string
  publicationDate: string
  lastUpdate: string
  categories: string
}

export const announcements: Announcement[] = [
  { id: 1, title: 'Title 1', publicationDate: 'Aug 11, 2023 04:38', lastUpdate: 'Aug 11, 2023', categories: 'City' },
  { id: 2, title: 'Title 2', publicationDate: 'Aug 11, 2023 04:36', lastUpdate: 'Aug 11, 2023', categories: 'City' },
  { id: 3, title: 'Title 3', publicationDate: 'Aug 11, 2023 04:35', lastUpdate: 'Aug 11, 2023', categories: 'City' },
  { id: 4, title: 'Title 4', publicationDate: 'Apr 19, 2023 05:14', lastUpdate: 'Apr 19, 2023', categories: 'City' },
  { id: 5, title: 'Title 5', publicationDate: 'Apr 19, 2023 05:11', lastUpdate: 'Apr 19, 2023', categories: 'City' },
  { id: 6, title: 'Title 6', publicationDate: 'Apr 19, 2023 05:11', lastUpdate: 'Apr 19, 2023', categories: 'City' },
  { id: 7, title: 'Title 7', publicationDate: 'Mar 24, 2023 07:27', lastUpdate: 'Mar 24, 2023', categories: 'City,Health' },
  { id: 8, title: 'Title 8', publicationDate: 'Mar 24, 2023 07:26', lastUpdate: 'Mar 24, 2023', categories: 'City,Health' },
  { id: 9, title: 'Title 9', publicationDate: 'Mar 24, 2023 07:26', lastUpdate: 'Mar 24, 2023', categories: 'City,Health' },
  { id: 10, title: 'Title 10', publicationDate: 'Mar 24, 2023 07:26', lastUpdate: 'Mar 24, 2023', categories: 'City,Health' },
  { id: 11, title: 'Title 11', publicationDate: 'Feb 11, 2024 08:12', lastUpdate: 'Feb 11, 2024', categories: 'Health' },
  { id: 12, title: 'Title 12', publicationDate: 'Feb 18, 2024 06:40', lastUpdate: 'Feb 18, 2024', categories: 'Community events' },
  { id: 13, title: 'Title 13', publicationDate: 'Mar 03, 2024 11:28', lastUpdate: 'Mar 03, 2024', categories: 'City' },
  { id: 14, title: 'Title 14', publicationDate: 'Mar 08, 2024 09:00', lastUpdate: 'Mar 08, 2024', categories: 'Health' },
  { id: 15, title: 'Title 15', publicationDate: 'Apr 01, 2024 12:16', lastUpdate: 'Apr 01, 2024', categories: 'Community events' },
  { id: 16, title: 'Title 16', publicationDate: 'Apr 13, 2024 10:53', lastUpdate: 'Apr 13, 2024', categories: 'City' },
  { id: 17, title: 'Title 17', publicationDate: 'May 07, 2024 14:22', lastUpdate: 'May 07, 2024', categories: 'Health' },
  { id: 18, title: 'Title 18', publicationDate: 'May 24, 2024 07:05', lastUpdate: 'May 24, 2024', categories: 'Community events' },
  { id: 19, title: 'Title 19', publicationDate: 'Jun 09, 2024 16:11', lastUpdate: 'Jun 09, 2024', categories: 'City' },
  { id: 20, title: 'Title 20', publicationDate: 'Jun 26, 2024 18:35', lastUpdate: 'Jun 26, 2024', categories: 'Health' },
]

type ApiAnnouncement = {
  id: number
  title: string
  publicationDate: string
  lastUpdate: string
  categories: Array<{
    name: string
  }>
}

function formatDate(value: string, withTime = false) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return value
  }

  return withTime
    ? date.toLocaleString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
    : date.toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    })
}

export default function AnnouncementsPage() {
  const [items, setItems] = useState<Announcement[]>(announcements)

  useEffect(() => {
    const controller = new AbortController()
    const apiBaseUrl = (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:4001'

    const loadAnnouncements = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/api/announcements`, {
          signal: controller.signal,
        })

        if (!response.ok) {
          return
        }

        const data = await response.json() as ApiAnnouncement[]
        const mapped = data.map((item) => ({
          id: item.id,
          title: item.title,
          publicationDate: formatDate(item.publicationDate, true),
          lastUpdate: formatDate(item.lastUpdate),
          categories: item.categories?.map((category) => category.name).join(', ') ?? 'Unknown',
        }))

        setItems(mapped)
      } catch {
        // Keep fallback mock data when API is unavailable.
      }
    }

    void loadAnnouncements()

    return () => {
      controller.abort()
    }
  }, [])

  return (
    <div className="announcements-layout">
      <aside className="sidebar">
        <div className="city-row">
          <div className="city-avatar" aria-hidden="true">🏙️</div>
          <span>Test city</span>
        </div>
        <button className="sidebar-item active" type="button">
          <svg viewBox="0 0 24 24" aria-hidden="true" className="sidebar-icon">
            <path d="M3 10.5v3h3.2l4.7 3.2v-9.4L6.2 10.5H3Zm9.4-1.7v6.4c2.2-.3 3.9-2.2 3.9-4.5s-1.7-4.2-3.9-4.5Z" />
          </svg>
          <span>Announcements</span>
        </button>
      </aside>

      <main className="content">
        <div className="top-strip" />
        <section className="panel">
          <h1>Announcements</h1>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Publication date</th>
                  <th>Last update</th>
                  <th>Categories</th>
                  <th aria-label="Actions" />
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={item.id} className={index === 4 ? 'highlighted' : ''}>
                    <td>{item.title}</td>
                    <td>{item.publicationDate}</td>
                    <td>{item.lastUpdate}</td>
                    <td>{item.categories}</td>
                    <td className="actions-cell">
                      <a href={`/announcements/${item.id}`} className="edit-button" aria-label={`Edit ${item.title}`}>
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M3 17.3V21h3.7l10.9-10.9-3.7-3.7L3 17.3Zm17.7-10.2c.4-.4.4-1 0-1.4l-2.4-2.4a1 1 0 0 0-1.4 0l-1.9 1.9 3.7 3.7 2-1.8Z" />
                        </svg>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  )
}
