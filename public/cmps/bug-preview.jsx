

export function BugPreview({ bug }) {
    const dynmClass = (bug.severity > 7) ? 'high-priority' : ''

    return <article className="bug-preview" key={bug._id}>
        <img src={`../assets/img/${bug.severity}.png`} alt="bug" />
        <h4>{bug.title}</h4>
        <p>Severity: <span className={dynmClass}>{bug.severity}</span></p>
        <p>{bug.description}</p>
        <p>{bug.owner.username}</p>
        <footer>
            {bug.labels && bug.labels.map(label => <h3 className="label" key={label}>{label}</h3>)}
        </footer>
    </article>
}