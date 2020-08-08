# MusicBox
一个音乐盒插件，可以通过输入乐谱来自动播放对应的曲子，同时可以配置其音色和播放速度等。

### 插件所在具体路径： 
```
/src/scripts/musicBox.js
```

### 参数默认配置：
```
{
    loop: false, // 循环播放
    musicText: '',  // 乐谱
    autoplay: 60, // 自动弹奏速度
    type: 'sine',  // 音色类型  sine|square|triangle|sawtooth
    duration: 2,  // 键音延长时间
    volume: 1,     // 音量
    mixing: false,  // 混合立体音
    keyboard: true  // 键盘控制
}
```

### 如何编写乐谱？
>1. 音下三个点由低到高分别依次对应小写字母（o,p,q,r,s,t,u）
>2. 音下二个点由低到高分别依次对应小写字母（h,i,j,k,l,m,n）
>3. 低音由低到高分别依次对应小写字母（a,b,c,d,e,f,g）
>4. 中音由低到高分别依次对应数字（1,2,3,4,5,6,7）
>5. 高音由低到高分别依次对应大写字母（A,B,C,D,E,F,G）
>6. 音上二个点由低到高分别依次对应大写字母（H,I,J,K,L,M,N）
>7. 音上三个点由低到高分别依次对应大写字母（O,P,Q,R,S,T,U）
>8. 空格代表四分音符时值，符号"-"代表八分音符时值，符号"="代表十六分音符时值
>9. 音符紧挨一起则代表同时发声


### Thanks
[chchlsh/MusicBox](https://github.com/chchlsh/MusicBox)
