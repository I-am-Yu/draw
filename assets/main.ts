const { ccclass, property } = cc._decorator;

@ccclass
export default class Main extends cc.Component {

    @property(cc.Prefab)
    xuxian: cc.Prefab = null;

    @property(cc.Graphics)
    ctx: cc.Graphics = null

    private xl: cc.Node = null;

    private startPos = cc.v2();
    private movePos = cc.v2();
    private endPos = cc.v2();

    protected onLoad() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);

        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);

        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    private onTouchStart(event) {
        let pos = event.getLocation();
        this.startPos = this.getLocalPos(pos);

        if (this.xl) {
            this.xl.destroy();
        }
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
        if (this.endPos.sub(this.startPos).mag() <= 1) {
            return;
        }

        let p1 = this.startPos;
        let p2 = cc.v2(p1.x + this.xl.width, p1.y);
        let p3 = cc.v2(p2.x, p2.y + this.xl.height);
        let p4 = cc.v2(p1.x, p3.y);
        let p5 = this.startPos;

        this.ctx.moveTo(p1.x, p1.y);
        this.ctx.lineTo(p2.x, p2.y);
        this.ctx.lineTo(p3.x, p3.y);
        this.ctx.lineTo(p4.x, p4.y);
        this.ctx.lineTo(p5.x, p5.y);
        this.ctx.stroke();
        this.ctx.fill();

        // cc.Intersection.pointInPolygon()

        // this.xl.destroy();
        this.xl.active = false
    }

    private createXuxian() {

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
    }

}
