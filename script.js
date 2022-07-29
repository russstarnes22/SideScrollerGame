window.addEventListener('load', ()=>{
    const canvas = document.getElementById('canvas1')
    const ctx = canvas.getContext('2d')
    canvas.width = 800
    canvas.height = 720
    
    let lastTime = 0

    let enemyTimer = 0
    let enemyInterval = 2000
    let randomEnemyInterval = Math.random() * 1000 + 500
    let enemies = []


    class InputHandler{
        constructor(){
            this.keys=[]
            window.addEventListener('keydown', (e)=>{
                if ((e.key === 's' || e.key === 'w' || e.key === 'a' || e.key === 'd') && this.keys.indexOf(e.key) === -1){
                    this.keys.push(e.key)
                }
                console.log(e.key, this.keys)
            })

            window.addEventListener('keyup', (e)=>{
                if ((e.key === 's' || e.key === 'w' || e.key === 'a' || e.key === 'd')){
                    this.keys.splice(this.keys.indexOf(e.key), 1)
                }
                console.log(e.key, this.keys)
            })


        }
    }

    class Player{
        constructor(gamewidth, gameheight){
            this.gamewidth = gamewidth
            this.gameheight = gameheight
            this.width = 200
            this.height = 200
            this.x = 0
            this.y = 250
            this.image = document.getElementById('playerImage')
            this.frameX = 0
            this.frameY = 0
            this.speed = 0
            this.vy = 0
            this.maxFrame = 7
            this.fps = 15
            this.frameTimer = 0
            this.frameInterval = 1000 / this.fps
            
        }
        draw(context){
            // context.fillStyle = 'white'
            // context.fillRect(this.x, this.y, this.width, this.height)

            //context.drawImage(image, sx,sy,sw,sh, x,y ,w,h)
            context.drawImage(this.image, this.frameX * this.width, this.frameY * this.height, this.width, this.height,
                 this.x, this.y, this.width, this.height)
        }

        update(input, deltaTime){
            //animation
            if (this.frameTimer > this.frameInterval){
                if (this.frameX >= this.maxFrame){
                    this.frameX = 0
                }else{
                    this.frameX++
                }
                this.frameTimer = 0
            }else{
                this.frameTimer += deltaTime
            }




            //***************/
            this.x += this.speed
            this.y += this.vy
            //input check
            if (input.keys.indexOf('d') > -1){
                this.speed = 5
            }else if (input.keys.indexOf('a') > -1){
                this.speed = -5
            }else if (input.keys.indexOf('s') > -1){
                this.vy = 5
            }else if (input.keys.indexOf('w') > -1){
                this.vy = -5
            }else {
                this.speed = 0
                this.vy = 0
            }

            //horizontal boundaries
            if(this.x <0){
                this.x = 0
            }else if(this.x > this.gamewidth - this.width){
                this.x = this.gamewidth - this.width
            }

            //vertical boundaries
            if(this.y <0){
                this.y = 0
            }else if(this.y > this.gameheight - this.height){
                this.y = this.gameheight - this.height
            }
        }
    }


    class Background{
        constructor(gameWidth, gameHeight){
            this.gameWidth = gameWidth
            this.gameHeight = gameHeight
            this.image = document.getElementById('backgroundImage')
            this.x = 0
            this.y = 0
            this.width = 3200
            this.height = 800
            this.speed = 5
        }

        draw(context){
            context.drawImage(this.image, this.x, this.y, this.width, this.height)
            context.drawImage(this.image, this.x + this.width, this.y, this.width, this.height)
        }

        update(){
            this.x -= this.speed

            if(this.x < 0 - this.width){
                this.x = 0
            }
        }
    }

    class Enemy{
        constructor(gamewidth, gameheight){
            this.gamewidth = gamewidth
            this.gameheight = gameheight
            this.width = 200
            this.height = 200
            this.x = this.gamewidth
            this.y = Math.random()* 520 +0
            this.image = document.getElementById('enemyImage')
            this.frameX = 0
            this.frameY = 0
            this.speed = 2
            this.vy = 0
            this.maxFrame = 4
            this.fps = 15
            this.frameTimer = 0
            this.frameInterval = 1000 / this.fps
            this.offScreen = false
            
        }

        draw(context){
            // context.fillStyle = 'white'
            // context.fillRect(this.x, this.y, this.width, this.height)

            //context.drawImage(image, sx,sy,sw,sh, x,y ,w,h)
            context.drawImage(this.image, this.frameX * this.width, this.frameY * this.height, this.width, this.height,
                 this.x, this.y, this.width, this.height)
        }

        update(deltaTime){
            //animation
            if (this.frameTimer > this.frameInterval){
                if (this.frameX >= this.maxFrame){
                    this.frameX = 0
                }else{
                    this.frameX++
                }
                this.frameTimer = 0
            }else{
                this.frameTimer += deltaTime
            }

            this.x -= this.speed

            if (this.x < 0 - this.width){
                this.offScreen = true
            }
        }

    }

    function enemyHandler(deltaTime){
      if( enemyTimer > enemyInterval + randomEnemyInterval){
          enemies.push(new Enemy(canvas.width, canvas.height))
          enemyTimer = 0
      }else{
          enemyTimer += deltaTime
      }

      enemies.forEach((enemy)=>{
          enemy.draw(ctx)
          enemy.update(deltaTime)
      })
      enemies = enemies.filter((enemy) => !enemy.offScreen)
      
    }


    //Instances
    const input = new InputHandler()
    const player = new Player(canvas.width, canvas.height)
    const background = new Background(canvas.width, canvas.height)
    //const enemy = new Enemy(canvas.width, canvas.height)
    
    

    function animate(timeStamp){
        const deltaTime = timeStamp - lastTime
        lastTime = timeStamp
        //console.log(deltaTime)
        ctx.clearRect(0,0, canvas.width, canvas.height)
        background.draw(ctx)
        background.update()
        player.draw(ctx)
        player.update(input, deltaTime)
        // enemy.draw(ctx)
        // enemy.update(deltaTime)
        enemyHandler(deltaTime)
        requestAnimationFrame(animate)
    }
    animate(0)

})