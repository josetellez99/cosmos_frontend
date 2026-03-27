import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CloseButton } from '@/components/ui/close-button'

describe('CloseButton', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders a button with accessible name "Close"', () => {
    render(<CloseButton onClick={() => {}} />)
    expect(screen.getByRole('button', { name: 'Close' })).toBeDefined()
  })

  it('calls onClick when the button is clicked', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<CloseButton onClick={onClick} />)
    await user.click(screen.getByRole('button', { name: 'Close' }))
    expect(onClick).toHaveBeenCalled()
  })

  it('does NOT call onClick when not clicked', () => {
    const onClick = vi.fn()
    render(<CloseButton onClick={onClick} />)
    expect(onClick).not.toHaveBeenCalled()
  })

  it('calls onClick exactly once per click', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<CloseButton onClick={onClick} />)
    await user.click(screen.getByRole('button', { name: 'Close' }))
    expect(onClick).toHaveBeenCalledTimes(1)
  })
})
