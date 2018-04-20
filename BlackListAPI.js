/*
Black List API
© 2018 Dark Tornado, All rights reserved.
상업적 이용 금지. API를 판매하거나 API가 포함된 소스 크드 및 프로그램을 이용한 금전적인 이익 추구 금지.

2차수정 : Nenka
© 2018 Nenka, All rights reserved.
수정 허락 받았습니다.
상업적 이용 금지. API를 판매하거나 API가 포함된 소스 크드 및 프로그램을 이용한 금전적인 이익 추구 금지.

BlackList new BlankList(boolean offline);
boolean add(String nickName);
boolean remove(String nickName);
boolean isBanned(String nickName);
String[] getList();
void save();
void read();
void clear();
void setBlackListUpdateListener(int num, ListUpdateListener listener);
void deleteBlackListUpdateListener(int num);
BlackList newInstance();

object Status
object Simple

Listener ListUpdateListener({
	onUpdated: function(status, list){
		//...
	}
})

**** 사용법 ****

var black = new BlackList();

or

var black = BlackList.newInstance();

black.setBlackListUpdateListener(1, new BlackList.ListUpdateListener({
	onUpdated: function(status, list){
		//...
	}
}));

function response(...){
	if(black.isBanned(sender)) return;
	//...
}

or 

function catchMessage(...){
	if(black.isBanned(sender)) return;
	//...
}

*/

const BlackList=(function(){
	//이짓 안하면 원하는데로 안되더군요
	const addValue = function(target, name, value){
		Object.defineProperty(target, name, {
			enumerable: false,
			configurable: false,
			writable: false,
			value: value
		});
	};
	const listeners=([]);
	const list=([]);
	const instance = ([]);
	function BlackList(offline){
		this.list=list;
		this.listeners=listeners;
		if(offline){
			this.list=([]);
			this.listeners=([]);
		}
		return this
	}
	const ListUpdateListener=(function(){
		const ListUpdateListener=(onUpdated)=>{
			return onUpdated!=null?onUpdated:(onUpdated=function(){})
		};
		return ListUpdateListener;
	})();
		
	const newInstance=(function(){
		const newInstance=()=>{
			if(instance[0]  == undefined) instance[0] = new BlackList();
			return instance[0];
		};
		return newInstance;
	})();
		
	const Simple=(function(){
		return {
			add:function(name){
				return new BlackList().add(name);
			},
			isBanned:function(name){
				return new BlackList().isBanned(name);
			},
			remove:function(name){
				return new BlackList().remove(name);
			},
			read:function(){
				return new BlackList().read();
			},
			getList:function(name){
				return new BlackList().getList();
			},
			clear:function(name){
				new BlackList().clear();
			}
		}
	})();
	
	const Status=(function(){
		return {
			CHECK:-1,
			ADD:0,
			REMOVE:1,
			SAVE:2,
			READ:3,
			CLEAR:4
		};
	})();
	
	BlackList.prototype={
		isBanned:function(name){
			for(let n=0;n<this.list.length;n++){
				if(this.list[n]==name) {
					for(let list of this.listeners){
						if(typeof list[1].onUpdated=="function") list[1].onUpdated(Status.CHECK, this.list);
					}
					return !0;
				}
			}
			return !1;
		},
		add:function(name){
			if(this.isBanned(name)){
				return !1;
			}else{
				this.list.push(name);
				for(let list of this.listeners){
					if(typeof list[1].onUpdated=="function") list[1].onUpdated(Status.ADD, this.list);
				}
				return !0;
			}
		},
		remove:function(name){
			if(!this.isBanned(name)){
				return !1;
			}else{
				for(let n=0;n<this.list.length;n++){
					if(this.list[n]==name){
						this.list.splice(n,1);
						for(let list of this.listeners){
							if(typeof list[1].onUpdated=="function") list[1].onUpdated(Status.REMOVE, this.list);
						}
						return !0;
					}
				}
			}
			return !1;
		},
		getList:function(name){
			return this.list;
		},
		clear:function(name){
			this.list=[];
			for(let list of this.listeners){
				if(typeof list[1].onUpdated=="function") list[1].onUpdated(Status.CLEAR, this.list);
			}
		},
		save:function(){
			try{
				let file=new java.io.File("/sdcard/kbot/blacklist.txt");
				let fos=new java.io.FileOutputStream(file);
				let str=new java.lang.String(this.list.join("::#::"));
				fos.write(str.getBytes());
				fos.close();
				for(let list of this.listeners){
					if(typeof list[1].onUpdated=="function") list[1].onUpdated(Status.SAVE, this.list);
				}
			}catch(e){
				throw e;
			}
		},
		read:function(){
			try{
				let file=new java.io.File("/sdcard/kbot/blacklist.txt");
				if(!file.exists()) return "";
				let fis=new java.io.FileInputStream(file);
				let isr=new java.io.InputStreamReader(fis);
				let br=new java.io.BufferedReader(isr);
				let str=br.readLine();
				let line="";
				while((line=br.readLine())!=null){
					str+="\n"+line
				}
				fis.close();
				isr.close();
				br.close();
				this.list=str.split("::#::");
				for(let list of this.listeners){
					if(typeof list[1].onUpdated=="function") list[1].onUpdated(Status.READ, this.list);
				}
			}catch(e){
				throw e
			}
		},
		setBlackListUpdateListener:function(num,listener){
			this.listeners.push([num,listener]);
		},
		deleteBlackListUpdateListener:function(num){
			for(let n=0;n<this.listeners.length;n++){
				if(this.listeners[n][0]==num) this.listeners.splice(n,1);
			}
		}
	};
	addValue(BlackList, "Status", Status);
	addValue(BlackList, "Simple", Simple);
	addValue(BlackList, "newInstance", newInstance);
	addValue(BlackList, "ListUpdateListener", ListUpdateListener);
	return BlackList;
})();