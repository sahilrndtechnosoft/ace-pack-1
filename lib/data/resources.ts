export const resourceLinks = [
    { href: '/gallery', label: 'Gallery', hint: 'Products, finishes and manufacturing' },
    { href: '/customization', label: 'OEM & Customization', hint: 'Custom tooling, IML branding & private label' },
    { href: '/quality', label: 'Quality & Certifications', hint: 'Material and manufacturing standards' },
    { href: '/process', label: 'Manufacturing Process', hint: 'From resin to dispatch' },
    { href: '/capabilities', label: 'Capabilities', hint: 'Presses, tooling and capacity' },
    { href: '/downloads', label: 'Download Center', hint: 'Catalogues and datasheets' },
];

export const resourcePages = {
    oem_customization: {
        title: 'OEM & Custom Packaging Solutions.',
        eyebrow: 'OEM & Customization',
        intro: 'Your brand, our precision manufacturing. From custom mould tooling and proprietary container geometry to 5-sided In-Mould Labelling (IML) and bespoke colour formulations, build your custom packaging programme under one roof at our ISO 9001:2015 Daman facility.',
        steps: [
            [
                'Custom Tooling & Container Geometry',
                'Collaborate with our in-house toolroom engineers on proprietary container shapes, volume capacities, multi-cavity moulds, and hermetic leak-proof snap lids tailored specifically for your brand.'
            ],
            [
                'Colour, Resin & Polymer Formulations',
                'Select from 100% prime virgin PP 05 food-grade polymer in ultra-clear transparent, deep gloss black, milky white, or bespoke pantone corporate shades with glossy or frosted matte finishes.'
            ],
            [
                'In-Mould Labelling (IML) Branding',
                'Seamless 5-sided photorealistic IML artwork fused directly into the polymer walls during moulding — delivering scratch-resistant, moisture-proof, microwave and deep-freeze durable brand presentation.'
            ],
            [
                'Sample Prototyping to Volume Dispatch',
                'Review pre-production physical samples, audit dimensional accuracy (±0.02mm), verify zero-leak rim performance, and scale into automated robotic manufacturing with palletized export dispatch.'
            ]
        ],
        action: 'Discuss an OEM & Custom Project'
    },
    oem: {
        title: 'OEM & Custom Packaging Solutions.',
        eyebrow: 'OEM & Customization',
        intro: 'Your brand, our precision manufacturing. From custom mould tooling and proprietary container geometry to 5-sided In-Mould Labelling (IML) and bespoke colour formulations, build your custom packaging programme under one roof at our ISO 9001:2015 Daman facility.',
        steps: [
            [
                'Custom Tooling & Container Geometry',
                'Collaborate with our in-house toolroom engineers on proprietary container shapes, volume capacities, multi-cavity moulds, and hermetic leak-proof snap lids tailored specifically for your brand.'
            ],
            [
                'Colour, Resin & Polymer Formulations',
                'Select from 100% prime virgin PP 05 food-grade polymer in ultra-clear transparent, deep gloss black, milky white, or bespoke pantone corporate shades with glossy or frosted matte finishes.'
            ],
            [
                'In-Mould Labelling (IML) Branding',
                'Seamless 5-sided photorealistic IML artwork fused directly into the polymer walls during moulding — delivering scratch-resistant, moisture-proof, microwave and deep-freeze durable brand presentation.'
            ],
            [
                'Sample Prototyping to Volume Dispatch',
                'Review pre-production physical samples, audit dimensional accuracy (±0.02mm), verify zero-leak rim performance, and scale into automated robotic manufacturing with palletized export dispatch.'
            ]
        ],
        action: 'Discuss an OEM & Custom Project'
    },
    customization: {
        title: 'OEM & Custom Packaging Solutions.',
        eyebrow: 'OEM & Customization',
        intro: 'Your brand, our precision manufacturing. From custom mould tooling and proprietary container geometry to 5-sided In-Mould Labelling (IML) and bespoke colour formulations, build your custom packaging programme under one roof at our ISO 9001:2015 Daman facility.',
        steps: [
            [
                'Custom Tooling & Container Geometry',
                'Collaborate with our in-house toolroom engineers on proprietary container shapes, volume capacities, multi-cavity moulds, and hermetic leak-proof snap lids tailored specifically for your brand.'
            ],
            [
                'Colour, Resin & Polymer Formulations',
                'Select from 100% prime virgin PP 05 food-grade polymer in ultra-clear transparent, deep gloss black, milky white, or bespoke pantone corporate shades with glossy or frosted matte finishes.'
            ],
            [
                'In-Mould Labelling (IML) Branding',
                'Seamless 5-sided photorealistic IML artwork fused directly into the polymer walls during moulding — delivering scratch-resistant, moisture-proof, microwave and deep-freeze durable brand presentation.'
            ],
            [
                'Sample Prototyping to Volume Dispatch',
                'Review pre-production physical samples, audit dimensional accuracy (±0.02mm), verify zero-leak rim performance, and scale into automated robotic manufacturing with palletized export dispatch.'
            ]
        ],
        action: 'Discuss an OEM & Custom Project'
    }
};

export function cartonPlan(quantity: number, unitsPerCarton: number) {
    if (!Number.isSafeInteger(quantity) || !Number.isSafeInteger(unitsPerCarton) || quantity < 1 || unitsPerCarton < 1) return null;
    const cartons = Math.ceil(quantity / unitsPerCarton);
    if (!Number.isSafeInteger(cartons * unitsPerCarton)) return null;
    return { cartons, spare: cartons * unitsPerCarton - quantity };
}
