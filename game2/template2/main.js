var FPS = 30;
//画面サイズ関係
var SCREEN_WIDTH = 640; //画面幅
var SCREEN_HEIGHT = 900;//画面高さ
var GAME_SCREEN_HEIGHT = 900;//ゲーム画面
var GAME_SCREEN_WIDTH = 640;//ゲーム画面

//ゲーム場面用予約語
var SCENE_TITLE = 1;
var SCENE_MAINGAME = 2;
//データはここへ
var ASSETS = {
    img_title:'img/title.png',
    img_player:'img/player.png',
    img_pause:'img/pausebutton.png',
    img_buttons:'img/buttons.png',
    img_gameover:'img/gameover.png',
    /*音は自分で探してね。良いのを見つけたらファイル名を変更してコメントを外してね
    se_start:'sound/aaa.mp3',
    se_ok:'sound/bbb.mp3',
    se_cancel:'sound/ccc.mp3',
    se_select:'sound/ddd.mp3',
    bgm_main:'sound/abc.mp3',
    bgm_gameover:'sound/def.mp3',
    */
};

//twitter
function twitter(text){//表示したい文章を引数に持ってくる
    var title = "title";
    var url = "http://aaaa.com";//ゲームのURLを入れる
    var hashtag = "ゲーム";//カンマ区切りで複数可能
    window.open("http://twitter.com/intent/tweet?text=【"+title+"】"+text+"&url=" + url+"&hashtags="+hashtag);	
}

//プログラム開始初期化処理--------------------------------------
enchant();
var core;//ゲーム基幹
var se_ok, se_cancel, se_select, bgm;//BGMとよく使う効果音はグローバル

window.onload = function(){
    core = new Game(SCREEN_WIDTH, SCREEN_HEIGHT);    
    core.preload(ASSETS);
    core.fps = FPS;
    core.onload = function(){
        system = new System();
        system.changeScene(SCENE_TITLE);
        /*
        //基本効果音・BGMの設定
        se_ok = new SoundEffect();
        se_ok.set(core.assets['se_ok'], 2);
        se_cancel = new SoundEffect();
        se_cancel.set(core.assets['se_cancel'], 2);
        se_select = new SoundEffect();
        se_select.set(core.assets['se_select'], 2);
        bgm = new Bgm();
        */
    }; 
    core.start();
} 

//システムクラス（ゲーム全体で必要な要素を保持する）---------------------------
var System = enchant.Class.create({
    initialize: function(){
        this.score = 0;//得点用
        this.rootScene;//ルートシーン参照用(シーン切り替えで必要になる)
    },
    //シーン切り替え
    changeScene: function(sceneNumber){
        switch(sceneNumber){
            case SCENE_TITLE:
                var title = new TitleScene();
                break;
            case SCENE_MAINGAME:
                var main = new MainGameScene();//メインゲームへ
                break;
        }
    },
});


