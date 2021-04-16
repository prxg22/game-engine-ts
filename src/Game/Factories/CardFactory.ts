import { Entity, EntityManager } from '../../Core'
import CardDescriptorComponent, {
  CardDescriptor
} from '../Components/CardDescriptorComponent'

export const create = (
  descriptor: CardDescriptor,
  entityManager: EntityManager
): Entity => {
  const card = entityManager.createEntity()

  entityManager.addComponent(new CardDescriptorComponent(descriptor), card)
  return card
}
