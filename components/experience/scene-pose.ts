import type { SceneState } from './config';
const clamp = (v:number, min=0,max=1) => Math.min(max,Math.max(min,v));
const mix = (a:number,b:number,p:number) => a+(b-a)*p;
const smooth = (p:number) => {const t=clamp(p);return t*t*(3-2*t);};
// Meter-scale assets: meal box, shallow bowl, deep round tub.
const SIZE = [[17.8,15.1],[18,17],[18,16]] as const;

/**
 * Scroll is sampled directly. Only the small idle movement depends on time.
 *
 * `aspect` is the canvas width/height and `height` its CSS pixel height. Both
 * default to a desktop frame so the choreography tests can stay 3-argument.
 */
export function getModelPose(kind:number,s:SceneState,time:number,aspect=1.6,height=900) {
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
  // Give the model breathing room on narrow desktop windows as well as phones.
  const landscapePull=mix(1.22,1,clamp((aspect-1.15)/.6));
  const pull=mix(landscapePull,2,portrait);
  // How far the container sits below the camera's aim. On a phone the hero
  // copy runs down to its button around 45% of the screen and the lid button
  // starts near 85%, so the container is centred in the band between them —
  // the earlier, shallower setting had it lapping the button and the
  // description. Every stage after the hero (craft, collection) stacks copy
  // above the model, so the hand-off eases it a touch further down still.
  // Two phones can share an aspect ratio and still differ in how much room the
  // hero leaves: the copy is laid out in the document, so its button ends at
  // the same pixel row on a 740px and an 844px screen, while the model is
  // framed as a fraction of the viewport. On the short screen that band is
  // barely taller than the container, so it shrinks and eases a little lower
  // until the hero hands off.
  const cramped=portrait*(1-intro)*clamp((800-height)/140);
  const drop=portrait*mix(1.9,2.05,intro)+cramped*.3;
  // The camera's aim stays put across phases. Tying it to `drop` would lower
  // the frame by the same amount the model moves down, cancelling most of it.
  const frameDrop=portrait*.5;
  const heroX=mix(1.35,0,portrait);
  const spread=mix(2.25,1.15,portrait);
  // The carousel slides each product in from off-stage; a portrait stage is a
  // third the width, so the desktop travel throws them far out of frame.
  const travel=mix(4.4,2.8,portrait);
  const stageX=heroX+(kind-selected)*travel*collection;
  const stageY=mix(-.7,-.95,intro)+idle-drop;

  return {
    visible:s.active&&(visibility>.001||finish>.001),
    scale:mix(size*mix(1,.72,cramped)*Math.max(.001,visibility),kind===1?12.3:10,finish),
    position:[mix(stageX,(kind-1)*spread,finish),mix(stageY,-1.02-portrait*.6,finish),mix(0,kind===1?.4:0,finish)] as [number,number,number],
    rotation:[mix(.22,.06,intro),-.58+s.craft*Math.PI*2+(kind-selected)*.95*collection+s.drag*(1-collection)+Math.sin(time*.25)*.08*(1-intro),mix(-.12,0,intro)*(1-finish)] as [number,number,number],
    lidAngle:-mix((.34+smooth((s.craft-.2)/.48)*1.7+s.inspect*.9*(1-intro))*(1-collection)+.12*collection,.1,finish),
    lidLift:kind===0?open*.055*(1-finish):.025*focus*(1-finish),
    camera:[s.pointerX*.045,mix(2.1,1.65,intro),(mix(8.1,7.3,intro)+finish*.9-Math.sin(selected*Math.PI/2)*.3)*pull] as [number,number,number],
    lookAt:.3-frameDrop,
  };
}
