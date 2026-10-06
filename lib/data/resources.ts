export const resourceLinks = [
 { href:'/gallery',label:'Gallery',hint:'Products, finishes and manufacturing' },
 { href:'/oem',label:'OEM',hint:'Manufacturing for your brand' },
 { href:'/customization',label:'Customization',hint:'Formats, colours and IML artwork' },
 { href:'/tools',label:'Tools',hint:'Capacity and carton planning' },
 { href:'/quality',label:'Quality & Certifications',hint:'Material and manufacturing standards' },
 { href:'/process',label:'Manufacturing Process',hint:'From resin to dispatch' },
 { href:'/capabilities',label:'Capabilities',hint:'Presses, tooling and capacity' },
 { href:'/downloads',label:'Download Center',hint:'Catalogues and datasheets' },
 { href:'/faq',label:'FAQ',hint:'Answers before you enquire' },
];
export const resourcePages = {
 oem:{title:'Your brand. Our manufacturing.',eyebrow:'OEM partnerships',intro:'Build your packaging programme with a manufacturing partner who understands the product, the application and the delivery plan.',steps:[['A clear product brief','Share the food application, format, capacity and material requirements.'],['Sample and specification review','Review the proposed container and lid combination before confirming the production brief.'],['Production alignment','Discuss tooling, branding, quality checks and the manufacturing schedule.'],['Prepared for dispatch','Agree carton configuration, identification and delivery requirements with our team.']],action:'Discuss an OEM project'},
 customization:{title:'Packaging with your signature.',eyebrow:'Customization',intro:'A considered format, a distinctive finish and artwork that belongs to your brand. Explore the possibilities with our team.',steps:[['Format and capacity','Discuss dimensions, serving sizes, compartments and lid compatibility.'],['Colour and finish','Review available material and colour options for the selected container.'],['In-mould labelling','Explore IML artwork, label placement and the information your packaging needs to carry.'],['From brief to sample','Align artwork, tooling and production requirements through a specification and sample review.']],action:'Discuss a custom project'},
};
export function cartonPlan(quantity:number,unitsPerCarton:number) {
 if(!Number.isSafeInteger(quantity)||!Number.isSafeInteger(unitsPerCarton)||quantity<1||unitsPerCarton<1)return null;
 const cartons=Math.ceil(quantity/unitsPerCarton);
 if(!Number.isSafeInteger(cartons*unitsPerCarton))return null;
 return {cartons,spare:cartons*unitsPerCarton-quantity};
}
