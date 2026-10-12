import AuthForm from '../AuthForm.jsx'
import AuthLayout from '../AuthLayout.jsx'

export default function Login({ onLogin, onSwitch }) {
  return <AuthLayout><AuthForm mode="login" onLogin={onLogin} onSwitch={onSwitch} /></AuthLayout>
}