import Global from "./Global";
import Main from "./main";
import Utils from "./Utils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Point extends cc.Component {

    onLoad() {

        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);

        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);

        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    private lastPos = cc.v2();
    private movePos = cc.v2();
    private firstXDir = 0;
    private firstYDir = 0;

    private reset() {
        this.lastPos = cc.v2();
        this.movePos = cc.v2();
        this.firstXDir = 0;
        this.firstYDir = 0;
    }
    private onTouchStart(event: cc.Event.EventTouch) {
        event.stopPropagation();

        this.reset();
        this.firstXDir = 0;
        this.lastPos = event.getLocation();

        console.log(this.node)
    }

    private onTouchMove(event: cc.Event.EventTouch) {
        event.stopPropagation();

        this.movePos = event.getLocation();
        let delta = event.getDelta();

        let bind_uuid = this.node["bind_uuid"];
        let bind_type = this.node["bind_type"];
        let bind_reversal = this.node["bind_reversal"];
        let bind_index1 = this.node["bind_index1"];
        let bind_index2 = this.node["bind_index2"];
        let bezier_array = this.node["bezier_array"];
        let bind_ctrl_dir = this.node["bind_ctrl_dir"];
        let points = Global.uuid_points_map[bind_uuid];


        let x = 0;
        if (this.movePos.x < this.lastPos.x) {
            x = -1;
            // console.log("左");
        } else if (this.movePos.x > this.lastPos.x) {
            x = 1;
            // console.log("右");
        }
        if (this.firstXDir == 0 && x !== 0) {
            this.firstXDir = x;
        }

        let y = 0;
        if (this.movePos.y < this.lastPos.y) {
            y = -1;
            // console.log("下");
        } else if (this.movePos.y > this.lastPos.y) {
            y = 1;
            // console.log("上");
        }
        if (this.firstYDir == 0 && y !== 0) {
            this.firstYDir = y;
        }

        if (bind_ctrl_dir == "x") {

            if (bind_type == "bezierCurveTo") {
                if (this.firstXDir == -1) {
                    bezier_array[1].x += (x * Math.abs(delta.x));
                } else if (this.firstXDir == 1) {
                    bezier_array[1].x += (x * Math.abs(delta.x));
                }


                if (this.firstYDir == -1) {
                    let index = bind_reversal ? bind_index2 : bind_index1;
                    points[index].y += (y * Math.abs(delta.y));
                } else if (this.firstYDir == 1) {
                    let index = bind_reversal ? bind_index1 : bind_index2;
                    points[index].y += (y * Math.abs(delta.y));
                }
            } else {

                if (this.firstXDir == -1) {
                    let index = bind_reversal ? bind_index2 : bind_index1;
                    points[index].x += (x * Math.abs(delta.x));
                } else if (this.firstXDir == 1) {
                    let index = bind_reversal ? bind_index1 : bind_index2;
                    points[index].x += (x * Math.abs(delta.x));
                }
            }
        }

        if (bind_ctrl_dir == "y") {

            if (bind_type == "bezierCurveTo") {
                if (this.firstYDir == -1) {
                    bezier_array[1].y += (y * Math.abs(delta.y));
                } else if (this.firstYDir == 1) {
                    bezier_array[1].y += (y * Math.abs(delta.y));
                }

                if (this.firstXDir == -1) {
                    let index = bind_reversal ? bind_index2 : bind_index1;
                    points[index].x += (x * Math.abs(delta.x));
                } else if (this.firstXDir == 1) {
                    let index = bind_reversal ? bind_index1 : bind_index2;
                    points[index].x += (x * Math.abs(delta.x));
                }
            } else {

                if (this.firstYDir == -1) {
                    let index = bind_reversal ? bind_index2 : bind_index1;
                    points[index].y += (y * Math.abs(delta.y));
                } else if (this.firstYDir == 1) {
                    let index = bind_reversal ? bind_index1 : bind_index2;
                    points[index].y += (y * Math.abs(delta.y));
                }
            }

        }

        Global.uuid_points_map[bind_uuid][bind_index1] = points[bind_index1];
        Global.uuid_points_map[bind_uuid][bind_index2] = points[bind_index2];
        Global.uuid_points_map[bind_uuid][bezier_array] = bezier_array;

        let main: Main = cc.find("Canvas").getComponent(Main);
        main.draw();

        this.lastPos = event.getLocation();
    }

    private onTouchEnd(event: cc.Event.EventTouch) {
        event.stopPropagation();

        this.reset();
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
    }


    // update (dt) {}
}
