const { useState, useEffect } = React

import { bugService } from "../services/bug.service.js"

export function BugEdit({ isOpen, onAddBug, newBug }) {
    const [bugToEdit, setBugToEdit] = useState(bugService.getEmptyBug())
    const dynmClass = isOpen ? 'open-modal' : ''

    function handleChange({ target }) {
        let { value, type, name: field } = target
        value = (type === 'number') ? +value : value
        setBugToEdit(prevBug => ({ ...prevBug, [field]: value }))
        newBug(bugToEdit)
    }


    return <div className={"modal " + dynmClass}>

        <form onSubmit={onAddBug}>

            <input type="text"
                name="title"
                id="title"
                placeholder="Enter title..."
                value={bugToEdit.title}
                onChange={handleChange} />

            <input type="text"
                name="description"
                id="description"
                placeholder="Enter description..."
                value={bugToEdit.description}
                onChange={handleChange} />

            <input type="number"
                name="severity"
                id="severity"
                placeholder="Enter severity 0-10"
                value={bugToEdit.severity}
                onChange={handleChange}
                min={0}
                max={10}
            />

            <button>Submit</button>


        </form>
    </div>
}