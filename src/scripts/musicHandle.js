import ajax from './ajax.js';
import MusicBox from './musicBox.js';

// TODO: 替换过时方法keyCode为网页内按钮

export default class musicHandle {

    constructor() {
		let version = "1.3.5";
		document.getElementById('ver').innerHTML = version;

        // 乐谱数据
        this.initMusicText = [];

        this.oTitle = document.querySelector('.title');

        // 音乐类型
        this.aMusicType = document.querySelectorAll('.type input');
        this.oMusicType = document.querySelector('.type input:checked');

        this.musicTextBox = document.getElementById('music-text');
        this.chordTextBox = document.getElementById('chord-text');
        this.oMusicName = document.querySelector('.music-name');
        this.oSpeed = document.getElementById('speed');
        this.oLoop = document.getElementById('loop');
        this.oSpeedSubBtn = document.getElementById('bpm-sub');
        this.oSpeedAddBtn = document.getElementById('bpm-add');
        this.oSpeedValue = document.getElementById('speed-value');
        this.musicPlayBtn = document.getElementById('music-play');
        this.musicStopBtn = document.getElementById('music-stop');
        this.musicClearBtn = document.getElementById('music-clear');

        this.musicTypes = ['sine', 'square', 'triangle', 'sawtooth'];
        this.curType = Number(this.oMusicType.value); // 当前音色类型
        this.musicType = this.musicTypes[this.curType];  // 音色类型
        this.music = this.playMusic();  // music对象
        this.paused = true;  // 是否停止播放
        this.curMusic = -1; // 当前音乐
        this.speed = Number(this.oSpeed.value);  // 播放速度
        this.loop = this.oLoop.checked;  // 循环播放

        this.init();

    }

    // 初始化
    init() {

        // 背景图片
        let oBg = document.querySelector('.bg');
        oBg.src = require(`../images/bg_${Math.ceil(Math.random() * 4)}.jpg`);

        // 乐谱编写说明
        this.help();

        // 获取音乐列表
        this.showMusicList();

        // 设置音乐类型
        for (let i = 0; i < this.aMusicType.length; i++) {
            this.aMusicType[i].addEventListener('change', (e) => {
                // noinspection JSUnresolvedVariable
                if (e.target.checked) {
                    this.setMusicType(e.target.value);
                }
            });
        }

        // 播放乐谱
        this.musicPlayBtn.addEventListener('click', () => {
            let musicText = this.musicTextBox.value;  // 获取乐谱
            let chordText = this.chordTextBox.value;  // 获取和弦
            if (musicText) {
                this.music.pauseMusic();
                this.music = this.playMusic(musicText);

                // let musicName = prompt('请输入曲名') || '';
                // if(musicName.trim() !== ''){
                // this.saveMusicText(musicName.trim(), encodeURIComponent(text));
                // this.oTitle.innerHTML = musicName;
                // }
                if (chordText) {
                    if (this.chord) {
                        this.chord.pauseMusic();
                    }
                    if (chordText) {
                        this.chord = new MusicBox('.chord', {
                            loop: this.loop, // 循环播放
                            musicText: decodeURIComponent(chordText),  // 乐谱
                            autoplay: this.oSpeed.value, // 自动弹奏速度
                            duration: 3,  // 键音延长时间
                            volume: .2    // 音量
                        });
                    }
                }
            } else {
                alert('请输入乐谱！');
            }
        });
		
		// 清空曲目并暂停播放
		this.musicStopBtn.addEventListener('click', () => {
			if (this.curMusic !== -1) this.aMusicName[this.curMusic].classList.remove('cur');
            this.curMusic = -1;
			this.pauseMusic();
			this.paused = true;
        });
		
		// 清空乐谱和曲目并暂停播放
		this.musicClearBtn.addEventListener('click', () => {
			if (confirm("确定清空？")) {
				if (this.curMusic !== -1) this.aMusicName[this.curMusic].classList.remove('cur');
				this.curMusic = -1;
				this.musicTextBox.value = "";
				this.chordTextBox.value = "";
				this.pauseMusic();
				this.paused = true;
			}
        });

        // 设置播放速度
        this.setMusicSpeed(this.oSpeed.value);
        this.oSpeed.addEventListener('input', () => {
            this.setMusicSpeed(this.oSpeed.value);
        });
        this.oSpeedValue.addEventListener('input', () => {
            this.setMusicSpeed(this.oSpeedValue.value);
        });
		
		// 循环播放
        this.oLoop.addEventListener('change', () => {
            this.loop = this.oLoop.checked;
			if (this.music) {
				this.music.changeLoop(this.loop);
			}
			if (this.chord) {
				this.chord.changeLoop(this.loop);
			}
        });
		
		// 减慢播放速度
		this.oSpeedSubBtn.addEventListener('click', () => {
            this.speed = Number(this.oSpeed.value);
			if (this.speed > Number(this.oSpeed.min)) {
				this.speed -= Number(this.oSpeed.step);
			}
            this.setMusicSpeed(this.speed);
        });
		
		// 加快播放速度
		this.oSpeedAddBtn.addEventListener('click', () => {
            this.speed = Number(this.oSpeed.value);
			if (this.speed < Number(this.oSpeed.max)) {
				this.speed += Number(this.oSpeed.step);
			}
            this.setMusicSpeed(this.speed);
        });
    }
	
