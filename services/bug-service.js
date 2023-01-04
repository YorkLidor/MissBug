const PDFDocument = require('pdfkit')
const fs = require('fs')

var bugs = require('../data/bugs.json')

const PAGE_SIZE = 6

module.exports = {
    query,
    get,
    remove,
    save,
    createPDF
}

function query(filterBy) {
    let fillteredBugs = bugs
    //Filtering
    const filterKeys = ['title', 'description', 'severity', 'labels']
    fillteredBugs = fillteredBugs.filter((bug) => {
        return test = filterKeys.reduce((acc, key) => {
            if (!acc) return false
            const regex = new RegExp(filterBy[key], 'i')
            return regex.test(bug[key])
        }, true)
    })

    //Sorting
    if (filterBy.sort) {
        const sortBy = filterBy.sort
        fillteredBugs = fillteredBugs.sort((bugA, bugB) => (('' + bugA[sortBy]).localeCompare('' + bugB[sortBy])) * filterBy.order)
    }
    const maxPages = Math.ceil(fillteredBugs.length / PAGE_SIZE)
    //Paging
    if (filterBy.pageIdx !== undefined) {
        const startIdx = +filterBy.pageIdx * PAGE_SIZE
        fillteredBugs = fillteredBugs.slice(startIdx, PAGE_SIZE + startIdx)
    }

    return Promise.resolve({ bugs: fillteredBugs, maxPages: maxPages })
}

function get(bugId) {
    const bug = bugs.filter(bug => bug._id === bugId)
    return Promise.resolve(bug)
}

function remove(bugId) {
    bugs = bugs.filter(bug => bug._id !== bugId)
    return _writeBugsToFile()
}

function save(bug) {
    if (bug._id) {
        const bugIdx = bugs.findIndex(currBug => currBug._id === bug._id)
        bugs[bugIdx] = bug
    } else {
        bug._id = _makeId()
        bug.createdAt = new Date().getTime()
        bugs.push(bug)
    }
    return _writeBugsToFile().then(() => bug)
}

function createPDF() {
    const doc = new PDFDocument()
    doc.pipe(fs.createWriteStream('output.pdf'));
    doc.font('Times-Bold').fontSize(31).text('List of current Bugs:', {
        align: 'center'
    })
    bugs.map((bug, idx) => {
        doc.pipe(fs.createWriteStream('output.pdf'))
        doc.font('Times-Bold').fontSize(21).text(`${idx}. ${bug.title}:`)
        doc.font('Times-Roman').fontSize(15).text(`${bug.description}. Severity of bug: ${bug.severity}`).moveDown(1.5)
    })
    doc.end()
}

function _makeId(length = 5) {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

function _writeBugsToFile() {
    return new Promise((res, rej) => {
        const data = JSON.stringify(bugs, null, 2)
        fs.writeFile('data/bugs.json', data, (err) => {
            if (err) return rej(err)
            // console.log("File written successfully\n");
            res()
        });
    })
}