export default class Utils {

    public static getTwoPointsCenter(p0, p1): { x: number, y: number } {
        let cPoint = { x: 0, y: 0 };
        if (p0.x == p1.x) {
            cPoint = {
                x: p1.x,
                y: p0.y + (p1.y - p0.y) / 2
            }
        } else if (p0.y == p1.y) {
            cPoint = {
                x: p0.x + (p1.x - p0.x) / 2,
                y: p1.y
            }
        }

        return cPoint;
    }
}