export const logout = () => {
    fetch("/logout")
    .then(res => {
        if(!res.ok){
            const errorHTML =  res.text();
            document.body.innerHTML = errorHTML;
            return;
        }
        if (res.redirected) {
            location.href = res.url
        }
    })
    .catch(error => {
        console.log('Error: ', error)
    })
}