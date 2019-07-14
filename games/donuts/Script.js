enchant();

enchant.Sound.enabledInMobileSafari = true;					//🔵効果未検証

window.onload=function() {
	var game = new Game(400,500);  				//✅画面サイズを400*500にする。（このサイズだとスマホでも快適なのでおススメ）
	
	//結果ツイート時にURLを貼るため、このゲームのURLをここに記入
	var url="https://kinaphar.github.io/games/donuts/index.html";
	url= encodeURI(url); //✅きちんとURLがツイート画面に反映されるようにエンコードする
	/////////////////////////////////////////////////
	//✅ゲーム開始前に必要な画像・音を読み込む部分
	
	
	//❗正解音読み込み
	var M_Good ="good.mp3";						//✅game.htmlからの相対パス
		game.preload([M_Good]); 				//✅データを読み込んでおく

	//❗不正解音読み込み
	var M_Bad ="bad.mp3";						//✅game.htmlからの相対パス
		game.preload([M_Bad]); 				//✅データを読み込んでおく

	//❗クリア音読み込み
	var M_Clear ="clear.mp3";						//✅game.htmlからの相対パス
	game.preload([M_Clear]); 				//✅データを読み込んでおく
		
	//❗タイムアップ音読み込み
	var M_TimeUp ="whistle.mp3";						//✅game.htmlからの相対パス
	game.preload([M_TimeUp]); 				//✅データを読み込んでおく

	//❗ツイート音読み込み
	var M_Tweet ="piyo.mp3";						//✅game.htmlからの相対パス
	game.preload([M_Tweet]); 				//✅データを読み込んでおく

	//❗リトライ音読み込み
	var M_Retry ="retry.mp3";						//✅game.htmlからの相対パス
	game.preload([M_Retry]); 				//✅データを読み込んでおく

	//❗BGM読み込み
	var M_BGM ="chahan_minus5db.mp3";						//✅game.htmlからの相対パス
	game.preload([M_BGM]); 				//✅データを読み込んでおく

	//✅リトライボタン
	var B_Retry="image/Retry_new.png";						//✅game.htmlからの相対パス
		game.preload([B_Retry]);					//✅データを読み込んでおく

	//✅ツイートボタン
	var B_Tweet="image/Tweet_new.png";						//✅game.htmlからの相対パス
		game.preload([B_Tweet]);					//✅データを読み込んでおく		


		
	var quizes = 20;		//❗クイズの問題数
	var Answer = new Array(1,0,1,1,0,  0,1,0,0,1,  0,0,0,0,1,  1,0,0,1,0);		// ❗正解
	var CorrectAnswer = new Array(
		"箱入りドーナツ<br>(ドーナツだよ)", "救命うきわ<br>(ドーナツじゃないよ)", "ドーナツ(チョコ＆ピンク)<br>(ドーナツだよ)", "フレンチクルーラー<br>(ドーナツだよ)", "レコードディスク<br>(ドーナツじゃないよ)",
		"オニオンリング<br>(ドーナツじゃないよ)", "焼きドーナツ<br>(ドーナツだよ)", "光学ディスク<br>(ドーナツじゃないよ)", "ブラックホール<br>(ドーナツじゃないよ)", "オールドファッション<br>(ドーナツだよ)",
		"シュシュ<br>(ドーナツじゃないよ)", "円グラフ<br>(ドーナツじゃないよ)", "土星<br>(ドーナツじゃないよ)", "花のレイ<br>(ドーナツじゃないよ)", "チュロス<br>(ドーナツだよ)", 
		"あんドーナツ<br>(ドーナツだよ)", "ブレスレット<br>(ドーナツじゃないよ)", "皿<br>(ドーナツじゃないよ)", "グラブジャムン<br>(インドのドーナツだよ)", "円座クッション<br>(ドーナツじゃないよ)"
	);


	// ❗読み込み素材追加
	var P_Salad = new Array();					//❗サラダ群
	var j;
	for ( j = 0 ; j < quizes ; j++ ){
		P_Salad[ j ] = eval("'image/salad" + j + ".png'");
		game.preload([P_Salad[j]]);
	};

	var P_Salad0 = "image/salad0.png";			//❗サラダ
		game.preload([P_Salad0]);

	var P_Maru = "image/maru_new.png";					//❗○ボタン
		game.preload([P_Maru]);

	var P_Batsu = "image/batsu_new.png";					//❗×ボタン
		game.preload([P_Batsu]);

	//✅読み込み終わり
	/////////////////////////////////////////////////
	
	game.onload = function() {					//✅ロードが終わった後にこの関数が呼び出されるので、この関数内にゲームのプログラムを書こう

		/////////////////////////////////////////////////
		//✅グローバル変数 
		
		var Correct=0;									//✅コイン枚数
		var State=0;								//✅現在のゲーム状態
		var LIMIT_TIME=30;

		// ❗グローバル変数追加

		//✅グローバル変数終わり
		/////////////////////////////////////////////////
		
		var S_MAIN = new Scene();					//✅シーン作成
		game.pushScene(S_MAIN);  					//✅S_MAINシーンオブジェクトを画面に設置
		S_MAIN.backgroundColor = "linen"; 			//✅S_MAINシーンの背景は黒くした


		//❗制限時間
		var time_label = new Label();
		time_label.font = "20px Meiryo";				//❗フォントはメイリオ 20px 変えたかったらググってくれ
		time_label.color = 'rgba(64,26,0,1)';		//❗色　RGB+透明度　今回は白
		time_label.moveTo(240, 20);	
		time_label.addEventListener(enchant.Event.ENTER_FRAME, function(){
			time = (LIMIT_TIME - parseInt(game.frame*100/game.fps)/100).toFixed(2);
			this.text = "残り" + time + "秒";
			// タイムが0以下になったらゲームオーバーシーンに移行する
			if (time <= 0) {
				
				game.assets[M_TimeUp].clone().play();
				game.popScene();					//✅S_MAINシーンを外す
				game.pushScene(S_END);				//✅S_ENDシーンを読み込ませる
				
				//ゲームオーバー後のテキスト表示
				S_GameOverText.text="GAMEOVER 記録："+Correct+"問正解";				//✅テキストに文字表示 
				S_AnswerText.text = "これ" + CorrectAnswer[State];				//❗正しい答えを表示 }
				S_GameOverTime.text = "残り" + time + "秒";
			};
		});
		S_MAIN.addChild(time_label);


		//❗問題文表示テキスト
		var Q_Text=new Label(); 
		Q_Text.font = "24px Meiryo";				//❗フォントはメイリオ 20px 変えたかったらググってくれ
		Q_Text.color = 'rgba(64,26,0,1)';		//❗色　RGB+透明度　今回は白
		Q_Text.width=400;							//❗横幅指定　今回画面サイズ400pxなので、width:400pxだと折り返して二行目表示してくれる
		Q_Text.moveTo(120,330);						//❗移動位置指定
		S_MAIN.addChild(Q_Text);					//❗S_MAINシーンにこのテキストを埋め込む
		Q_Text.text="これドーナツ？";


		//❗サラダ群
		var Salad = new Array();
		var i;
		for ( i = 0 ; i < quizes ; i++ ){
			Salad[ i ] = new Sprite(400, 350);
			Salad[ i ].image = eval("game.assets[P_Salad[" + i + "]]");
			Salad[ i ].scaleX *= 0.8;
			Salad[ i ].scaleY *= 0.8;
			Salad[ i ].moveTo(0, 10)
		};

		//❗サラダ
		S_MAIN.addChild(Salad[0]);


		//❗○ボタン
		var Maru = new Sprite(120, 120);
		Maru.moveTo(240, 370);
		Maru.image = game.assets[P_Maru];
		S_MAIN.addChild(Maru);

		//❗❗❗❗❗○ボタン押したときの挙動❗❗❗❗❗
		Maru.ontouchstart=function(){
			Maru.moveTo(240, 375);
		};

		Maru.ontouchend=function(){		//📝✅S_Coinボタンをタッチした（タッチして離した）時にこの中の内容を実行する
			Maru.moveTo(240, 370);
			if(Answer[State] === 1){				//❗正解なら
				Correct++;								//❗正解数を1増やす
				game.assets[M_Good].clone().play();		//❗正解の音を鳴らす。
				if(State === quizes - 1){				// 🔵最終問題正解
					game.assets[M_Clear].clone().play();		//❗クリアの音を鳴らす。
					game.popScene();					//✅S_MAINシーンを外す
					S_END.backgroundColor="orange"
					game.pushScene(S_END);				//✅S_ENDシーンを読み込ませる
					S_GameOverText.text="CLEAR!!! 記録："+Correct+"問正解";				//✅テキストに文字表示 
					S_AnswerText.text = "これ" + CorrectAnswer[State];				//❗正しい答えを表示 
					S_GameOverTime.text = "残り" + time + "秒";
				};
			};

			if(Answer[State] === 0){
				game.assets[M_Bad].clone().play();		//❗不正解の音を鳴らす。
				game.popScene();					//✅S_MAINシーンを外す
				game.pushScene(S_END);				//✅S_ENDシーンを読み込ませる
				
				//ゲームオーバー後のテキスト表示
				S_GameOverText.text="GAMEOVER 記録："+Correct+"問正解";				//✅テキストに文字表示 
				S_AnswerText.text = "これ" + CorrectAnswer[State];				//❗正しい答えを表示 
				S_GameOverTime.text = "残り" + time + "秒";
			};
			
			S_MAIN.removeChild(Salad[State]);
			State = (State+1)%quizes;
			S_MAIN.addChild(Salad[State]);
		};


		//❗×ボタン
		var Batsu = new Sprite(120, 120)
		Batsu.moveTo(40, 370);
		Batsu.image = game.assets[P_Batsu];
		S_MAIN.addChild(Batsu);


		//❗❗❗❗❗×ボタン押したときの挙動❗❗❗❗❗
		Batsu.ontouchstart=function(){
			Batsu.moveTo(40, 375);
		};

		Batsu.ontouchend=function(){		//📝✅S_Coinボタンをタッチした（タッチして離した）時にこの中の内容を実行する
			Batsu.moveTo(40, 370);
			if(Answer[State] === 0){				//🔵正解の場合
				Correct++;								//❗正解数を1増やす
				game.assets[M_Good].clone().play();		//❗正解の音を鳴らす。
				if(State === quizes - 1){				// 🔵最終問題正解
					game.assets[M_Clear].clone().play();		//❗クリアの音を鳴らす。
					game.popScene();					//✅S_MAINシーンを外す
					S_END.backgroundColor="orange"
					game.pushScene(S_END);				//✅S_ENDシーンを読み込ませる
					S_GameOverText.text="CLEAR!!! 記録："+Correct+"問正解";				//✅テキストに文字表示 
					S_AnswerText.text = "これ" + CorrectAnswer[State];				//❗正しい答えを表示 
					S_GameOverTime.text = "残り" + time + "秒";
				};
			};

			
			if(Answer[State] === 1){			//🔵不正解の場合
				game.assets[M_Bad].clone().play();		//❗不正解の音を鳴らす。
				
				game.popScene();					//✅S_MAINシーンを外す
				game.pushScene(S_END);				//✅S_ENDシーンを読み込ませる
				
				//ゲームオーバー後のテキスト表示
				S_GameOverText.text="GAMEOVER 記録："+Correct+"問正解";				//✅テキストに文字表示 
				S_AnswerText.text = "これ" + CorrectAnswer[State];				//❗正しい答えを表示 
				S_GameOverTime.text = "残り" + time + "秒";
			};

			S_MAIN.removeChild(Salad[State]);
			State = (State+1)%quizes;
			S_MAIN.addChild(Salad[State]);
		};
		


		//❗コイン枚数表示テキスト
		var S_Text=new Label(); 					//✅テキストはLabelクラス
		S_Text.font = "20px Meiryo";				//✅フォントはメイリオ 20px 変えたかったらググってくれ
		S_Text.color = 'rgba(64,26,0,1)';		//✅色　RGB+透明度　今回は白
		S_Text.width=400;							//✅横幅指定　今回画面サイズ400pxなので、width:400pxだと折り返して二行目表示してくれる
		S_Text.moveTo(40,20);						//✅移動位置指定
		S_MAIN.addChild(S_Text);					//✅S_MAINシーンにこのテキストを埋め込む
		S_Text.text="正解数："+Correct;					//✅テキストに文字表示 Coinは変数なので、ここの数字が増える
		

		// BGM用クラス
		var Bgm = enchant.Class.create({
				initialize: function(){
						this.data = null;
						this.isPlay = false;//プレイの状態フラグ
						this.isPuase = false;
				},
				//BGM用音楽ファイルのセット
				set: function(data){
						this.data = data;
				},
				//再生(再生のみに使う)
				play: function(){
						this.data.play();
						this.isPlay = true;
						if(this.data.src != undefined){//srcプロパティを持っている場合
								this.data.src.loop = true;
						}
				},
				//ループ再生(必ずループ内に記述すること) PCでのループ再生で使う
				loop: function(){
						if(this.isPlay == true && this.data.src == undefined){//再生中でsrcプロパティを持っていない場合
								this.data.play();
								this.isPuase = false;//ポーズ画面から戻った場合は自動的に再生を再開させるため
						}else if(this.isPuase){//srcあり場合でポーズ画面から戻ったとき用
								this.data.play();
								this.data.src.loop = true;//ポーズするとfalseになるっぽい(確認はしていない)
								this.isPuase = false;
						}
				},
				//再生停止(曲を入れ替える前は,必ずstop()させる)
				stop: function(){
						if(this.data != null){
								if(this.isPuase){
										this.isPlay = false;
										this.isPuase = false;
										this.data.currentTime = 0;
								}else if(this.isPlay){
										this.data.stop();
										this.isPlay = false;
								}
						}
				},
				//一時停止（ポーズ画面などの一時的な画面の切り替え時に音を止めたいときのみ使う）
				pause: function(){
						if(this.data != null){
								this.data.pause();
								this.isPuase = true;
						}
				}
		});	
		
		var game_bgm = new Bgm();
		game_bgm.set(game.assets[M_BGM]);
		game_bgm.play();

		///////////////////////////////////////////////////
		//📝✅メインループ　ここに主要な処理をまとめて書こう
		game.onenterframe=function(){
			if (State === 0){
				S_MAIN.addChild(Salad[State]);
			}
			game_bgm.loop();

			//✅現在のテキスト表示
			S_Text.text="正解数："+Correct; 				//Coin変数が変化するので、毎フレームごとにCoinの値を読み込んだ文章を表示する
		};
		
		
		
		////////////////////////////////////////////////////////////////
		//✅結果画面
		 S_END=new Scene();
		 S_END.backgroundColor="navy";				//🔵青く染める

		//✅GAMEOVER
		var S_GameOverText=new Label(); 					//✅テキストはLabelクラス
		S_GameOverText.font = "20px Meiryo";				//✅フォントはメイリオ 20px 変えたかったらググってくれ
		S_GameOverText.color = 'rgba(255,255,255,1)';		//✅色　RGB+透明度　今回は白
		S_GameOverText.width=400;							//✅横幅指定　今回画面サイズ400pxなので、width:400pxだと折り返して二行目表示してくれる
		S_GameOverText.moveTo(0,30);						//✅移動位置指定
		S_END.addChild(S_GameOverText);						//✅S_ENDシーンにこの画像を埋め込む

		var S_GameOverTime = new Label();
		S_GameOverTime.font = "20px Meiryo";				//✅フォントはメイリオ 20px 変えたかったらググってくれ
		S_GameOverTime.color = 'rgba(255,255,255,1)';		//✅色　RGB+透明度　今回は白
		S_GameOverTime.width=400;							//✅横幅指定　今回画面サイズ400pxなので、width:400pxだと折り返して二行目表示してくれる
		S_GameOverTime.moveTo(280, 30);
		S_END.addChild(S_GameOverTime);

		//❗これ○○だ
		var S_AnswerText=new Label(); 					//✅テキストはLabelクラス
		S_AnswerText.font = "30px Meiryo";				//✅フォントはメイリオ 20px 変えたかったらググってくれ
		S_AnswerText.color = 'rgba(255,255,255,1)';		//✅色　RGB+透明度　今回は白
		S_AnswerText.width=300;							//✅横幅指定　今回画面サイズ400pxなので、width:400pxだと折り返して二行目表示してくれる
		S_AnswerText.moveTo(50,100);						//✅移動位置指定
		S_END.addChild(S_AnswerText);						//✅S_ENDシーンにこの画像を埋め込む

		//✅リトライボタン
		var S_Retry=new Sprite(360,200);				//✅画像サイズをここに書く。使う予定の画像サイズはプロパティで見ておくこと
		S_Retry.moveTo(20,300);						//✅コインボタンの位置
		S_Retry.image = game.assets[B_Retry];			//✅読み込む画像の相対パスを指定。　事前にgame.preloadしてないと呼び出せない
		S_END.addChild(S_Retry);					//✅S_MAINにこのコイン画像を貼り付ける  

		S_Retry.ontouchstart=function(){
			S_Retry.moveTo(20,305);
		};

		S_Retry.ontouchend=function(){				//✅S_Retryボタンをタッチした（タッチして離した）時にこの中の内容を実行する
			S_Retry.moveTo(20,300);
			game.assets[M_Retry].clone().play();
			S_MAIN.removeChild(Salad[State]);	  //❗サラダ消しとく
			State=0;
			Correct=0;
			game.frame = 0;
			game.popScene();						//✅S_ENDシーンを外す
			S_END.backgroundColor="navy";				//🔵青く染め直す
			game.pushScene(S_MAIN);					//✅S_MAINシーンを入れる
		};		

		//✅ツイートボタン
		var S_Tweet=new Sprite(360,100);				//✅画像サイズをここに書く。使う予定の画像サイズはプロパティで見ておくこと
		S_Tweet.moveTo(20,220);						//✅コインボタンの位置
		S_Tweet.image = game.assets[B_Tweet];			//✅読み込む画像の相対パスを指定。　事前にgame.preloadしてないと呼び出せない
		S_END.addChild(S_Tweet);					//✅S_MAINにこのコイン画像を貼り付ける
		S_Tweet.ontouchstart=function(){
			S_Tweet.moveTo(20,225);
		};
		S_Tweet.ontouchend=function(){				//✅S_Tweetボタンをタッチした（タッチして離した）時にこの中の内容を実行する
			//✅ツイートＡＰＩに送信
			S_Tweet.moveTo(20,220);
			game.assets[M_Tweet].clone().play();
			window.open("http://twitter.com/intent/tweet?text=「これドーナツ？ 〜画像認証トレーニング〜」 に"+Correct+"問正解した！" + S_GameOverTime.text + "&hashtags=ahoge,これドーナツ&url="+url); //ハッシュタグにahogeタグ付くようにした。
		};

	};
	game.start();
};
