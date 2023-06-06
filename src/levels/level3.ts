import Level from "../level.ts";

import lab3json from '../assets/lab3.json?url'
import tileset2 from "../assets/tileset2.png";

export default class Level3 extends Level {
    constructor() {
        super('level3', {
            levelKey: 'lab3',
            levelUrl: lab3json,
            tilesetKey: 'tileset2',
            tilesetName: 'tileset2',
            tilesetUrl: tileset2
        });
    }
}
