export const logout = () => {
    fetch("/logout")
    .then(res => {
        if (res.redirected) {
            location.href = res.url
        }
    })
    .catch(error => {
        console.log('Error: ', error)
    })
}