import { render, screen } from '@testing-library/react'
import ForgotPasswordPage from '@/app/forgot-password/page'

// Mock next/font
jest.mock('next/font/google', () => ({
  Inter: () => ({
    className: 'mock-font',
  }),
}))

describe('ForgotPasswordPage', () => {
  it('renders without redirecting', () => {
    render(<ForgotPasswordPage />)
    
    expect(screen.getByText('Reset Your Password')).toBeInTheDocument()
  })

  it('has consistent styling with other auth pages', () => {
    const { container } = render(<ForgotPasswordPage />)
    
    const mainDiv = container.firstChild
    expect(mainDiv).toHaveClass('min-h-screen')
    expect(mainDiv).toHaveClass('bg-black')
    expect(mainDiv).toHaveClass('text-white')
  })

  it('includes the ForgotPasswordForm component', () => {
    render(<ForgotPasswordPage />)
    
    expect(screen.getByText('Reset Your Password')).toBeInTheDocument()
  })

  it('has proper page structure', () => {
    render(<ForgotPasswordPage />)
    
    expect(screen.getByText('Quantum AI')).toBeInTheDocument()
    expect(screen.getByText('Reset Your Password')).toBeInTheDocument()
  })
})