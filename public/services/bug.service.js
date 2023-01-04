import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'

const BASE_URL = '/api/bug/'
// const STORAGE_KEY = 'bugDB'
let maxPages = 1
export const bugService = {
    query,
    getById,
    save,
    remove,
    getEmptyBug,
    getPDF,
    getDefaultFilter,
    getMaxPages,
}

function getMaxPages(){
    return maxPages
}

function query(filterBy = getDefaultFilter()) {
    const filterToSend = `?title=${filterBy.title}&description=${filterBy.description}&severity=${filterBy.severity}&labels=${filterBy.labels}&sort=${filterBy.sort}&order=${filterBy.order}&pageIdx=${filterBy.pageIdx}`
    return axios.get(BASE_URL + filterToSend)
        .then(res => {
            maxPages = res.data.maxPages
            return res.data.bugs
        })
}

function getById(bugId) {
    return axios.get(BASE_URL + bugId)
        .then(res => res.data)
}

function remove(bugId) {
    return axios.delete(BASE_URL + bugId)
}

function save(bug) {
    const url = (bug._id) ? BASE_URL + `${bug._id}` : BASE_URL
    const method = (bug._id) ? 'put' : 'post'
    return axios[method](url, bug).then(res => res.data)
}

function getEmptyBug(id = '', title = '', description = '', severity = 0, createdAt = 0) {
    return { id, title, description, severity, createdAt }
}

function getPDF() {
    return axios.get(BASE_URL + 'save_pdf')
}

function getDefaultFilter() {
    return { title: '', description: '', severity: '', labels: '', sort: '', order: 1, pageIdx: 0 }
}