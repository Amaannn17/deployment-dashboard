const projectData = {
    lighting: {},
    cabling: {},
    bms: {}
};

for (let i = 0; i < 10000; i++) {
    projectData.lighting['model_' + i] = { quantity: 10, stages: { pulling: 5, termination: 2 } };
    projectData.cabling['model_' + i] = { quantity: 20, stages: { pulling: 10, termination: 5, commissioning: 1 } };
    projectData.bms['model_' + i] = { quantity: 5, stages: { pulling: 2, termination: 1 } };
}

const phaseConfig = {
    lighting: {
        pulling: { text: '1. Cable Pulling', w: 0.3 },
        termination: { text: '2. Termination', w: 0.3 },
        installation: { text: '3. Installation', w: 0.3 },
        commissioning: { text: '4. Commissioning', w: 0.1 }
    },
    cabling: {
        pulling: { text: '1. Cable Pulling', w: 0.35 },
        termination: { text: '2. Termination', w: 0.35 },
        commissioning: { text: '3. Testing & Commissioning', w: 0.30 }
    },
    bms: {
        pulling: { text: '1. Cable Pulling', w: 0.35 },
        termination: { text: '2. Termination', w: 0.35 },
        commissioning: { text: '3. Testing & Commissioning', w: 0.30 }
    }
};

function testObjectValues() {
    let stats = { lighting: 0, cabling: 0, bms: 0 };
    let totalPossible = 0;

    for (let sys in projectData) {
        let activeConf = phaseConfig[sys];
        if (!activeConf) continue;

        for (let item of Object.values(projectData[sys])) {
            totalPossible += item.quantity;
            let itemDone = 0;
            for (let p in activeConf) {
                let val = item.stages[p] || 0;
                itemDone += val * activeConf[p].w;
            }
            stats[sys] += itemDone;
        }
    }
    return { stats, totalPossible };
}

function testForIn() {
    let stats = { lighting: 0, cabling: 0, bms: 0 };
    let totalPossible = 0;

    for (let sys in projectData) {
        let activeConf = phaseConfig[sys];
        if (!activeConf) continue;

        let sysData = projectData[sys];
        for (let key in sysData) {
            let item = sysData[key];
            totalPossible += item.quantity;
            let itemDone = 0;
            for (let p in activeConf) {
                let val = item.stages[p] || 0;
                itemDone += val * activeConf[p].w;
            }
            stats[sys] += itemDone;
        }
    }
    return { stats, totalPossible };
}

const ITERATIONS = 1000;

// Warmup
for (let i = 0; i < 100; i++) {
    testObjectValues();
    testForIn();
}

console.time('Object.values');
for (let i = 0; i < ITERATIONS; i++) {
    testObjectValues();
}
console.timeEnd('Object.values');

console.time('for...in');
for (let i = 0; i < ITERATIONS; i++) {
    testForIn();
}
console.timeEnd('for...in');
