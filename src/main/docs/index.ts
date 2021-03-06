import paths from './paths'
import components from './components'
import schemas from './schemas'

export default {
  openapi: '3.0.0',
  info: {
    title: 'Clean Node API',
    description: 'Api do curso do Mango para realizar enquetes entre programadores',
    version: '1.0.0'
  },
  contact: {
    name: 'Italo Leandro',
    email: 'italo_leandro@outlook.com',
    url: 'https://github.com/ItaloLeandro02/clean-ts-api/issues'
  },
  licenses: {
    name: 'GPL-3.0-or-later',
    url: 'https://spdx.org/licenses/GPL-3.0-or-later.html'
  },
  servers: [{
    url: '/api'
  }],
  tags: [{
    name: 'Login'
  }, {
    name: 'Enquete'
  }],
  paths,
  schemas,
  components
}
