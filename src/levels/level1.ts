import Level from "../level.ts";

import lab1json from '../assets/lab1.json?url';
import lab from '../assets/lab.png';

export default class Level1 extends Level {
    constructor() {
        super('level1', {
            levelKey: 'lab1',
            levelUrl: lab1json,
            tilesetKey: 'lab',
            tilesetName: 'lab',
            tilesetUrl: lab
        });
    } 
}
