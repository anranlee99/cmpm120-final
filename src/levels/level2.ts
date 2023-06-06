import Level from "../level.ts";

import lab2json from '../assets/lab2.json?url';
import lab from "../assets/lab.png";

export default class Level2 extends Level {
    constructor() {
        super('level2', {
            levelKey: 'lab2',
            levelUrl: lab2json,
            tilesetKey: 'lab',
            tilesetName: 'tileset',
            tilesetUrl: lab
        });
    }
}
