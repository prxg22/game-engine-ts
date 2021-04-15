import Phaser from 'phaser'
import EntityManager from './Core/EntityManager'
import Entity from './Core/Entity'
import System from './Core/System'
import HealthComponent from './Game/Components/HealthComponent'
import RenderComponent from './Game/Components/RenderComponent'
import RigidBodyComponent from './Game/Components/RigidBodyComponent'

import HealthSystem from './Game/Systems/HealthSystem'
import RenderSystem from './Game/Systems/RenderSystem'
import { Vector2D } from './Utils/Vector2D'
import MoveComponent, {
  DIRECTIONS,
  MOVEMENT_STATUS,
} from './Game/Components/MoveComponent'
import MoveSystem from './Game/Systems/MoveSystem'

// Scene
class Main extends Phaser.Scene {
  entityManager?: EntityManager
  player?: Entity
  opponents?: Entity[]
  systems: System[] = []
  private _lastTime: number = 0

  preload() {}

  createPlayer(): Entity {
    const player = <Entity>this.entityManager?.createEntity()

    const rectangle = this.add.rectangle(100, 100, 16, 16, 0x0000ff)
    const text = this.add.text(0, 0, '', { fontSize: '16px' })
    const position = <Vector2D>[20, 20]

    const render = new RenderComponent(rectangle)
    const rigidBody = new RigidBodyComponent(position)
    const health = new HealthComponent(100, 100, text)
    const move = new MoveComponent(DIRECTIONS.NONE)

    this.entityManager?.addComponent(rigidBody, player)
    this.entityManager?.addComponent(render, player)
    this.entityManager?.addComponent(health, player)
    this.entityManager?.addComponent(move, player)

    return player
  }

  createOpponent(): Entity {
    const opponent = <Entity>this.entityManager?.createEntity()

    const rectangle = this.add.rectangle(100, 100, 16, 16, 0xff0000)
    const text = this.add.text(0, 0, '', { fontSize: '16px' })
    const position = <Vector2D>[
      Phaser.Math.Between(0, 49),
      Phaser.Math.Between(0, 36),
    ]

    const render = new RenderComponent(rectangle)
    const rigidBody = new RigidBodyComponent(position)
    const health = new HealthComponent(100, 100, text)
    // const move = new MoveComponent(DIRECTIONS.NONE)

    ;[render, rigidBody, health].forEach(component => {
      this.entityManager?.addComponent(component, opponent)
    })

    this.opponents = [...(this.opponents || []), opponent]

    return opponent
  }

  create() {
    this.entityManager = new EntityManager()
    this.systems.push(
      new RenderSystem(this.entityManager, this),
      new HealthSystem(this.entityManager, this),
      new MoveSystem(this.entityManager, this),
    )
    this.player = this.createPlayer()
    this.createOpponent()
    this.createOpponent()
    this.createOpponent()
    this.createOpponent()
  }

  update(dt: number) {
    if (dt - this._lastTime < 1000) return

    this._lastTime = dt
    this.systems.forEach(s => s.update(dt))

    this.systems.forEach(s => {
      s.render(dt)
    })
  }
}

new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'content',
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
    },
  },
  backgroundColor: 'transparent',
  scene: Main,
})
