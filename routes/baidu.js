//需要暴露出去的js文件
const cheerio = require('cheerio');
const axios = require('axios');

function post(data) {
        return axios({
            method: 'post',
            url: 'https://hanyu.baidu.com/s',
            headers: {
                'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            params: {
                 wd : data
            } 
    });
}

function parse( req, rsp  ) {
    var text = "", temp = "";
    if( undefined == rsp )
        return "";
   
    const $ = cheerio.load( rsp.data );
    if( $("#empty-tips").length > 0  )
        return "";

    switch( $('body').attr('id') ) {
        case "pc--body":
            $('.poem-list-item','#data-container').each( function(i, el)  {
                
                temp = $(el).children('div[style^=display]').text().trim() ;
                temp==""? temp=$(el).children('a[href^="/s"]').text().trim() : temp;
                
                text += "【"+ temp +"】" ;
                $(el).children('.poem-list-item-info').children().each( function( i,ele){
                        text += $(ele).text().trim() ;
                    });

                //console.log( "【"+i+$(el).children('.poem-list-item-body').length );
                $(el).children('.poem-list-item-body').each( function( i,ele){
                        text += $(ele).text().trim() ;
                    });
                text += "\n" ;
            });
            break;
        case "pc-term-body":
        case "pc-word-body":
            //console.log( rsp.data );
            text += $('.baike-feedback','#baike-wrapper').attr('data');
            text += (temp=$('span','#radical').text())!=""?
                        $('b','#pinyin').text() + " 【部首:"+ temp + "+" 
                        + $('span','#stroke_count').text()+"画】": "" ;
            
            $('dl','#basicmean-wrapper').each( function(i, el)  {
                //console.log( "i "+i );
                text += $(el).children( "dt").text()+"\n";
                $(el).children( "dd").children().each( function(i, ele)  {
                    text += $(ele).text().trim()+"\n";
                })
            })    
            
            var sn = "";    
            $('a','#synonym').each( function( i, el ) {
                    //console.log( i + $(this).text() );
                    sn += $(this).text()+",";
                    if( i>4 ) return false;
            });
            if( sn != "" )
                text += "【同】 "+ sn.substring(0,sn.length-1)+"\n";

            var an = "";
            $('a','#antonym').each( function( i, el ) {
                    //console.log( i + $(this).text() );
                    an += $(this).text()+",";  
                    if( i>4 ) return false;
            })
            if( an != "" )
                text += "【反】 "+ an.substring(0,an.length-1)+"\n";

            break;    
        default:
            text = "抱歉，没有收录该输入";
    } 
    if( text != "" )
        text += "【链】 "+encodeURI("https://hanyu.baidu.com/s?wd="+req);
    return text;
}

module.exports.post = post;
module.exports.parse = parse; 
