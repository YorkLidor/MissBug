import { showSuccessMsg } from '../services/event-bus.service.js'
const { useEffect } = React

export function AppFooter() {

    useEffect(() => {
        // component did mount when dependancy array is empty
    }, [])

    return (
        <footer className='full main-layout app-footer'>
            <small>
                &copy; Matan Adi &amp; Lidor York
            </small>
        </footer>
    )

}