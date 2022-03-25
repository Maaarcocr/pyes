class Channel {
    constructor() {
        this.queue = []
        this.pending = []
    }

    take = async () => {
        if (this.queue.length == 0) {
            const p = this.createPromise();
            this.pending.push(p)
            return await p.promise
        } else {
            const p = this.queue.shift()
            p.resolve(p.value)
            return await p.promise
        }
    }

    put = async (value) => {
        if (this.pending.length == 0) {
            const p = this.createPromise()
            p.value = value;
            this.queue.push(p)
            return p.promise
        } else {
            const p = this.pending.shift();
            p.resolve(value)
        }
    }

    createPromise = () => {
        const p = {}
        p.promise = new Promise((resolve, reject) => {
            p.resolve = resolve;
            p.reject = reject;
        })
        return p
    }
}

export default Channel