import type { Court, Sport } from '../types'
import { get } from './http'

export const catalogApi = {
  getSports: () => get<Sport[]>('/sports'),
  getCourts: () => get<Court[]>('/courts'),
}