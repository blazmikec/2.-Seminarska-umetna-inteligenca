export class PerfCounter {
    constructor() {
        this.processed = 0;
        this.maxDepth = 0;
    }

    reset() {
        this.processed = 0;
        this.maxDepth = 0;
    }

    getResult() {
        return {processed:this.processed, maxDepth:this.maxDepth}
    }

}