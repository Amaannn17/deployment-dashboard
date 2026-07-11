const benchmark = () => {
    // Setup mock data
    const projectDataEmpty = {
        sys1: {},
        sys2: {},
        sys3: {},
        sys4: {},
        sys5: {}
    };

    const projectDataWithData = {
        sys1: {},
        sys2: {},
        sys3: { someKey: 1, anotherKey: 2 },
        sys4: {},
        sys5: {}
    };

    function hasAnyDataOld(projectData) {
        for (let sys in projectData) {
            if (Object.keys(projectData[sys]).length > 0) return true;
        }
        return false;
    }

    function hasAnyDataNew(projectData) {
        for (let sys in projectData) {
            for (let _ in projectData[sys]) return true;
        }
        return false;
    }

    const ITERATIONS = 1000000;

    console.log("Benchmarking empty data...");
    console.time("Old Method - Empty");
    for (let i = 0; i < ITERATIONS; i++) {
        hasAnyDataOld(projectDataEmpty);
    }
    console.timeEnd("Old Method - Empty");

    console.time("New Method - Empty");
    for (let i = 0; i < ITERATIONS; i++) {
        hasAnyDataNew(projectDataEmpty);
    }
    console.timeEnd("New Method - Empty");


    console.log("\nBenchmarking with data...");
    console.time("Old Method - Data");
    for (let i = 0; i < ITERATIONS; i++) {
        hasAnyDataOld(projectDataWithData);
    }
    console.timeEnd("Old Method - Data");

    console.time("New Method - Data");
    for (let i = 0; i < ITERATIONS; i++) {
        hasAnyDataNew(projectDataWithData);
    }
    console.timeEnd("New Method - Data");
};

benchmark();
