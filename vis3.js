
//visualization 3 - animated legal process
var caseInfo;
var cases;

var buckets;
var levels;

var marginX;
var marginY;

var width;
var height;

var velocity = 5;

//colors: declare all color variables
var start = "#F8F4F3"
var A0 = "#F9BCA0"
var A1 = "#F3A57F"
var A2 = "#DB6E5A"
var A3 = "#CE5246"
var A4 = "#C13738"
var D0 = "#C7DEEC"
var D1 = "#92C9DE"
var D2 = "#76B3D0"
var D3 = "#3F8FBE"
var D4 = "#3C8FC3"


function preload(){
    caseInfo = loadTable("https://gist.githubusercontent.com/meitalhoffman/6553d3b820e7c652f0a23f4f666f1058/raw/8ee2508602de97381e69b199b11971fb5201486d/legalProcessAnimationInfo.csv", "csv", "header")
}

function setup(){
    createCanvas(600, 700)
    width = 600
    height = 700
    marginX = 30;
    marginY = 30;
    cases = []
    buckets = {}
    levels = []
    initializeBuckets()
    initializeLevels()
    loadData()

}

function draw() {
    background(220)
    buckets["Referred"].draw()
    buckets["Approved"].draw()
    buckets["Denied"].draw()
    for(let c in cases){
        cases[c].draw()
        cases[c].update()
    }
    for(let l in levels){
        levels[l].updateHover()
        levels[l].draw()
    }
}

function mouseClicked(){
    for(let l in levels){
        if(levels[l].over){
            levels[l].restartCases()
        }
    }
}

function loadData(){
    let rowCount = caseInfo.getRowCount()
    for(let i = 0; i < rowCount; i++){
        var row = caseInfo.rows[i]
        let rowVal = round(row.get(0)/100)
        let stops = []
        stops.push(row.get(1))
        stops.push(row.get(2))
        stops.push(row.get(3))
        stops.push(row.get(4))
        stops.push(row.get(5));
        for(let c = 0; c < rowVal; c++){
            cases.push(new applicant(stops, 5))
        }

    }
}

function initializeBuckets(){
    var referral = new bucket((width/2-120), (height-marginY-80), 240, 80, -1, "Referred to Immigration Court")
    var approved = new bucket(marginX, (height-marginY-80), 120, 80, -1, "Asylum Approved")
    var denied = new bucket((width-marginX-120), (height-marginY-80), 120, 80, -1, "Asylum Denied")
    buckets["Referred"] = referral
    buckets["Approved"]  = approved
    buckets["Denied"] = denied
}

function initializeLevels(){
    // levels = [["New Application", "Pending Application"],
    // ["Affirmative", "Defensive"],
    // ["Interview Scheduled", "Uninterviewed Referral", "Filing Deadline Referral", "Interviewed"],
    // ["Interview Conducted", "Interview Cancelled", "No Show", "Credible Fear", "No Credible Fear"],
    // ["USCIS", "Applicant"]]
    var pendingApps = new bucket(marginX, marginY, 120, 50, 0, "Pending Application")
    var newApps = new bucket(width/2, marginY, 120, 50, 0, "New Applications")
    var affirmative = new bucket(width/2 - 100, 100+marginY, 120, 40, 1, "Affirmative")
    var defensive = new bucket(width/2 + 90, 100+marginY, 120, 40, 1, "Defensive")
    var dInterviews = new bucket(width/2 + 110, 190+marginY, 120, 40, 2, "Interviews Conducted")
    var aInterviews = new bucket(width/2 - 150, 190+marginY, 120, 40, 2, "Interviews Scheduled")
    var aNoShow = new bucket(width/2 - 50, 280+marginY, 80, 40, 3, "No Show")
    var aCancelled = new bucket(width/2 - 150, 280+marginY, 80, 40, 3, "Cancelled")
    var aConducted = new bucket(width/2 - 250, 280+marginY, 80, 40, 3, "Conducted")
    var dNoFear = new bucket(width/2 + 150, 370+marginY, 120, 40, 3, "Fear Not Established")
    var dFear = new bucket(width/2, 370+marginY, 120, 40, 3, "Fear Established")

    levels.push(pendingApps)
    levels.push(newApps)
    levels.push(affirmative)
    levels.push(defensive)
    levels.push(aInterviews)
    levels.push(dInterviews)
    levels.push(aConducted)
    levels.push(aCancelled)
    levels.push(aNoShow)
    levels.push(dFear)
    levels.push(dNoFear)
}

