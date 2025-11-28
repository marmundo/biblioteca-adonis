import { createLivroValidator } from '#validators/livro'
import type { HttpContext } from '@adonisjs/core/http'
import Livro from "#models/livro"
import { DateTime } from 'luxon'

export default class LivrosController {
  /**
   * Display a list of resource
   */
  async index({}: HttpContext) {
    const livros = await Livro.query().preload('user')
    return livros
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, auth }: HttpContext) {
    const payload = await request.validateUsing(createLivroValidator)
    const livro = await Livro.create({
      ...payload,
      dataPublicacao: DateTime.fromJSDate(payload.dataPublicacao),
      userId: auth.user!.id
    })
    await livro.load('user')
    return livro
  }

  /**
   * Show individual record
   */
  async show({ params }: HttpContext) {
    const livro = await Livro.query().where('id', params.id).preload('user').firstOrFail()
    return livro
  }


  /**
   * Handle form submission for the edit action
   */
  async update({ params, request }: HttpContext) {
    const livro = await Livro.find(params.id)
    if (!livro) {
      throw new Error('Livro não encontrado')
    }

    const payload = await request.validateUsing(createLivroValidator)

    livro.merge({
      ...payload,
      dataPublicacao: DateTime.fromJSDate(payload.dataPublicacao)
    })
    await livro.save()
    return livro
  }

  /**
   * Delete record
   */
  async destroy({ params }: HttpContext) {
    const livro = await Livro.find(params.id)
    if (!livro) {
      throw new Error('Livro não encontrado')
    }

    await livro.delete()
    return { message: 'Livro deletado com sucesso' }
  }
}