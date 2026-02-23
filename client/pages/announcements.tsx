import { useEffect, useMemo, useRef, useState } from 'react'

export type Announcement = {
  id: number
  title: string
  description: string
  publicationDate: string
  lastUpdate: string
  publicationTimestamp: number
  lastUpdateTimestamp: number
  categories: string
  categoryNames: string[]
}

export const announcements: Announcement[] = [
  { id: 1, title: 'Title 1', description: 'Description 1', publicationDate: 'Aug 11, 2023 04:38', lastUpdate: 'Aug 11, 2023', publicationTimestamp: new Date('2023-08-11T04:38:00Z').getTime(), lastUpdateTimestamp: new Date('2023-08-11T04:38:00Z').getTime(), categories: 'City', categoryNames: ['City'] },
  { id: 2, title: 'Title 2', description: 'Description 2', publicationDate: 'Aug 11, 2023 04:36', lastUpdate: 'Aug 11, 2023', publicationTimestamp: new Date('2023-08-11T04:36:00Z').getTime(), lastUpdateTimestamp: new Date('2023-08-11T04:36:00Z').getTime(), categories: 'City', categoryNames: ['City'] },
  { id: 3, title: 'Title 3', description: 'Description 3', publicationDate: 'Aug 11, 2023 04:35', lastUpdate: 'Aug 11, 2023', publicationTimestamp: new Date('2023-08-11T04:35:00Z').getTime(), lastUpdateTimestamp: new Date('2023-08-11T04:35:00Z').getTime(), categories: 'City', categoryNames: ['City'] },
  { id: 4, title: 'Title 4', description: 'Description 4', publicationDate: 'Apr 19, 2023 05:14', lastUpdate: 'Apr 19, 2023', publicationTimestamp: new Date('2023-04-19T05:14:00Z').getTime(), lastUpdateTimestamp: new Date('2023-04-19T05:14:00Z').getTime(), categories: 'City', categoryNames: ['City'] },
  { id: 5, title: 'Title 5', description: 'Description 5', publicationDate: 'Apr 19, 2023 05:11', lastUpdate: 'Apr 19, 2023', publicationTimestamp: new Date('2023-04-19T05:11:00Z').getTime(), lastUpdateTimestamp: new Date('2023-04-19T05:11:00Z').getTime(), categories: 'City', categoryNames: ['City'] },
  { id: 6, title: 'Title 6', description: 'Description 6', publicationDate: 'Apr 19, 2023 05:11', lastUpdate: 'Apr 19, 2023', publicationTimestamp: new Date('2023-04-19T05:11:00Z').getTime(), lastUpdateTimestamp: new Date('2023-04-19T05:11:00Z').getTime(), categories: 'City', categoryNames: ['City'] },
  { id: 7, title: 'Title 7', description: 'Description 7', publicationDate: 'Mar 24, 2023 07:27', lastUpdate: 'Mar 24, 2023', publicationTimestamp: new Date('2023-03-24T07:27:00Z').getTime(), lastUpdateTimestamp: new Date('2023-03-24T07:27:00Z').getTime(), categories: 'City, Health', categoryNames: ['City', 'Health'] },
  { id: 8, title: 'Title 8', description: 'Description 8', publicationDate: 'Mar 24, 2023 07:26', lastUpdate: 'Mar 24, 2023', publicationTimestamp: new Date('2023-03-24T07:26:00Z').getTime(), lastUpdateTimestamp: new Date('2023-03-24T07:26:00Z').getTime(), categories: 'City, Health', categoryNames: ['City', 'Health'] },
  { id: 9, title: 'Title 9', description: 'Description 9', publicationDate: 'Mar 24, 2023 07:26', lastUpdate: 'Mar 24, 2023', publicationTimestamp: new Date('2023-03-24T07:26:00Z').getTime(), lastUpdateTimestamp: new Date('2023-03-24T07:26:00Z').getTime(), categories: 'City, Health', categoryNames: ['City', 'Health'] },
  { id: 10, title: 'Title 10', description: 'Description 10', publicationDate: 'Mar 24, 2023 07:26', lastUpdate: 'Mar 24, 2023', publicationTimestamp: new Date('2023-03-24T07:26:00Z').getTime(), lastUpdateTimestamp: new Date('2023-03-24T07:26:00Z').getTime(), categories: 'City, Health', categoryNames: ['City', 'Health'] },
  { id: 11, title: 'Title 11', description: 'Description 11', publicationDate: 'Feb 11, 2024 08:12', lastUpdate: 'Feb 11, 2024', publicationTimestamp: new Date('2024-02-11T08:12:00Z').getTime(), lastUpdateTimestamp: new Date('2024-02-11T08:12:00Z').getTime(), categories: 'Health', categoryNames: ['Health'] },
  { id: 12, title: 'Title 12', description: 'Description 12', publicationDate: 'Feb 18, 2024 06:40', lastUpdate: 'Feb 18, 2024', publicationTimestamp: new Date('2024-02-18T06:40:00Z').getTime(), lastUpdateTimestamp: new Date('2024-02-18T06:40:00Z').getTime(), categories: 'Community events', categoryNames: ['Community events'] },
  { id: 13, title: 'Title 13', description: 'Description 13', publicationDate: 'Mar 03, 2024 11:28', lastUpdate: 'Mar 03, 2024', publicationTimestamp: new Date('2024-03-03T11:28:00Z').getTime(), lastUpdateTimestamp: new Date('2024-03-03T11:28:00Z').getTime(), categories: 'City', categoryNames: ['City'] },
  { id: 14, title: 'Title 14', description: 'Description 14', publicationDate: 'Mar 08, 2024 09:00', lastUpdate: 'Mar 08, 2024', publicationTimestamp: new Date('2024-03-08T09:00:00Z').getTime(), lastUpdateTimestamp: new Date('2024-03-08T09:00:00Z').getTime(), categories: 'Health', categoryNames: ['Health'] },
  { id: 15, title: 'Title 15', description: 'Description 15', publicationDate: 'Apr 01, 2024 12:16', lastUpdate: 'Apr 01, 2024', publicationTimestamp: new Date('2024-04-01T12:16:00Z').getTime(), lastUpdateTimestamp: new Date('2024-04-01T12:16:00Z').getTime(), categories: 'Community events', categoryNames: ['Community events'] },
  { id: 16, title: 'Title 16', description: 'Description 16', publicationDate: 'Apr 13, 2024 10:53', lastUpdate: 'Apr 13, 2024', publicationTimestamp: new Date('2024-04-13T10:53:00Z').getTime(), lastUpdateTimestamp: new Date('2024-04-13T10:53:00Z').getTime(), categories: 'City', categoryNames: ['City'] },
  { id: 17, title: 'Title 17', description: 'Description 17', publicationDate: 'May 07, 2024 14:22', lastUpdate: 'May 07, 2024', publicationTimestamp: new Date('2024-05-07T14:22:00Z').getTime(), lastUpdateTimestamp: new Date('2024-05-07T14:22:00Z').getTime(), categories: 'Health', categoryNames: ['Health'] },
  { id: 18, title: 'Title 18', description: 'Description 18', publicationDate: 'May 24, 2024 07:05', lastUpdate: 'May 24, 2024', publicationTimestamp: new Date('2024-05-24T07:05:00Z').getTime(), lastUpdateTimestamp: new Date('2024-05-24T07:05:00Z').getTime(), categories: 'Community events', categoryNames: ['Community events'] },
  { id: 19, title: 'Title 19', description: 'Description 19', publicationDate: 'Jun 09, 2024 16:11', lastUpdate: 'Jun 09, 2024', publicationTimestamp: new Date('2024-06-09T16:11:00Z').getTime(), lastUpdateTimestamp: new Date('2024-06-09T16:11:00Z').getTime(), categories: 'City', categoryNames: ['City'] },
  { id: 20, title: 'Title 20', description: 'Description 20', publicationDate: 'Jun 26, 2024 18:35', lastUpdate: 'Jun 26, 2024', publicationTimestamp: new Date('2024-06-26T18:35:00Z').getTime(), lastUpdateTimestamp: new Date('2024-06-26T18:35:00Z').getTime(), categories: 'Health', categoryNames: ['Health'] },
]

