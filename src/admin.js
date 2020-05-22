import AdminBro from 'admin-bro'
import AdminBroExpress from 'admin-bro-expressjs'
import AdminBroMongoose from 'admin-bro-mongoose'

import { Therapist, Therapy, Symptom, Synonym } from './therapists/models.js'
import { Article } from './articles/models.js'

export default function (app, route) {
  AdminBro.registerAdapter(AdminBroMongoose)
  const adminBro = new AdminBro({
    rootPath: route,
    branding: {
      companyName: 'Naturapeute Admin',
    },
    dashboard: {
      // component: 'StringsList'
    },
    resources: [
      {
        resource: Synonym,
        options: {
          listProperties: ['name', 'words'],
          showProperties: ['name', 'words'],
          editProperties: ['name', 'words'],
          titleProperty: 'name',
          isVisible: { list: true, filter: true, show: false, edit: true },
        }
      },
      {
        resource: Article,
        options: {
          listProperties: ['title', 'creationDate'],
          showProperties: ['title', 'slug', 'tags', 'body'],
          titleProperty: 'title',
          properties: {
            slug: { isVisible: false },
            body: {
              type: 'richtext'
            },
            tags: {
              components: {
                // edit: AdminBro.bundle('strings-list'), //'StringsList',
                // list: AdminBro.bundle('strings-list'), //'StringsList',
              }
            }
          }
        }
      },
      {
        resource: Therapist,
      }
    ],
  })
  const router = AdminBroExpress.buildRouter(adminBro)
  app.use(route, router)
}