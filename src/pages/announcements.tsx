export type Announcement = {
  title: string
  publicationDate: string
  lastUpdate: string
  categories: string
}

export const announcements: Announcement[] = [
  { title: 'Title 1', publicationDate: 'Aug 11, 2023 04:38', lastUpdate: 'Aug 11, 2023', categories: 'City' },
  { title: 'Title 2', publicationDate: 'Aug 11, 2023 04:36', lastUpdate: 'Aug 11, 2023', categories: 'City' },
  { title: 'Title 3', publicationDate: 'Aug 11, 2023 04:35', lastUpdate: 'Aug 11, 2023', categories: 'City' },
  { title: 'Title 4', publicationDate: 'Apr 19, 2023 05:14', lastUpdate: 'Apr 19, 2023', categories: 'City' },
  { title: 'Title 5', publicationDate: 'Apr 19, 2023 05:11', lastUpdate: 'Apr 19, 2023', categories: 'City' },
  { title: 'Title 6', publicationDate: 'Apr 19, 2023 05:11', lastUpdate: 'Apr 19, 2023', categories: 'City' },
  { title: 'Title 7', publicationDate: 'Mar 24, 2023 07:27', lastUpdate: 'Mar 24, 2023', categories: 'City,Health' },
  { title: 'Title 8', publicationDate: 'Mar 24, 2023 07:26', lastUpdate: 'Mar 24, 2023', categories: 'City,Health' },
  { title: 'Title 9', publicationDate: 'Mar 24, 2023 07:26', lastUpdate: 'Mar 24, 2023', categories: 'City,Health' },
  { title: 'Title 10', publicationDate: 'Mar 24, 2023 07:26', lastUpdate: 'Mar 24, 2023', categories: 'City,Health' },
]

export default function AnnouncementsPage() {
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
                {announcements.map((item, index) => (
                  <tr key={item.title} className={index === 4 ? 'highlighted' : ''}>
                    <td>{item.title}</td>
                    <td>{item.publicationDate}</td>
                    <td>{item.lastUpdate}</td>
                    <td>{item.categories}</td>
                    <td className="actions-cell">
                      <a href={`/announcements/${index + 1}`} className="edit-button" aria-label={`Edit ${item.title}`}>
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
