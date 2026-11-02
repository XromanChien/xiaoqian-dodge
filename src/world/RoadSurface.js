import Phaser from 'phaser';

// A procedural ground material, evaluated in the same world coordinates as gameplay.
// No baked road lines or screen-space scrolling texture is used.
const fragment = `
precision highp float;
varying mediump vec2 fragCoord;
uniform vec2 resolution;
uniform float horizon, vanishing, slope, halfWidth, bottom, travelled, wood, paving;
uniform float farDistance, nearDistance, visibleDistance;
uniform vec3 baseColor, lightColor, shadowColor;
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }
float noise(vec2 p) {
 vec2 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f);
 return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+1.),f.x),f.y);
}
void main() {
 float y=resolution.y-fragCoord.y;
 if(y<=horizon) discard;
 float perspective=(y-horizon)/(bottom-horizon);
 float x=(fragCoord.x-vanishing-slope*(y-horizon))/(halfWidth*perspective);
 if(abs(x)>5.0) discard;
 float progress=(farDistance-nearDistance/perspective)/(farDistance-nearDistance);
 float z=travelled+(1.0-progress)*visibleDistance;
 vec2 ground=vec2(x*9.0,z);
 float coarse=noise(ground*0.65);
 float fine=noise(ground*32.0);
 float detail=smoothstep(0.04,0.5,perspective);
 vec3 color=mix(shadowColor,baseColor,0.5+coarse*0.5);
 color*=1.0+(fine-0.5)*0.32*detail;
 // Broad, soft patches resemble mottled street light without static image shadows.
 float lighting=noise(ground*vec2(0.27,0.12));
 color=mix(color,lightColor,smoothstep(0.45,0.85,lighting)*0.45);
 float joint=1.0-smoothstep(0.025,0.065,abs(fract(z/3.0)-0.5));
 float grain=noise(vec2(ground.x*20.0,z*0.5));
 color*=1.0-wood*(joint*0.48+(1.0-grain)*0.18)*detail;
 float brickRow=floor(z/3.0);
 float brickEdge=1.0-smoothstep(0.012,0.035,abs(fract(x*4.0+mod(brickRow,2.0)*0.5)-0.5));
 color*=1.0-paving*max(joint,brickEdge)*0.22*detail;
 // Slightly darker shoulder joins the road surface rather than revealing the old photo road.
 color*=1.0-smoothstep(1.0,1.08,abs(x))*0.12;
 color=mix(baseColor,color,smoothstep(0.0,0.12,perspective));
 gl_FragColor=vec4(color,1.0);
}`;

export default class RoadSurface {
  constructor(scene, width, height) {
    if (scene.game.renderer.type !== Phaser.WEBGL) return;
    const gl = scene.game.renderer.gl;
    if (!gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT)?.precision) return;
    const uniforms = {};
    for (const key of ['horizon', 'vanishing', 'slope', 'halfWidth', 'bottom', 'travelled', 'wood', 'paving', 'farDistance', 'nearDistance', 'visibleDistance']) {
      uniforms[key] = { type: '1f', value: 0 };
    }
    for (const key of ['baseColor', 'lightColor', 'shadowColor']) uniforms[key] = { type: '3fv', value: [1, 1, 1] };
    try {
    this.shader = scene.add.shader(new Phaser.Display.BaseShader('road-surface', fragment, undefined, uniforms),
      width / 2, height / 2, width, height).setDepth(0);
    } catch (error) {
      console.warn("Road material unavailable; using geometry fallback.", error.message);
      this.shader = null;
      return;
    }
    const program = this.shader.program?.webGLProgram;
    if (!program || !gl.getProgramParameter(program, gl.LINK_STATUS)) {
      this.shader.destroy();
      this.shader = null;
    }
  }

  update(road, wood, paving) {
    if (!this.shader) return;
    for (const [key, value] of Object.entries({ horizon: road.horizon, vanishing: road.vanishingX,
      slope: road.centerSlope, halfWidth: road.nearHalfWidth, bottom: road.bottom,
      travelled: road.travelled, wood, paving, farDistance: road.farDistance,
      nearDistance: road.nearDistance, visibleDistance: road.visibleDistance })) this.shader.setUniform(key + '.value', value);
    for (const key of ['base', 'light', 'shadow']) {
      const color = road.materialColor(key);
      this.shader.setUniform(key + 'Color.value', [(color >> 16 & 255) / 255, (color >> 8 & 255) / 255, (color & 255) / 255]);
    }
  }

  destroy() { this.shader?.destroy(); }
}