class bucket{
    constructor(_x, _y, _width, _height, _l, _text, _c){
        this.x = _x
        this.y = _y
        this.w = _width
        this.h = _height
        this.l = _l
        this.text = _text
        this.color = _c
        this.cases = []
        this.over = false
    }

    draw(){
        fill(0)
        stroke(0)
        if(this.l == -1) fill(0)
        else if(this.l == 0) fill(188)
        else if(this.l == 1) fill(126)
        else if(this.l == 2) fill(84)
        else if(this.l == 3) fill(42)
        rect(this.x, this.y, this.w, this.h)
        if(this.l == -1) fill(255)
        else if(this.l == 0) fill(0)
        else if(this.l == 1) fill(255)
        else if(this.l == 2) fill(255)
        else if(this.l == 3) fill(255)
        // fill(255)
        let textW = textWidth(this.text)
        text(this.text, this.x+(this.w/2 - textW/2), this.y+15)
    }

    isOver(){
        if(mouseX >= this.x && mouseX <= this.x+this.w && mouseY >= this.y && mouseY <= this.y+this.h){
            return true
        } else {
            return false
        }
    }

    updateHover(){
        this.over = this.isOver()
    }

    restartCases(){
        for(let c in this.cases){
            if(this.l == 0){
                this.cases[c].currentLevel = this.l
                this.cases[c].getFirstStop()
                this.cases[c].done = false
            } else {
                this.cases[c].currentLevel = this.l - 1
                this.cases[c].x = this.getRandomX()
                this.cases[c].y = this.getRandomY()
                this.cases[c].done = false
                this.cases[c].newTarget()
            }
        }
    }

    getRandomX(){
        return this.x + random(this.w -10)
    }

    getRandomY(){
        return this.y + random(this.h)
    }

    getFinalY(){
        return this.y + 30 + random(this.h-30)
    }
}

//class holding 10 applicants
class applicant{
    constructor(_path, _radius){
        this.path = _path
        this.radius = _radius
        this.x = 0
        this.y = 0
        this.targetX = 0
        this.targetY = 0
        this.dirX = 0
        this.dirY = 0
        this.currentLevel = 0
        this.color = start
        this.nextColor = start
        this.done = false
        this.getBuckets()
        this.getFirstStop()
    }

    getBuckets(){
        if(this.path[0] == "New Application"){
            levels[1].cases.push(this)
        } else {
            levels[0].cases.push(this)
        }
        if(this.path[1] == "Affirmative"){
            levels[2].cases.push(this)
        } else {
            levels[3].cases.push(this)
        }
        if(this.path[2] == "Interview Scheduled"){
            levels[4].cases.push(this)
        } else if(this.path[2] == "Interviewed"){
            levels[5].cases.push(this)
        }  if(this.path[3] == "Interview Conducted"){
            levels[6].cases.push(this)
        } else if(this.path[3] == "Interview Cancelled"){
            levels[7].cases.push(this)
        } else if(this.path[3] == "No Show"){
            levels[8].cases.push(this)
        } else if(this.path[3] == "Credible Fear"){
            levels[9].cases.push(this)
        } else if(this.path[3] == "No Credible Fear"){
            levels[10].cases.push(this)
        }

    }

    getFirstStop(){
        if(this.path[0] == "New Application"){
            this.x = levels[1].getRandomX()
            this.y = levels[1].getRandomY()
        }
        else {
            this.x = levels[0].getRandomX()
            this.y = levels[0].getRandomY()
        }
        if(this.path[1] == "Affirmative"){
            this.targetX = levels[2].getRandomX()
            this.targetY = levels[2].getRandomY()
            this.nextColor = A0
        } else{
            this.targetX = levels[3].getRandomX()
            this.targetY = levels[3].getRandomY()
            this.nextColor = D0
        }
        this.getNewDir()
    }

    draw(){
        fill(this.color)
        ellipse(this.x, this.y, this.radius, this.radius)
    }

