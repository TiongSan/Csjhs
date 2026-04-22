const fractalForest = {
  canvas: null,
  ctx: null,
  trees: [],
  maxLevel: 11,
  currentTreeIndex: 0,

  init(){
    this.canvas = document.getElementById("fractalCanvas");
    if(!this.canvas) return;
    this.ctx = this.canvas.getContext("2d");
    this.reset();
  },

  reset(){
    if(!this.ctx) return;
    this.trees = [];
    this.currentTreeIndex = 0;
    this.trees.push(this.makeTree(this.canvas.width * 0.28, this.canvas.height - 10, 44));
    this.draw();
  },

  makeTree(x, y, length){
    const hue = Math.random() * 360;
    return {
      x,
      y,
      initialLength: length,
      level: 1,
      colorScheme: {
        base: `hsla(${hue}, 58%, 28%, .88)`,
        highlight: `hsla(${hue}, 68%, 38%, .88)`,
        light: `hsla(${hue}, 74%, 50%, .88)`
      }
    };
  },

  getRandomAngle(){
    const degrees = 20 + Math.random() * 18;
    return degrees * Math.PI / 180;
  },

  grow(){
    if(!this.ctx) return;
    const currentTree = this.trees[this.currentTreeIndex];
    if(currentTree.level < this.maxLevel){
      currentTree.level++;
    }else{
      const spacing = 42;
      const newX = 24 + this.trees.length * spacing;
      if(newX < this.canvas.width - 20){
        const prevLength = this.trees[this.currentTreeIndex].initialLength;
        this.trees.push(this.makeTree(newX, this.canvas.height - 10, Math.max(24, prevLength * 0.86)));
        this.currentTreeIndex++;
      }else{
        this.reset();
        return;
      }
    }
    this.draw();
  },

  drawBranch(startX, startY, len, angle, depth, colorScheme){
    const ctx = this.ctx;
    ctx.beginPath();
    ctx.save();

    ctx.translate(startX, startY);
    ctx.rotate(angle);
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -len);

    const depthRatio = depth / this.maxLevel;
    ctx.strokeStyle =
      depthRatio > 0.7 ? colorScheme.light :
      depthRatio > 0.35 ? colorScheme.highlight :
      colorScheme.base;

    ctx.lineWidth = Math.max(1, depth * 0.62);
    ctx.stroke();

    if(depth > 0){
      const rightAngle = this.getRandomAngle();
      const leftAngle = this.getRandomAngle();
      this.drawBranch(0, -len, len * 0.74, rightAngle, depth - 1, colorScheme);
      this.drawBranch(0, -len, len * 0.74, -leftAngle, depth - 1, colorScheme);
    }

    ctx.restore();
  },

  draw(){
    if(!this.ctx) return;
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    ctx.fillStyle = "rgba(255,255,255,.15)";
    ctx.fillRect(0,0,this.canvas.width,this.canvas.height);

    this.trees.forEach(tree=>{
      this.drawBranch(tree.x, tree.y, tree.initialLength, 0, tree.level, tree.colorScheme);
    });
  }
};
