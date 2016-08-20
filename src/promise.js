export default class Promise {
    // internal method
    resolvePromise(y) {
        if (this.status === 'pending') {
            this.status = 'fulfilled'
            this.value = y

            if (Array.isArray(this.nextPromises)) {
                this.nextPromises.forEach((nextPromise, index) => {
                    const onFulfilled = this.onFulfilleds[index]
                    if (typeof onFulfilled === 'function') {
                        const y = onFulfilled(y)
                        Promise.Resolve(nextPromise, this.value)
                        this.onFulfilleds[index] = null
                    }
                })  
            }
        }
    }

    // internal method
    rejectPromise(r) {
        if (this.status === 'pending') {
            this.status = 'rejected'
            this.result = r
            if (Array.isArray(this.nextPromises)) {
                this.nextPromises.forEach((nextPromise, index) => {
                    const onRejected = this.onRejecteds[index]
                    if (typeof onRejected === 'function') {
                        const x = onRejected(r)
                        Promise.Resolve(nextPromise, this.result)
                        this.onRejecteds[index] = null
                    }
                })
            }
        }
    }

    // internal method
    static Resolve(nextPromise, x) {
        if (nextPromise === x) { throw new TypeError() }
        if (x instanceof Promise) { 
            x.then(nextPromise.resolvePromise, nextPromise.rejectPromise) 
        }  
        if (typeof x === 'object' || typeof x === 'function') {
            const then = x.then
            if (typeof then === 'function') {
                const resolvePromise = nextPromise.resolvePromise.bind(nextPromise)
                const rejectPromise = nextPromise.rejectPromise.bind(nextPromise)
                try {
                    then.call(x, resolvePromise, rejectPromise)
                } catch (e) {
                    nextPromise.rejectPromise(e)
                }
            } else {
                nextPromise.resolvePromise(x)
            }
        } else {
            nextPromise.resolvePromise(x)
        }  
    }

    constructor(executor) {
        this.status = 'pending'
        const resolvePromise = this.resolvePromise.bind(this)
        const rejectPromise  = this.rejectPromise.bind(this)
        executor(resolvePromise, rejectPromise)
    }

    then(onFulfilled, onRejected) {
        const nextPromise = new Promise((resolve, reject) => {
            setTimeout(() => {
                if (this.status === 'fulfilled') {
                    const x = onFulfilled(this.value)
                    Promise.Resolve(nextPromise, x)
                } else if (this.status === 'rejected') {
                    const x = onRejected(this.result)
                    Promise.Resolve(nextPromise, x)
                } else {
                    this.onFulfilleds = this.onFulfilleds || []
                    this.onRejecteds  = this.onRejecteds  || []
                    this.nextPromises = this.nextPromises || []

                    const length = this.nextPromises.length
                    (typeof onFulfilled === 'function') && (this.onFulfilleds[length] = onFulfilled)
                    (typeof onRejected === 'function')  && (this.onRejecteds[length]  = onRejected)
                    this.nextPromises.push(nextPromise)
                }
            }, 0)
        })

        return nextPromise
    }
}