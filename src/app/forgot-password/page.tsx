import { redirect } from 'next/navigation'

export default function ForgotPasswordPage() {
  redirect('/sign-in?reset=true')
}