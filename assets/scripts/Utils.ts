import Global from "./Global";

export default class Utils {

    public static getTwoPointsCenter(p0: cc.Vec2, p1: cc.Vec2) {
        let tempPos = cc.v2();
        p1.sub(p0, tempPos);
        tempPos.div(2, tempPos);
        p0.add(tempPos, tempPos);
        return tempPos;
    }

    public static getBezierArray(uuid, index1, index2) {
        let p0 = Global.uuid_points_map[uuid][index1];
        let p1 = Global.uuid_points_map[uuid][index2];
        let cPoint = Utils.getTwoPointsCenter(p0, p1);
        return [
            cc.v2(p0.x, p0.y),
            cc.v2(cPoint.x, cPoint.y + 50),
            cc.v2(p1.x + 2, p1.y),
        ]
    }
}