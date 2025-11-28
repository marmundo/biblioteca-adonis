import { createLivroValidator } from '#validators/livro'
import type { HttpContext } from '@adonisjs/core/http'
import Livro from "#models/livro"
import { DateTime } from 'luxon'

export default class LivrosController {
  /**
   * Display a list of resource
   */
  async index({}: HttpContext) {
    const livros = await Livro.all()
    return livros
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request }: HttpContext) {
    const payload = await request.validateUsing(createLivroValidator)
    const livro = await Livro.create({
      ...payload,
      dataPublicacao: DateTime.fromJSDate(payload.dataPublicacao)
    })
    return livro
  }

  /**
   * Show individual record
   */
  async show({ params }: HttpContext) {
    const livro = await Livro.find(params.id)
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