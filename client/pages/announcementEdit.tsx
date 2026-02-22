import { useEffect, useMemo, useRef, useState } from 'react'

type AnnouncementEditPageProps = {
  id: string
}

type CategoryRecord = {
  id: number
  name: string
}

const fallbackCategoryRecords: CategoryRecord[] = [
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

function getPublicationDateError(value: string) {
  if (!value.trim()) {
    return 'Use format MM/DD/YYYY HH:mm'
  }

  const hasExpectedShape = /^\d{2}\/\d{2}\/\d{4}\s\d{2}:\d{2}$/.test(value)
  if (!hasExpectedShape) {
    return 'Use format MM/DD/YYYY HH:mm'
  }

  if (!parsePublicationDate(value)) {
    return 'Enter a valid calendar date and time'
  }

  return ''
}

function toPublicationInputValue(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return '08/10/2023 08:55'
  }

  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const year = String(date.getFullYear())
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')

  return `${month}/${day}/${year} ${hours}:${minutes}`
}

type ApiAnnouncementDetail = {
  id: number
  title: string
  description: string
  publicationDate: string
  categories: Array<{
    id: number
    name: string
  }>
}

export default function AnnouncementEditPage({ id }: AnnouncementEditPageProps) {
  const parsedId = Number(id)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [categoryRecords, setCategoryRecords] = useState<CategoryRecord[]>([])
  const [categoryQuery, setCategoryQuery] = useState('')
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false)
  const [publicationDate, setPublicationDate] = useState(() => toPublicationInputValue(new Date().toISOString()))
  const [categoryError, setCategoryError] = useState('')
  const [publicationDateError, setPublicationDateError] = useState('')
  const [publishError, setPublishError] = useState('')
  const [isPublishing, setIsPublishing] = useState(false)
  const categorySelectRef = useRef<HTMLDivElement | null>(null)
  const categoryInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    const apiBaseUrl = (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:4001'

    const loadCategories = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/api/categories`, {
          signal: controller.signal,
        })

        if (!response.ok) {
          return
        }

        const data = await response.json() as CategoryRecord[]
        setCategoryRecords(data)
      } catch {
        // Keep fallback categories when API is unavailable.
      }
    }

    void loadCategories()

    return () => {
      controller.abort()
    }
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    const apiBaseUrl = (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:4001'

    if (!Number.isInteger(parsedId) || parsedId <= 0) {
      return () => {
        controller.abort()
      }
    }

    const loadAnnouncement = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/api/announcements/${parsedId}`, {
          signal: controller.signal,
        })

        if (!response.ok) {
          return
        }

        const data = await response.json() as ApiAnnouncementDetail
        setTitle(data.title ?? '')
        setContent(data.description ?? '')
        setPublicationDate(toPublicationInputValue(data.publicationDate))

        const categoryNames = data.categories?.map((category) => category.name).filter(Boolean) ?? []
        setSelectedCategories(categoryNames)
      } catch {
        // Keep editable defaults when API announcement lookup is unavailable.
      }
    }

    void loadAnnouncement()

    return () => {
      controller.abort()
    }
  }, [parsedId])

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

  const categoryOptions = useMemo(
    () => (categoryRecords.length > 0 ? categoryRecords.map((item) => item.name) : fallbackCategoryRecords.map((item) => item.name)),
    [categoryRecords],
  )

  const availableCategories = useMemo(
    () => categoryOptions.filter((option) => !selectedCategories.includes(option)),
    [categoryOptions, selectedCategories],
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
    if (categoryError) {
      setCategoryError('')
    }
    if (publishError) {
      setPublishError('')
    }
  }

  const addCategory = (category: string) => {
    setSelectedCategories((previous) => [...previous, category])
    setCategoryQuery('')
    setIsCategoryDropdownOpen(true)
    if (categoryError) {
      setCategoryError('')
    }
    if (publishError) {
      setPublishError('')
    }
    categoryInputRef.current?.focus()
  }

  const handlePublish = async () => {
    const validationError = getPublicationDateError(publicationDate)
    if (validationError) {
      setPublicationDateError(validationError)
      return
    }

    const missingFields: string[] = []
    if (!title.trim()) {
      missingFields.push('title')
    }
    if (!content.trim()) {
      missingFields.push('content')
    }

    if (missingFields.length > 0) {
      setPublishError(`Please fill required field(s): ${missingFields.join(', ')}`)
      return
    }

    if (selectedCategories.length === 0) {
      setCategoryError('Select at least one category')
      setPublishError('Category is required')
      return
    }

    setPublishError('')
    setCategoryError('')

    const parsedDate = parsePublicationDate(publicationDate)
    if (!parsedDate) {
      setPublicationDateError('Use format MM/DD/YYYY HH:mm')
      return
    }

    const apiBaseUrl = (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:4001'
    const adminSecret = import.meta.env.VITE_ADMIN_SECRET as string | undefined

    setIsPublishing(true)

    try {
      const categoriesSource = categoryRecords.length > 0 ? categoryRecords : fallbackCategoryRecords

      const selectedCategoryIds = selectedCategories
        .map((selectedCategoryName) => categoriesSource.find((category) => category.name === selectedCategoryName)?.id)
        .filter((categoryId): categoryId is number => Number.isInteger(categoryId))

      if (selectedCategoryIds.length !== selectedCategories.length) {
        throw new Error('One or more selected categories are invalid. Please reselect categories and try again.')
      }

      const announcementsResponse = await fetch(`${apiBaseUrl}/api/announcements`)
      if (!announcementsResponse.ok) {
        throw new Error('Cannot load announcements from API')
      }

      const announcementData = await announcementsResponse.json() as Array<{ id: number }>
      const isExistingAnnouncement = Number.isInteger(parsedId)
        && parsedId > 0
        && announcementData.some((item) => item.id === parsedId)

      const nextId = announcementData.length > 0
        ? Math.max(...announcementData.map((item) => item.id)) + 1
        : 1

      const requestUrl = isExistingAnnouncement
        ? `${apiBaseUrl}/api/announcements/${parsedId}`
        : `${apiBaseUrl}/api/announcements`

      const requestMethod = isExistingAnnouncement ? 'PUT' : 'POST'

      const requestBody: {
        id?: number
        title: string
        description: string
        categoryIds: number[]
        publicationDate: string
      } = {
        title: title.trim(),
        description: content.trim(),
        categoryIds: selectedCategoryIds,
        publicationDate: parsedDate.toISOString(),
      }

      if (!isExistingAnnouncement) {
        requestBody.id = nextId
      }

      const createResponse = await fetch(requestUrl, {
        method: requestMethod,
        headers: {
          'Content-Type': 'application/json',
          ...(adminSecret ? { 'x-admin-secret': adminSecret } : {}),
        },
        body: JSON.stringify(requestBody),
      })

      if (!createResponse.ok) {
        const errorPayload = await createResponse.json().catch(() => ({})) as { message?: string }
        throw new Error(errorPayload.message ?? 'Failed to publish announcement')
      }

      setPublicationDateError('')
      window.location.href = '/announcements'
    } catch (error) {
      setPublishError(error instanceof Error ? error.message : 'Failed to publish announcement')
    } finally {
      setIsPublishing(false)
    }
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
            <input
              id="announcement-title"
              value={title}
              onChange={(event) => {
                setTitle(event.target.value)
                if (publishError) {
                  setPublishError('')
                }
              }}
            />

            <label htmlFor="announcement-content">Content</label>
            <textarea
              id="announcement-content"
              value={content}
              onChange={(event) => {
                setContent(event.target.value)
                if (publishError) {
                  setPublishError('')
                }
              }}
            />

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
                    if (categoryError) {
                      setCategoryError('')
                    }
                    if (publishError) {
                      setPublishError('')
                    }
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
            {categoryError && <p className="field-error">{categoryError}</p>}

            <label htmlFor="announcement-date" className="spaced-label">Publication date</label>
            <input
              id="announcement-date"
              value={publicationDate}
              onChange={(event) => {
                const nextValue = event.target.value
                setPublicationDate(nextValue)

                if (nextValue.length === 16) {
                  setPublicationDateError(getPublicationDateError(nextValue))
                } else if (publicationDateError) {
                  setPublicationDateError('')
                }
              }}
              onBlur={() => {
                setPublicationDateError(getPublicationDateError(publicationDate))
              }}
              placeholder="MM/DD/YYYY HH:mm"
              aria-invalid={publicationDateError ? 'true' : 'false'}
              className={publicationDateError ? 'date-input-error' : ''}
            />
            {publicationDateError && <p className="field-error">{publicationDateError}</p>}
            {publishError && <p className="field-error">{publishError}</p>}

            <div className="publish-row">
              <button type="button" className="publish-button" onClick={() => { void handlePublish() }} disabled={isPublishing}>
                {isPublishing ? 'Publishing...' : 'Publish'}
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
