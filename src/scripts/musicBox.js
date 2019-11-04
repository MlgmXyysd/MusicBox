/**
 *
 * 音乐盒
 *
 * 2018.11.14 by wangrui
 *
 */

class MusicBox {

    constructor(selector, options) {

        let defaults = {

            loop: false, // 循环播放
            musicText: '',  // 乐谱
            autoplay: 60, // 自动弹奏速度
            type: 'sine',  // 音色类型  sine|square|triangle|sawtooth
            duration: 2,  // 键音延长时间
            volume: 0.5,     // 音量
            mixing: true,  // 混合立体音
            keyboard: true  // 键盘控制

        };

        this.selector = selector;
        this.opts = Object.assign(defaults, options);

        // 创建新的音频上下文接口
        // noinspection JSUnresolvedVariable
        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();

        // 音阶频率
        // this.arrFrequency = [262, 294, 330, 349, 392, 440, 494, 523, 587, 659, 698, 784, 880, 988, 1047, 1175, 1319, 1397, 1568, 1760, 1967];
        this.arrFrequency = [
            // ---1
            {id: 0, value: 33},
            {id: 1, value: 37},
            {id: 2, value: 41},
            {id: 3, value: 44},
            {id: 4, value: 49},
            {id: 5, value: 56},
            {id: 6, value: 62},
            // --1
            {id: 7, value: 66},
            {id: 8, value: 74},
            {id: 9, value: 83},
            {id: 10, value: 87},
            {id: 11, value: 98},
            {id: 12, value: 110},
            {id: 13, value: 124},
            // -1
            {id: 14, value: 131},
            {id: 15, value: 147},
            {id: 16, value: 165},
            {id: 17, value: 175},
            {id: 18, value: 196},
            {id: 19, value: 220},
            {id: 20, value: 247},
            /**** 主音域 start ****/
            // 1
            {id: 21, value: 262},
            {id: 22, value: 294},
            {id: 23, value: 330},
            {id: 24, value: 349},
            {id: 25, value: 392},
            {id: 26, value: 440},
            {id: 27, value: 494},
            // 1-
            {id: 28, value: 523},
            {id: 29, value: 587},
            {id: 30, value: 659},
            {id: 31, value: 698},
            {id: 32, value: 784},
            {id: 33, value: 880},
            {id: 34, value: 988},
            // 1--
            {id: 35, value: 1047},
            {id: 36, value: 1175},
            {id: 37, value: 1319},
            {id: 38, value: 1397},
            {id: 39, value: 1568},
            {id: 40, value: 1760},
            {id: 41, value: 1967},
            /**** 主音域 end ****/
            // 1---
            {id: 42, value: 2089},
            {id: 43, value: 2288},
            {id: 44, value: 2565},
            {id: 45, value: 2716},
            {id: 46, value: 3047},
            {id: 47, value: 3417},
            {id: 48, value: 3832}
        ];
        // 音符
        this.arrNotes = ['o', 'p', 'q', 'r', 's', 't', 'u', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'a', 'b', 'c', 'd', 'e', 'f', 'g', '1', '2', '3', '4', '5', '6', '7', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U'];
        // 键码值
        this.keyCodes = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 49, 50, 51, 52, 53, 54, 55, 81, 87, 69, 82, 84, 89, 85, 65, 83, 68, 70, 71, 72, 74, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

        // 绘制钢琴
        this.draw();

        this.speed = 60;
        this.paused = false;

        // 播放乐谱
        if (this.opts.autoplay) {
            this.speed = this.opts.autoplay === true ? this.speed : this.opts.autoplay;
            this.playMusic(this.opts.musicText);
        }

    }

    // 创建声音
    createSound(freq) {

        // 创建一个OscillatorNode, 它表示一个周期性波形（振荡），基本上来说创造了一个音调
        let oscillator = this.audioCtx.createOscillator();
        // 创建一个GainNode,它可以控制音频的总音量
        let gainNode = this.audioCtx.createGain();
        // 把音量，音调和终节点进行关联
        oscillator.connect(gainNode);
        // this.audioCtx.destination返回AudioDestinationNode对象，表示当前audio context中所有节点的最终节点，一般表示音频渲染设备
        gainNode.connect(this.audioCtx.destination);
        // 指定音调的类型  sine|square|triangle|sawtooth
        oscillator.type = this.opts.type;
        // 设置当前播放声音的频率，也就是最终播放声音的调调
        oscillator.frequency.value = freq;
        // 当前时间设置音量为0
        gainNode.gain.setValueAtTime(0, this.audioCtx.currentTime);
        // 0.01秒后音量为this.opts.volume
        gainNode.gain.linearRampToValueAtTime(this.opts.volume, this.audioCtx.currentTime + 0.01);
        // 音调从当前时间开始播放
        oscillator.start(this.audioCtx.currentTime);
        // this.opts.duration秒内声音慢慢降低，是个不错的停止声音的方法
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + this.opts.duration);
        // this.opts.duration秒后完全停止声音
        oscillator.stop(this.audioCtx.currentTime + this.opts.duration);

    }

