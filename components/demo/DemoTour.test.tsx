import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DemoTour, type TourStep } from './DemoTour'

function makeSteps(): TourStep[] {
  return [
    { key: 'a', title: '1 · First', body: 'First step body', anchor: 'a', onEnter: vi.fn() },
    { key: 'b', title: '2 · Second', body: 'Second step body', anchor: 'b', onEnter: vi.fn() },
    { key: 'c', title: '3 · Third', body: 'Third step body', anchor: 'c', onEnter: vi.fn() },
  ]
}

describe('DemoTour', () => {
  it('renders nothing when closed', () => {
    const { container } = render(<DemoTour steps={makeSteps()} open={false} onClose={vi.fn()} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('shows the first step and runs its onEnter when opened', () => {
    const steps = makeSteps()
    render(<DemoTour steps={steps} open onClose={vi.fn()} />)

    expect(screen.getByText('1 · First')).toBeInTheDocument()
    expect(screen.getByText('Step 1 of 3')).toBeInTheDocument()
    expect(steps[0].onEnter).toHaveBeenCalled()
    // Back is hidden on the first step.
    expect(screen.queryByRole('button', { name: /back/i })).not.toBeInTheDocument()
  })

  it('navigates forward and back through steps', async () => {
    const user = userEvent.setup()
    const steps = makeSteps()
    render(<DemoTour steps={steps} open onClose={vi.fn()} />)

    await user.click(screen.getByRole('button', { name: /next/i }))
    expect(screen.getByText('2 · Second')).toBeInTheDocument()
    expect(steps[1].onEnter).toHaveBeenCalled()

    await user.click(screen.getByRole('button', { name: /back/i }))
    expect(screen.getByText('1 · First')).toBeInTheDocument()
  })

  it('shows Done on the last step and closes when clicked', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<DemoTour steps={makeSteps()} open onClose={onClose} />)

    await user.click(screen.getByRole('button', { name: /next/i }))
    await user.click(screen.getByRole('button', { name: /next/i }))
    expect(screen.getByText('3 · Third')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /done/i }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('closes from the Skip control', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<DemoTour steps={makeSteps()} open onClose={onClose} />)

    await user.click(screen.getByRole('button', { name: 'Skip' }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
