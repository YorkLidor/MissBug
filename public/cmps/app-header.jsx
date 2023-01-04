const { NavLink } = ReactRouterDOM
const { useEffect, useRef, useState } = React

import { UserMsg } from './user-msg.jsx'
import { userService } from '../services/user.service.js'
import { eventBusService } from '../services/event-bus.service.js'

export function AppHeader() {
    const [user, setUser] = useState(userService.getLoggedinUser())

    useEffect(() => {
        eventBusService.on('setUser',setUser)
    }, [])

    function onLogout() {
        userService.logout()
            .then(() => {
                setUser(null)
            })
    }

    return (
        <header className='app-header full main-layout'>
            <UserMsg />
            <div className="container">
                <h1 className='logo'>Bugs are Forever</h1>
                <nav className='main-nav'>
                    <NavLink to="/">Home</NavLink>
                    <NavLink to="/bug">Bugs</NavLink>
                    <NavLink to="/about" >About</NavLink>

                    {!user && <NavLink to="/loginpage" className="push">Login</NavLink>}

                    {user && <div>
                        <h1>Hello {user.username}</h1>
                        <NavLink onClick={onLogout} to="/loginpage" className="push">Logout</NavLink>
                    </div>
                    }


                </nav>
            </div>
        </header>
    )
}