//メインゲームシーン---------------------------------------------------------------
var MainGameScene = enchant.Class.create(enchant.Scene, {
    initialize: function(){
        enchant.Scene.call(this);
        //画面初期処理-----------------
        core.replaceScene(this);//シーンを入れ替える
        this.backgroundColor = 'rgba(0, 0, 0, 1)';//背景色 
        var screen = new Group();//ゲーム用スクリーン作成
        this.addChild(screen);
        system.rootScene = this;//シーンのアドレスを保存
        
        //自機クラス生成
        var player = new Sprite(64, 64);
        player.image = core.assets['img_player'];
        player.moveTo(300, 500);
        screen.addChild(player);

        //得点表示
        var label_score = new Label();
        label_score.color = 'white';
        label_score.font = '30px sans-serif';
        label_score.moveTo(250, 20);
        screen.addChild(label_score);
        
        //残り時間表示
        var timer = new TimeCountDown(0, 30);//分、秒で設定
        timer.moveTo(550, 20);
        screen.addChild(timer);
        
        var btn_pause = new Sprite(64, 64);
        btn_pause.image = core.assets['img_pause'];
        screen.addChild(btn_pause);
        btn_pause.addEventListener('touchend', function(){
            //se_ok.play();
            var pauseScene = new PuaseScene();
        });
        
        //自機の操作（このシーンへのタッチで操作）
        this.addEventListener('touchstart', function(e){
            player.px = e.x;
            player.py = e.y;
        });
        this.addEventListener('touchmove', function(e){
            player.x -= player.px - e.x;
            player.y -= player.py - e.y;
            player.px = e.x;
            player.py = e.y;
        });
                              
        //メインゲームシーンのループ処理------------------------------------
        this.addEventListener('enterframe', function(){
            //bgm.loop();//BGMループ再生
            if(timer.isTimeUp){//タイムアップ
                //bgm.stop();
                var gameover = new GameoverScene();//ゲームオーバーシーンへ
                removeChildren(this);//シーンの子要素を削除
                return;
            }
            label_score.text = ('00000000' + system.score).slice(-8);//得点表示
        });
    },
});
//ポーズ画面関数（これはpushSceneで画面に表示）------------------------------------------------
var PuaseScene = enchant.Class.create(enchant.Scene, {
    initialize: function(){
        enchant.Scene.call(this);
        //画面初期処理-----------------
        core.pushScene(this);//プッシュで上に出す
        var screen = new Group();//ゲーム用スクリーン作成
        this.addChild(screen);
        
        this.backgroundColor = 'rgba(0, 0, 0, 0.5)';//背景色 (少し暗くする)
        
        //再開
        var btn_resume = new Sprite(200, 100);
        btn_resume.image = core.assets['img_buttons'];
        btn_resume.moveTo(80, 200);
        btn_resume.frame = 0;
        screen.addChild(btn_resume);
        btn_resume.addEventListener('touchend', function(){
            //se_cancel.play();
            removeChildren(this);//子要素を削除
            core.popScene();
        });
        //タイトルへ戻る
        var btn_title = new Sprite(200, 100);
        btn_title.image = core.assets['img_buttons'];
        btn_title.frame = 1;
        btn_title.moveTo(350, 200);
        screen.addChild(btn_title);
        btn_title.addEventListener('touchend', function(){
            //se_ok.play();
            fade_out.start(screen);
        });
        var fade_out = new FadeOut(GAME_SCREEN_WIDTH, GAME_SCREEN_HEIGHT, "black");
        //ポーズ画面シーンのループ処理-----------------------------------------
        this.addEventListener('enterframe', function(){
            if(fade_out.do(0.05)){//trueが帰ってきたらフェードアウト後の処理へ
                //bgm.stop();
                removeChildren(this);//子要素を削除
                removeChildren(system.rootScene);//ルートシーンの子要素を削除
                system.changeScene(SCENE_TITLE);//シーンの切り替え
            }
        });
    }
}); 
//タイトル画面シーン-------------------------------------------------------------
var TitleScene = enchant.Class.create(enchant.Scene, {
    initialize: function(){
        enchant.Scene.call(this);//シーンクラス呼び出し
        //画面初期処理-----------------
        core.replaceScene(this);//シーンを入れ替える
        this.backgroundColor = 'rgba(0, 0, 0, 1)';//背景色 
        var screen = new Group();//ゲーム用スクリーン作成
        this.addChild(screen);
        //基本効果音
        //var se_start = new SoundEffect();
        //se_start.set(core.assets['se_start'], 1);
        //タイトルロゴ画像表示
        var logo_title = new Sprite(640, 300);
        logo_title.image = core.assets['img_title'];
        logo_title.moveTo(0, 100);
        screen.addChild(logo_title);
        
        //touch to start表示
        var label = new Label();   
        label.text = "TOUCH TO START";
        label.color = 'white';
        label.font = '40px sans-serif';
        label.x = 140; 
        label.y = 600; 
        label.width = GAME_SCREEN_WIDTH;
        screen.addChild(label);

        var isStartPushed = false;//スタートボタンチェックフラグ
        //画面タッチでスタート
        this.addEventListener('touchend', function(){
            if(isStartPushed == false){
                isStartPushed = true;//押したよフラグ
                //se_start.play();//効果音
                this.from = this.age;
            }
        });
        //フェードアウト用オブジェクト
        var fade_out = new FadeOut(GAME_SCREEN_WIDTH, GAME_SCREEN_HEIGHT, "black");
        
        //タイトル画面シーンのループ--------------------------------------------------
        this.addEventListener('enterframe', function(){
            if(isStartPushed == true){//スタートボタンが押された
                if(label.visible == true){//スタートボタン点滅処理
                    label.visible = false;
                }else{
                    label.visible = true;
                }
                if(this.age - this.from > 20){//20フレーム後にフェードアウト
                    fade_out.start(screen);
                }
            }
            if(fade_out.do(0.1)){//trueが帰ってきたらフェードアウト後の処理へ
                removeChildren(this);//子要素を削除
                system.changeScene(SCENE_MAINGAME);//シーンの切り替え
            }
        });
    },
});
//ゲームオーバーシーン（ツイッターや得点の表示）-------------------------------------------------------------
var GameoverScene = enchant.Class.create(enchant.Scene, {
    initialize: function(){
        enchant.Scene.call(this);//シーンクラス呼び出し
        //画面初期処理-----------------
        core.pushScene(this);//シーンを入れ替える
        this.backgroundColor = 'rgba(0, 0, 0, 0.3)';//背景色 
        var screen = new Group();//ゲーム用スクリーン作成
        this.addChild(screen);
        //効果音・BGM-----------------
        var se_gameover = core.assets['bgm_gameover'];
        //se_gameover.play();
        
        //ここからシーンの要素作成追加---------------------
        //ゲームオーバー
        var logo_gameover = new Sprite(500, 200);
        logo_gameover.image = core.assets['img_gameover'];
        logo_gameover.moveTo(60, 150);
        screen.addChild(logo_gameover);
    
        //得点表示
        var label = new Label();   
        label.text = "score : " + ('00000000' + system.score).slice(-8);//8ケタの0詰め表示
        label.color = 'white';
        label.font = '50px sans-serif';
        label.x = 100; 
        label.y = 400; 
        label.width = GAME_SCREEN_WIDTH;
        screen.addChild(label);
    
        //ツイートボタン
        var btn_tweet = new Sprite(200, 100);
        btn_tweet.image = core.assets['img_buttons'];
        btn_tweet.moveTo(80, 600);
        btn_tweet.frame = 2;
        btn_tweet.addEventListener('touchend', function() {
            //se_ok.play();//効果音
            twitter("ここに文章をいれてね");
        });
        //終了ボタン
        var btn_end = new Sprite(200, 100);
        btn_end.image = core.assets['img_buttons'];
        btn_end.frame = 3;
        btn_end.moveTo(350, 600);
        btn_end.addEventListener('touchend', function() {
            //se_ok.play();//効果音
            fade_out.start(screen);
        });
        
        var fade_out = new FadeOut(GAME_SCREEN_WIDTH, GAME_SCREEN_HEIGHT, "black");
    
        this.from = this.age;//経過フレーム計測用
        var isCreateBtn = false;//ボタンを追加したか
        //ゲームオーバーシーンのループ処理------------------------------
        this.addEventListener('enterframe', function(){
            if(this.age - this.from < 40){//一定時間待つ
                return;
            }
            //ボタンを表示させる
            if(isCreateBtn == false){//まだ表示してないよ
                screen.addChild(btn_tweet);  
                screen.addChild(btn_end);
                isCreateBtn = true;
            }
            if(fade_out.do(0.05)){//trueが帰ってきたらフェードアウト後の処理へ
                removeChildren(this);//このシーンの要素を削除
                removeChildren(system.rootScene);//ルートシーンの子要素を削除
                system.changeScene(SCENE_TITLE);//シーン切り替え
            }
        });
    }
});