    update(){
        if(abs(this.x - this.targetX) < 5 && abs(this.y - this.targetY) < 5){
            // console.log("made it to the target!")
            if(this.done){
                // console.log("done")
                this.dirX = 0
                this.dirY = 0
            }
            else {
                // console.log("getting new target")
                this.newTarget()
            }
        }
        this.x = this.x - this.dirX
        this.y = this.y - this.dirY
    }

    newTarget(){
        this.currentLevel = this.currentLevel + 1
        // console.log("new level is: "+str(this.currentLevel))
        this.color = this.nextColor
        switch(this.currentLevel){
            case 1:
                if(this.path[2] == "Interview Scheduled"){
                    // console.log("interview scheduled")
                    this.targetX = levels[4].getRandomX()
                    this.targetY = levels[4].getRandomY()
                    this.nextColor = A2
                    this.getNewDir()

                } else if(this.path[2].includes("Referral" )){
                    // console.log("referred")
                    this.targetX = buckets["Referred"].getRandomX()
                    this.targetY = buckets["Referred"].getFinalY()
                    this.nextColor = A4
                    this.getNewDir()
                    this.currentLevel = -1

                } else if(this.path[2] == "Interviewed"){
                    // console.log("interviewed")
                    this.targetX = levels[5].getRandomX()
                    this.targetY = levels[5].getRandomY()
                    this.nextColor = D2
                    this.getNewDir()

                } else if(this.path[2] == "no data"){
                    this.targetX = width - marginX - random(3)
                    this.targetY = this.y + random(50)
                    this.nextColor = D3
                    this.getNewDir()
                    this.currentLevel = -1
                }
                break;
            case 2:
                if(this.path[3] == "Interview Conducted"){
                    this.targetX = levels[6].getRandomX()
                    this.targetY = levels[6].getRandomY()
                    this.nextColor = A3
                    this.getNewDir()
                } else if(this.path[3] == "Interview Cancelled"){
                    this.targetX = levels[7].getRandomX()
                    this.targetY= levels[7].getRandomY()
                    this.nextColor = A3
                    this.getNewDir()
                } else if(this.path[3] == "No Show"){
                    this.targetX = levels[8].getRandomX()
                    this.targetY = levels[8].getRandomY()
                    this.nextColor = A3
                    this.getNewDir()
                } else if(this.path[3] == "no data"){
                    if(this.x < width/2){
                        this.targetX = marginX + random(3)
                    } else {
                        this.targetX = width -marginX - random(3)
                    }
                    this.targetY = this.y + random(50)
                    this.getNewDir()
                } else if(this.path[3] == "Credible Fear"){
                    this.targetX = levels[9].getRandomX()
                    this.targetX = levels[9].getRandomY()
                    this.nextColor = D3
                    this.getNewDir()
                }
                else if(this.path[3] == "No Credible Fear"){
                    this.targetX = levels[10].getRandomX()
                    this.targetY = levels[10].getRandomY()
                    this.nextColor = D3
                    this.getNewDir()
                }
                break;
            case 3:
                this.currentLevel = -1
                if(this.path[4] == "Approved"){
                    this.targetX = buckets["Approved"].getRandomX()
                    this.targetY = buckets["Approved"].getFinalY()
                } else if(this.path[4] == "Denied" | this.path[4] == "No Show Denial"){
                    this.targetX = buckets["Denied"].getRandomX()
                    this.targetY = buckets["Denied"].getFinalY()
                } else if(this.path[4] == "Referred"){
                    this.targetX = buckets["Referred"].getRandomX()
                    this.targetY = buckets["Referred"].getFinalY()
                } else if(this.path[4] == "USCIS" | this.path[4] == "Applicant" | this.path[4] == "no data"){
                    if(this.x < width/2){
                        this.targetX = marginX + random(3)
                    } else {
                        this.targetX = width - marginX - random(3)
                    }
                    this.targetY = this.y + random(100)
                }
                this.getNewDir()
                break;
            case 0:
                //they have found their target! just jitter
                this.done = true
                this.jitter()
                break;
            }
            

    }

    jitter(){
        this.targetX = this.x + random(2)
        this.targetY = this.y + random(2)
        this.getNewDir()
    }

    getNewDir(){
        let xdist = this.x - this.targetX;
        let ydist = this.y - this.targetY;
        let angle = atan2(ydist, xdist);
        this.dirX = cos(angle)*(velocity);
        this.dirY = sin(angle)*(velocity);
    }


}