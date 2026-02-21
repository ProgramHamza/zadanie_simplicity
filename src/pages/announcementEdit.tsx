import { useEffect, useMemo, useRef, useState } from 'react'
import { announcements } from './announcements'

type AnnouncementEditPageProps = {
  id: string
}

const categoryOptions = [
  'Community events',
  'Crime & Safety',
  'Culture',
  'Discounts & Benefits',
  'Emergencies',
  'For Seniors',
  'Health',
  'Kids & Family',
  'City',
]

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

function toCategoryLabel(value: string) {
  return value
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean)
}

function parsePublicationDate(value: string) {
  const match = value.match(/^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/(\d{4})\s([01]\d|2[0-3]):([0-5]\d)$/)
  if (!match) {
    return null
  }

  const [, month, day, year, hours, minutes] = match
  const monthNumber = Number(month)
  const dayNumber = Number(day)
  const yearNumber = Number(year)
  const hoursNumber = Number(hours)
  const minutesNumber = Number(minutes)
  const parsedDate = new Date(yearNumber, monthNumber - 1, dayNumber, hoursNumber, minutesNumber, 0, 0)

  if (
    parsedDate.getFullYear() !== yearNumber
    || parsedDate.getMonth() !== monthNumber - 1
    || parsedDate.getDate() !== dayNumber
    || parsedDate.getHours() !== hoursNumber
    || parsedDate.getMinutes() !== minutesNumber
  ) {
    return null
  }

  return parsedDate
}

export default function AnnouncementEditPage({ id }: AnnouncementEditPageProps) {
  const parsedId = Number(id)
  const selectedAnnouncement = Number.isInteger(parsedId) && parsedId > 0 && parsedId <= announcements.length
    ? announcements[parsedId - 1]
    : announcements[0]
  const initialCategories = toCategoryLabel(selectedAnnouncement.categories)
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialCategories.length > 0 ? initialCategories : ['City'],
  )
  const [categoryQuery, setCategoryQuery] = useState('')
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false)
  const [publicationDate, setPublicationDate] = useState('08/10/2023 08:55')
  const [publicationDateError, setPublicationDateError] = useState('')
  const categorySelectRef = useRef<HTMLDivElement | null>(null)
  const categoryInputRef = useRef<HTMLInputElement | null>(null)

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

  const availableCategories = useMemo(
    () => categoryOptions.filter((option) => !selectedCategories.includes(option)),
    [selectedCategories],
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

  const removeCategory = (category: string) => {
    setSelectedCategories((previous) => previous.filter((item) => item !== category))
  }

  const addCategory = (category: string) => {
    setSelectedCategories((previous) => [...previous, category])
    setCategoryQuery('')
    setIsCategoryDropdownOpen(true)
    categoryInputRef.current?.focus()
  }

  const handlePublish = () => {
    const parsedDate = parsePublicationDate(publicationDate)

    if (!parsedDate) {
      setPublicationDateError('Use format MM/DD/YYYY HH:mm')
      return
    }

    if (parsedDate.getTime() < Date.now()) {
      setPublicationDateError('Publication date cannot be in the past')
      return
    }

    setPublicationDateError('')
  }

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
        <section className="edit-panel">
          <div className="edit-form-wrap">
            <h1>Edit the announcement</h1>

            <label htmlFor="announcement-title">Title</label>
            <input id="announcement-title" value={selectedAnnouncement.title} readOnly />

            <label htmlFor="announcement-content">Content</label>
            <textarea id="announcement-content" value="dasda" readOnly />

            <label htmlFor="announcement-category-search" className="spaced-label">Category</label>
            <p className="field-hint">Select category so readers know what your announcement is about.</p>
            <div className="category-select" ref={categorySelectRef}>
              <div
                className={`category-field${isCategoryDropdownOpen ? ' open' : ''}`}
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
                  id="announcement-category-search"
                  ref={categoryInputRef}
                  className="category-input"
                  value={categoryQuery}
                  onFocus={() => setIsCategoryDropdownOpen(true)}
                  onChange={(event) => {
                    setCategoryQuery(event.target.value)
                    setIsCategoryDropdownOpen(true)
                  }}
                  placeholder="Type to search categories"
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

            <label htmlFor="announcement-date" className="spaced-label">Publication date</label>
            <input
              id="announcement-date"
              value={publicationDate}
              onChange={(event) => {
                setPublicationDate(event.target.value)
                if (publicationDateError) {
                  setPublicationDateError('')
                }
              }}
              placeholder="MM/DD/YYYY HH:mm"
              aria-invalid={publicationDateError ? 'true' : 'false'}
              className={publicationDateError ? 'date-input-error' : ''}
            />
            {publicationDateError && <p className="field-error">{publicationDateError}</p>}

            <div className="publish-row">
              <button type="button" className="publish-button" onClick={handlePublish}>Publish</button>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
