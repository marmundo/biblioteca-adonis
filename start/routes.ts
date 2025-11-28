/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import LivrosController from '#controllers/livros_controller'
import UsuariosController from '#controllers/usuarios_controller'
import AuthController from '#controllers/auth_controller'
import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

// Rotas públicas de autenticação
router.post('/register', [AuthController, 'register'])
router.post('/login', [AuthController, 'login'])

// Rotas protegidas de autenticação
router.group(() => {
  router.post('/logout', [AuthController, 'logout'])
  router.get('/me', [AuthController, 'me'])
}).use(middleware.auth())

// Rotas de livros (protegidas para criar, atualizar e deletar)
router.get('/livros', [LivrosController, 'index'])
router.get('/livros/:id', [LivrosController, 'show'])

router.group(() => {
  router.post('/livros', [LivrosController, 'store'])
  router.put('/livros/:id', [LivrosController, 'update'])
  router.patch('/livros/:id', [LivrosController, 'update'])
  router.delete('/livros/:id', [LivrosController, 'destroy'])
}).use(middleware.auth())

// Rotas de usuários
router.resource('usuarios', UsuariosController).apiOnly()