    // 乐谱编写说明
    help() {
        document.querySelector('.help .icon').addEventListener('click', () => {
            document.querySelector('.popup').classList.add('show');
        });
        document.querySelector('.help .close').addEventListener('click', () => {
            document.querySelector('.popup').classList.remove('show');
        });
    }

    // 设置音色类型
    setMusicType(typeId) {
        this.aMusicType[typeId].checked = true;
        this.musicType = this.musicTypes[typeId];
        this.music.setMusicType(this.musicType);
    }

    // 获取乐谱列表
    showMusicList() {

        let btns = '';

        ajax({
            url: require(`../res/musicList.json`),
            dataType: 'json',
            success: (res) => {
                if (res.code === 200) {
                    this.initMusicText = res.data.list;
                    this.initMusicText.forEach(item => {
                        btns += `<div class="btn"><span>${item.name}</span></div>`;
                    });

                    this.oMusicName.innerHTML = btns;

                    // 点播乐曲
                    this.aMusicName = document.querySelectorAll('.music-name .btn');
                    for (let i = 0; i < this.aMusicName.length; i++) {
                        this.aMusicName[i].addEventListener('click', () => {
                            this.curMusic = i;
                            this.chooseMusic(i);
                        });
                    }
                } else {
                    alert("获取乐谱失败：" + res.msg);
                }
            }
        });

    }

    // 播放乐曲
    playMusic(musicText) {
        let autoplay = musicText ? Number(this.oSpeed.value) : false;
        return new MusicBox('.music-box', {
            loop: this.loop, // 循环播放
            musicText: decodeURIComponent(musicText),  // 乐谱
            autoplay: autoplay, // 自动弹奏速度
            type: this.musicType,  // 音色类型  sine|square|triangle|sawtooth
            duration: 3,  // 键音延长时间
            mixing: true
        });
    }

    // 设置播放速度
    setMusicSpeed(speed) {
		this.speed = speed;
        this.oSpeed.value = speed;
        this.oSpeedValue.value = speed;
        this.oSpeed.style.backgroundSize = speed / 3 + '% 100%';
        this.music.setPlaySpeed(speed);
        if (this.chord) {
            this.chord.setPlaySpeed(speed);
        }
    }

    // 点播乐曲
    chooseMusic(i) {
        // noinspection JSUnresolvedVariable
        let melodyText = this.initMusicText[i].melody;
        let chordText = this.initMusicText[i].chord;
        let bpm = this.initMusicText[i].bpm;
        for (let i = 0; i < this.aMusicName.length; i++) {
            this.aMusicName[i].classList.remove('cur');
        }
        this.aMusicName[i].classList.add('cur');
		this.setMusicSpeed(bpm);
        this.paused = false;
        this.musicTextBox.value = decodeURIComponent(melodyText);
        this.chordTextBox.value = decodeURIComponent(chordText);
        this.music.pauseMusic();
        this.music = this.playMusic(melodyText);
        // 和弦
        if (this.chord) {
            this.chord.pauseMusic();
        }
        if (chordText) {
            this.chord = new MusicBox('.chord', {
                loop: this.loop, // 循环播放
                musicText: decodeURIComponent(chordText),  // 乐谱
                autoplay: this.oSpeed.value, // 自动弹奏速度
                duration: 3,  // 键音延长时间
                volume: .2    // 音量
            });
        }
        // this.oTitle.innerHTML = this.initMusicText[i].name;
        // document.title = this.oTitle.innerHTML;
    }

    // 停止点播
    pauseMusic() {
        this.music.pauseMusic();
        // 和弦
        if (this.chord) {
            this.chord.pauseMusic();
        }
    }

}