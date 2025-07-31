import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { useSignIn } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { ForgotPasswordForm } from '@/app/forgot-password/forgot-password-form'

// Mock Clerk
jest.mock('@clerk/nextjs', () => ({
  useSignIn: jest.fn(),
}))

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>
  }
})

describe('ForgotPasswordForm', () => {
  const mockUseSignIn = {
    isLoaded: true,
    signIn: {
      create: jest.fn(),
      attemptFirstFactor: jest.fn(),
      resetPassword: jest.fn(),
    },
    setActive: jest.fn(),
  }

  const mockRouter = {
    push: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useSignIn as jest.Mock).mockReturnValue(mockUseSignIn)
    ;(useRouter as jest.Mock).mockReturnValue(mockRouter)
  })

  it('renders email input step by default', () => {
    render(<ForgotPasswordForm />)
    
    expect(screen.getByLabelText('Email Address')).toBeInTheDocument()
    expect(screen.getByText('Send Reset Code')).toBeInTheDocument()
  })

  it('renders page title and branding', () => {
    render(<ForgotPasswordForm />)
    
    expect(screen.getByText('Reset Your Password')).toBeInTheDocument()
    expect(screen.getByText('Quantum AI')).toBeInTheDocument()
  })

  it('validates email input is required', async () => {
    render(<ForgotPasswordForm />)
    
    const submitButton = screen.getByText('Send Reset Code')
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('Please enter your email address')).toBeInTheDocument()
    })
  })

  it('shows loading state during form submission', async () => {
    mockUseSignIn.signIn.create.mockResolvedValue({ status: 'needs_first_factor' })
    
    render(<ForgotPasswordForm />)
    
    const emailInput = screen.getByLabelText('Email Address')
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    
    const submitButton = screen.getByText('Send Reset Code')
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('Sending Code...')).toBeInTheDocument()
    })
  })

  it('transitions to verification step after successful code send', async () => {
    mockUseSignIn.signIn.create.mockResolvedValue({ status: 'needs_first_factor' })
    
    render(<ForgotPasswordForm />)
    
    const emailInput = screen.getByLabelText('Email Address')
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    
    const submitButton = screen.getByText('Send Reset Code')
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('Enter the code below to continue')).toBeInTheDocument()
    })
  })

  it('shows success message after code send', async () => {
    mockUseSignIn.signIn.create.mockResolvedValue({ status: 'needs_first_factor' })
    
    render(<ForgotPasswordForm />)
    
    const emailInput = screen.getByLabelText('Email Address')
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    
    const submitButton = screen.getByText('Send Reset Code')
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('Check your email for the verification code')).toBeInTheDocument()
    })
  })

  it('shows error message when code send fails', async () => {
    mockUseSignIn.signIn.create.mockRejectedValue({
      errors: [{ longMessage: 'Email not found' }]
    })
    
    render(<ForgotPasswordForm />)
    
    const emailInput = screen.getByLabelText('Email Address')
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    
    const submitButton = screen.getByText('Send Reset Code')
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('Email not found')).toBeInTheDocument()
    })
  })

  it('handles Clerk loading state', () => {
    (useSignIn as jest.Mock).mockReturnValue({ isLoaded: false })
    
    render(<ForgotPasswordForm />)
    
    expect(screen.getByText('Authentication service not available')).toBeInTheDocument()
  })

  it('provides clear navigation back to sign-in', () => {
    render(<ForgotPasswordForm />)
    
    const signInLink = screen.getByText('Sign in here')
    expect(signInLink).toHaveAttribute('href', '/sign-in')
  })

  it('validates password requirements during reset', async () => {
    mockUseSignIn.signIn.create.mockResolvedValue({ status: 'needs_first_factor' })
    mockUseSignIn.signIn.attemptFirstFactor.mockResolvedValue({ status: 'needs_new_password' })
    
    render(<ForgotPasswordForm />)
    
    // First transition to reset step
    const emailInput = screen.getByLabelText('Email Address')
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.click(screen.getByText('Send Reset Code'))
    
    await waitFor(() => {
      expect(screen.getByText('Enter the code below to continue')).toBeInTheDocument()
    })

    const codeInput = screen.getByLabelText('Verification Code')
    fireEvent.change(codeInput, { target: { value: '123456' } })
    fireEvent.click(screen.getByText('Verify Code'))

    await waitFor(() => {
      expect(screen.getByText('Create a new password for your account')).toBeInTheDocument()
    })

    // Test password validation
    const passwordInput = screen.getByLabelText('New Password')
    const confirmInput = screen.getByLabelText('Confirm New Password')
    
    fireEvent.change(passwordInput, { target: { value: 'short' } })
    fireEvent.change(confirmInput, { target: { value: 'different' } })
    
    const resetButton = screen.getByText('Set New Password')
    fireEvent.click(resetButton)
    
    await waitFor(() => {
      expect(screen.getByText('Passwords do not match')).toBeInTheDocument()
    })
  })

  it('shows password requirements', async () => {
    mockUseSignIn.signIn.create.mockResolvedValue({ status: 'needs_first_factor' })
    mockUseSignIn.signIn.attemptFirstFactor.mockResolvedValue({ status: 'needs_new_password' })
    
    render(<ForgotPasswordForm />)
    
    // Navigate to reset step
    const emailInput = screen.getByLabelText('Email Address')
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.click(screen.getByText('Send Reset Code'))

    await waitFor(() => {
      expect(screen.getByText('Enter the code below to continue')).toBeInTheDocument()
    })

    const codeInput = screen.getByLabelText('Verification Code')
    fireEvent.change(codeInput, { target: { value: '123456' } })
    fireEvent.click(screen.getByText('Verify Code'))

    await waitFor(() => {
      expect(screen.getByText('Password must be at least 8 characters long')).toBeInTheDocument()
    })
  })

  it('allows navigation back to email step from verification', async () => {
    mockUseSignIn.signIn.create.mockResolvedValue({ status: 'needs_first_factor' })
    
    render(<ForgotPasswordForm />)
    
    // Go to verification step
    const emailInput = screen.getByLabelText('Email Address')
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.click(screen.getByText('Send Reset Code'))

    await waitFor(() => {
      expect(screen.getByText('Enter the code below to continue')).toBeInTheDocument()
    })

    // Test back navigation
    const backButton = screen.getByText('Back to Email')
    fireEvent.click(backButton)

    expect(screen.getByLabelText('Email Address')).toBeInTheDocument()
    expect(screen.getByText('Send Reset Code')).toBeInTheDocument()
  })
})