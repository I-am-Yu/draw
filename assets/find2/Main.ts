
import { astar } from "./AStar";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Prefab)
    p: cc.Prefab = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {
        let gx = 40
        let numCols = this.node.width / gx
        let numRows = this.node.height / gx
        let a = new astar.Grid(numCols, numRows);
        a.setWalkable(6, 0, false)

        let nodes = a.getNodes()

        nodes.forEach((node: any) => {
            node.forEach(element => {
                let p = cc.instantiate(this.p)
                this.node.addChild(p)
                p.x = element.x * gx
                p.y = element.y * gx
                p.getChildByName("label").getComponent(cc.Label).string = `(${element.x},${element.y})`
            });

        });

        a.setStartNode(0, 0);
        a.setEndNode(14, 0);

        let b = new astar.AStar()
        b.allowDiag(false)
        b.findPath(a)
        console.log(b.path)

    }

    // update (dt) {}
}
