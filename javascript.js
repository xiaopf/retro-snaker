var s=60; //网格的数量


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
var path=[];


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
      searchPath(snaker,x,y);
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

      draw(rX,rY,'green');  
    } 


   

    // 初始化画蛇和食物
    drawBody();
    random();
    searchPath(snaker,x,y);
     console.log(rX,rY)
     console.log(x,y)



    $('#ai').click(function(){
      console.log(path)
      move();    
    })


    function searchPath(arr,x,y){

        var openList=[];
        var closeList=[].concat(arr);
        var mX=x,mY=y; 
        closeList.push([mX,mY]);
 
        while(!(mX==rX&&mY==rY)){

            if(mX-1!=-1&&mX-1!=s&&!isInArr(closeList,mX-1,mY)&&!isInArr(openList,mX-1,mY)){
              openList.push([mX-1,mY,getF([mX-1,mY]),mX,mY,]);
            };

            if(mY+1!=-1&&mY+1!=s&&!isInArr(closeList,mX,mY+1)&&!isInArr(openList,mX,mY+1)){
              openList.push([mX,mY+1,getF([mX,mY+1]),mX,mY,]);
            };

            if(mX+1!=-1&&mX+1!=s&&!isInArr(closeList,mX+1,mY)&&!isInArr(openList,mX+1,mY)){
              openList.push([mX+1,mY,getF([mX+1,mY]),mX,mY,]);
            };

            if(mY-1!=-1&&mY-1!=s&&!isInArr(closeList,mX,mY-1)&&!isInArr(openList,mX,mY-1)){
              openList.push([mX,mY-1,getF([mX,mY-1]),mX,mY,]);
            };
            
            function getF(arr){
                var G=Math.abs(arr[0]-x)+Math.abs(arr[1]-y);
                var H=Math.abs(arr[0]-rX)+Math.abs(arr[1]-rY);
                return [G,H,G+H];
            }
        
            openList.sort(function(a,b){
              return b[2][2]-a[2][2];
            });

            var oLen=openList.length;

            // console.log(openList,oLen);

            if(oLen>1&&(openList[oLen-1][2][2]==openList[oLen-2][2][2])){

                var openListSlice=new Array(0);
                openListSlice=openList.slice(oLen-2);

                // console.log(openListSlice);

                var olLen=openListSlice.length;

                openListSlice.sort(function(a,b){
                   return b[2][1]-a[2][1];
                });

                var openOut=openListSlice.pop(); 

                openList.splice(openList.indexOf(openOut),1)

            }else{
                var openOut=openList.pop(); 
            }

            // drawBody([openOut],'orange');
            closeList.push(openOut);
            mX=openOut[0];
            mY=openOut[1];
        };

        var len=closeList.length;      
        path.unshift([rX,rY]);   
        path.unshift([closeList[len-1][3],closeList[len-1][4]]);

        var a=path[0][0];
        var b=path[0][1];
        var ss=0;

        while(!(a==x&&b==y)){

            for (var i = len-1-ss; i >=0; i--) {

              if(closeList[i][0]==a&&closeList[i][1]==b){
                  path.unshift([closeList[i][3],closeList[i][4]]);
                  ss=len-i;
                  break;
              }
            }
            a=path[0][0];
            b=path[0][1];
        }
        
        console.log(path)
        path.shift();

        if(path[1]){
          return true;
        }
        // drawBody(path.slice(1,path.length-1),'grey');



        // function drawBody(arr,color){
        //     var i=0;
        //     var arrLen=arr.length;
        //     var timer=setInterval(function(){

        //         if(i<arrLen){
        //            draw(arr[i][0],arr[i][1],color); 
        //         }else{
        //            clearInterval(timer)
        //         }

        //         i++;

        //     },100);
        // }  

        function isInArr(arr,aX,aY){
          var k=false;
          arr.forEach(function(item){
              if(item[0]==aX&&item[1]==aY){
                  k=true;
              }
          });
          return k;
        } 
}
       

 



    // 控制方向
    // $(document).keydown(function(event){

    //     // 防止蛇头未动，方向改变
    //     if(time==0){return false} 

    //     if (event.keyCode==37){  
    //         u=d=false;
    //         if(l){return false;}
    //         r=l=true;
    //         dir='l';
    //         time=0;
    //         move();
    //     } 
    //     if (event.keyCode==38){    
    //         r=l=false;
    //         if(u){return false;}
    //         d=u=true;   
    //         dir='u';
    //         time=0;
    //         move();
    //     }
    //     if (event.keyCode==39){ 
    //         u=d=false;
    //         if(r){return false;}
    //         r=l=true;
    //         dir='r';
    //         time=0;
    //         move();
    //     } 
    //     if (event.keyCode==40){    
    //         r=l=false;
    //         if(d){return false;}
    //         u=d=true;        
    //         dir='d';
    //         time=0;
    //         move();
    //     } 

        
    // });



    function move(){

        // setTimeout(function(){time++},200);

        clearInterval(timer);

        timer=setInterval(function(){



            
            // console.log(path)
            var p=path.shift();

            console.log(p)

            if(!p){

                  

                  do{
                      var  a=Math.floor(Math.random()*s);
                      var  b=Math.floor(Math.random()*s); 
                  }while(isInBody(aX,aY)&&searchPath(snaker,a,b));

                  searchPath(snaker,a,b);
                  

            }else{
              
            }
            

            // switch(dir){
            //     case 'u':
            //       x--;
            //       break;
            //     case 'd':
            //       x++;
            //       break;
            //     case 'l':
            //       y--;
            //       break;
            //     case 'r':
            //       y++;
            //       break;
            // };

            // if(x==s||y==s||x==-1||y==-1||isInBody(x,y)){
            //     alert('game over!')
            //     init();
            //     clearInterval(timer);
            // }else 

            if(p[0]==rX&&p[1]==rY){
                snaker.unshift(p);
                random();
                searchPath(snaker,snaker[0][0],snaker[0][1])
                drawBody(); 
            }else{
                unDraw(snaker[snaker.length-1][0],snaker[snaker.length-1][1]);
                snaker.pop();
                snaker.unshift(p)
                drawBody();        
            };  
        },100);
     }
})