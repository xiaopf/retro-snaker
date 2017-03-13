var s=30; //网格的数量

//初始随机产生蛇头的位置
var x=Math.floor(Math.random()*s),
    y=Math.floor(Math.random()*s);

var rX,rY; //设置随机点的全局变量

var timer; //运动定时器

var time=1; //防止按键200ms以内按下触发变向的变量

var dir;   //初始化方向变量

var u=d=l=r=false; //防止蛇头回头变量

var snaker=new Array(0);  //设置蛇身的数组
    snaker.push([x,y]);  //将初始化蛇头推入数组


$(document).ready(function(){
    // 初始化地图
    for (var i = 0; i < s; i++) {
        $("table")[0].innerHTML+='<tr class="'+'r'+i+'"></tr>';
        for (var j = 0; j < s; j++) {
            $("tr")[i].innerHTML+='<td class="'+'d'+j+' smallBox"></td>';
        }   
    }
    
    // game over后的初始化
    function init(){
      $('td').css({backgroundColor:'white'});
      x=Math.floor(Math.random()*s),y=Math.floor(Math.random()*s);
      dir;
      u=d=l=r=false;
      snaker=new Array(0);;
      snaker.push([x,y]);
      drawBody();
      random();
    }
    
    //画蛇 
    function draw(x,y,color){
        if(!color){color="blue";}
        x='.'+'r'+x;
        y='.'+'d'+y;
        $(x).find(y).css({backgroundColor:color});
    }

    // 清除蛇
    function unDraw(x,y){
        x='.'+'r'+x;
        y='.'+'d'+y;
        $(x).find(y).css({backgroundColor:'white'});
    }

    //画蛇全身 
    function drawBody(){
        for(var i=0;i<snaker.length;i++){
          if(i==0){
            draw(snaker[0][0],snaker[0][1],'red');
          }else{
            draw(snaker[i][0],snaker[i][1],'blue');           
          }
        }
    }

    // 判断点是否在蛇身上
    function isInBody(aX,aY){
      var k;
      snaker.forEach(function(item){
          if(item[0]==aX&&item[1]==aY){
              k=true;
          }
      });
      return k;
    }

    // 随机产生食物
    function random(){
      do{
          var  aX=Math.floor(Math.random()*s);
          var  aY=Math.floor(Math.random()*s); 
      }while(isInBody(aX,aY));

      rX=aX;
      rY=aY;

      draw(aX,aY,'green');  
    } 


    // 初始化画蛇和食物
    drawBody();
    random();

    // 控制方向
    $(document).keydown(function(event){

        // 防止蛇头未动，方向改变
        if(time==0){return false} 

        if (event.keyCode==37){  
            u=d=false;
            if(l){return false;}
            r=l=true;
            dir='l';
        } 
        if (event.keyCode==38){    
            r=l=false;
            if(u){return false;}
            d=u=true;   
            dir='u';
        }
        if (event.keyCode==39){ 
            u=d=false;
            if(r){return false;}
            r=l=true;
            dir='r';
        } 
        if (event.keyCode==40){    
            r=l=false;
            if(d){return false;}
            u=d=true;        
            dir='d';
        } 

        time=0;
        move();
    });



    function move(){

        setTimeout(function(){time++},200);

        clearInterval(timer);

        timer=setInterval(function(){

            switch(dir){
                case 'u':
                  x--;
                  break;
                case 'd':
                  x++;
                  break;
                case 'l':
                  y--;
                  break;
                case 'r':
                  y++;
                  break;
            };

            if(x==s||y==s||x==-1||y==-1||isInBody(x,y)){
                alert('game over!')
                init();
                clearInterval(timer);
            }else if(x==rX&&y==rY){
                snaker.unshift([x,y]);
                random();
                drawBody(); 
            }else{
                unDraw(snaker[snaker.length-1][0],snaker[snaker.length-1][1]);
                snaker.pop();
                snaker.unshift([x,y])
                drawBody();        
            };  
        },200);
     }
})