type ApiAnnouncement = {
  id: number
  title: string
  description: string
  publicationDate: string
  lastUpdate: string
  categories: Array<{
    id: number
    name: string
  }>
}

type ApiCategory = {
  id: number
  name: string
}

function fuzzyScore(option: string, query: string) {
  const normalizedQuery = query.trim().toLowerCase()
  if (!normalizedQuery) {
    return 0
  }

  const normalizedOption = option.toLowerCase()
  const directIndex = normalizedOption.indexOf(normalizedQuery)
  if (directIndex >= 0) {
    return 2000 - directIndex * 8 - (normalizedOption.length - normalizedQuery.length)
  }

  const normalize = (value: string) =>
    value
      .toLowerCase()
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .replace(/[^a-z0-9]+/g, ' ')
      .trim()

  const damerauLevenshtein = (source: string, target: string) => {
    const sourceLength = source.length
    const targetLength = target.length

    if (sourceLength === 0) {
      return targetLength
    }

    if (targetLength === 0) {
      return sourceLength
    }

    const matrix: number[][] = Array.from({ length: sourceLength + 1 }, () => Array(targetLength + 1).fill(0))

    for (let row = 0; row <= sourceLength; row += 1) {
      matrix[row][0] = row
    }

    for (let column = 0; column <= targetLength; column += 1) {
      matrix[0][column] = column
    }

    for (let row = 1; row <= sourceLength; row += 1) {
      for (let column = 1; column <= targetLength; column += 1) {
        const substitutionCost = source[row - 1] === target[column - 1] ? 0 : 1

        matrix[row][column] = Math.min(
          matrix[row - 1][column] + 1,
          matrix[row][column - 1] + 1,
          matrix[row - 1][column - 1] + substitutionCost,
        )

        if (
          row > 1
          && column > 1
          && source[row - 1] === target[column - 2]
          && source[row - 2] === target[column - 1]
        ) {
          matrix[row][column] = Math.min(matrix[row][column], matrix[row - 2][column - 2] + 1)
        }
      }
    }

    return matrix[sourceLength][targetLength]
  }

  const normalizedOptionForDistance = normalize(option)
  const words = normalizedOptionForDistance.split(' ').filter(Boolean)

  const byWordDistance = words.length > 0
    ? Math.min(...words.map((word) => damerauLevenshtein(normalizedQuery, word)))
    : damerauLevenshtein(normalizedQuery, normalizedOptionForDistance)

  const collapsedOption = normalizedOptionForDistance.replace(/\s+/g, '')
  const collapsedQuery = normalizedQuery.replace(/\s+/g, '')
  const byPhraseDistance = damerauLevenshtein(collapsedQuery, collapsedOption)
  const startsWithBonus = words.some((word) => word.startsWith(normalizedQuery)) ? 220 : 0

  return 1000 - Math.min(byWordDistance, byPhraseDistance) * 90 + startsWithBonus
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
  const [allItems, setAllItems] = useState<Announcement[]>(announcements)
  const [notification, setNotification] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [categoryQuery, setCategoryQuery] = useState('')
  const [sortBy, setSortBy] = useState<'publicationDateDesc' | 'publicationDateAsc' | 'lastUpdateDesc' | 'lastUpdateAsc' | 'titleAsc' | 'titleDesc'>('publicationDateDesc')
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false)
  const [reloadToken, setReloadToken] = useState(0)
  const categorySelectRef = useRef<HTMLDivElement | null>(null)
  const categoryInputRef = useRef<HTMLInputElement | null>(null)

  const apiBaseUrl = (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:4001'
  const wsUrl = apiBaseUrl.startsWith('https://')
    ? apiBaseUrl.replace('https://', 'wss://')
    : apiBaseUrl.replace('http://', 'ws://')

  useEffect(() => {
    const controller = new AbortController()

    const loadCategories = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/api/categories`, {
          signal: controller.signal,
        })

        if (!response.ok) {
          return
        }

        const data = await response.json() as ApiCategory[]
        setCategories(data.map((category) => category.name).sort((left, right) => left.localeCompare(right)))
      } catch {
        setCategories([])
      }
    }

    void loadCategories()

    return () => {
      controller.abort()
    }
  }, [apiBaseUrl])

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (categorySelectRef.current && !categorySelectRef.current.contains(event.target as Node)) {
        setIsCategoryDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [])

  useEffect(() => {
    const controller = new AbortController()

    const loadAnnouncements = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/api/announcements`, {
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error('Cannot load announcements')
        }

        const data = await response.json() as ApiAnnouncement[]
        const mapped = data.map((item) => {
          const categoryNames = item.categories?.map((category) => category.name) ?? []

          return {
            id: item.id,
            title: item.title,
            description: item.description,
            publicationDate: formatDate(item.publicationDate, true),
            lastUpdate: formatDate(item.lastUpdate),
            publicationTimestamp: new Date(item.publicationDate).getTime(),
            lastUpdateTimestamp: new Date(item.lastUpdate).getTime(),
            categories: categoryNames.length > 0 ? categoryNames.join(', ') : 'Unknown',
            categoryNames,
          }
        })

        setAllItems(mapped)
      } catch {
        setAllItems(announcements)
      }
    }

    void loadAnnouncements()

    return () => {
      controller.abort()
    }
  }, [apiBaseUrl, reloadToken])

  useEffect(() => {
    let notificationTimer: number | undefined
    const socket = new WebSocket(`${wsUrl}/ws`)

    socket.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data) as { event?: string, data?: { title?: string } }
        if (payload.event !== 'announcement.created') {
          return
        }

        const messageTitle = payload.data?.title?.trim() || 'A new announcement'
        setNotification(`${messageTitle} was published`)

        if (notificationTimer) {
          window.clearTimeout(notificationTimer)
        }

        notificationTimer = window.setTimeout(() => {
          setNotification('')
        }, 4000)

        setReloadToken((previous) => previous + 1)
      } catch {
        // Ignore malformed websocket payloads.
        return
      }
    }

    return () => {
      socket.close()
      if (notificationTimer) {
        window.clearTimeout(notificationTimer)
      }
    }
  }, [wsUrl])

  const availableCategories = useMemo(
    () => categories.filter((category) => !selectedCategories.includes(category)),
    [categories, selectedCategories],
  )

  const filteredCategories = useMemo(() => {
    const normalizedQuery = categoryQuery.trim()
    if (!normalizedQuery) {
      return availableCategories
    }

    return availableCategories
      .map((option) => ({ option, score: fuzzyScore(option, normalizedQuery) }))
      .sort((left, right) => right.score - left.score || left.option.localeCompare(right.option))
      .map((item) => item.option)
  }, [availableCategories, categoryQuery])

  const filteredItems = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase()
    const hasQuery = normalizedQuery.length > 0
    const hasCategoryFilter = selectedCategories.length > 0

    const entries = allItems
      .map((item) => {
        const matchesCategory = !hasCategoryFilter || selectedCategories.some((category) => item.categoryNames.includes(category))
        if (!matchesCategory) {
          return { item, score: Number.NEGATIVE_INFINITY, matchesQuery: false }
        }

        if (!hasQuery) {
          return { item, score: 0, matchesQuery: true }
        }

        const titleScore = fuzzyScore(item.title, normalizedQuery)
        const descriptionScore = fuzzyScore(item.description, normalizedQuery)
        const score = Math.max(titleScore, descriptionScore)
        const directMatch = item.title.toLowerCase().includes(normalizedQuery) || item.description.toLowerCase().includes(normalizedQuery)

        return {
          item,
          score,
          matchesQuery: directMatch || score >= 200,
        }
      })
      .filter((entry) => entry.matchesQuery)

    return entries
      .sort((left, right) => {
        if (sortBy === 'publicationDateDesc') {
          return right.item.publicationTimestamp - left.item.publicationTimestamp || left.item.id - right.item.id
        }

        if (sortBy === 'publicationDateAsc') {
          return left.item.publicationTimestamp - right.item.publicationTimestamp || left.item.id - right.item.id
        }

        if (sortBy === 'lastUpdateDesc') {
          return right.item.lastUpdateTimestamp - left.item.lastUpdateTimestamp || left.item.id - right.item.id
        }

        if (sortBy === 'lastUpdateAsc') {
          return left.item.lastUpdateTimestamp - right.item.lastUpdateTimestamp || left.item.id - right.item.id
        }

        if (sortBy === 'titleAsc') {
          return left.item.title.localeCompare(right.item.title) || left.item.id - right.item.id
        }

        return right.item.title.localeCompare(left.item.title) || left.item.id - right.item.id
      })
      .map((entry) => entry.item)
  }, [allItems, searchQuery, selectedCategories, sortBy])

  const removeCategory = (category: string) => {
    setSelectedCategories((previous) => previous.filter((item) => item !== category))
  }

  const addCategory = (category: string) => {
    setSelectedCategories((previous) => [...previous, category])
    setCategoryQuery('')
    setIsCategoryDropdownOpen(true)
    categoryInputRef.current?.focus()
  }

  return (
    <div className="announcements-layout">
      <aside className="sidebar">
        <div className="city-row">
          <div className="city-avatar" aria-hidden="true">🏙️</div>
          <span>Test city</span>
        </div>
        <a className="sidebar-item active" href="/announcements">
          <img src="/ikonanouncement.png" alt="" aria-hidden="true" className="sidebar-icon" />
          <span>Announcements</span>
        </a>
      </aside>

      <main className="content">
        <div className="top-strip" />
        <section className="panel">
          <div className="panel-header">
            <h1>Announcements</h1>
            <a href="/announcements/new" className="create-announcement-button">Create new announcement</a>
          </div>

          <div className="announcement-filters">
            <input
              type="search"
              className="announcement-search-input"
              placeholder="Search by title or content"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
            <select
              className="announcement-sort-select"
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value as typeof sortBy)}
              aria-label="Sort announcements"
            >
              <option value="publicationDateDesc">Sort: newest publication</option>
              <option value="publicationDateAsc">Sort: oldest publication</option>
              <option value="lastUpdateDesc">Sort: recently updated</option>
              <option value="lastUpdateAsc">Sort: least recently updated</option>
              <option value="titleAsc">Sort: title A-Z</option>
              <option value="titleDesc">Sort: title Z-A</option>
            </select>
            <div className="category-select announcement-category-select" ref={categorySelectRef}>
              <div
                className={`category-field announcement-category-field${isCategoryDropdownOpen ? ' open' : ''}`}
                onClick={() => {
                  setIsCategoryDropdownOpen(true)
                  categoryInputRef.current?.focus()
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    setIsCategoryDropdownOpen(true)
                    categoryInputRef.current?.focus()
                  }
                }}
              >
                {selectedCategories.map((category) => (
                  <span className="category-chip" key={category}>
                    {category}
                    <button
                      type="button"
                      className="category-chip-remove"
                      onClick={(event) => {
                        event.stopPropagation()
                        removeCategory(category)
                      }}
                      aria-label={`Remove ${category}`}
                    >
                      ×
                    </button>
                  </span>
                ))}
                <input
                  ref={categoryInputRef}
                  className="category-input"
                  value={categoryQuery}
                  onFocus={() => setIsCategoryDropdownOpen(true)}
                  onChange={(event) => {
                    setCategoryQuery(event.target.value)
                    setIsCategoryDropdownOpen(true)
                  }}
                  placeholder={selectedCategories.length > 0 ? 'Search more categories' : 'Filter by categories'}
                />
                <button
                  type="button"
                  className="category-caret"
                  aria-label="Toggle category list"
                  onClick={(event) => {
                    event.stopPropagation()
                    setIsCategoryDropdownOpen((previous) => !previous)
                    categoryInputRef.current?.focus()
                  }}
                >
                  ⌄
                </button>
              </div>

              {isCategoryDropdownOpen && (
                <div className="category-dropdown" role="listbox" aria-label="Category options">
                  {filteredCategories.length === 0 && (
                    <p className="announcement-empty-category">No matching categories</p>
                  )}
                  {filteredCategories.map((category) => (
                    <button
                      key={category}
                      type="button"
                      className="category-option"
                      onClick={() => addCategory(category)}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {notification && <p className="ws-notification">{notification}</p>}

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
                {filteredItems.map((item, index) => (
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
