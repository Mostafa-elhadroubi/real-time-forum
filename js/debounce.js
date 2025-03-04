export const debounce = (fn, delay) => {
    let time = null
    return (...args) => {
        clearTimeout(time)
        time = setTimeout(() => {
            fn(...args)
        }, delay)
    }
}

export const fn = () => {
    console.log("0")
}
