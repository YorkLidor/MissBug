const { Link } = ReactRouterDOM

import { bugService } from '../services/bug.service.js'
import { showSuccessMsg, showErrorMsg, showUserMsg } from '../services/event-bus.service.js'

import { BugList } from '../cmps/bug-list.jsx'
import { BugEdit } from '../cmps/bug-edit.jsx'
import { BugFilter } from '../cmps/bug-filter.jsx'
import { userService } from '../services/user.service.js'

const { useState, useEffect, useRef } = React

export function BugIndex() {

    const [bugs, setBugs] = useState([])
    const [openModal, setOpenModal] = useState(null)
    const [filterBy, setFilterBy] = useState(bugService.getDefaultFilter())
    const [newBug, setNewBug] = useState(null)
    const maxPages = useRef(bugService.getMaxPages())
    const logedUser = useRef(userService.getLoggedinUser())

    useEffect(() => {
        loadBugs()
    }, [filterBy])

    function onSetFilter(filterBy) {
        setFilterBy(filterBy)
    }
    function loadBugs() {
        bugService.query(filterBy)
            .then((bugs) => {
                setBugs(bugs)
                maxPages.current = bugService.getMaxPages()
            })
            .catch((err) => console.log(err))
    }

    function checkIsBugOwner(bug) {
        if (!logedUser.current) return false
        if (bug.owner._id !== logedUser.current._id) {
            showErrorMsg('Its not your bug!')
            return false
        }
        return true
    }

    function onRemoveBug(bug) {
        if (!checkIsBugOwner(bug)) return
        const { _id: bugId } = bug
        bugService.remove(bugId)
            .then(() => {
                console.log('Deleted Succesfully!')
                const bugsToUpdate = bugs.filter(bug => bug._id !== bugId)
                setBugs(bugsToUpdate)
                showSuccessMsg('Bug removed')
            })
            .catch(err => {
                console.log('Error from onRemoveBug ->', err)
                showErrorMsg('Cannot remove bug')
            })
    }

    function onAddBug(ev) {
        ev.preventDefault()
        if (!logedUser.current) {
            showUserMsg('You must login')
            return
        }
        newBug.owner = logedUser.current
        bugService.save(newBug)
            .then(savedBug => {
                console.log('Added Bug', savedBug)
                setBugs([...bugs, savedBug])
                showSuccessMsg('Bug added')
            })
            .catch(err => {
                console.log('Error from onAddBug ->', err)
                showErrorMsg('Cannot add bug')
            })

        setOpenModal(false)
    }

    function onEditBug(bug) {
        if (!checkIsBugOwner(bug)) return
        const severity = +prompt('New severity?')
        const bugToSave = { ...bug, severity }
        console.log('bugToSave:', bugToSave)
        bugService.save(bugToSave)
            .then(savedBug => {
                console.log('Updated Bug:', savedBug)
                const bugsToUpdate = bugs.map(currBug => (currBug._id === savedBug._id) ? savedBug : currBug)
                setBugs(bugsToUpdate)
                showSuccessMsg('Bug updated')
            })
            .catch(err => {
                console.log('Error from onEditBug ->', err)
                showErrorMsg('Cannot update bug')
            })
    }

    return (
        <main className='bug-index'>
            <h3>Bugs App</h3>
            <main>
                <button onClick={() => setOpenModal(!openModal)}>Add Bug ⛐</button>
                <button onClick={() => {
                    bugService.getPDF()
                    showSuccessMsg('Bug updated')
                }}>Export ⛐ to PDF</button>
                <div>
                    <BugFilter onSetFilter={onSetFilter} maxPages={maxPages} />
                </div>
                {openModal && <BugEdit newBug={setNewBug} onAddBug={onAddBug} isOpen={openModal} />}
                <BugList bugs={bugs} onRemoveBug={onRemoveBug} onEditBug={onEditBug} />
            </main>
        </main>
    )
}
