const baidu = require('./baidu');
const solve24game = require('./24game');

var helpText = "试试输入\'书\'、\'值日\'、\'倒计时\'、\'课程表\'、娃的学号、汉字、词组、4个算24点的数....";
var bookLink = "https://docs.qq.com/sheet/DTXphbHBpc3FFbGdF";

    // 值日生标尺
	baseDay   = new Date( '2019-3-5 00:00:00.000' );
	baseDuty  = 29-1;   //当日值日的首位同学学号
	baseGuard = 1-1;   //没到周二，算上周护校的家长，到周二，算本周的

	// 2019年下半学期
	firstDay = new Date( '2019-02-18 00:00:01.000' );
	lastDay  = new Date( '2019-06-30 00:00:01.000' );	
	
	ONEDAY = 1000*24*60*60;

	var nameList= new Array(
        '陈睿哲','陈卓然','黄喆' ,'姜皓旻', '林致远', '吕恺烨', '马天昊', '钱君垚', '邱颢涵','史立潇',
		'王嘉诚','徐澍','徐煜扬',	'薛嘉霖','俞希铖', '喻子文',	'张宸玮','张天成','赵彦杰',	'朱奕瀚',
		'宗逸宸','崔墨含','范琳希','冯艺衡','胡默', '黄语琦',  '季子乔','姜是艺', '钱馨颐',	'沈侞逸',
		'石欣睿','王寻文','吴诗愉','郤乙文','谢洛灵','许清馨',	'杨可薇','叶欣瑶', '余沁芝',	'张庭溪',
		'郑好',	'钟睿琦' );

	var classList= new Array(
        '周一：自然','周二：美术、校本','周三：体育、唱游、道德',
        '周四：美术、道德、体育、兴趣','周五：自然、唱游、体育' );	

	/**     
	* 周六周天 自己计算     
	* 大放假或者调休     
	* 2月4日至10 4月5日至7 4月29日至5月1日	 
	* @type {Array}     */
	bigWeekDay = ['20180101', '20180215', '20180216', '20180217', '20180218', 
					'20180219', '20180220', '20180221', '20180405', '20180406', 
					'20180407', '20180429', '20180430', '20180501', '20180618', 
					'20180924', '20181001', '20181002', '20181003', '20181004', 
					'20181005', '20181006', '20181007',  
		                        '20181105', '20181106', //进博会
		                        '20181231', '20190101',
					'20190204', '20190205', '20190206', '20190207', '20190208', 
					'20190209', '20190210', '20190405', '20190406', '20190407', 
					'20190429', '20190430', '20190501', '20190617', '20190913',	
					'20191001', '20191002', '20191003', '20191004', '20191005', 
					'20191006', '20191007'	]; 	
	/**     
	 * 2月11日(星期日)、2月24  4月8日(星期日)上班 4月28日(星期六)上  9月29日(星期六)、9月30	 
	 * @type {[string]}	 */	
	tiaoxiu    = ['20180211', '20180224', '20180408', '20180428', '20180928','20180929', 
		                        '20181111', //进博会
					'20190202', '20190203', '20190427', '20190428'   ];  

	/**  
	* @param timeStamp  输入一个时间对象， 判断该天是否为工作日	 
	* @returns {boolean}  false 休息   true 工作	 */    
	function isWorkday(timeStamp='', incFri = true ) 
	{    	
		//console.log(timeStamp);        
		if ( timeStamp == 'undefine' || timeStamp == '') 
		{        	
			timeStamp = new Date();        
		}         

		var isWeek = timeStamp.getDay(); //0 周日  6周六 	    
		var y = timeStamp.getFullYear();	    
		var m = timeStamp.getMonth()+1;	    
		m = m < 10 ? '0' + m : '' + m;	    
		var d = timeStamp.getDate() <10 ? '0'+timeStamp.getDate():''+timeStamp.getDate(); 	   
		var ymd = y+m+d; 	    
		//判断是否为调休日 必定是工作日	   
		if (tiaoxiu.indexOf(ymd) > -1) 
		{		    
			return true;	    
		}        
		//判断是否为假期 必定休息        
		if (bigWeekDay.indexOf(ymd) > -1) 
		{        	
			return false;        
		}        
		//判断是否为周五、周六、周天        
		if (isWeek == 0 || isWeek == 6 || (incFri && isWeek == 5) ) 
		{	    	
			return false        
		}      

		return true;    
	}


	function diffworkday( d )
	{
		//console.log( d ); 
		var count =0, dTime = d.getTime();
		for( var i= baseDay.getTime()+ONEDAY; i<=dTime; i += ONEDAY ) {
			if( isWorkday( new Date(i) ) ) {
				count++;
			}
		}
		return count;
	}

	function getGuardText( d )
	{
		//console.logDate() 
		var count =0;
		var currday = baseDay;
		do{
			currday = new Date( currday.getTime()+7*ONEDAY ); 
			count++;
		}while( !isWorkday( currday ) || currday <= d );

		//console.log( currday ); 

		return guardText = "下次护校："
						+ (currday.getMonth()+1) + "月" + currday.getDate() + "日 "
						+ "(" + ((baseGuard+count)%nameList.length+1)
						+ nameList[ (baseGuard+count)%nameList.length ] + ")";			
	}

	function getClassText( d )
	{
		//console.logDate() 
		var currday = d;
		do{
			currday = new Date( currday.getTime()+ONEDAY ); 
		}while( !isWorkday( currday, false ) );

		//console.log( currday ); 

		return "下日" + classList[ currday.getDay()-1 ] ;			
	}

	function getCountDown( d )
	{
		//console.logDate() 
		var totalCnt = 0, pastCnt = 0;
		var currday = firstDay;
		do{
			currday = new Date( currday.getTime()+7*ONEDAY ); 
			totalCnt++;
			if( currday < d ) {
				pastCnt++;
			}
		}while( currday <= lastDay );
		
		var p1 = ( pastCnt/totalCnt*100 ).toFixed(1);
		var p2 = ((totalCnt-pastCnt)/totalCnt*100 ).toFixed(1);

		return  "本学期共有" + totalCnt+ "周，已过了"
						+ pastCnt + "周(" + p1 + "%)，"
						+ "再坚持" + (totalCnt-pastCnt) + "周("
						+ p2 + "%)就放假了喽！";			
	}

	function nextDuty( id, today )
	{
		//console.logDate() 
		var currid  = baseDuty;
		var currday = baseDay;
		var count   = 0;
		var rid     = id-1;
		for( ; currday.getTime()+ONEDAY <= today.getTime(); currid+=4 )
		{
			do{
				currday = new Date( currday.getTime() + ONEDAY );
			} while( !isWorkday( currday) );
		} 
		//console.log( "1:"+currday + "  " + currid ); 

		for( ; rid!=(currid)%nameList.length && 
				rid!=(currid+1)%nameList.length &&
				rid!=(currid+2)%nameList.length &&
				rid!=(currid+3)%nameList.length ; currid+=4 ) {
			do{
				currday = new Date( currday.getTime() + ONEDAY );
			} while( !isWorkday( currday) );
		}	
		//console.log( "2:"+currday + "  " + currid ); 

		return id+"号下次值日"+(currday.getMonth()+1)+"月"+
								currday.getDate()+"日(周"+currday.getDay()+")";			
	}

	function getDutyList( today )
	{
		var diff = diffworkday( today );
		var todayText = isWorkday(today)? "当日："
									+ ((baseDuty+diff*4)%nameList.length+1) + "~"
									+ ((baseDuty+diff*4+3)%nameList.length+1) + " "
									+ nameList[ (baseDuty+diff*4)%nameList.length ]
									+ ","	+ nameList[ (baseDuty+diff*4+1)%nameList.length ]
									+ ","	+ nameList[ (baseDuty+diff*4+2)%nameList.length ]
									+ ","	+ nameList[ (baseDuty+diff*4+3)%nameList.length ]
		                                                        + "\n"
									: "";

		var nextday = today;
		do{
			nextday = new Date( nextday.getTime()+ONEDAY);
		}while( !isWorkday( nextday ) ) 

		var diff = diffworkday( nextday );
		var nextdayText =  (isWorkday( new Date( today.getTime()+ONEDAY) )?"次日：":"下周：")
						+ ((baseDuty+diff*4)%nameList.length+1) + "~"
						+ ((baseDuty+diff*4+3)%nameList.length+1) + " "		
						+ nameList[ (baseDuty+diff*4)%nameList.length ]
						+ ","	+ nameList[ (baseDuty+diff*4+1)%nameList.length ]
						+ ","	+ nameList[ (baseDuty+diff*4+2)%nameList.length ]
						+ ","	+ nameList[ (baseDuty+diff*4+3)%nameList.length ]
		                                + "\n";
		return todayText + nextdayText + getGuardText(today);
	}

	function inputType( content )
	{  
		// 先判断是否是4个数字
		var clist = content.split( /[ `!@#$%&*()-+_=|:;"',.?<>，。？！”“：；]/);
                if ( 4 == clist.length  && clist.map( function (item) {
                                             return new RegExp("^[0-9]*[1-9][0-9]*$").test( item );
                                           }).toString() == [ true, true, true, true].toString() ) 
                {  
                    var result = solve24game( clist[0], clist[1], clist[2], clist[3] ); 
		    return (result=="")? "竟然算不出来！！" : result;
                }
		// 再判断是否是学号
		else if( new RegExp("^[0-9]*[1-9][0-9]*$").test( content ) )
		{
			if( Number(content)<=42 ) //输入的学号
			{
				return nextDuty( Number(content), new Date()  );			
			}
		}
		// 再判断其他命令
		var keyArray = ['值日生', '值日', '倒计时','课程表','课程','帮助','书'];
  		var keyIndex = keyArray.indexOf(content);		
		switch (keyIndex) {
			case 0:
    		case 1:
      			return getDutyList( new Date() );
      		case 2:
      			return getCountDown( new Date());
        	case 3:
        	case 4:
        		return getClassText( new Date() );
        	case 5:
       			return helpText;
		case 6:
			return bookLink;
       		default:
       			return "";
      	}			
		
	}

function strlen(str) 
{   
    var len = 0;    
    for (var i=0; i<str.length; i++)  {      
        var c = str.charCodeAt(i);       //单字节加1         
        if ((c >= 0x0001 && c <= 0x007e) || (0xff60<=c && c<=0xff9f)) {            
            len++;       
        }
        else {             
            len+=2;      
        }   
    }   
    return len;
}


var router = require('express').Router();
// 引用 wechat 库，详细请查看 https://github.com/node-webot/wechat
var wechat = require('wechat');
var config = {
  token: 'cloudwechat',
  appid: 'wxed528b635567a89e',
  encodingAESKey: 'HE7BrNPWVxu2CW4QITEokdlalFDEdQH421ctFMqBsbW'
};

var WechatAPI = require('wechat-api');
var api = new WechatAPI('wxed528b635567a89e',
  'dc4b0a07680c2f96b77f3597ca54c979');

console.log("enter wechatBot.js");

router.use('/', wechat(config).text(function(message, req, res, next) {
  // message为文本内容
  // FromUserName: 'oPKu7jgOibOA-De4u8J2RuNKpZRw',
  // CreateTime: '1359125035',
  // MsgType: 'text',
  // Content: 'http',
  // MsgId: '5837397576500011341' }
    var reply =  inputType( message.Content );
    if( reply == "" ) {
	 Promise.all( [baidu.post( message.Content )] )
             .then( ([ rsp ]) => {
                            res.reply({
                                  type: "text",
                                  content: baidu.parse( message.Content, rsp )
                            });
                  })  
             .catch(error => console.log( c) );  
    }
    else {
       res.reply({
          type: "text",
          content: reply
       });
    }
}).image(function(message, req, res, next) {
  // message为图片内容
  // { ToUserName: 'gh_d3e07d51b513',
  // FromUserName: 'oPKu7jgOibOA-De4u8J2RuNKpZRw',
  // CreateTime: '1359124971',
  // MsgType: 'image',
  // PicUrl: 'http://mmsns.qpic.cn/mmsns/bfc815ygvIWcaaZlEXJV7NzhmA3Y2fc4eBOxLjpPI60Q1Q6ibYicwg/0',
  // MediaId: 'media_id',
  // MsgId: '5837397301622104395' }}).voice(function(message, req, res, next) {
  // TODO
}).voice(function(message, req, res, next) {
  // message为音频内容
  // { ToUserName: 'gh_d3e07d51b513',
  // FromUserName: 'oPKu7jgOibOA-De4u8J2RuNKpZRw',
  // CreateTime: '1359125022',
  // MsgType: 'voice',
  // MediaId: 'OMYnpghh8fRfzHL8obuboDN9rmLig4s0xdpoNT6a5BoFZWufbE6srbCKc_bxduzS',
  // Format: 'amr',
  // MsgId: '5837397520665436492' }
}).video(function(message, req, res, next) {
  // message为视频内容
  // { ToUserName: 'gh_d3e07d51b513',
  // FromUserName: 'oPKu7jgOibOA-De4u8J2RuNKpZRw',
  // CreateTime: '1359125022',
  // MsgType: 'video',
  // MediaId: 'OMYnpghh8fRfzHL8obuboDN9rmLig4s0xdpoNT6a5BoFZWufbE6srbCKc_bxduzS',
  // ThumbMediaId: 'media_id',
  // MsgId: '5837397520665436492' }
  // TODO
}).shortvideo(function(message, req, res, next) {
  // message为短视频内容
  // { ToUserName: 'gh_d3e07d51b513',
  // FromUserName: 'oPKu7jgOibOA-De4u8J2RuNKpZRw',
  // CreateTime: '1359125022',
  // MsgType: 'shortvideo',
  // MediaId: 'OMYnpghh8fRfzHL8obuboDN9rmLig4s0xdpoNT6a5BoFZWufbE6srbCKc_bxduzS',
  // ThumbMediaId: 'media_id',
  // MsgId: '5837397520665436492' }
  // TODO
}).location(function(message, req, res, next) {
  // message为链接内容
  // { ToUserName: 'gh_d3e07d51b513',
  // FromUserName: 'oPKu7jgOibOA-De4u8J2RuNKpZRw',
  // CreateTime: '1359125022',
  // MsgType: 'link',
  // Title: '公众平台官网链接',
  // Description: '公众平台官网链接',
  // Url: 'http://1024.com/',
  // MsgId: '5837397520665436492' }
  // TODO
}).link(function(message, req, res, next) {
  // message为链接内容
  // { ToUserName: 'gh_d3e07d51b513',
  // FromUserName: 'oPKu7jgOibOA-De4u8J2RuNKpZRw',
  // CreateTime: '1359125022',
  // MsgType: 'link',
  // Title: '公众平台官网链接',
  // Description: '公众平台官网链接',
  // Url: 'http://1024.com/',
  // MsgId: '5837397520665436492' }
  // TODO
}).event(function(message, req, res, next) {
  // message为事件内容
  // { ToUserName: 'gh_d3e07d51b513',
  // FromUserName: 'oPKu7jgOibOA-De4u8J2RuNKpZRw',
  // CreateTime: '1359125022',
  // MsgType: 'event',
  // Event: 'LOCATION',
  // Latitude: '23.137466',
  // Longitude: '113.352425',
  // Precision: '119.385040',
  // MsgId: '5837397520665436492' }
  // TODO
}).device_text(function(message, req, res, next) {
  // message为设备文本消息内容
  // { ToUserName: 'gh_d3e07d51b513',
  // FromUserName: 'oPKu7jgOibOA-De4u8J2RuNKpZRw',
  // CreateTime: '1359125022',
  // MsgType: 'device_text',
  // DeviceType: 'gh_d3e07d51b513'
  // DeviceID: 'dev1234abcd',
  // Content: 'd2hvc3lvdXJkYWRkeQ==',
  // SessionID: '9394',
  // MsgId: '5837397520665436492',
  // OpenID: 'oPKu7jgOibOA-De4u8J2RuNKpZRw' }
  // TODO
}).device_event(function(message, req, res, next) {
  // message为设备事件内容
  // { ToUserName: 'gh_d3e07d51b513',
  // FromUserName: 'oPKu7jgOibOA-De4u8J2RuNKpZRw',
  // CreateTime: '1359125022',
  // MsgType: 'device_event',
  // Event: 'bind'
  // DeviceType: 'gh_d3e07d51b513'
  // DeviceID: 'dev1234abcd',
  // OpType : 0, //Event为subscribe_status/unsubscribe_status时存在
  // Content: 'd2hvc3lvdXJkYWRkeQ==', //Event不为subscribe_status/unsubscribe_status时存在
  // SessionID: '9394',
  // MsgId: '5837397520665436492',
  // OpenID: 'oPKu7jgOibOA-De4u8J2RuNKpZRw' }
  // TODO
}).middlewarify());

module.exports = router;

console.log("leave wechatBot.js");
