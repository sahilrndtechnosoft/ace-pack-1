import type { SceneState } from './config';
const clamp = (v:number, min=0,max=1) => Math.min(max,Math.max(min,v));
const mix = (a:number,b:number,p:number) => a+(b-a)*p;
const smooth = (p:number) => {const t=clamp(p);return t*t*(3-2*t);};
// Meter-scale assets: meal box, shallow bowl, deep round tub.
const SIZE = [[17.8,15.1],[18,17],[18,16]] as const;
// Craft turn: the container holds still while each of the three facts is read
// and only turns across the fact changeovers (p = 1 and 2), plus a slow drift
// so it never looks frozen. Ends at CRAFT_TURN radians past the start.
const HOLD_ANGLES = [0, Math.PI * .6, Math.PI * 1.25];
const DRIFT = .25;
export const CRAFT_TURN = HOLD_ANGLES[2] + DRIFT;
const craftTurn = (craft:number) => {
  const p = clamp(craft) * 3;
  const first = smooth((p - .75) / .5), second = smooth((p - 1.75) / .5);
  return HOLD_ANGLES[1] * first + (HOLD_ANGLES[2] - HOLD_ANGLES[1]) * second + clamp(craft) * DRIFT;
};

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
  const smoothFocus=smooth(focus);
  const visibility=kind===0?Math.max(1-collection,smoothFocus):smoothFocus*collection;
  const intro=smooth(s.hero);
  const idle=(1-intro)*Math.sin(time*.65)*.065;

  // Finale exit smoothing: as finale climbs 0 -> 1, models gracefully drift up and fade without collapsing geometry
  const finale=clamp(s.finale||0);
  const exitFade=1-smooth(finale);
  const exitLift=smooth(finale)*2.0;
  const exitDepth=-smooth(finale)*1.2;
  const exitScale=mix(1,0.94,smooth(finale));

  // Per-kind scale, [before hero settle, after].
  const size=mix(SIZE[kind][0],SIZE[kind][1],intro);
  const open=clamp((smooth((s.craft-.2)/.48)*1.15+s.inspect*.85*(1-intro))*(1-collection));
  const portrait=clamp((1.15-aspect)/.45);
  const landscapePull=mix(1.22,1,clamp((aspect-1.15)/.6));
  const pull=mix(landscapePull,2,portrait);
  const cramped=portrait*(1-intro)*clamp((800-height)/140);
  const drop=portrait*mix(1.9,2.05,intro)+cramped*.3;
  const frameDrop=portrait*.5;
  const heroX=mix(1.35,0,portrait);
  const travel=mix(4.4,2.8,portrait);
  const stageX=heroX+(kind-selected)*travel*collection;
  // Rise slightly while the lid is open so the interior reads as presented.
  const stageY=mix(-.7,-.95,intro)+idle-drop+exitLift+open*.12;

  // Models remain smoothly visible until finale exit finishes
  const isVisible = s.active && visibility > 0.001 && exitFade > 0.001;

  return {
    visible: isVisible,
    scale: size*mix(1,.72,cramped)*Math.max(.001,visibility)*exitScale,
    position: [stageX, stageY, exitDepth] as [number,number,number],
    rotation: [
      // Tip toward the camera as the lid opens so you can see inside.
      mix(.22,.06,intro)+open*.3,
      -.58+craftTurn(s.craft)+(kind-selected)*.95*collection+s.drag*(1-collection)+Math.sin(time*.25)*.08*(1-intro),
      mix(-.12,0,intro)
    ] as [number,number,number],
    lidAngle: -((.34+smooth((s.craft-.2)/.48)*1.7+s.inspect*.9*(1-intro))*(1-collection)+.12*collection),
    lidLift: kind===0 ? open*.055 : .025*focus,
    camera: [
      s.pointerX*.045,
      mix(2.1,1.65,intro),
      (mix(8.1,7.3,intro)-Math.sin(selected*Math.PI/2)*.3)*pull
    ] as [number,number,number],
    lookAt: .3-frameDrop,
  };
}
