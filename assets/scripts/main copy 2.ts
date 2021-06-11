const { ccclass, property } = cc._decorator;

interface point {
    xMin: number,
    xMax: number,
    yMin: number,
    yMax: number
}

interface rangePoint {
    top: point
}

@ccclass
export default class Main extends cc.Component {

    @property(cc.Prefab)
    xuxian: cc.Prefab = null;

    @property(cc.Graphics)
    ctx: cc.Graphics = null

    @property(cc.Graphics)
    ctx2: cc.Graphics = null


    private xl: cc.Node = null;

    private graphArray: rangePoint[] = [];

    private startPos = cc.v2();
    private movePos = cc.v2();
    private endPos = cc.v2();

    protected onLoad() {
        let a = cc.find("Canvas/Graphics").getComponents(cc.Graphics)
        console.log(a)
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);

        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);

        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
    }


    private onTouchStart(event: cc.Event.EventTouch) {

        let pos = event.getLocation();
        this.startPos = this.getLocalPos(pos);

        if (this.xl) {
            this.xl.destroy();
        }

        if (this.graphArray.length > 0) {
            console.log("this.graphArray", this.graphArray)
            console.log("this.startPos", this.startPos)

            let _t = this.graphArray[0]
            if (this.startPos.x > _t.top.xMin && this.startPos.x < _t.top.xMax && this.startPos.y > _t.top.yMin && this.startPos.y < _t.top.yMax) {
                console.log("点击到top")
            }
            // return;
        }


        this.xl = cc.instantiate(this.xuxian);
        this.node.addChild(this.xl);
        this.xl.x = this.startPos.x;
        this.xl.y = this.startPos.y;
    }

    private points = [];
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
        if (this.endPos.sub(this.startPos).mag() <= 1) {
            return;
        }

        let p1 = this.startPos;
        let p2 = cc.v2(p1.x + this.xl.width, p1.y);
        let p3 = cc.v2(p2.x, p2.y + this.xl.height);
        let p4 = cc.v2(p1.x, p3.y);
        let p5 = this.startPos;
        let c = (p2.x - p1.x) / 2;
        let arr = [
            cc.v2(p1.x, p1.y),
            cc.v2(p1.x + c, p1.y + 50),
            cc.v2(p2.x, p2.y),
        ]

        this.points.push({
            type: "moveTo",
            pos: p1
        })
        this.points.push({
            type: "lineTo",
            pos: p2
        })
        this.points.push({
            type: "lineTo",
            pos: p3
        })
        this.points.push({
            type: "lineTo",
            pos: p4
        })
        this.points.push({
            type: "lineTo",
            pos: p5
        })
        // this.points.push({
        //     type: "bezierCurveTo",
        //     posarr: arr
        // })

        this.draw();


        let a = this.bezierCalculate(arr, 100)


  


        //点击范围
        let lw = this.ctx.lineWidth;

        //上边框
        let top: point = {
            xMin: p1.x,
            xMax: p2.x,
            yMin: p1.y,
            yMax: p1.y + lw
        }

        //下边框
        let bottomMinX = p4.x;
        let bottomMaxX = p3.x;
        let bottomMinY = p3.y - lw;
        let bottomMaxY = p3.y;

        //左边框

        let rp: rangePoint = {
            top
        }

        this.graphArray.push(rp)

        // this.xl.destroy();
        // this.xl.active = false

    }


    private draw() {
        this.ctx.clear();
        this.points.forEach(val => {
            // this.ctx.moveTo(p1.x, p1.y);
            // this.ctx.lineTo(p2.x, p2.y);
            // this.ctx.lineTo(p3.x, p3.y);
            // this.ctx.lineTo(p4.x, p4.y);
            // this.ctx.lineTo(p5.x, p5.y);
            // this.ctx.bezierCurveTo(p1.x, p1.y, p1.x + c, p1.y + 50, p2.x, p2.y);

            switch (val.type) {
                case "moveTo":
                    this.ctx.moveTo(val.pos.x, val.pos.y);
                    break;
                case "lineTo":
                    this.ctx.lineTo(val.pos.x, val.pos.y);
                    break;
                case "bezierCurveTo":
                    let arr = val.posarr;
                    this.ctx.bezierCurveTo(arr[0].x, arr[0].y, arr[1].x, arr[1].y, arr[2].x, arr[2].y);
                    break;
            }
        })

        this.ctx.stroke();
        this.ctx.fill();
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
