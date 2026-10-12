import AuthForm from '../AuthForm.jsx'
import AuthLayout from '../AuthLayout.jsx'

export default function Signup({ onLogin, onSwitch }) {
  return <AuthLayout><AuthForm mode="signup" onLogin={onLogin} onSwitch={onSwitch} /></AuthLayout>
}