(() => {
  'use strict';
  const canvas = document.getElementById('cap');
  const ctx = canvas.getContext('2d');
  const buffer = document.createElement('canvas');
  buffer.width = 100; buffer.height = 132;
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
    b.clearRect(0,0,100,132);
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
    // A white coat, with lapels, seams, pockets and buttons.
    const polygon = (points, fill) => {
      b.beginPath(); points.forEach(([x,y],i)=>i?b.lineTo(x,y):b.moveTo(x,y));
      b.closePath(); b.fillStyle=fill; b.fill();
    };
    const cloth=b.createLinearGradient(25,85,73,125);
    cloth.addColorStop(0,'#e7edf3');cloth.addColorStop(.5,'#a8bacb');cloth.addColorStop(1,'#e3e9f1');
    polygon([[40,87],[30,91],[20,112],[28,116],[34,103],[32,129],[68,129],[66,103],[72,116],[80,112],[70,91],[60,87],[54,92],[46,92]],cloth);
    polygon([[44,87],[50,96],[56,87],[54,114],[46,114]],'#354454');
    polygon([[40,87],[46,91],[50,109],[39,98],[43,95]],'#f5f5ed');
    polygon([[60,87],[54,91],[50,109],[61,98],[57,95]],'#dfeaf3');
    b.strokeStyle='#73899e';b.lineWidth=.55;
    b.beginPath();b.moveTo(50,109);b.lineTo(50,129);b.stroke();
    for(const x of [36,57]) { b.strokeRect(x,113,7,7); }
    b.strokeRect(57,101,6,5);
    b.fillStyle='#6b8299';for(const y of [112,118,124]){b.beginPath();b.arc(52,y,.65,0,Math.PI*2);b.fill();}
    // Stethoscope rotates around the same vertical axis and angle as the hat.
    const scopePoint=(x,y,z=0)=>[50+(x*c+z*s)*23,58+y*22+(-x*s+z*c)*7];
    const line=(points,color,width)=>{
      b.beginPath();points.forEach(([x,y,z],i)=>{const p=scopePoint(x,y,z||0);i?b.lineTo(...p):b.moveTo(...p);});
      b.strokeStyle=color;b.lineWidth=width;b.lineCap='round';b.lineJoin='round';b.stroke();
    };
    line([[-.27,0],[-.43,.08],[-.46,.42],[-.3,.67],[0,.75],[.3,.67],[.46,.42],[.43,.08],[.27,0]],'#d4e4f1',1.1);
    const tube=[];
    for(let i=0;i<=40;i++){const t=i/40; tube.push([.36*Math.sin(t*Math.PI*1.6),.75+t*.47,.08*Math.sin(t*Math.PI)]);}
    line(tube,'#74bfc1',1.8);
    const end=scopePoint(...tube[tube.length-1]);
    b.fillStyle='#dbeaf2';b.beginPath();b.ellipse(end[0],end[1],Math.max(.8,2.8*Math.abs(c)),2.7,0,0,Math.PI*2);b.fill();
    b.fillStyle='#628d9e';b.beginPath();b.ellipse(end[0],end[1],Math.max(.4,1.7*Math.abs(c)),1.6,0,0,Math.PI*2);b.fill();
    for(const x of [-.27,.27]){const p=scopePoint(x,0);b.fillStyle='#9bd3d4';b.beginPath();b.arc(...p,1.2,0,Math.PI*2);b.fill();}
    const w=canvas.clientWidth,h=canvas.clientHeight,dpr=Math.min(devicePixelRatio||1,2);
    if(canvas.width!==Math.round(w*dpr)||canvas.height!==Math.round(h*dpr)){canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);}
    ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);
    const cw=w/100,ch=h/132;
    ctx.font=`bold ${ch}px Menlo, Consolas, monospace`;ctx.textAlign='center';ctx.textBaseline='top';
    const pixels=b.getImageData(0,0,100,132).data;
    ctx.shadowBlur=3;
    for(let y=0;y<132;y++)for(let x=0;x<100;x++){
      const i=(y*100+x)*4;if(pixels[i+3]<60)continue;
      const r=pixels[i],g=pixels[i+1],blue=pixels[i+2];
      ctx.fillStyle=ctx.shadowColor=`rgb(${r},${g},${blue})`;
      ctx.fillText(ramp[Math.max(1,Math.round(Math.max(r,g,blue)/255*(ramp.length-1)))],(x+.5)*cw,y*ch);
    }
  }
  requestAnimationFrame(draw);
})();
