const { useState, useEffect, useRef } = React

import { bugService } from "../services/bug.service.js"

export function BugFilter({ onSetFilter, maxPages }) {
    const [filterBugs, setfilterBugs] = useState(bugService.getDefaultFilter())
    const elNextBtn = useRef(null)
    const elPrevBtn = useRef(null)

    useEffect(() => {
        // update father cmp that filters change very type
        onSetFilter(filterBugs)
    }, [filterBugs])

    useEffect(() => {
        elPrevBtn.current.disabled = true
    }, [])

    function handleChange({ target }) {
        let { value, name: field, type } = target
        value = (type === 'number') ? +value : value
        setfilterBugs((prevFilter) => ({ ...prevFilter, [field]: value }))
    }

    function onSubmitFilter(ev) {
        // update father cmp that filters change on submit
        ev.preventDefault()
        onSetFilter(filterBugs)
    }

    function onSetPage({ currentTarget }, direction) {
        if (filterBugs.pageIdx + direction === 0) {
            currentTarget.disabled = true
            elNextBtn.current.disabled = false
        } else if (filterBugs.pageIdx + direction + 1 >= maxPages.current) {
            currentTarget.disabled = true
            elPrevBtn.current.disabled = false
        } else {
            elPrevBtn.current.disabled = false
            elNextBtn.current.disabled = false
        }
        setfilterBugs((prevFilter) => ({ ...prevFilter, pageIdx: prevFilter.pageIdx + direction }))
        onSetFilter(filterBugs)
    }

    return <section className="bug-filter">
        <div className='container' >

            <form onSubmit={onSubmitFilter}>
                <label htmlFor="title">Title:</label>
                <input type="text"
                    id="title"
                    name="title"
                    placeholder="By title"
                    value={filterBugs.title}
                    onChange={handleChange}
                />

                <label htmlFor="description">Description:</label>
                <input type="text"
                    id="description"
                    name="description"
                    placeholder="By description..."
                    value={filterBugs.description}
                    onChange={handleChange}
                />

                <label htmlFor="title">Severity:</label>
                <input type="number"
                    id="severity"
                    name="severity"
                    placeholder="By severity..."
                    value={filterBugs.severity}
                    onChange={handleChange}
                />

                <label htmlFor="labels">Label:</label>
                <select name="labels" id="is-read-filter" type='text' onChange={handleChange}>
                    <option value=''>All</option>
                    <option value='js'>Js</option>
                    <option value='css'>Css</option>
                    <option value='react'>React</option>
                </select>

                <label htmlFor="sort"> Sort by:</label>
                <select name="sort" id="is-read-filter" type='text' onChange={handleChange}>
                    <option value=''>All</option>
                    <option value='title'>title</option>
                    <option value='description'>description</option>
                    <option value='severity'>severity</option>
                </select>

                <label htmlFor="order">Sort order</label>
                <select name="order" id="is-read-filter" type='text' onChange={handleChange}>
                    <option value={1}>Up order</option>
                    <option value={-1}>Down order</option>
                </select>
                <button>Filter</button>
            </form>

            <button ref={elPrevBtn} onClick={(ev) => onSetPage(ev, -1)}>Prev</button>
            <button ref={elNextBtn} onClick={(ev) => onSetPage(ev, 1)}>Next</button>
        </div>
    </section>
}