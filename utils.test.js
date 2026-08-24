const test = require('node:test');
const assert = require('node:assert');
const { escapeHTML } = require('./utils.js');

test('escapeHTML escapes basic HTML entities', () => {
    assert.strictEqual(escapeHTML('<script>alert(1)</script>'), '&lt;script&gt;alert(1)&lt;/script&gt;');
});

test('escapeHTML escapes quotes and ampersands', () => {
    assert.strictEqual(escapeHTML('Tom & Jerry "The Movie" \'92'), 'Tom &amp; Jerry &quot;The Movie&quot; &#39;92');
});

test('escapeHTML handles non-strings gracefully', () => {
    assert.strictEqual(escapeHTML(null), null);
    assert.strictEqual(escapeHTML(undefined), undefined);
    assert.strictEqual(escapeHTML(123), 123);
});

test('escapeHTML returns same string if no entities', () => {
    assert.strictEqual(escapeHTML('Safe String 123'), 'Safe String 123');
});

const { updateWork, formatNum } = require('./utils.js');

const { afterEach } = require('node:test');

afterEach(() => {
    delete global.projectData;
    delete global.document;
    delete global.saveData;
    delete global.renderActiveTable;
    delete global.updateMasterChart;
});


test('updateWork handles positive additions', () => {
    // Setup globals
    global.projectData = {
        lighting: {
            'TestFixture': {
                quantity: 100,
                stages: { pulling: 10 }
            }
        }
    };

    global.document = {
        getElementById: (id) => {
            if (id === 'input-TestFixture') {
                return { value: '25.5' };
            }
            return { value: 'NaN' };
        }
    };

    let saved = false;
    let tableRendered = false;
    let chartUpdated = false;

    global.saveData = () => { saved = true; };
    global.renderActiveTable = () => { tableRendered = true; };
    global.updateMasterChart = () => { chartUpdated = true; };

    updateWork('lighting', 'TestFixture', 'pulling');

    assert.strictEqual(global.projectData.lighting['TestFixture'].stages.pulling, 35.5);
    assert.strictEqual(saved, true);
    assert.strictEqual(tableRendered, true);
    assert.strictEqual(chartUpdated, true);
});

test('updateWork clamps to max quantity', () => {
    global.projectData = {
        cabling: {
            'Cable1': {
                quantity: 50,
                stages: { pulling: 40 }
            }
        }
    };

    global.document = {
        getElementById: () => ({ value: '20' }) // 40 + 20 = 60, should clamp to 50
    };

    global.saveData = () => {};
    global.renderActiveTable = () => {};
    global.updateMasterChart = () => {};

    updateWork('cabling', 'Cable1', 'pulling');

    assert.strictEqual(global.projectData.cabling['Cable1'].stages.pulling, 50);
});

test('updateWork handles negative subtractions and clamps to 0', () => {
    global.projectData = {
        bms: {
            'Sensor': {
                quantity: 10,
                stages: { pulling: 5 }
            }
        }
    };

    global.document = {
        getElementById: () => ({ value: '-10' }) // 5 - 10 = -5, should clamp to 0
    };

    global.saveData = () => {};
    global.renderActiveTable = () => {};
    global.updateMasterChart = () => {};

    updateWork('bms', 'Sensor', 'pulling');

    assert.strictEqual(global.projectData.bms['Sensor'].stages.pulling, 0);
});

test('updateWork returns early if input is NaN', () => {
    global.projectData = {
        bms: {
            'Sensor2': {
                quantity: 10,
                stages: { pulling: 5 }
            }
        }
    };

    global.document = {
        getElementById: () => ({ value: 'invalid_string' })
    };

    let saved = false;
    global.saveData = () => { saved = true; };
    global.renderActiveTable = () => {};
    global.updateMasterChart = () => {};

    updateWork('bms', 'Sensor2', 'pulling');

    // Should remain 5 and saveData should NOT have been called
    assert.strictEqual(global.projectData.bms['Sensor2'].stages.pulling, 5);
    assert.strictEqual(saved, false);
});

test('updateWork handles special characters in model names', () => {
    global.projectData = {
        lighting: {
            'Model with \'quotes\' & "spaces"': {
                quantity: 100,
                stages: { pulling: 0 }
            }
        }
    };

    let queryId = '';
    global.document = {
        getElementById: (id) => {
            queryId = id;
            return { value: '10' };
        }
    };

    global.saveData = () => {};
    global.renderActiveTable = () => {};
    global.updateMasterChart = () => {};

    updateWork('lighting', 'Model with \'quotes\' & "spaces"', 'pulling');

    assert.strictEqual(global.projectData.lighting['Model with \'quotes\' & "spaces"'].stages.pulling, 10);
    assert.strictEqual(queryId, 'input-Model%20with%20%27quotes%27%20%26%20%22spaces%22');
});
