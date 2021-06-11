import Global from "./Global";
import Utils from "./Utils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Main extends cc.Component {

    @property(cc.Prefab)
    xuxian: cc.Prefab = null;

    @property(cc.Prefab)
    point: cc.Prefab = null;

    @property(cc.Graphics)
    ctx: cc.Graphics = null

    @property(cc.Graphics)
    ctx2: cc.Graphics = null


    private xl: cc.Node = null;

    // private graphArray: rangePoint[] = [];

    private points = [];

    private startPos = cc.v2();
    private movePos = cc.v2();
    private endPos = cc.v2();

    protected onLoad() {

        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);

        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);

        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    private onTouchStart(event: cc.Event.EventTouch) {
        console.log(111)

        let pos = event.getLocation();
        this.startPos = this.getLocalPos(pos);

        // if (this.xl) {
        //     this.xl.destroy();
        // }

        this.xl = cc.instantiate(this.xuxian);
        this.node.addChild(this.xl);
        this.xl.x = this.startPos.x;
        this.xl.y = this.startPos.y;
    }

    private onTouchMove(event) {

        let pos = event.getLocation();
        this.movePos = this.getLocalPos(pos);

        let _w = this.movePos.x - this.startPos.x;
        let _h = this.movePos.y - this.startPos.y;

        this.xl.width = _w;
        this.xl.height = _h;
    }

    private onTouchEnd(event) {
        let pos = event.getLocation();
        this.endPos = this.getLocalPos(pos);
        if (this.endPos.sub(this.startPos).mag() <= 3) {
            return;
        }

        let p0 = this.startPos;
        let p1 = cc.v2(p0.x + this.xl.width, p0.y);
        let p2 = cc.v2(p1.x, p1.y + this.xl.height);
        let p3 = cc.v2(p0.x, p2.y);
        let p4 = this.startPos;

        Global.uuid_points_map[this.xl.uuid] = [
            p0, p1, p2, p3, p4
        ];

        // let point1 = cc.instantiate(this.point)
        // point1["bind_uuid"] = this.xl.uuid;
        // point1["bind_type"] = "lineTo";
        // point1["bind_index1"] = 0;
        // point1["bind_index2"] = 1;
        // point1["bind_ctrl_dir"] = "x";

        let point1 = cc.instantiate(this.point)
        point1["bind_uuid"] = this.xl.uuid;
        point1["bind_type"] = "bezierCurveTo";
        point1["bind_index1"] = 0;
        point1["bind_index2"] = 1;
        point1["bezier_array"] = Utils.getBezierArray(point1["bind_uuid"], point1["bind_index1"], point1["bind_index2"]);
        point1["bind_ctrl_dir"] = "y";

        let point2 = cc.instantiate(this.point)
        point2["bind_uuid"] = this.xl.uuid;
        point2["bind_type"] = "lineTo";
        point2["bind_index1"] = 1;
        point2["bind_index2"] = 2;
        point2["bind_ctrl_dir"] = "y";

        let point3 = cc.instantiate(this.point)
        point3["bind_uuid"] = this.xl.uuid;
        point3["bind_type"] = "lineTo";
        point3["bind_index1"] = 2;
        point3["bind_index2"] = 3;
        point3["bind_ctrl_dir"] = "x";

        let point4 = cc.instantiate(this.point)
        point4["bind_uuid"] = this.xl.uuid;
        point4["bind_type"] = "lineTo";
        point4["bind_index1"] = 3;
        point4["bind_index2"] = 4;
        point4["bind_ctrl_dir"] = "y";

        this.node.addChild(point1);
        this.node.addChild(point2);
        this.node.addChild(point3);
        this.node.addChild(point4);

        Global.uuid_ctrl_node_map[this.xl.uuid] = [
            point1,
            point2,
            point3,
            point4,
        ]

        this.draw();
        this.xl.active = false;
    }

    public draw() {
        this.ctx.clear();

        let keys = Object.keys(Global.uuid_ctrl_node_map)
        keys.forEach(key => {

            let ctrlNodes: cc.Node[] = Global.uuid_ctrl_node_map[key];
            let points = Global.uuid_points_map[key];

            this.setDrawPath("moveTo", points[0]);

            ctrlNodes.forEach(ctrlNode => {
                let bind_type = ctrlNode["bind_type"];
                let bind_index1 = ctrlNode["bind_index1"];
                let bind_index2 = ctrlNode["bind_index2"];
                let bezier_array = ctrlNode["bezier_array"];

                // 设置控制点
                let p0 = points[bind_index1];
                let p1 = points[bind_index2];
                let centerPos = Utils.getTwoPointsCenter(p0, p1);
                ctrlNode.x = centerPos.x;
                ctrlNode.y = centerPos.y;

                // 划线
                switch (bind_type) {
                    case "lineTo":
                        this.setDrawPath(bind_type, points[bind_index2]);
                        break;
                    case "bezierCurveTo":
                        this.setDrawPath(bind_type, bezier_array);
                        break;
                }
            })
        })

        this.ctx.stroke();
    }


    private setDrawPath(type, pos) {
        switch (type) {
            case "moveTo":
                this.ctx.moveTo(pos.x, pos.y);
                break;
            case "lineTo":
                this.ctx.lineTo(pos.x, pos.y);
                break;
            case "bezierCurveTo":
                let arr = pos;
                this.ctx.bezierCurveTo(arr[0].x, arr[0].y, arr[1].x, arr[1].y, arr[2].x, arr[2].y);
                break;
        }
    }



    private getLocalPos(pos: cc.Vec2) {
        let out = cc.v2();
        //用摄像机做转换，将触摸点转换到游戏中的世界坐标
        cc.Camera.findCamera(cc.find("Canvas")).getScreenToWorldPoint(pos, out);

        let localPos = this.node.convertToNodeSpaceAR(out);
        return localPos;
    }

    protected start() {
        // this.ctx.moveTo(0, 0);
        // this.ctx.lineTo(300, 150);
        // this.ctx.stroke();


        // this.ctx.moveTo(20, 20);
        // this.ctx.quadraticCurveTo(20, 100, 200, 20);
        // this.ctx.stroke();


        // console.log(this.ctx)

    }

    /**
     * @param poss      贝塞尔曲线控制点坐标
     * @param precision 精度，需要计算的该条贝塞尔曲线上的点的数目
     * @return 该条贝塞尔曲线上的点（二维坐标）
     */
    private bezierCalculate(poss: Array<cc.Vec2>, precision: number) {

        //维度，坐标轴数（二维坐标，三维坐标...）
        let dimersion = 2;

        //贝塞尔曲线控制点数（阶数）
        let number = poss.length;

        //控制点数不小于 2 ，至少为二维坐标系
        if (number < 2 || dimersion < 2)
            return null;

        let result = new Array();

        //计算杨辉三角
        let mi = new Array();
        mi[0] = mi[1] = 1;
        for (let i = 3; i <= number; i++) {

            let t = new Array();
            for (let j = 0; j < i - 1; j++) {
                t[j] = mi[j];
            }

            mi[0] = mi[i - 1] = 1;
            for (let j = 0; j < i - 2; j++) {
                mi[j + 1] = t[j] + t[j + 1];
            }
        }

        //计算坐标点
        for (let i = 0; i < precision; i++) {
            let t = i / precision;
            let p = cc.v2(0, 0);
            result.push(p);
            for (let j = 0; j < dimersion; j++) {
                let temp = 0.0;
                for (let k = 0; k < number; k++) {
                    temp += Math.pow(1 - t, number - k - 1) * (j == 0 ? poss[k].x : poss[k].y) * Math.pow(t, k) * mi[k];
                }
                j == 0 ? p.x = temp : p.y = temp;
            }
            // p.x = this.toDecimal(p.x);
            // p.y = this.toDecimal(p.y);
        }

        return result;
    }

}
