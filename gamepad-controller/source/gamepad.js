const BUTTONS = [
    'A',
    'B',
    'X',
    'Y',
    'LEFT_SHOULDER_0',
    'RIGHT_SHOULDER_0',
    'LEFT_SHOULDER_1',
    'RIGHT_SHOULDER_1',
    'SELECT',
    'START',
    'LEFT_STICK_BUTTON',
    'RIGHT_STICK_BUTTON',
    'UP',
    'DOWN',
    'LEFT',
    'RIGHT',
    'AXES1',
    'AXES2'
];

import Event from './gamepad.event';
import EventDispatcher from './../../event-dispatcher/event.dispatcher';

export default class Gamepad extends EventDispatcher {
    constructor(w) {
        this.window = w || window;
        this.defaultIndex = 0;
        this.soft = 0.1;
        this.status = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

        this.eventCount = 0;
        if (this.getContoller() === undefined)
            this.ready = false;
        else
            this.ready = true;

        this.listener = {
            'A': [],
            'B': [],
            'X': [],
            'Y': [],
            'LEFT_SHOULDER_0': [],
            'RIGHT_SHOULDER_0': [],
            'LEFT_SHOULDER_1': [],
            'RIGHT_SHOULDER_1': [],
            'SELECT': [],
            'START': [],
            'LEFT_STICK_BUTTON': [],
            'RIGHT_STICK_BUTTON': [],
            'UP': [],
            'DOWN': [],
            'LEFT': [],
            'RIGHT': [],
            'AXES1': [],
            'AXES2': []
        };

        this.addListener();
        this.start();

    }

    start() {
        this.interval = setInterval(() = > {
                this.update();
    },
        1000 / 60
    )
        ;
    }

    stop() {
        clearInterval(this.interval);
    }

    getContoller() {
        return this.window.navigator.getGamepads()[this.defaultIndex];
    }

    addListener() {
        this.window.addEventListener("gamepadconnected", (e) = > {
            console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
            e.gamepad.index, e.gamepad.id,
            e.gamepad.buttons.length, e.gamepad.axes.length);
        this.ready = true;
        this.defaultIndex = e.gamepad.index;
    })
        ;

        this.window.addEventListener("gamepaddisconnected", (e) = > {
            console.log("Gamepad disconnected from index %d: %s",
            e.gamepad.index, e.gamepad.id);

        this.ready = false;
    })
        ;
    }

    update() {
        if (!this.ready)
            return false;
        var controller = this.getContoller();
        if (controller === undefined) return;
        var buttons = controller.buttons;

        var bl = buttons.length;
        while (bl--) {
            var button = buttons[bl];

            if (button.pressed) {
                this.trigger(bl, button.value, "press");
            }

            if (this.status[bl] === 0 && button.pressed) {
                this.trigger(bl, button.value, "down");
            }

            if (this.status[bl] === 1 && !button.pressed) {
                this.trigger(bl, button.value, "up");
            }

            this.status[bl] = ~~button.pressed;
        }

        if (Math.abs(controller.axes[0]) > this.soft || Math.abs(controller.axes[1]) > this.soft) {
            this.trigger(16, [controller.axes[0], controller.axes[1]], "press");
        }

        if (Math.abs(controller.axes[2]) > this.soft || Math.abs(controller.axes[3]) > this.soft) {
            this.trigger(17, [controller.axes[2], controller.axes[3]], "press");
        }


    }

    on(type, listener) {
        var _t = type;
        if (_t instanceof Array) {
            _t.map((name) = > {
                return name.toUpperCase()
            }
        )
        }
        super.on(_t, listener)
    }

    trigger(typeName, value, type) {
        var name = BUTTONS[typeName].toLowerCase();
        super.trigger({'type': name, "etype": type});
    }

}