(() => {
  'use strict';
  const canvas = document.getElementById('cap');
  const ctx = canvas.getContext('2d');
  const buffer = document.createElement('canvas');
  buffer.width = 100; buffer.height = 60;
  const b = buffer.getContext('2d', { willReadFrequently: true });
  const ramp = ' .:-=+*cxoaX#%&@';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let last = 0;
  function draw(now) {
    requestAnimationFrame(draw);
    if (document.hidden || now - last < 50) return;
    last = now;
    const angle = reduced.matches ? 0.5 : now / 4800;
    const c = Math.cos(angle), s = Math.sin(angle);
    const project = ([x,y,z]) => {
      const X = x*c + z*s, Z = -x*s + z*c;
      return [50 + X*24, 27 + y*25 + Z*10 + (reduced.matches ? 0 : Math.sin(now / 1700) * .8), Z - y*.4];
    };
    b.clearRect(0,0,100,60);
    const faces = [];
    const face = (points,color,outline = false,layer = 0) => {
      const p = points.map(project);
      faces.push({p, color, outline, layer, depth:p.reduce((a,v)=>a+v[2],0)/p.length});
    };
    // The cylindrical crown beneath the square mortarboard.
    for(let i=0;i<32;i++) {
      const a=i*Math.PI/16, d=(i+1)*Math.PI/16;
      const u=[Math.cos(a)*.64,.02,Math.sin(a)*.64];
      const v=[Math.cos(d)*.64,.02,Math.sin(d)*.64];
      const light=Math.round(36+42*Math.max(0,Math.cos(a-angle-.7)));
      face([u,v,[v[0]*.86,.55,v[2]*.86],[u[0]*.86,.55,u[2]*.86]],`rgb(${light},${Math.round(light*.7)},${Math.round(light*1.35)})`);
    }
    const corners=[[-1,-.15,-1],[1,-.15,-1],[1,-.15,1],[-1,-.15,1]];
    for(let i=0;i<4;i++) {
      const u=corners[i],v=corners[(i+1)%4];
      face([u,v,[v[0],0,v[2]],[u[0],0,u[2]]],'#866096',true,1);
    }
    const satin = b.createLinearGradient(22, 12, 73, 42);
    satin.addColorStop(0, '#e7b9e8');
    satin.addColorStop(.38, '#b080cb');
    satin.addColorStop(.7, '#80579c');
    satin.addColorStop(1, '#c394cb');
    face(corners,satin,true,2);
    faces.sort((a,b)=>a.layer-b.layer || a.depth-b.depth);
    for(const {p,color,outline} of faces) {
      b.beginPath();p.forEach((v,i)=>i?b.lineTo(v[0],v[1]):b.moveTo(v[0],v[1]));
      b.closePath();b.fillStyle=color;b.fill();if(outline){b.strokeStyle='#e4b8ed';b.lineWidth=.45;b.stroke();}
    }
    // Golden cord running from the button to the edge, with a hanging tassel.
    const knot=project([0,-.18,0]), edge=project([.92,-.18,.65]);
    const tip=project([.99,.72,.65]);
    const sway=reduced.matches?0:Math.sin(now/1100)*1.7;
    b.strokeStyle='#f3ca73';b.lineWidth=1.1;b.beginPath();b.moveTo(knot[0],knot[1]);b.quadraticCurveTo((knot[0]+edge[0])/2, (knot[1]+edge[1])/2+1.5, edge[0],edge[1]);b.quadraticCurveTo(edge[0]+sway,tip[1]-5,tip[0]+sway,tip[1]);b.stroke();
    b.fillStyle='#ffe0a0';b.beginPath();b.arc(knot[0],knot[1],1.3,0,Math.PI*2);b.fill();
    for(let i=-3;i<=3;i++){
      b.strokeStyle=i%2 ? '#d69c43' : '#ffe3a0'; b.lineWidth=.55;
      b.beginPath();b.moveTo(tip[0]+sway+i*.13,tip[1]-1);
      b.quadraticCurveTo(tip[0]+sway+i*.5,tip[1]+3,tip[0]+sway+i*.65,tip[1]+6-Math.abs(i)*.3);b.stroke();
    }
    b.fillStyle='#ffe4a9';b.fillRect(tip[0]+sway-1,tip[1]-1,2,1.5);
    const w=canvas.clientWidth,h=canvas.clientHeight,dpr=Math.min(devicePixelRatio||1,2);
    if(canvas.width!==Math.round(w*dpr)||canvas.height!==Math.round(h*dpr)){canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);}
    ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);
    const cw=w/100,ch=h/60;
    ctx.font=`bold ${ch}px Menlo, Consolas, monospace`;ctx.textAlign='center';ctx.textBaseline='top';
    const pixels=b.getImageData(0,0,100,60).data;
    ctx.shadowBlur=3;
    for(let y=0;y<60;y++)for(let x=0;x<100;x++){
      const i=(y*100+x)*4;if(pixels[i+3]<60)continue;
      const r=pixels[i],g=pixels[i+1],blue=pixels[i+2];
      ctx.fillStyle=ctx.shadowColor=`rgb(${r},${g},${blue})`;
      ctx.fillText(ramp[Math.max(1,Math.round(Math.max(r,g,blue)/255*(ramp.length-1)))],(x+.5)*cw,y*ch);
    }
  }
  requestAnimationFrame(draw);
})();
