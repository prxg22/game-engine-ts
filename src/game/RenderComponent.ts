import Phaser from "phaser"
import Component from "../core/Component"

class RenderComponent implements Component {
  constructor(public node: Phaser.GameObjects.Shape) {}
}

export default RenderComponent
