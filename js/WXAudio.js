(function() {
	$.fn.weixinAudio = function(options) {
		var $this = $(this),
		    isTouch = 'ontouchstart' in window,
	        eStart = isTouch ? 'touchstart' : 'mousedown',
	        eMove = isTouch ? 'touchmove' : 'mousemove',
	        eEnd = isTouch ? 'touchend' : 'mouseup',
	        eCancel = isTouch ? 'touchcancel' : 'mouseup',
		    defaultoptions = {
			autoplay: false,
			operate: false
		};
		function Plugin($context) {
			//dom
			this.$context = $context;
            
            this.strip = $context.data('strip'); //测试数据 每条描述
            this.curStrip = 0;
			this.$Audio = $context.find('audio');
			this.Audio = this.$Audio[0];
			this.$audio_play = $context.find('.play');
			// this.$audio_length = $context.find('#audio_length');
			// this.$audio_progress = $context.find('#audio_progress');
			this.$audio_progress = $context.find('.progress');
			this.$audio_progress_bar = $context.find('.progress-bar');
			this.$audio_progress_wrap = $context.find('.progress-wrap');
			this.$audio_speed = $context.find('.sd-menu a');
			this.$prev = $context.find('.prev-strip');
			this.$next = $context.find('.next-strip');
			this.$audio_toggle = $context.find('.sd-toggle');
			//属性
			this.currentState = 'pause';
			this.time = null;
			this.settings = $.extend(true, defaultoptions, options);
			//执行初始化
			this.init();
		}
		Plugin.prototype = {
			init: function() {
				var self = this;
				// self.updateTotalTime();
				self.times = self.handleStrip2(self.strip);
				console.log(self.times);
				self.events();

				// 设置自动播放
				if(self.settings.autoplay){
					self.play();
				}
			},
			play: function() {
				var self = this;
				if (self.currentState === "play" && !self.operate) {
					self.pause();
					self.$context.addClass('paused');
					return;
				}
				self.Audio.play();
				self.$context.removeClass('paused');
				clearInterval(self.timer);
				self.timer = setInterval(self.run.bind(self), 50);
				self.currentState = "play";
				// self.$audio_area.addClass('playing');
			},
			pause: function() {
				var self = this;
				self.Audio.pause();
				self.currentState = "pause";
				clearInterval(self.timer);
				// self.$audio_area.removeClass('playing');
			},
			stop:function(){

			},
			events: function() {
				var self = this;
				// var updateTime;
				// self.$audio_area.on('click', function() {
				// 	self.play();
				// 	if (!updateTime) {
				// 		self.updateTotalTime();
				// 		updateTime = true;
				// 	}
				// });
				self.$audio_play.on('click', function() {
					self.operate = false;
					self.play();
				});
				self.$audio_toggle.on('click', function(e) {
					e.preventDefault();
					$(this).next('.sd-menu').fadeToggle();
				});
				self.$audio_speed.on('click', function(e) {
					e.preventDefault();
                    self.speed(this);
                    $('.sd-menu').fadeOut();
                    $('.sd-toggle').text($(this).text());
				});
				self.$audio_progress.on(eStart, function(e) {
					if(self.currentState === "pause"){self.operate = true};
                	self.operate && self.play();
                    self.adjustCurrentTime(e);
                    self.$audio_progress.on(eMove, function(e) {
                        self.adjustCurrentTime(e);
                    });
                }).on(eCancel, function() {
                    self.$audio_progress.unbind(eMove);
                });
                self.$audio_progress_bar.on(eStart, function(e) {
                	if(self.currentState === "pause"){self.operate = true};
                	self.operate && self.play();
                    self.barjustCurrentTime(e);
                    self.$audio_progress_bar.on(eMove, function(e) {
                        self.barjustCurrentTime(e);
                    });
                }).on(eCancel+' '+eEnd, function() {
                    self.$audio_progress_bar.unbind(eMove);
                });
                self.Audio.addEventListener('ended', function() {
                	self.pause();
					self.$context.addClass('paused');
                });
                self.$prev.on('click', function() {
		            self.prev();
                });
                self.$next.on('click', function() {
		            self.next();
                });
			},
			//正在播放
			run: function() {
				var self = this;
				self.animateProgressBarPosition();
				if (self.Audio.ended) {
					self.pause();
				}
			},
			//进度条
			animateProgressBarPosition: function() {
				var self = this,
					percentage = (self.Audio.currentTime * 100 / self.Audio.duration) + '%';
				if (percentage == "NaN%") {
					percentage = 0 + '%';
				}
				var styles = {
					"left": percentage
				};
				self.curStrip = self.handleStrip1(self.strip,parseInt(self.Audio.currentTime));
				// console.log("当前的strip：" + self.curStrip);
				// console.log("当前的curtime：" + self.Audio.currentTime);
				self.$context.parent().children('p').eq(self.curStrip).addClass('red').siblings('p').removeClass("red");
				self.$audio_progress_bar.css(styles);
			},
			//获取时间秒
			getAudioSeconds: function(string) {
				var self = this,
					string = string % 60;
				string = self.addZero(Math.floor(string), 2);
				(string < 60) ? string = string: string = "00";
				return string;
			},
			//获取时间分
			getAudioMinutes: function(string) {
				var self = this,
					string = string / 60;
				string = self.addZero(Math.floor(string), 2);
				(string < 60) ? string = string: string = "00";
				return string;
			},
			//时间+0
			addZero: function(word, howManyZero) {
				var word = String(word);
				while (word.length < howManyZero) word = "0" + word;
				return word;
			},
			//更新总时间
			// updateTotalTime: function() {
			// 	var self = this,
			// 		time = self.Audio.duration,
			// 		minutes = self.getAudioMinutes(time),
			// 		seconds = self.getAudioSeconds(time),
			// 		audioTime = minutes + ":" + seconds;
			// 	self.$audio_length.text(audioTime);
			// },
			prev: function() {
				var self = this;
				if(self.curStrip === 0){
					alert("已是第一条");
					return;
				}
				if(self.currentState === "pause")return;
				self.$context.parent().children('p').eq(self.curStrip - 1).addClass('red').siblings('p').removeClass("red");
				self.Audio.currentTime = self.times[self.curStrip - 1];
				console.log("prev的time是："+ self.Audio.currentTime);
			},
			next: function() {
				var self = this;
				if(self.currentState === "pause")return;
				if(self.curStrip >= (self.times.length - 1)){
					alert("已是最后一条");
					return;
				}
                self.$context.parent().children('p').eq(self.curStrip + 1).addClass('red').siblings('p').removeClass("red");
				console.log("curStrip："+ self.curStrip);
				self.Audio.currentTime = self.times[self.curStrip + 1];
				console.log("next的time是："+ self.Audio.currentTime);
			},
			speed: function(th) {
				var self = this,
				    speed = $(th).data('speed');
				self.Audio.defaultPlaybackRate = speed;
                console.log("speed="+speed)
			},
			adjustCurrentTime: function(e) {
				var self = this;
                var theRealEvent = isTouch ?(e.originalEvent.touches[0].pageX -$(".progress").offset().left) : e.offsetX;
                self.Audio.currentTime = Math.round((self.Audio.duration * (theRealEvent - self.$audio_progress_bar.width())) / self.$audio_progress_wrap.width());
            },
            barjustCurrentTime: function(e) {
            	var self = this;
                var theRealEvent = isTouch ? e.originalEvent.touches[0] : e;
                self.Audio.currentTime = Math.round((self.Audio.duration * (self.$audio_progress_bar.position().left - self.$audio_progress_bar.width())) / self.$audio_progress_wrap.width());
            },
            handleStrip1: function(strip,num) {
            	var i = 0, sum = 0, len = strip.length;
            	if(!(len>0))return;
            	for (i; i < len; i++) {
            		sum+=strip[i];
            		if(sum>num){
            			return +i;
            		}
            	}
            },
            handleStrip2: function(strip) {
            	var arr = strip.slice();
            	arr.forEach(function(el, index) {
            		if(index === 0) {
            			arr[index] = el;
            		}else {
            			arr[index] = el + arr[index - 1];
            		}
            	});
            	arr.unshift(0)
            	arr.pop();
            	return arr;
            }
		}
		var obj = {}
		// var instantiate = function() {
		// 	 new Plugin($(this));
		// }
		$this.each(function(index,element){
			obj['weixinAudio'+index] = new Plugin($(this));
		}); //多个执行返回对象

		return obj
	}
})(jQuery)