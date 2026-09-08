import type { SceneState } from './config';
const clamp = (v:number, min=0,max=1) => Math.min(max,Math.max(min,v));
const mix = (a:number,b:number,p:number) => a+(b-a)*p;
const smooth = (p:number) => {const t=clamp(p);return t*t*(3-2*t);};
const SIZE = [[17.8,15.1],[18,16],[15,12.7]] as const;

/**
 * Scroll is sampled directly. Only the small idle movement depends on time.
 *
 * `aspect` is the canvas width/height. It defaults to a desktop ratio so the
 * choreography tests can stay 3-argument.
 */
export function getModelPose(kind:number,s:SceneState,time:number,aspect=1.6) {
  const collection=smooth(s.range);
  const selected=clamp(s.range-1,0,2);
  const focus=clamp(1-Math.abs(selected-kind));
  const visibility=kind===0?Math.max(1-collection,focus):focus*collection;
  const finish=smooth(s.finale);
  const intro=smooth(s.hero);
  const idle=(1-intro)*Math.sin(time*.65)*.065;
  // Per-kind scale, [before hero settle, after]. The takeaway container is
  // 190mm on its long side where the clamshell it replaced was 226mm, so kind 0
  // is scaled up to keep the hero silhouette the size the layout was composed
  // around.
  const size=mix(SIZE[kind][0],SIZE[kind][1],intro);
  // How far the snap-fit lid is off its seat, 0 seated to 1 fully lifted —
  // the same craft-scroll and inspect-button drivers that used to swing the
  // clamshell's hinge.
  const open=clamp((smooth((s.craft-.2)/.48)*1.15+s.inspect*.85*(1-intro))*(1-collection));
  // A portrait viewport sees a far narrower slice of the scene at the same
  // camera distance, so the desktop composition — container right of centre,
  // beside the copy — pushes it off the right edge and straight over the text.
  // Portrait instead centres the container, drops it into the lower half of the
  // screen with the copy stacked above, and pulls the camera back to fit it.
  // 0 from 4:3 landscape upward, 1 on a phone held upright.
  const portrait=clamp((1.15-aspect)/.45);
  const pull=mix(1,2,portrait);
  // How far the container sits below the camera's aim. It deepens once the
  // collection carousel engages, because the product panels are taller than the
  // craft facts and would otherwise sit underneath the model.
  const drop=portrait*mix(.85,2.05,collection);
  // The camera's aim stays put across phases. Tying it to `drop` would lower
  // the frame by the same amount the model moves down, cancelling most of it.
  const frameDrop=portrait*.5;
  const heroX=mix(1.35,0,portrait);
  const spread=mix(2.25,1.15,portrait);
  // The carousel slides each product in from off-stage; a portrait stage is a
  // third the width, so the desktop travel throws them far out of frame.
  const travel=mix(4.4,2.8,portrait);
  return {
    visible:s.active&&(visibility>.001||finish>.001),
    scale:mix(size*Math.max(.001,visibility),kind===1?12.3:10,finish),
    position:[mix(heroX+(kind-selected)*travel*collection,(kind-1)*spread,finish),mix(mix(-.7,-.95,intro)+idle-drop,-1.02-portrait*.6,finish),mix(0,kind===1?.4:0,finish)] as [number,number,number],
    rotation:[mix(.22,.06,intro),-.58+s.craft*Math.PI*2+(kind-selected)*.95*collection+s.drag*(1-collection)+Math.sin(time*.25)*.08*(1-intro),mix(-.12,0,intro)*(1-finish)] as [number,number,number],
    lidAngle:-mix((.34+smooth((s.craft-.2)/.48)*1.7+s.inspect*.9*(1-intro))*(1-collection)+.12*collection,.1,finish),
    lidLift:kind===0?open*.055*(1-finish):kind===1?.05*focus*(1-finish):0,
    camera:[s.pointerX*.045,mix(2.1,1.65,intro),(mix(8.1,7.3,intro)+finish*.9-Math.sin(selected*Math.PI/2)*.3)*pull] as [number,number,number],
    lookAt:.3-frameDrop,
  };
}
