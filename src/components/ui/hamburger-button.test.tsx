import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { UiContext, type UiContextType } from '@/contexts/UiContext'
import { HambugerButton } from '@/components/ui/hamburger-button'

const renderWithUiContext = (contextValue: UiContextType) => {
  return render(
    <UiContext.Provider value={contextValue}>
      <HambugerButton />
    </UiContext.Provider>
  )
}

describe('HambugerButton', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders a button', () => {
    const contextValue: UiContextType = {
      isSidebarOpened: false,
      setIsSidebarOpened: vi.fn(),
      dashboardDate: 'date',
      setDashboardDate: () => {}
    }
    renderWithUiContext(contextValue)
    expect(screen.getByRole('button')).toBeDefined()
  })

  it('calls setIsSidebarOpened(true) when clicked', async () => {
    const user = userEvent.setup()
    const setIsSidebarOpened = vi.fn()
    const contextValue: UiContextType = {
      isSidebarOpened: false,
      setIsSidebarOpened,
      dashboardDate: 'date',
      setDashboardDate: () => {}
    }
    renderWithUiContext(contextValue)
    await user.click(screen.getByRole('button'))
    expect(setIsSidebarOpened).toHaveBeenCalledWith(true)
  })

  it('throws when rendered outside UiContext', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => render(<HambugerButton />)).toThrow(
      'There is not possible to access to the ui context'
    )
    consoleErrorSpy.mockRestore()
  })
})
