import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service.js'
import { userService } from '../services/user.service.js'
import { LoginForm } from '../cmps/login-form.jsx'
import { eventBusService } from '../services/event-bus.service.js'

const { useState, useEffect } = React
const { useNavigate } = ReactRouterDOM

export function LoginSignup() {

    const [user, setUser] = useState(userService.getLoggedinUser())
    const navigate = useNavigate()

    useEffect(() => {
        if (user) navigate('/')
        eventBusService.emit('setUser',user)
    }, [user])

    function onChangeLoginStatus(user) {
        setUser(user)

    }
    
    function onLogout() {
        userService.logout()
            .then(() => {
                setUser(null)
            })
    }

    const [isSignup, setIsSignUp] = useState(false)

    function onLogin(credentials) {
        isSignup ? signup(credentials) : login(credentials)

    }

    function login(credentials) {
        userService.login(credentials)
            .then(onChangeLoginStatus)
            .then(() => { showSuccessMsg('Logged in successfully') })
            .catch((err) => { showErrorMsg('Oops try again') })
    }

    function signup(credentials) {
        userService.signup(credentials)
            .then(onChangeLoginStatus)
            .then(() => { showSuccessMsg('Signed in successfully') })
            .catch((err) => { showErrorMsg('Oops try again') })
    }

    return (
        <div className="login-page">
            <LoginForm
                onLogin={onLogin}
                isSignup={isSignup}
            />

            <div className="btns">
                <button onClick={() => setIsSignUp(!isSignup)}>
                    {isSignup ? 'Already a member? Login' : 'New user? Signup here'}
                </button >
            </div>

        </div >
    )
}