    // 创建立体音（三和弦）
    createMusic(note) {

        let index = this.arrNotes.indexOf(note);
        let step = 0;
        if (this.opts.mixing) step = 7;

        if (index !== -1) {
            if (index - step >= 0) {
                this.createSound(this.arrFrequency.find(item => item.id === index - step).value);
            }
            this.createSound(this.arrFrequency.find(item => item.id === index).value);
            if (index + step <= 48) {
                this.createSound(this.arrFrequency.find(item => item.id === index + step).value);
            }
        }

    }
	
	// 修改循环播放
	changeLoop(loop) {
		this.opts.loop = loop;
	}

    // 绘制钢琴
    draw() {

        this.musicBtn = null;

        let musicBtns = document.querySelector(this.selector),
            li = '',
            noteClass = '';
        let lowHighNote = {
            a: 1,
            b: 2,
            c: 3,
            d: 4,
            e: 5,
            f: 6,
            g: 7,
            h: 1,
            i: 2,
            j: 3,
            k: 4,
            l: 5,
            m: 6,
            n: 7,
            o: 1,
            p: 2,
            q: 3,
            r: 4,
            s: 5,
            t: 6,
            u: 7
        };  // 字母与高低音阶匹配表

        for (let i = 0; i < this.arrNotes.length; i++) {
            if (this.arrNotes[i] >= 'a' && this.arrNotes[i] <= 'g') {
                noteClass = 'low';
            } else if (this.arrNotes[i] >= 'A' && this.arrNotes[i] <= 'G') {
                noteClass = 'high';
            } else if (this.arrNotes[i] >= 'h' && this.arrNotes[i] <= 'n') {
                noteClass = 'two-low';
            } else if (this.arrNotes[i] >= 'H' && this.arrNotes[i] <= 'N') {
                noteClass = 'two-high';
            } else if (this.arrNotes[i] >= 'o' && this.arrNotes[i] <= 'u') {
                noteClass = 'three-low';
            } else if (this.arrNotes[i] >= 'O' && this.arrNotes[i] <= 'U') {
                noteClass = 'three-high';
            } else {
                noteClass = '';
            }
            //noteClass = (this.arrNotes[i] >= 'a' && this.arrNotes[i] <= 'g') ? 'low' : ((this.arrNotes[i] >= 'A' && this.arrNotes[i] <= 'G') ? 'high' : '');
            li += '<li><span></span><i class="' + noteClass + '">' + (lowHighNote[this.arrNotes[i].toLowerCase()] || this.arrNotes[i]) + '</i></li>'
        }

        musicBtns.innerHTML = '<ul>' + li + '</ul>';

        // 鼠标点击发声
        this.musicBtn = musicBtns.querySelectorAll('li');
        for (let i = 0; i < this.arrNotes.length; i++) {
            this.musicBtn[i].addEventListener('mousedown', () => {
                this.pressBtn(i);
            })
        }

        // 鼠标起来时样式消失
        document.addEventListener('mouseup', () => {
            for (let i = 0; i < this.arrNotes.length; i++) {
                this.musicBtn[i].className = '';
            }
        });

        // 键盘按键控制
        if (this.opts.keyboard) {
            document.addEventListener('keydown', (e) => {
                let nodeName = document.activeElement.nodeName.toLowerCase();
                if (nodeName !== 'textarea') {  // 此时焦点不在textarea上
                    if (this.keyCodes.indexOf(e.keyCode) !== -1) {
                        this.pressBtn(this.keyCodes.indexOf(e.keyCode));
                    }
                }
            });
        }

    }

    // 按下钢琴键
    pressBtn(i) {

        this.musicBtn[i].className = 'cur';
        // console.log(this.arrFrequency[i]);
        this.createMusic(this.arrNotes[i]);
        // this.createSound(this.arrFrequency[i]);
        setTimeout(() => {
            this.musicBtn[i].className = '';
        }, 300);

    }

    // 播放乐谱
    playMusic(musicText) {

        let noteArr = musicText.split('');
        let delayTime = 1000 * 60;

        (async () => {
            try {
                let i = 0;
                while (!this.paused) {
                    if (i >= noteArr.length) {  // 停止或者循环
                        if (this.opts.loop) {
                            i = 0;
                        } else {
                            break;
                        }
                    }
                    let n = this.arrNotes.indexOf(noteArr[i]);  // 钢琴键位置
                    if (n !== -1) {  // 发出乐音
                        this.pressBtn(n);
                    } else {
                        switch (noteArr[i]) {
                            case '0':
                                break; // 休止符
                            case '-':
                                await sleep(delayTime / (2 * this.speed));
                                break; // 八分音符时值
                            case '=':
                                await sleep(delayTime / (4 * this.speed));
                                break; // 十六分音符时值
                            default:
                                await sleep(delayTime / this.speed);
                                break; // 四分音符时值
                        }
                    }
                    i++;
                }
            } catch (e) {
                location.reload();
            }
        })();

    }

    // 停止播放
    pauseMusic() {

        this.paused = true;

    }

    // 设置音乐类型
    setMusicType(type) {

        this.opts.type = type;

    }

    // 设置播放速度
    setPlaySpeed(speed) {

        this.speed = speed;

    }

}

// 延迟执行
function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

window.MusicBox = MusicBox;

export default MusicBox;

