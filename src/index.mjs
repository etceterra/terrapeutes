import express from 'express'
import nunjucks from 'nunjucks'
import bodyparser from 'body-parser'
import marked from 'marked'

import config from './config.mjs'
import articlesRoutes from './articles/routes.mjs'
import therapistsRoutes from './therapists/routes.mjs'
import { Therapy } from './therapists/airtable.mjs'


const app = express()

app.set('view engine', 'html')
const template = nunjucks.configure(`src/views`, { express: app, autoescape: true })
template.addFilter('markdown', (str = '') => nunjucks.runtime.markSafe(marked(str)))

app.use(express.static('assets'))
app.use(bodyparser.urlencoded({ extended: false }))

app.get('/', async (req, res) => {
  const therapies = await Therapy.getAll()
  res.render('index', { therapies })
})

articlesRoutes(app, '/journal')

therapistsRoutes(app)

app.get('/therapies', async (req, res) => res.render(`therapies/index.html`))
app.get('/therapies/:name', async (req, res) => res.render(`therapies/${req.params.name}`))
app.get('/privacy.html', async (req, res) => res.render('privacy'))
app.get('/policy.html', async (req, res) => res.render('policy'))
app.get('/evenements.html', async (req, res) => res.render('events'))

app.listen(config.PORT, () => console.log(`App running on http://localhost:${config.PORT}`))
