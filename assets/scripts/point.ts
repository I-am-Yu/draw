import Global from "./Global";
import Utils from "./Utils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Point extends cc.Component {

    onLoad() {

        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
    }

    private onTouchStart(event: cc.Event.EventTouch) {
        console.log(this.node)
    }

    start() {
        let bind_uuid = this.node["bind_uuid"];
        let bind_type = this.node["bind_type"];
        let bind_index1 = this.node["bind_index1"];
        let bind_index2 = this.node["bind_index2"];
        let bezier_array = this.node["bezier_array"];

        let points = Global.uuid_points_map[bind_uuid];

        let p0 = points[bind_index1];
        let p1 = points[bind_index2];

        let centerPos = Utils.getTwoPointsCenter(p0, p1);
        this.node.x = centerPos.x;
        this.node.y = centerPos.y;

    }

    // update (dt) {}
}
